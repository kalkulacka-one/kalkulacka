export function getLabel(districtId: string, options: any[]) {
  const label = options.filter((option) => option.value === districtId);
  return label[0].label;
}
