export function calculatorFullKey({ calculatorKey, calculatorGroup }: { calculatorKey: string; calculatorGroup?: string | null }): string {
  return calculatorGroup ? `${calculatorGroup}/${calculatorKey}` : calculatorKey;
}
