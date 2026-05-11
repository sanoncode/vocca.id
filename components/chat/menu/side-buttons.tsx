'use client'

import React, { Suspense } from 'react'
import SideButton from './side-button'
import Image from 'next/image'
import { ThemeSwitcher } from '../../theme-switcher'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'


type menu = {
    name: string,
    icon: string,
    size: number
}

const TopMenuButton: menu[] = [{
    name: 'chat',
    icon: '/chat.svg',
    size: 100
},
{
    name: 'groups',
    icon: '/group.svg',
    size: 100
}, {
    name: 'people',
    icon: '/people.svg',
    size: 100
}]


const BottomMenuButton: menu[] = [{
    name: 'archive',
    icon: '/archive.svg',
    size: 100
},
{
    name: 'logout',
    icon: '/logout.svg',
    size: 100
}]

const SideButtons = () => {

    const router = useRouter()


    const handleClick = async (route: string) => {
        if(route === 'logout')
        {   
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
        }

        router.push(`/${route}`)
    } 


    return (
        <>
            <div className="flex flex-col gap-4">
                {TopMenuButton.map((menu: menu) => (
                    <SideButton
                    action={()=> handleClick(menu.name)}
                    key={menu.name}>
                        <Image
                            src={menu.icon}
                            height={menu.size}
                            width={menu.size}
                            alt={menu.name}
                            className="dark:invert"
                        />
                    </SideButton>
                ))}
            </div>
            <div className="flex flex-col gap-4">
                <ThemeSwitcher />
                <Suspense>
                    {BottomMenuButton.map((menu: menu) => (
                        <SideButton action={() => handleClick(menu.name)} key={menu.name}>
                            <Image
                                src={menu.icon}
                                height={menu.size}
                                width={menu.size}
                                alt={menu.name}
                                className="dark:invert"
                            />
                        </SideButton>
                    ))}
                </Suspense>
            </div>
        </>
    )
}

export default SideButtons
