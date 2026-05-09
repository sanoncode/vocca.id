import React from 'react'
import { Button } from '../../ui/button'

interface SideButtonProps {
    children: React.ReactNode,
    action: () => void

}

const SideButton = ({ children, action }: SideButtonProps) => {
    return (
        <Button
        onClick={action}
            variant={'outline'} className="h-14 w-14 rounded-xl ">
            {children}
        </Button>
    )
}

export default SideButton
