'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!code) {
      router.replace('/tracking') // يرجعو إلا ما كانش الكود
    } else {
      setIsVerified(true)
    }
  }, [code, router])

  if (!isVerified) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100">{children}</main>
    </div>
  )
}