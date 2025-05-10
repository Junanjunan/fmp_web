export const getGrowth = (
  currentYearRevenue: number,
  previousYearRevenue: number
): number => {
  if (!previousYearRevenue) {
    if (currentYearRevenue) {
      return 999.99;
    } else {
      return -999.99;
    }
  }
  const diff = currentYearRevenue - previousYearRevenue;
  let growth = diff / previousYearRevenue * 100;
  growth = parseFloat(growth.toFixed(2));
  return growth
}

export const getPercentageNumber = (
  value: number | string, decimalPlaces: number = 2
): number => {
  const percentage = parseFloat(value as string) * 100;
  return parseFloat(percentage.toFixed(decimalPlaces));
}