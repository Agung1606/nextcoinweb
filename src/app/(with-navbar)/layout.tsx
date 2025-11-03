import Navbar from '@/components/layout/Navbar';
import React from 'react'

function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col w-full h-screen'>
      <Navbar />
      <main className="flex-1 overflow-y-auto p-2">
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout