import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (active) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
        {!active && <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />}
        {active && <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V21h6V9.043L12 3 3 9.043V21h6v-4.455z" />}
      </svg>
    ),
  },
  {
    to: '/search',
    label: 'Search',
    icon: () => (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    to: '/create',
    label: 'Create',
    icon: () => (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[244px] border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-8 z-40">
      <Link to="/" className="px-3 mb-8">
        <h1 className="text-2xl font-bold gradient-text tracking-tight">InstaGram</h1>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'font-bold text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {icon(isActive)}
                <span className="text-base">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'font-bold text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={isActive ? 'gradient-ring rounded-full' : ''}>
                <Avatar name={user?.full_name || user?.username} size="sm" gradient={false} />
              </div>
              <span className="text-base">Profile</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="space-y-1 border-t border-neutral-200 dark:border-neutral-800 pt-4">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-3 py-3 rounded-xl w-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
        >
          {isDark ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
          <span className="text-base">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  )
}
