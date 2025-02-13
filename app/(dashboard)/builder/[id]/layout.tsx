import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-grow w-full mx-auto'>
        {children}
    </div>
  )
}

export default Layout