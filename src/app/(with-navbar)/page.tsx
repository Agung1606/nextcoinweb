"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import millify from "millify";
import {
  fetchCoinsListMarket,
  trendingSearchList,
  cryptoGlobalMarketData,
} from "@/api/coingecko";
import Link from "next/link";
import { LoaderFive } from "@/components/ui/loader";
import CoinCard from "@/components/CoinCard";

// home page (market overview)
export default function Home() {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["markets", page],
    queryFn: () => fetchCoinsListMarket({ page: page }),
    refetchInterval: 30000,
    staleTime: 1000 * 60,
  });

  const { data: trendingListData } = useQuery({
    queryKey: ["trendingList"],
    queryFn: () => trendingSearchList(),
  });

  const { data: globalMarketData } = useQuery({
    queryKey: ["globalMarket"],
    queryFn: () => cryptoGlobalMarketData(),
  });

  // Table columns
  const columns = [
    {
      accessorKey: "market_cap_rank",
      header: "#",
      cell: ({ getValue }: any) => (
        <span className="text-sm">{getValue()}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Coin",
      cell: ({ row }: any) => (
        <Link
          href={`/crypto/${row.original.id}`}
          className="flex items-center gap-x-4 cursor-pointer"
        >
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={28}
            height={28}
          />
          <span className="text-sm font-semibold">{row.original.name}</span>{" "}
          <span className="uppercase text-sm text-gray-400">
            ({row.original.symbol})
          </span>
        </Link>
      ),
    },
    {
      accessorKey: "current_price",
      header: "Price (USD)",
      cell: ({ getValue }: any) => (
        <span className="text-sm">${getValue().toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "24h",
      cell: ({ getValue }: any) => {
        const value = getValue();
        return (
          <span
            className={`${
              value >= 0
                ? "text-[var(--color-state-success)]"
                : "text-[var(--color-state-danger)]"
            } text-sm`}
          >
            {value?.toFixed(2)}%
          </span>
        );
      },
    },
    {
      accessorKey: "market_cap",
      header: "Market Cap",
      cell: ({ getValue }: any) => (
        <span className="text-sm">${getValue().toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "circulating_supply",
      header: "Circulating Supply",
      cell: ({ getValue, row }: any) => (
        <>
          <span className="text-sm">{millify(getValue())}</span>{" "}
          <span className="uppercase text-sm">{row.original.symbol}</span>
        </>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <LoaderFive text="Loading..." />
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="grid grid-rows-2 gap-2">
          <div className="border border-slate-800 py-2 px-4 rounded-lg"></div>
          <div className="border border-slate-800 py-2 px-4 rounded-lg"></div>
        </div>
        <div className="border border-slate-800 py-2 px-4 rounded-lg">
          <p className="text-lg mb-2">Top 5 coin trends 🔥</p>
          {trendingListData.coins.slice(0, 5).map((coin: any) => (
            <CoinCard
              key={coin.item.id}
              id={coin.item.id}
              imageUrl={coin.item.large}
              name={coin.item.name}
              symbol={coin.item.symbol}
              price={coin.item.data.price}
              pricePercentage={coin.item.data.price_change_percentage_24h.usd}
              className="hover:bg-slate-900"
            />
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full">
          <thead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="p-3 text-left cursor-pointer select-none text-sm"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {sortDirection === "asc"
                        ? " ▲"
                        : sortDirection === "desc"
                        ? " ▼"
                        : null}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table?.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-t-slate-900 hover:bg-slate-900"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* pagination */}
        <div className="flex justify-center items-center my-5">
          <div className="bg-slate-800 shadow-md w-1/3 py-2 px-1 rounded-full flex justify-evenly items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`
                  px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer
                  ${
                    page === num
                      ? "bg-blue-900 border border-blue-600" // active page
                      : "text-gray-300 hover:bg-blue-900"
                  }        // inactive page
                `}
                disabled={page === num}
                onClick={() => {
                  setPage(num);
                  tableRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
