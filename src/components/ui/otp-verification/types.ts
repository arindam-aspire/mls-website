export type OtpVerificationFormLabels = {
  codeLabel: string;
  digitLabel: (params: { index: number }) => string;
  codeRequired: string;
  didntReceive: string;
  resend: string;
  resendIn: (params: { time: string }) => string;
  continue: string;
  confirmLoading: string;
};

export type OtpVerificationTitleLabels = {
  title: string;
  subtitle: string;
  sentCodeLabel: string;
};

export type OtpVerificationFormProps = {
  labels: OtpVerificationFormLabels;
  onSubmit: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
};

export type OtpVerificationTitleProps = {
  labels: OtpVerificationTitleLabels;
  contactLine?: string;
  displayOtp?: string;
  className?: string;
};
