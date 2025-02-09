"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react'

const Error = ({ error }: {error: Error }) => {
  useEffect(() => {
    console.log(error)
  }, [error]);
  return (
    <div className='flex items-center justify-center w-full h-full gap-4'>
        <h2 className='text-destructive text-4xl'>Something went wrong</h2>
        <Button asChild>
            <Link href={"/"}>Home</Link>
        </Button>
    </div>
  )
}

export default Error