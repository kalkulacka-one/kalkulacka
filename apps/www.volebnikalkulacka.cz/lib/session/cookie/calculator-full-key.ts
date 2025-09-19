export function calculatorFullKey({ calculatorKey, calculatorGroup }: { calculatorKey: string; calculatorGroup?: string | null }): string {
  return calculatorGroup ? `${calculatorKey}/${calculatorGroup}` : calculatorKey;
}
