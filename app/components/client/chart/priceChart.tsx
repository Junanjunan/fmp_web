'use client';

import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { ChartProps } from '@/types/chart';


export const PriceChart = ({ data }: ChartProps) => {
  const priceChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!priceChartRef.current || !volumeChartRef.current) {
      return;
    }

    const priceChart = createChart(priceChartRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      localization: {
        dateFormat: 'yy/MM/dd',
      },
      width: priceChartRef.current.clientWidth,
      height: 400,
    });

    const volumeChart = createChart(volumeChartRef.current, {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      localization: {
        dateFormat: 'yy/MM/dd',
      },
      width: volumeChartRef.current.clientWidth,
      height: 200,
    });

    const candlestickSeries = priceChart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const volumeSeries = volumeChart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
    });

    const candleData = data.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const volumeData = data.map((item) => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    }));

    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    // Sync the time scales of both charts
    const syncHandler = () => {
      const timeRange = priceChart.timeScale().getVisibleRange();
      if (timeRange !== null) {
        volumeChart.timeScale().setVisibleRange(timeRange);
      }
    };

    const syncHandlerBasedOnVolume = () => {
      const timeRange = volumeChart.timeScale().getVisibleRange();
      if (timeRange !== null) {
        priceChart.timeScale().setVisibleRange(timeRange);
      }
    }

    priceChart.timeScale().subscribeVisibleTimeRangeChange(syncHandler);
    volumeChart.timeScale().subscribeVisibleTimeRangeChange(syncHandlerBasedOnVolume);

    const handleResize = () => {
      if (priceChartRef.current && volumeChartRef.current) {
        const width = priceChartRef.current.clientWidth;
        priceChart.applyOptions({ width });
        volumeChart.applyOptions({ width });
      }
    };

    window.addEventListener('resize', handleResize);

    priceChart.timeScale().fitContent();
    volumeChart.timeScale().fitContent();

    return () => {
      window.removeEventListener('resize', handleResize);
      priceChart.remove();
      volumeChart.remove();
    };
  }, [data]);

  return (
    <div>
      <div ref={priceChartRef} />
      <div ref={volumeChartRef} />
    </div>
  );
};