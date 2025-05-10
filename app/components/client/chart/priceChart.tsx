'use client';

import { createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { ChartProps } from '@/types/chart';
import { calculateBollingerBands } from '@/lib/chart';


export const PriceChart = ({ data }: ChartProps) => {
  const priceChartRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    high: 0,
    low: 0,
    open: 0,
    close: 0,
    highPercentChange: 0,
    lowPercentChange: 0,
    openPercentChange: 0,
    closePercentChange: 0,
  });

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

    // Add Bollinger Bands series first so they appear behind candlesticks
    const upperBandSeries = priceChart.addLineSeries({
      color: '#26a69a',
      lineWidth: 1,
    });
    const middleBandSeries = priceChart.addLineSeries({
      color: '#323232',
      lineWidth: 1,
    });
    const lowerBandSeries = priceChart.addLineSeries({
      color: '#ef5350',
      lineWidth: 1,
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

    const { upper, middle, lower } = calculateBollingerBands(data, 20, 2);

    const volumeData = data.map((item) => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    }));

    candlestickSeries.setData(candleData);
    upperBandSeries.setData(upper);
    middleBandSeries.setData(middle);
    lowerBandSeries.setData(lower);
    volumeSeries.setData(volumeData);

    // Add crosshair move handler for tooltip
    priceChart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.y < 0
      ) {
        setTooltip(prev => ({ ...prev, show: false }));
        return;
      }

      // Find current and previous candles
      const currentIndex = candleData.findIndex(d => d.time === param.time);
      if (currentIndex > 0) {
        const currentCandle = candleData[currentIndex];
        const previousCandle = candleData[currentIndex - 1];
        const previousClose = previousCandle.close;

        const highPercentChange = ((currentCandle.high - previousClose) / previousClose * 100).toFixed(2);
        const lowPercentChange = ((currentCandle.low - previousClose) / previousClose * 100).toFixed(2);
        const openPercentChange = ((currentCandle.open - previousClose) / previousClose * 100).toFixed(2);
        const closePercentChange = ((currentCandle.close - previousClose) / previousClose * 100).toFixed(2);

        setTooltip({
          show: true,
          x: param.point.x,
          y: param.point.y,
          high: currentCandle.high,
          low: currentCandle.low,
          open: currentCandle.open,
          close: currentCandle.close,
          highPercentChange: parseFloat(highPercentChange),
          lowPercentChange: parseFloat(lowPercentChange),
          openPercentChange: parseFloat(openPercentChange),
          closePercentChange: parseFloat(closePercentChange),
        });
      }
    });

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

  const PriceModalItem = ({ title, price, percentChange }: { title: string, price: number, percentChange: number }) => {
    return (
      <div className="flex justify-between gap-4">
        <span className="font-large">{title}:</span>
        <div>
          <span className="mr-2">{price.toFixed(2)}</span>
          <span className={percentChange >= 0 ? 'text-green-600' : 'text-red-600'}>
            ({percentChange}%)
          </span>
        </div>
      </div>
    )
  }

  const PriceModal = () => {
    return (
      <>
        {tooltip.show && (
          <div
            className="absolute bg-white shadow-lg rounded-lg p-3 z-50"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 20}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="text-sm">
              <PriceModalItem title={"Close"} price={tooltip.close} percentChange={tooltip.closePercentChange} />
              <PriceModalItem title={"Open"} price={tooltip.open} percentChange={tooltip.openPercentChange} />
              <PriceModalItem title={"High"} price={tooltip.high} percentChange={tooltip.highPercentChange} />
              <PriceModalItem title={"Low"} price={tooltip.low} percentChange={tooltip.lowPercentChange} />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <ColorInformation />
      <div ref={priceChartRef} />
      <div ref={volumeChartRef} />
      <PriceModal />
    </div>
  );
};

const ColorCard = ({ color, title }: { color: string, title: string }) => (
  <div className="flex items-center mr-5">
    <div className={`w-5 h-5 inline-block mr-1`} style={{ backgroundColor: color }}></div>
    <span>{title}</span>
  </div>
);

const ColorInformation = () => (
  <div className="flex items-center mt-10">
    <ColorCard color="#26a69a" title="BB uper" />
    <ColorCard color="#323232" title="BB middle" />
    <ColorCard color="#ef5350" title="BB lower" />
  </div>
);