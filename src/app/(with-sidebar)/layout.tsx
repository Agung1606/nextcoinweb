import Sidebar from '@/components/layout/Sidebar';
import React from 'react'

function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex w-full h-screen'>
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export default SidebarLayout