"use client"
import { useState, useEffect } from "react";
import { FAKE_DATA } from "@/constants/data";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import axios from "axios";

// home page (market overview)
export default function Home() {
  const [data, setData] = useState([]);

  // Fetch data from CoinGecko API
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 20,
            page: 1,
            sparkline: false
          }
        },
      );
      setData(res.data);
    };

    fetchData();

    // Optional: refresh every 60s
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Table columns
  const columns = [
    {
      accessorKey: "market_cap_rank",
      header: "#",
      cell: ({ getValue }: any) => <span className="text-sm">{getValue()}</span>
    },
    {
      accessorKey: "name",
      header: "Coin",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-6 h-6"
          />
          <span className="text-sm">{row.original.name}</span> <span className="uppercase text-sm text-gray-600">{row.original.symbol}</span>
        </div>
      )
    },
    {
      accessorKey: "current_price",
      header: "Price (USD)",
      cell: ({ getValue }: any) =>
        `$${getValue().toLocaleString()}`
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "24h",
      cell: ({ getValue }: any) => {
        const value = getValue();
        return (
          <span
            className={
              value >= 0 ? "text-green-500" : "text-red-500"
            }
          >
            {value.toFixed(2)}%
          </span>
        );
      }
    },
    {
      accessorKey: "market_cap",
      header: "Market Cap",
      cell: ({ getValue }: any) =>
        `$${getValue().toLocaleString()}`
    },
    {
      accessorKey: "circulating_supply",
      header: "Circulating Supply",
      cell: ({ getValue }: any) =>
        `${getValue()}`
    },
  ];

   // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sortDirection = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="p-3 text-left cursor-pointer select-none text-sm"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortDirection === "asc" ? " ▲" : sortDirection === "desc" ? " ▼" : null}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="border-t border-t-gray-800 hover:bg-gray-900 cursor-pointer"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}