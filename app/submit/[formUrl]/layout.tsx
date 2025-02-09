import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen h-screen'>
        <nav className='flex justify-between items-center border-b border-borer h[60[x] px-4 py-2'>
            <Logo />
        </nav>
        <main className='flex w-full flex-grow'>
            {children}
        </main>
    </div>
  )
}

export default Layout;