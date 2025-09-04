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