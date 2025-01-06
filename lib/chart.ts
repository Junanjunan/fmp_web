import { PriceData } from "@/types/chart"


export function calculateBollingerBands(
  data: PriceData[], 
  period: number = 20, 
  multiplier: number = 2
) {
  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      continue;
    }

    const slice = data.slice(i - period + 1, i + 1);

    // Calculate SMA
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    const sma = sum / period;

    // Calculate Standard Deviation
    const squaredDiffs = slice.map(val => Math.pow(val.close - sma, 2));
    const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
    const standardDeviation = Math.sqrt(avgSquaredDiff);

    // Calculate Bands
    const upperBand = sma + (multiplier * standardDeviation);
    const lowerBand = sma - (multiplier * standardDeviation);

    const point = {
      time: data[i].time,
      value: sma
    };

    upper.push({ ...point, value: upperBand });
    middle.push({ ...point, value: sma });
    lower.push({ ...point, value: lowerBand });
  }

  return { upper, middle, lower };
}


export function calculateLastBollingerBands(
  data: PriceData[], 
  period: number = 20, 
  multiplier: number = 2
) {
  // Check if there are enough data points
  if (data.length < period) {
    throw new Error("Not enough data points to calculate Bollinger Bands.");
  }

  const slice = data.slice(0, period); // Get the last 'period' data points

  // Calculate SMA
  const sum = slice.reduce((acc, val) => acc + parseFloat(val.close.toString()), 0);
  const sma = sum / period;

  // Calculate Standard Deviation
  const squaredDiffs = slice.map(val => Math.pow(val.close - sma, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
  const standardDeviation = Math.sqrt(avgSquaredDiff);

  // Calculate Bands
  const upperBand = sma + (multiplier * standardDeviation);
  const lowerBand = sma - (multiplier * standardDeviation);

  return {
    lastUpper: upperBand,
    lastMiddle: sma,
    lastLower: lowerBand,
  };
}