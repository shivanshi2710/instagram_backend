import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav, { MobileHeader } from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Sidebar />
      <MobileHeader />
      <main className="md:ml-[244px] pb-20 md:pb-8">
        <div className="max-w-[630px] mx-auto px-4 py-4 md:py-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      {children}
    </div>
  )
}

export function WideLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Sidebar />
      <MobileHeader />
      <main className="md:ml-[244px] pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
