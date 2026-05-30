import { Button } from '@/components/ui/button';
import { SideBarItemProps } from '@/constants/types/props';
import { Crown } from 'lucide-react';
import Link from 'next/link';

const SideBarItem = ({
  label,
  href,
  createdBy,
  userId,
  active,
}: SideBarItemProps) => {
  return (
    <Link className='text-left' href={href}>
      <Button
        variant={"ghost"}
        size={'lg'}
        className={`w-full ${active ? 'border border-black dark:border-white' : ''}`}>
        {createdBy === userId && <Crown className="w-4 h-4" />}
        {label}
      </Button>
    </Link>

  )
}

export default SideBarItem
