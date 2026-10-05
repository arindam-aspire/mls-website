import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSmsApiFailure,
  createSmsRequestLock,
  isMobileNotVerifiedApiError,
  requestRegisteredMobileSms,
  resolveRegisteredMobileSmsEligibility,
  sanitizeSmsErrorMessage,
  shouldRetrySmsSend,
  stripSensitiveSmsFields,
} from "./registeredMobileSms.utils.ts";

const verifiedUser = {
  phone_number: "registered-mobile",
  is_phone_verified: true as const,
};

describe("resolveRegisteredMobileSmsEligibility", () => {
  it("allows SMS only when the registered number is explicitly verified", () => {
    assert.deepEqual(resolveRegisteredMobileSmsEligibility(verifiedUser), {
      allowed: true,
    });
  });

  it("blocks an unverified mobile number", () => {
    assert.deepEqual(
      resolveRegisteredMobileSmsEligibility({
        phone_number: verifiedUser.phone_number,
        is_phone_verified: false,
      }),
      { allowed: false, reason: "unverified" },
    );
  });

  it("blocks a missing mobile number even when a flag is present", () => {
    assert.deepEqual(
      resolveRegisteredMobileSmsEligibility({
        phone_number: "   ",
        is_phone_verified: true,
      }),
      { allowed: false, reason: "missing_phone" },
    );
    assert.deepEqual(
      resolveRegisteredMobileSmsEligibility({
        phone_number: null,
        is_phone_verified: true,
      }),
      { allowed: false, reason: "missing_phone" },
    );
  });

  it("blocks is_phone_verified false", () => {
    assert.equal(
      resolveRegisteredMobileSmsEligibility({
        phone_number: verifiedUser.phone_number,
        is_phone_verified: false,
      }).allowed,
      false,
    );
  });

  it("blocks a missing verification field", () => {
    assert.deepEqual(
      resolveRegisteredMobileSmsEligibility({
        phone_number: verifiedUser.phone_number,
      }),
      { allowed: false, reason: "unverified" },
    );
  });

  it("blocks a null verification status", () => {
    assert.deepEqual(
      resolveRegisteredMobileSmsEligibility({
        phone_number: verifiedUser.phone_number,
        is_phone_verified: null,
      }),
      { allowed: false, reason: "unverified" },
    );
  });

  it("blocks unknown, pending, and rejected statuses", () => {
    for (const status of ["pending", "unverified", "rejected", "true", ""]) {
      assert.equal(
        resolveRegisteredMobileSmsEligibility({
          phone_number: verifiedUser.phone_number,
          is_phone_verified: status as unknown as boolean,
        }).allowed,
        false,
      );
    }
  });

  it("blocks an unauthenticated user", () => {
    assert.deepEqual(resolveRegisteredMobileSmsEligibility(null), {
      allowed: false,
      reason: "unauthenticated",
    });
    assert.deepEqual(resolveRegisteredMobileSmsEligibility(undefined), {
      allowed: false,
      reason: "unauthenticated",
    });
  });

  it("allows SMS after verification changes from false to true", () => {
    const before = resolveRegisteredMobileSmsEligibility({
      phone_number: verifiedUser.phone_number,
      is_phone_verified: false,
    });
    const after = resolveRegisteredMobileSmsEligibility({
      ...verifiedUser,
      is_phone_verified: true,
    });

    assert.equal(before.allowed, false);
    assert.equal(after.allowed, true);
  });
});

