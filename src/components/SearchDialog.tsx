"use client"

import React, { ReactNode, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'
import { searchCoins, trendingSearchList } from '@/api/coingecko'
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image'
import Link from 'next/link'
import { X, Search } from 'lucide-react'

type Props = {
  trigger: ReactNode
}

const ItemCoin = ({
  id, 
  imageUrl, 
  name, 
  symbol
}: {
  id: string; 
  imageUrl: string, 
  name: string, 
  symbol: string
}) => {
  return (
    <Link 
      href={`/crypto/${id}`} 
      className="flex items-center gap-2 p-2 cursor-pointer rounded-md bg-slate-800 hover:bg-blue-900 hover:border hover:border-blue-600">
      <Image
        src={imageUrl}
        alt={name}
        width={22}
        height={22}
      />
      <span className='truncate'>
        {name}
      </span>
      <span className='text-xs text-gray-400'>
        ({symbol.toUpperCase()})
      </span>
    </Link>
  )
}

const SearchDialog = (props: Props) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400); // ⏳ wait 400ms after typing

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: debouncedQuery.length > 0, // only run when user has typed something
  });

  const {data: trendingListData} = useQuery({
    queryKey: ["trendingList"],
    queryFn: () => trendingSearchList(),
  })

  return (
    <Dialog.Root>
      {/* use parent-provided trigger */}
      <Dialog.Trigger asChild>
        {props.trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' />
        <Dialog.Content
          className='fixed left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-slate-900 py-2 px-4 shadow-lg focus:outline-none'
          aria-describedby='search-list'
        >
            <Dialog.Title hidden>
              Search Coins
            </Dialog.Title>

          <div className='flex items-center'>
            <Search className='w-5 h-5' />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coin..."
              className="w-full rounded px-3 py-2 focus:outline-none placeholder:font-semibold"
              />
              <Dialog.Close asChild>
                <button className='cursor-pointer'>
                  <X className='w-5 h-5' />
                </button>
              </Dialog.Close>
          </div>

          <div className={`${isLoading && "hidden"} mt-4`}>
            <p className='mb-2 text-sm font-semibold'>Trending crypto 🔥</p>
            {!data && trendingListData && (
              <ul className='space-y-2 max-h-96 overflow-y-auto pr-2'>
                {trendingListData.map((coin: any) => (
                  <ItemCoin 
                    key={coin.item.id}
                    id={coin.item.id}
                    imageUrl={coin.item.large}
                    name={coin.item.name}
                    symbol={coin.item.symbol}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            {isLoading && (
              <div className='h-96 flex justify-center items-center'>
                <p>Loading...</p>
              </div>
            )}
            {data?.length > 0 && (
              <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {data.map((coin: any) => (
                  <ItemCoin 
                    key={coin.id}
                    id={coin.id}
                    imageUrl={coin.large}
                    name={coin.name}
                    symbol={coin.symbol}
                  />
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