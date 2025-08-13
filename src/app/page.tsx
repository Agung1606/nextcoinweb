"use client"
import { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import axios from "axios";
import millify from "millify";

// home page (market overview)
export default function Home() {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

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
            page: page,
            sparkline: false
          }
        },
      );
      setData(res.data);
    };

    fetchData();

    // Optional: refresh every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [page]);

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
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="w-6 h-6"
          />
          <span className="text-sm font-semibold">{row.original.name}</span> <span className="uppercase text-sm text-gray-600">{row.original.symbol}</span>
        </div>
      )
    },
    {
      accessorKey: "current_price",
      header: "Price (USD)",
      cell: ({ getValue }: any) =>
        <span className="text-sm">${getValue().toLocaleString()}</span>
    },
    {
      accessorKey: "price_change_percentage_24h",
      header: "24h",
      cell: ({ getValue }: any) => {
        const value = getValue();
        return (
          <span
            className={`${
              value >= 0 ? "text-green-500" : "text-red-500"
            } text-sm`}
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
        <span className="text-sm">${getValue().toLocaleString()}</span>
    },
    {
      accessorKey: "circulating_supply",
      header: "Circulating Supply",
      cell: ({ getValue, row }: any) => (
        <>
          <span className="text-sm">{millify(getValue())}</span> <span className="uppercase text-sm">{row.original.symbol}</span>
        </>
      )
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
        <table ref={tableRef} className="min-w-full">
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
                className="border-t border-t-gray-800 hover:bg-gray-900"
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
        <div className="flex justify-center items-center mt-5">
          <div className="bg-gray-800 w-1/3 py-2 px-1 rounded-full flex justify-evenly items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`
                  px-3 py-1 rounded-full transition-colors duration-200
                  ${page === num 
                    ? "text-emerald-400 font-bold bg-gray-700" // active page
                    : "text-gray-400 hover:text-white"}        // inactive page
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