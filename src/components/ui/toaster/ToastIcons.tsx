import type { ToastVariant } from "./types";

const iconPaths: Record<ToastVariant, string> = {
  success: "M4.5 12.75l6 6 9-13.5",
  error: "M6 18L18 6M6 6l12 12",
  warning:
    "M12 9v3.75m0 3.75h.008v.008H12v-.008zm-.938-8.122l-8.485 14.69A1.5 1.5 0 003.879 21h16.243a1.5 1.5 0 001.301-2.247L13.94 4.627a1.5 1.5 0 00-2.878.001z",
  info: "M12 9v.01M12 13v4m0-9.75a9 9 0 110 18 9 9 0 010-18z",
};

export function ToastIcon({ variant }: { variant: ToastVariant }) {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={iconPaths[variant]}
      />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
