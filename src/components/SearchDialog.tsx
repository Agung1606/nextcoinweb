"use client"

import React, { ReactNode, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { searchCoins } from '@/api/coingecko'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  trigger: ReactNode
}

const SearchDialog = (props: Props) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400); // ⏳ wait 400ms after typing

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: debouncedQuery.length > 0, // only run when user has typed something
  });

  return (
    <Dialog.Root>
      {/* use parent-provided trigger */}
      <Dialog.Trigger asChild>
        {props.trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' />
        <Dialog.Content
          className='fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none'
        >
          <div>
            <Dialog.Title className='text-sm mb-4'>
              Search Coins
            </Dialog.Title>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coins..."
            className="w-full rounded border px-3 py-2 focus:outline-none"
          />

          <div className="mt-4">
            {isLoading && <p>Loading...</p>}
            {data?.length > 0 && (
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {data.map((coin: any) => (
                  <Link href={`/crypto/${coin.id}`} key={coin.id} className="flex items-center gap-2 p-1 cursor-pointer hover:border-b hover:border-b-gray-400">
                    <Image
                      src={coin.large}
                      alt={coin.name}
                      width={22}
                      height={22}
                    />
                    <span className='truncate'>
                      {coin.name}
                    </span>
                    <span className='text-xs text-gray-400'>
                      ({coin.symbol.toUpperCase()})
                    </span>
                  </Link>
                ))}
              </ul>
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default SearchDialog;