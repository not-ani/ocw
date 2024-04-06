import React from 'react'

export default function Page({
  params
}: {
  params: {
    projectId: string
  },
}) {
  const projectId = parseInt(params.projectId)

  return (
    <div>
    </div>
  )
}
