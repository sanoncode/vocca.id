import { Button } from '@/components/ui/button';
import { SideBarItemProps } from '@/constants/types/props';
import { Crown } from 'lucide-react';
import Link from 'next/link';

const SideBarItem = ({
  label,
  href,
  createdBy,
  userId,
}: SideBarItemProps) => {
  return (
    <Button variant={"link"} className='w-full' size={'lg'}>
      {createdBy === userId ? <Crown className="w-4 h-4" />: null}
        <Link className='text-left' href={href}>
            {label}
      </Link>
   </Button>
 
  )
}

export default SideBarItem
