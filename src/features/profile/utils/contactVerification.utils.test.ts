import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildRegisteredContactOtpConfirm,
  buildRegisteredContactOtpRequest,
  isContactAlreadyVerifiedError,
  registeredContactChannel,
} from "./contactVerification.utils.ts";

const contact = {
  email: "user@example.com",
  phoneNumber: "+962791234567",
};

describe("registered contact OTP bodies stay on one channel", () => {
  it("requests and confirms email without a phone field", () => {
    const request = buildRegisteredContactOtpRequest("email", contact);
    const confirm = buildRegisteredContactOtpConfirm("email", contact, "123456");

    assert.deepEqual(request, { channel: "email", email: "user@example.com" });
    assert.deepEqual(confirm, {
      channel: "email",
      email: "user@example.com",
      code: "123456",
    });
    assert.equal(registeredContactChannel(request), "email");
    assert.equal("phoneNumber" in request, false);
    assert.equal("phoneOtp" in confirm, false);
  });

  it("requests and confirms phone without an email field", () => {
    const request = buildRegisteredContactOtpRequest("phone", contact, { resend: true });
    const confirm = buildRegisteredContactOtpConfirm("phone", contact, "654321");

    assert.deepEqual(request, {
      channel: "phone",
      phoneNumber: "+962791234567",
      resend: true,
    });
    assert.deepEqual(confirm, {
      channel: "phone",
      phoneNumber: "+962791234567",
      phoneOtp: "654321",
    });
    assert.equal(registeredContactChannel(request), "phone");
    assert.equal("email" in request, false);
    assert.equal("code" in confirm, false);
  });
});

describe("isContactAlreadyVerifiedError", () => {
  it("matches already-verified codes and messages", () => {
    assert.equal(
      isContactAlreadyVerifiedError({ code: "EMAIL_ALREADY_VERIFIED", message: "no" }),
      true,
    );
    assert.equal(
      isContactAlreadyVerifiedError({ message: "Phone is already verified" }),
      true,
    );
  });

  it("does not treat invalid or expired OTP as already verified", () => {
    assert.equal(
      isContactAlreadyVerifiedError({ message: "Invalid OTP. Please try again." }),
      false,
    );
    assert.equal(
      isContactAlreadyVerifiedError({ message: "OTP has expired. Please request a new OTP." }),
      false,
    );
  });
});
