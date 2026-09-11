import { cn } from '../../utils/cn'

export default function Avatar({ name, size = 'md', className, gradient = true }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl',
  }

  const inner = (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 select-none',
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )

  if (gradient) {
    return <div className="gradient-ring inline-block rounded-full">{inner}</div>
  }

  return inner
}
