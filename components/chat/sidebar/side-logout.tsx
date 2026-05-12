import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const SideLogout = () => {
     
    const router = useRouter()
    const handleLogout = async () => {
        const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
    }

  return (
      <Button variant={'outline'} size={'lg'} onClick={() => handleLogout()}>
          <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-600 dark:text-red-400">Logout</span>
        </Button>
  )
}

export default SideLogout