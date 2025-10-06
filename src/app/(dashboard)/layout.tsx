// app/(dashboard)/layout.tsx
'use client'


import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Link from 'next/link'

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {



    return (
        <div className="flex h-screen bg-gray-100">

        </div>
    )
}