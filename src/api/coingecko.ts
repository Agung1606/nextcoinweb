import axios from "axios"

export const fetchCoinsListMarket = async ({ page }: { page: number }) => {
  const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 20,
            page: page,
            sparkline: false
          }
        },
      );
  return res.data;
}

export const coinDataByID = async ({ id }: { id: string }) => {
  const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
    params: {
      community_data: false,
      developer_data: false
    }
  })

  return res.data;
}

export const searchCoins = async (query: string) => {
  if (!query) return [];
  const res = await axios.get("https://api.coingecko.com/api/v3/search", {
    params: { query },
  });
  return res.data.coins;
}

export const trendingSearchList = async () => {
  const res = await axios.get("https://api.coingecko.com/api/v3/search/trending");
  return res.data.coins;
}