import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Navigation items with Lucide-style SVG icons
const navItems = [
  { 
    to: '/dashboard', 
    label: 'Dashboard', 
    end: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  { 
    to: '/dashboard/inbox', 
    label: 'Inbox',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    badge: 3
  },
  { 
    to: '/dashboard/leads', 
    label: 'Leads',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    to: '/dashboard/calendar', 
    label: 'Calendar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    to: '/dashboard/settings', 
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

// Mobile bottom navigation item
function MobileNavItem({ to, icon, label, badge, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'text-blue-600 bg-blue-50'
            : 'text-stone-500 active:bg-stone-100'
        }`
      }
    >
      <span className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </NavLink>
  );
}

// Sidebar nav link component
function SidebarLink({ to, icon, label, badge, end = false, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-medium shadow-sm border border-blue-100/50'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800 active:bg-stone-200'
        } ${collapsed ? 'justify-center px-3' : ''}`
      }
    >
      <span className="relative">
        {icon}
        {badge && collapsed && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, business, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white/95 backdrop-blur-lg border-r border-stone-200/80 flex flex-col
          transition-all duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
          lg:translate-x-0 lg:shadow-none
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-72
        `}
      >
        {/* Logo */}
        <div className={`p-4 border-b border-stone-100 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {sidebarCollapsed ? (
            <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
          ) : (
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
              <span className="text-xl font-bold text-stone-800">
                Book<span className="text-blue-600">Fox</span>
              </span>
            </div>
          )}
          <button
            className="hidden lg:flex p-2 hover:bg-stone-100 rounded-xl transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 hover:bg-stone-100 rounded-xl transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <SidebarLink
              key={item.to}
              {...item}
              collapsed={sidebarCollapsed}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Business info */}
        <div className={`p-4 border-t border-stone-100 ${sidebarCollapsed ? 'text-center' : ''}`}>
          {!sidebarCollapsed && (
            <div className="mb-3 p-3 bg-gradient-to-r from-stone-50 to-stone-100/50 rounded-xl border border-stone-200/50">
              <p className="font-semibold text-stone-800 truncate text-sm">{business?.name || 'Your Business'}</p>
              <p className="text-stone-500 text-xs truncate mt-0.5 flex items-center gap-1">
                {business?.twilio_phone ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {business.twilio_phone}
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    Setup needed
                  </>
                )}
              </p>
            </div>
          )}

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(!userMenuOpen);
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{user?.email}</p>
                    <p className="text-xs text-stone-500">Owner</p>
                  </div>
                  <svg className={`w-4 h-4 text-stone-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {/* User dropdown menu */}
            <div
              className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-stone-200 py-2 overflow-hidden transition-all duration-200 ${
                sidebarCollapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'
              } ${userMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
              <button
                onClick={() => {
                  navigate('/dashboard/settings');
                  setUserMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-stone-50 active:bg-stone-100 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <hr className="my-1 border-stone-100" />
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 active:bg-red-100 flex items-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} pb-20 lg:pb-0`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-stone-200/80">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile logo */}
            <div className="lg:hidden">
              <img src="/logo.png" alt="BookFox" className="w-9 h-9" />
            </div>

            {/* Search - hidden on mobile */}
            <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search leads, conversations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100/80 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <button className="md:hidden p-2.5 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Desktop: Help button */}
              <button className="hidden lg:flex p-2.5 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => (
            <MobileNavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
