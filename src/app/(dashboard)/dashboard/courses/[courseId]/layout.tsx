
import React from 'react'
import { Sidebar } from './_components/sidebar'
import { Navbar } from './_components/navbar'
import { getCurrentUser } from '@/server/auth'

export default async function DashboardLayout({
  children,
  params

}: {
  children: React.ReactNode,
  params: {
    courseId: string
  }
}) {
  const session = await getCurrentUser()
  return (
    <div className="flex h-screen">
      <Sidebar id={params.courseId} />
      <main className="flex-1 overflow-y-auto">
        <Navbar session={session!} />
        <div className="overflow-y-auto p-8 pt-2 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
