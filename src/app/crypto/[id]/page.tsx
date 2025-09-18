"use client"

import { coinDataByID, fetchOHLCByID } from '@/api/coingecko';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { use } from 'react'
import millify from 'millify';
import { InfinityIcon } from 'lucide-react';
import CandleStickChart from '@/components/CandleStickChart';

const GridItem = ({
  text,
  data,
  symbol,
  className
}: {
  text: string;
  data: string | number | undefined;
  symbol?: string;
  className?: string;
}) => {
  return (
    <div className={`${className} flex flex-col items-center justify-center border border-slate-600 p-2 rounded-md`}>
      <p className='text-sm'>{text}</p>
      {data 
        ? <p className="font-semibold">{data} {symbol}</p> 
        : <InfinityIcon className="w-10 h-10" />}
    </div>
  )
};

function CryptoInfo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["coins", id],
    queryFn: () => coinDataByID({ id: id }),
    refetchInterval: 30000,
    staleTime: 1000 * 60
  })

  const { data: dataOHLC, isLoading: isLoadingOHLC } = useQuery({
    queryKey: ["coinOHLC", id],
    queryFn: () => fetchOHLCByID({ id: id, vs_currency: "usd", days: 7 }),
    refetchInterval: 30000,
    staleTime: 1000 * 60
  })

  if(isLoading || isLoadingOHLC) return <div>Loading...</div>

  return (
    <div className='w-full min-h-screen flex flex-col'>
      {/*this will be navbar */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800">
        <p className="text-lg font-bold">NextCoin</p>
      </div>
      <div className='flex flex-1 flex-col lg:flex-row'>

        {/* sidebar */}
        <aside className='w-full lg:w-72 flex-shrink-0 h-full flex flex-col px-4 py-2 border-r border-slate-800 overflow-y-auto'>
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
                <div className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-slate-700 text-sm font-bold">
                  {data?.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <span className='text-xl font-semibold truncate'>{data?.name}</span>
              <span className='text-gray-400 text-sm uppercase'>{data?.symbol}</span>
              <span className='text-xs font-semibold bg-slate-600 px-2 rounded-md'>#{data?.market_cap_rank}</span>
            </div>
            <div className='flex items-center gap-x-2'>
              <p className='text-4xl font-semibold'>${data?.market_data?.current_price?.usd.toLocaleString()}</p>
              <p 
                className={`text-xs font-semibold ${data?.market_data?.price_change_percentage_24h >= 0 ? "text-[var(--color-state-success)]" : "text-[var(--color-state-danger)]"}`}>
                {data?.market_data?.price_change_percentage_24h.toFixed(2) ?? "N/A"}% (1d)
              </p>
            </div>
          </div>
          {/* grid info */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            <GridItem 
              text='Market cap' 
              data={`$${millify(data?.market_data?.market_cap?.usd) ?? "N/A"}`} 
              className='col-span-2' 
            />
            <GridItem 
              text='FDV' 
              data={`$${millify(data?.market_data?.fully_diluted_valuation?.usd) ?? "N/A"}`} 
            />
            <GridItem 
              text='Total supply' 
              data={`${millify(data?.market_data?.total_supply) ?? "N/A"}`}
              symbol={data?.symbol.toUpperCase()}
            />
            <GridItem 
              text='Max. supply' 
              data={`${data?.market_data?.max_supply ? millify(data?.market_data?.max_supply) : ""}`} 
              symbol={data?.symbol.toUpperCase()}
            />
            <GridItem 
              text='Circ. supply' 
              data={`${millify(data?.market_data?.circulating_supply) ?? "N/A"}`} 
              symbol={data?.symbol.toUpperCase()}
            />
          </div>
          {/* price performance */}
          <div className='mt-4'>
            <p className='text-sm font-semibold'>Price performance</p>

            <div className='flex justify-between items-center my-1'>
              <div>
                <p className='text-xs font-semibold text-gray-400'>All-time high</p>
                <p className='text-xs font-semibold text-gray-400'>
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
                <p className='text-xs font-semibold text-gray-400'>All-time low</p>
                <p className='text-xs font-semibold text-gray-400'>
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

        <div className='flex-1 h-full p-4'>
          <CandleStickChart data={dataOHLC} />
        </div>
      </div>
    </div>
  )
}

export default CryptoInfo