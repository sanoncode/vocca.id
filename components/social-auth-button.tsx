import React from 'react'
import { Button } from './ui/button'

interface SocialButtonAuthProps {
    children: React.ReactNode,
    action: () => void
}

const SocialButtonAuth = ({children, action}: SocialButtonAuthProps) => {
  return (
    <Button
    onClick={action}
    variant={'outline'}
    className='w-full'
    >
        {children}
    </Button>
  )
}

export default SocialButtonAuth