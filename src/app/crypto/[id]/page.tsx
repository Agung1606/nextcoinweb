"use client"

import { coinDataByID } from '@/api/coingecko';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { use } from 'react'
import millify from 'millify';
import { Infinity } from 'lucide-react';

const GridItem = ({
  text,
  data,
  symbol,
  className
}: {
  text: string;
  data: any;
  symbol?: string;
  className?: string;
}) => {
  return (
    <div className={`${className} flex flex-col items-center justify-center border border-gray-200 p-2 rounded-md`}>
      <p className='text-sm'>{text}</p>
      {data 
        ? <p className="font-semibold">{data} {symbol}</p> 
        : <Infinity className="w-10 h-10" />}
    </div>
  )
};

function CryptoInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["coins", id],
    queryFn: () => coinDataByID({ id: id }),
    refetchInterval: 1000,
    staleTime: 1000 * 60
  })

  if(isLoading) return <div>Loading...</div>

  return (
    <div>
      <aside className='h-full flex flex-col px-4 py-2 border-r border-[var(--color-border)]'>
        {/* price info */}
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
            <p className='text-4xl font-semibold'>${data?.market_data?.current_price?.usd.toLocaleString()}</p>
            <p 
              className={`text-sm font-semibold ${data?.market_data?.price_change_percentage_24h >= 0 ? "text-[var(--color-state-success)]" : "text-[var(--color-state-danger)]"}`}>
              {data?.market_data?.price_change_percentage_24h.toFixed(2)}% (1d)
            </p>
          </div>
        </div>
        {/* grid info */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <GridItem 
            text='Market cap' 
            data={`$${millify(data?.market_data?.market_cap?.usd)}`} 
            className='col-span-2' 
          />
          <GridItem 
            text='FDV' 
            data={`$${millify(data?.market_data?.fully_diluted_valuation?.usd)}`} 
          />
          <GridItem 
            text='Total supply' 
            data={`${millify(data?.market_data?.total_supply)}`}
            symbol={data?.symbol.toUpperCase()}
          />
          <GridItem 
            text='Max. supply' 
            data={`${data?.market_data?.max_supply ? millify(data?.market_data?.max_supply) : ""}`} 
            symbol={data?.symbol.toUpperCase()}
          />
          <GridItem 
            text='Circulating supply' 
            data={`${millify(data?.market_data?.circulating_supply)}`} 
            symbol={data?.symbol.toUpperCase()}
          />
        </div>
        {/* price performance */}
        <div className='mt-4'>
          <p className='text-sm font-semibold'>Price performance</p>

          <div className='flex justify-between items-center my-1'>
            <div>
              <p className='text-xs font-semibold text-gray-600'>All-time high</p>
              <p className='text-xs font-semibold text-gray-600'>
                {new Date(data?.market_data?.ath_date?.usd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className='text-end'>
              <p className='font-bold text-sm'>${data?.market_data?.ath?.usd.toLocaleString()}</p>
              <p className='text-sm'>{data?.market_data?.ath_change_percentage?.usd.toFixed(2)}%</p>
            </div>
          </div>

          <div className='flex justify-between items-center my-1'>
            <div>
              <p className='text-xs font-semibold text-gray-600'>All-time low</p>
              <p className='text-xs font-semibold text-gray-600'>
                {new Date(data?.market_data?.atl_date?.usd).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className='text-end'>
              <p className='font-bold text-sm'>${data?.market_data?.atl?.usd.toLocaleString()}</p>
              <p className='text-sm'>{data?.market_data?.atl_change_percentage?.usd.toFixed(2)}%</p>
            </div>
          </div>

        </div>
      </aside>
    </div>
  )
}

export default CryptoInfo