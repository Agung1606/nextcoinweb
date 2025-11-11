import { transformCGtoLWC } from "@/lib/charts";
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000, // prevents hanging requests
});

const handleError = (message: string) => {
  throw new Error(message);
};

export const fetchCoinsListMarket = async ({ page }: { page: number }) => {
  try {
    const res = await api.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 20,
        page: page,
        sparkline: false,
      },
    });
    return res.data;
  } catch (error) {
    handleError("Failed to fetch market data");
  }
};

export const coinDataByID = async ({ id }: { id: string }) => {
  try {
    const res = await api.get(`/coins/${id}`, {
      params: {
        community_data: false,
        developer_data: false,
      },
    });

    return res.data;
  } catch (error) {
    handleError("Failed to fetch coin data");
  }
};

export const searchCoins = async (query: string) => {
  if (!query) return [];
  try {
    const res = await api.get("/search", {
      params: { query },
    });
    return res.data.coins;
  } catch (error) {
    handleError("Error while searching coins");
  }
};

export const trendingSearchList = async () => {
  try {
    const res = await api.get("/search/trending");
    return res.data;
  } catch (error) {
    handleError("Failed to fetch trending lists");
  }
};

export const fetchOHLCByID = async ({
  id,
  vs_currency,
  days,
}: {
  id: string;
  vs_currency: string;
  days: number;
}) => {
  try {
    const res = await api.get(`/coins/${id}/ohlc`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const data = transformCGtoLWC(res.data ?? []);

    return data;
  } catch (error) {
    handleError("Failed to fetch OHLC");
  }
};

export const cryptoGlobalMarketData = async () => {
  try {
    const res = await api.get(`/global`);
    return res.data;
  } catch (error) {
    handleError("Failed to fetch global data");
  }
};
