"use client"

import { coinDataByID } from '@/api/coingecko';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { use } from 'react'
import millify from 'millify';

function CryptoInfo({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params);

  const {data, isLoading} = useQuery({
    queryKey: ["coins", id],
    queryFn: () => coinDataByID({ id: id }),
    refetchInterval: 1000,
    staleTime: 1000 * 60
  })

  return (
    <div>
      <aside className='w-64 h-full flex flex-col p-2 border-r border-[var(--color-border)]'>
        <div className='flex flex-col gap-y-6'>
          <div className='flex items-center gap-x-2'>
            {data?.image?.large ? (
              <Image
                src={data.image.large}
                alt={data?.name ?? "crypto logo"}
                width={30}
                height={30}
                className="rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-gray-700 text-white text-sm font-bold">
                {data?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
            <span className='text-xl font-semibold'>{data?.name}</span>
            <span className='text-gray-400 text-sm uppercase'>{data?.symbol}</span>
            <span className='text-xs font-semibold text-white bg-gray-500 px-2 rounded-md'>#{data?.market_cap_rank}</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <p className='text-3xl font-semibold'>${data?.market_data?.current_price?.usd.toLocaleString()}</p>
            <p 
              className={`text-sm font-semibold ${data?.market_data?.price_change_percentage_24h >= 0 ? "text-[var(--color-state-success)]" : "text-[var(--color-state-danger)]"}`}>
              {data?.market_data?.price_change_percentage_24h.toFixed(2)}% (1d)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className='col-span-2 text-center border border-gray-200 p-2 rounded-md'>
            <p className='text-sm'>Market Cap</p>
            <p className='font-semibold'>${millify(data?.market_data?.market_cap?.usd)}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default CryptoInfo