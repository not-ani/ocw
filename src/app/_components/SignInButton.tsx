import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function SignInButton() {
  return (
    <div>
      <Link href={`/api/auth/signin`}>
        Sign In
      </Link>

    </div>
  )
}

