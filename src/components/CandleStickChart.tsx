"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';

interface Candle extends CandlestickData<UTCTimestamp> {}

interface ChartProps {
  data?: Candle[];
}

const CandleStickChart: React.FC<ChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 400,
      layout: { textColor: "black", background: { color: "white" } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      borderVisible: false,
    });

    // resize handler
    const handleResize = () => {
      chartRef.current?.applyOptions({
        width: containerRef.current?.clientWidth ?? 0,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
        seriesRef.current.setData(data);

        // Auto fit the chart to exactly show the available data
        chartRef.current?.timeScale().fitContent();
      }
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default CandleStickChart;
