'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoaderProps {
  message?: string
  color?: string // Tailwind color class suffix like 'blue', 'green', 'red'
  background?: string // Optional bg color like 'bg-white bg-opacity-50'
}

const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  color = 'blue',
  background = 'bg-white bg-opacity-50',
}) => {
  return (
    <div className={`fixed inset-0 ${background} z-50 flex justify-center items-center`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`h-10 w-10 animate-spin text-${color}-600`} />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default Loader
