import type { CandlestickData, UTCTimestamp, LineData } from 'lightweight-charts';

export function transformCGtoLWC(
  ohlcArray: unknown
): CandlestickData<UTCTimestamp>[] {
  if (!ohlcArray || !Array.isArray(ohlcArray)) {
    return [];
  }

  // We expect each element to itself be an array [timestampMs, open, high, low, close]
  return ohlcArray
    .filter((c): c is [number, number, number, number, number] =>
      Array.isArray(c) &&
      c.length === 5 &&
      typeof c[0] === 'number' &&
      typeof c[1] === 'number' &&
      typeof c[2] === 'number' &&
      typeof c[3] === 'number' &&
      typeof c[4] === 'number'
    )
    .map<CandlestickData<UTCTimestamp>>(c => {
      const [timestampMs, open, high, low, close] = c;
      const timestampSec = Math.floor(timestampMs / 1000);
      return {
        time: (timestampSec as UTCTimestamp),
        open,
        high,
        low,
        close
      };
    });
}

export function transformOHLCToLine(
  ohlcArray: CandlestickData<UTCTimestamp>[]
): LineData<UTCTimestamp>[] {
  return ohlcArray.map(c => ({
    time: c.time,
    value: c.close, // or (open+close)/2 if you want average
  }));
}
