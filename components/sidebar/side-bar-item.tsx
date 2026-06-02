import { Button } from '@/components/ui/button';
import { SideBarItemProps } from '@/constants/types/props';
import { cn } from '@/lib/utils';
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
    <Link href={href}>
      <Button
        variant={"ghost"}
        size={'lg'}
        className={cn(
          'w-full mb-2',
          active && 'border border-black dark:border-white'
        )}>
       
        {createdBy === userId && <Crown className="w-4 h-4" />}
        {label}
      </Button>
    </Link>

  )
}

export default SideBarItem
