"use client"
import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query"; 
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import millify from "millify";
import { fetchCoinsListMarket } from "@/api/coingecko";
import SearchDialog from "@/components/SearchDialog";
import { Search } from "lucide-react";
import Link from "next/link";


// home page (market overview)
export default function Home() {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [page, setPage] = useState(1);

  const {data, isLoading} = useQuery({
    queryKey: ["markets", page],
    queryFn: () => fetchCoinsListMarket({ page: page }),
    refetchInterval: 30000,
    staleTime: 1000 * 60
  })

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
        <Link href={`/crypto/${row.original.id}`} className="flex items-center gap-x-4 cursor-pointer">
          <Image 
            src={row.original.image} 
            alt={row.original.name} 
            width={28} 
            height={28} 
          />
          <span className="text-sm font-semibold">{row.original.name}</span> <span className="uppercase text-sm text-[var(--color-text-secondary)]">{row.original.symbol}</span>
        </Link>
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
              value >= 0 ? "text-[var(--color-state-success)]" : "text-[var(--color-state-danger)]"
            } text-sm`}
          >
            {value?.toFixed(2)}%
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

  if(isLoading) return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <p>Loading...</p>
    </div>
  )

  return (
    <div>
      <div className="flex justify-end mb-8 mx-6">
        <SearchDialog 
          trigger={
            <button className="bg-[var(--color-border)] hover:bg-[var(--color-surface)] flex items-center gap-x-2 px-4 py-1 rounded-md">
              <Search className="w-4 h-4" />
              <p className="text-sm">Search</p>
            </button>
          }
        />
      </div>
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
                className="border-t border-t-[var(--color-border)] hover:bg-[var(--color-surface)]"
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
        {/* pagination */}
        <div className="flex justify-center items-center my-5">
          <div className="bg-[var(--color-surface)] shadow-md w-1/3 py-2 px-1 rounded-full flex justify-evenly items-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`
                  px-3 py-1 rounded-full transition-colors duration-200
                  ${page === num 
                    ? "text-[var(--color-text)] bg-[var(--color-accent)]" // active page
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-hover)]"}        // inactive page
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