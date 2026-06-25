/**
 * Maps selected service-area option values to API labels joined for POST /agents/manual-onboard.
 */
export function formatManualOnboardServiceArea(
  values: string[],
  options: { value: string; label: string }[],
): string {
  const labelByValue = new Map(options.map((option) => [option.value, option.label]));

  return values
    .map((value) => labelByValue.get(value) ?? value)
    .join(", ");
}
