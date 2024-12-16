export const getGrowth = (
  currentYearRevenue: number, 
  previousYearRevenue: number
): number => {
  if (!previousYearRevenue) {
    if (currentYearRevenue) {
      return 999.99;
    } else{
      return -999.99;
    }
  }
  const diff = currentYearRevenue - previousYearRevenue;
  let growth = diff / previousYearRevenue * 100;
  growth = parseFloat(growth.toFixed(2));
  return growth
}