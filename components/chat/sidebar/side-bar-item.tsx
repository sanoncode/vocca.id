import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

type itemProps = {
  label: string,
  active?: boolean,
  href: string
};

const SideBarItem = ({
  label,
  href
}: itemProps) => {
  return (
     <Button variant={"link"} className='w-full' size={'lg'}>
        <Link className='text-left' href={href}>
            {label}
      </Link>
   </Button>
  )
}

export default SideBarItem
