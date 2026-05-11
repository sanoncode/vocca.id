import React from 'react'
import { createClient } from '@/lib/supabase/server';
import { Button } from './ui/button';
import Link from 'next/link';

export async function GetStarted(){
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

  return user ? (
    <Button>
        <Link href='/chat' className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition" >
            Let's Have a Chat 💬
        </Link>
    </Button>
  ) : (
       <Button>
        <Link href='/auth/login' className="inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition" >
            Get Started 🚀
        </Link>
    </Button>
  )
}

export default GetStarted