"use client";

import { AgentOnboardingForm } from "./AgentOnboardingForm";
import type { AgentOnboardingFormProps } from "./AgentOnboardingForm";

export type ManualOnboardAgentFormProps = AgentOnboardingFormProps;

export function ManualOnboardAgentForm(props: ManualOnboardAgentFormProps) {
  return <AgentOnboardingForm {...props} />;
}
