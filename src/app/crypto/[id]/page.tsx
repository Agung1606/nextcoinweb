import React from 'react'

async function CryptoInfo({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params;
  return (
    <div>CryptoInfo {id}</div>
  )
}

export default CryptoInfo