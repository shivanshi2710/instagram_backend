import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'

const items = [
  { to: '/', end: true, icon: 'home' },
  { to: '/search', icon: 'search' },
  { to: '/create', icon: 'create' },
  { to: '/profile', icon: 'profile' },
]

function NavIcon({ type, active }) {
  const cls = `w-6 h-6 ${active ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`

  if (type === 'home') {
    return (
      <svg className={cls} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        {!active && <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />}
        {active && <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V21h6V9.043L12 3 3 9.043V21h6v-4.455z" />}
      </svg>
    )
  }
  if (type === 'search') {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    )
  }
  if (type === 'create') {
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    )
  }
  return null
}

export default function MobileNav() {
  const { user } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-around py-2 px-4">
        {items.map(({ to, end, icon }) => {
          if (icon === 'profile') {
            return (
              <NavLink
                key={to}
                to={`/profile/${user?.username}`}
                className={({ isActive }) => `p-2 rounded-xl transition-colors ${isActive ? 'opacity-100' : 'opacity-70'}`}
              >
                {({ isActive }) => (
                  <div className={isActive ? 'gradient-ring rounded-full' : ''}>
                    <Avatar name={user?.full_name || user?.username} size="sm" gradient={false} />
                  </div>
                )}
              </NavLink>
            )
          }
          return (
            <NavLink key={to} to={to} end={end} className="p-2 rounded-xl transition-colors">
              {({ isActive }) => <NavIcon type={icon} active={isActive} />}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export function MobileHeader() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold gradient-text">InstaGram</Link>
      <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
        {isDark ? (
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>
    </header>
  )
}
