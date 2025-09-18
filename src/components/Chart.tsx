"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp, CandlestickSeries, LineSeries, AreaSeries } from 'lightweight-charts';
import { transformOHLCToLine } from '@/lib/charts';

interface Candle extends CandlestickData<UTCTimestamp> {}

interface ChartProps {
  data?: Candle[];
  chartType: "candleStick" | "chartArea"
}

const Chart: React.FC<ChartProps> = ({ data, chartType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | "Area"> | null>(null);

  useEffect(() => {
      if (!containerRef.current) return;

      // create chart
      chartRef.current = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: 400,
        layout: { textColor: "#E0E0E0", background: { color: "transparent" } },
        timeScale: { timeVisible: true, secondsVisible: false },
        grid: {
          vertLines: {
            color: "#1d293d", // vertical grid lines
            style: 1, // solid line
          },
          horzLines: {
            color: "#1d293d", // horizontal grid lines
            style: 1, // solid line
          },
        },
      });

      return () => {
        chartRef.current?.remove();
      };
    }, []);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // remove old series safely
    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (e) {
        console.warn("Tried to remove non-existing series", e);
      }
      seriesRef.current = null;
    }

    if(chartType === "candleStick") {
      seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        borderVisible: false,
      });
      seriesRef.current.setData(data);
    } else {
      seriesRef.current = chartRef.current.addSeries(AreaSeries, {
        lineWidth: 2,
      })
      seriesRef.current.setData(transformOHLCToLine(data));
    }

    chartRef.current.timeScale().fitContent();
  }, [data, chartType]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default Chart;
