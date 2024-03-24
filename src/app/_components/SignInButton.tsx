import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function SignInButton() {
  return (
    <div className="text-[0.875rem] inline-flex items-center justify-center">
      <Button className="h-[2.5rem]">
        <Link href={`/api/auth/signin`}>
          Sign In
        </Link>
      </Button>
    </div>
  )
}

