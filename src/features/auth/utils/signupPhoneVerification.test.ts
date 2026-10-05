import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canRequestOtpResend,
  isCompleteOtpCode,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
} from "../../../components/ui/otp-verification/otpPolicy.ts";
import {
  createSmsRequestLock,
  isRegisteredMobileVerified,
} from "../../profile/utils/registeredMobileSms.utils.ts";
import {
  canFinishAfterPhoneVerification,
  hasSignupPhoneNumber,
  requestSignupPhoneOtp,
  resolveRegisteredPhoneForVerification,
  resolveSignupVerificationStep,
  shouldOpenSignupPhoneVerification,
} from "./signupPhoneVerification.ts";

const REGISTERED_PHONE = "registered-phone";

describe("signup phone verification step", () => {
  it("opens phone verification after email confirmation when a phone was stored", () => {
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: true,
        phoneNumber: REGISTERED_PHONE,
        isPhoneVerified: false,
      }),
      "phone-verification",
    );
    assert.equal(
      shouldOpenSignupPhoneVerification({
        pending: true,
        phoneNumber: REGISTERED_PHONE,
        isPhoneVerified: false,
      }),
      true,
    );
  });

  it("keeps signup without a phone on the existing email confirmation flow", () => {
    assert.equal(hasSignupPhoneNumber("  "), false);
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: false,
        phoneNumber: "",
      }),
      "email-confirmation",
    );
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: true,
        phoneNumber: null,
        isPhoneVerified: false,
      }),
      "complete",
    );
  });

  it("does not skip email confirmation when a phone exists", () => {
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: false,
        phoneNumber: REGISTERED_PHONE,
        isPhoneVerified: false,
      }),
      "email-confirmation",
    );
  });

  it("uses the account phone and falls back to the signup phone", () => {
    assert.equal(
      resolveRegisteredPhoneForVerification({
        accountPhone: " account-phone ",
        signupPhone: REGISTERED_PHONE,
      }),
      "account-phone",
    );
    assert.equal(
      resolveRegisteredPhoneForVerification({
        accountPhone: " ",
        signupPhone: ` ${REGISTERED_PHONE} `,
      }),
      REGISTERED_PHONE,
    );
  });
});

describe("phone OTP rules", () => {
  it("requires exactly 6 numeric digits", () => {
    assert.equal(OTP_LENGTH, 6);
    assert.equal(isCompleteOtpCode("12345"), false);
    assert.equal(isCompleteOtpCode("123456"), true);
    assert.equal(isCompleteOtpCode("12345a"), false);
  });

  it("stays unverified when the backend does not return an explicit true", () => {
    for (const status of [false, null, undefined, "pending", "unknown", 0, true]) {
      assert.equal(
        canFinishAfterPhoneVerification(status),
        isRegisteredMobileVerified(status),
      );
    }
  });

  it("starts a 60-second resend cooldown and blocks a second tap while one is running", () => {
    assert.equal(OTP_RESEND_SECONDS, 60);
    assert.equal(
      canRequestOtpResend({ secondsRemaining: OTP_RESEND_SECONDS, isResending: false }),
      false,
    );
    assert.equal(
      canRequestOtpResend({ secondsRemaining: 0, isResending: true }),
      false,
    );
    assert.equal(
      canRequestOtpResend({ secondsRemaining: 0, isResending: false }),
      true,
    );
  });

  it("does not call the OTP API when the phone is missing", async () => {
    let calls = 0;
    const outcome = await requestSignupPhoneOtp({
      phoneNumber: " ",
      lock: createSmsRequestLock(),
      send: async () => {
        calls += 1;
      },
    });

    assert.equal(outcome.status, "missing_phone");
    assert.equal(calls, 0);
  });

  it("allows only one in-flight OTP request for the registered phone", async () => {
    let calls = 0;
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const lock = createSmsRequestLock();

    const first = requestSignupPhoneOtp({
      phoneNumber: REGISTERED_PHONE,
      lock,
      send: async () => {
        calls += 1;
        await gate;
      },
    });
    const second = await requestSignupPhoneOtp({
      phoneNumber: REGISTERED_PHONE,
      lock,
      send: async () => {
        calls += 1;
      },
    });

    assert.equal(second.status, "busy");
    assert.equal(calls, 1);
    release();
    assert.equal((await first).status, "sent");
    assert.equal(calls, 1);
  });
});

describe("email and phone verification stay independent", () => {
  it("does not treat a verified phone as a substitute for email confirmation", () => {
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: false,
        phoneNumber: REGISTERED_PHONE,
        isPhoneVerified: true,
      }),
      "email-confirmation",
    );
  });

  it("does not treat email confirmation as phone verification", () => {
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: true,
        phoneNumber: REGISTERED_PHONE,
        isPhoneVerified: false,
      }),
      "phone-verification",
    );
  });

  it("asks for a new OTP when a changed number is not explicitly verified", () => {
    assert.equal(
      resolveSignupVerificationStep({
        emailConfirmed: true,
        phoneNumber: "replacement-phone",
        isPhoneVerified: false,
      }),
      "phone-verification",
    );
    assert.equal(canFinishAfterPhoneVerification(false), false);
  });
});
