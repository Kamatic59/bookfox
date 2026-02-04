import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo, FoxIconMinimal } from '../components/Logo';

// Navigation items
const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard', end: true },
  { to: '/dashboard/inbox', icon: '💬', label: 'Inbox' },
  { to: '/dashboard/leads', icon: '👥', label: 'Leads' },
  { to: '/dashboard/calendar', icon: '📅', label: 'Calendar' },
  { to: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
];

// Sidebar nav link component
function SidebarLink({ to, icon, label, end = false, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-blue-50 text-blue-600 font-medium'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
        } ${collapsed ? 'justify-center' : ''}`
      }
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, business, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-stone-200 transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-stone-100 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {sidebarCollapsed ? (
            <FoxIconMinimal size={32} />
          ) : (
            <Logo size="md" />
          )}
          <button 
            className="hidden lg:block p-1 hover:bg-stone-100 rounded-lg transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg className={`w-5 h-5 text-stone-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.to} 
              {...item} 
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Business info */}
        <div className={`p-4 border-t border-stone-100 ${sidebarCollapsed ? 'text-center' : ''}`}>
          {!sidebarCollapsed && (
            <div className="mb-3">
              <p className="font-medium text-stone-800 truncate">{business?.name}</p>
              <p className="text-stone-500 text-sm truncate">
                {business?.twilio_phone || 'No phone configured'}
              </p>
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{user?.email}</p>
                    <p className="text-xs text-stone-500">Owner</p>
                  </div>
                  <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </>
              )}
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-lg border border-stone-200 py-2 ${sidebarCollapsed ? 'left-full ml-2' : 'left-0 right-0'}`}>
                <button
                  onClick={() => navigate('/dashboard/settings')}
                  className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <span>⚙️</span> Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-stone-200">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search leads, conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Help */}
              <button className="p-2 rounded-xl hover:bg-stone-100 transition-colors">
                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Mobile user avatar */}
              <button 
                className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Mobile close sidebar on nav */}
      {sidebarOpen && (
        <div className="lg:hidden" onClick={() => setSidebarOpen(false)}>
          <Outlet />
        </div>
      )}
    </div>
  );
}
