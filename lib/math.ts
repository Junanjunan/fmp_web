export const getGrowth = (
  currentYearRevenue: number, 
  previousYearRevenue: number
): number => {
  const diff = currentYearRevenue - previousYearRevenue;
  let growth = diff / previousYearRevenue;
  growth = parseFloat(growth.toFixed(2));
  return growth
}