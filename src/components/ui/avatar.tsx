'use client'

import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-slate-700',
          sizes[size],
          className
        )}
      />
    )
  }

  const gradients = [
    'from-primary to-primary-light',
    'from-secondary to-emerald-400',
    'from-accent to-amber-400',
    'from-pink-500 to-rose-400',
    'from-violet-500 to-purple-400',
  ]

  const gradientIndex = name.charCodeAt(0) % gradients.length

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white ring-2 ring-slate-700',
        gradients[gradientIndex],
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
