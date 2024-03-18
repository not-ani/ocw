'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export function SessionWrapper(props: {
  childern: React.ReactNode
}) {
  return (
    <div>
      <SessionProvider>
        {props.childern}
      </SessionProvider>
    </div>
  )
}