describe("SMS API error handling", () => {
  it("does not retry when the backend returns MOBILE_NOT_VERIFIED", () => {
    const error = createSmsApiFailure({
      code: "MOBILE_NOT_VERIFIED",
      message: "Mobile is not verified",
    });

    assert.equal(isMobileNotVerifiedApiError(error), true);
    assert.equal(shouldRetrySmsSend(error), false);
  });

  it("does not retry when the backend returns PHONE_NOT_VERIFIED", () => {
    const error = createSmsApiFailure({
      code: "PHONE_NOT_VERIFIED",
      message: "Phone is not verified",
    });

    assert.equal(isMobileNotVerifiedApiError(error), true);
    assert.equal(shouldRetrySmsSend(error), false);
  });

  it("reads MOBILE_NOT_VERIFIED from nested backend details", () => {
    const error = {
      code: 400,
      message: "Request failed",
      details: { success: false, detail: { code: "MOBILE_NOT_VERIFIED" } },
    };

    assert.equal(isMobileNotVerifiedApiError(error), true);
    assert.equal(shouldRetrySmsSend(error), false);
  });

  it("hides SMS provider infrastructure errors", () => {
    const generic = "The SMS could not be sent. Please try again.";
    assert.equal(
      sanitizeSmsErrorMessage(
        "AWS SNS AccessDenied: InvalidClientTokenId",
        generic,
      ),
      generic,
    );
  });

  it("does not expose an OTP in a user-facing message or payload", () => {
    const generic = "The SMS could not be sent. Please try again.";
    assert.equal(
      sanitizeSmsErrorMessage("Your OTP is 123456", generic),
      "Your OTP is ••••••",
    );
    assert.deepEqual(
      stripSensitiveSmsFields({
        success: true,
        otp: "123456",
        dev_phone_otp: "654321",
        message: "sent",
      }),
      { success: true, message: "sent" },
    );
  });
});

describe("requestRegisteredMobileSms", () => {
  it("calls the SMS API when the registered mobile is verified", async () => {
    let calls = 0;
    const outcome = await requestRegisteredMobileSms({
      lock: createSmsRequestLock(),
      loadUser: async () => verifiedUser,
      send: async () => {
        calls += 1;
        return { success: true };
      },
    });

    assert.equal(calls, 1);
    assert.deepEqual(outcome, { status: "sent", result: { success: true } });
  });

  it("does not call the SMS API when the mobile is unverified, missing, or null", async () => {
    const cases = [
      { phone_number: verifiedUser.phone_number, is_phone_verified: false },
      { phone_number: "", is_phone_verified: true },
      { phone_number: verifiedUser.phone_number, is_phone_verified: null },
      { phone_number: verifiedUser.phone_number },
    ];

    for (const user of cases) {
      let calls = 0;
      const outcome = await requestRegisteredMobileSms({
        lock: createSmsRequestLock(),
        loadUser: async () => user,
        send: async () => {
          calls += 1;
          return { success: true };
        },
      });
      assert.equal(calls, 0);
      assert.equal(outcome.status, "blocked");
    }
  });

  it("does not call the SMS API again after MOBILE_NOT_VERIFIED", async () => {
    let calls = 0;
    const failure = createSmsApiFailure({
      code: "MOBILE_NOT_VERIFIED",
      message: "Mobile is not verified",
    });

    await assert.rejects(
      () =>
        requestRegisteredMobileSms({
          lock: createSmsRequestLock(),
          loadUser: async () => verifiedUser,
          send: async () => {
            calls += 1;
            throw failure;
          },
        }),
      (error: unknown) => error === failure,
    );

    assert.equal(calls, 1);
    assert.equal(shouldRetrySmsSend(failure), false);
  });

  it("keeps the request locked while sending so a second click does not call the API", async () => {
    const lock = createSmsRequestLock();
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let calls = 0;

    const first = requestRegisteredMobileSms({
      lock,
      loadUser: async () => verifiedUser,
      send: async () => {
        calls += 1;
        await gate;
        return { success: true };
      },
    });

    const second = await requestRegisteredMobileSms({
      lock,
      loadUser: async () => verifiedUser,
      send: async () => {
        calls += 1;
        return { success: true };
      },
    });

    assert.deepEqual(second, { status: "busy" });
    assert.equal(lock.isPending, true);
    release?.();
    assert.deepEqual(await first, { status: "sent", result: { success: true } });
    assert.equal(calls, 1);
    assert.equal(lock.isPending, false);
  });
});

describe("createSmsRequestLock", () => {
  it("allows only one in-flight SMS request", () => {
    const lock = createSmsRequestLock();
    let calls = 0;

    if (lock.tryEnter()) calls += 1;
    if (lock.tryEnter()) calls += 1;

    assert.equal(calls, 1);
    assert.equal(lock.isPending, true);

    lock.leave();
    assert.equal(lock.isPending, false);
    assert.equal(lock.tryEnter(), true);
  });
});
