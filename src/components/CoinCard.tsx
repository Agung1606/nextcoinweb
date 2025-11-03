"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CoinCard = ({
  id, 
  imageUrl, 
  name, 
  symbol,
  price,
  pricePercentage,
  className
}: {
  id: string; 
  imageUrl: string, 
  name: string, 
  symbol: string,
  price?: any,
  pricePercentage?: any,
  className?: string
}) => {
  return (
    <Link
      href={`/crypto/${id}`}
      className={`flex items-center justify-between p-2 cursor-pointer rounded-md ${className}`}
    >
      <div className="flex items-center gap-x-2">
        <Image src={imageUrl} alt={name} width={22} height={22} />
        <span className="truncate">{name}</span>
        <span className="text-xs text-gray-400">({symbol.toUpperCase()})</span>
      </div>
      {price && (
        <div className="flex items-center gap-x-2">
          <p>${price.toLocaleString()}</p>
          <p
            className={`${
              pricePercentage >= 0
                ? "text-[var(--color-state-success)]"
                : "text-[var(--color-state-danger)]"
            }`}
          >
            {pricePercentage >= 0 ? "▲" : "▼"} {pricePercentage.toFixed(2)}%
          </p>
        </div>
      )}
    </Link>
  );
}

export default CoinCard;