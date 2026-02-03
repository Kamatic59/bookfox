import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/inbox', icon: MessageSquare, label: 'Inbox' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const { user, business, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <span className="text-xl">🦊</span>
          <span>BookFox</span>
        </div>
        
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium text-sm"
        >
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-200
          transform transition-transform lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-stone-100">
          <span className="text-2xl">🦊</span>
          <span className="font-bold text-xl text-stone-800">BookFox</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Business Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-stone-100">
          <div className="bg-stone-50 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-medium text-stone-800 truncate">
                  {business?.name || 'Your Business'}
                </p>
                <p className="text-xs text-stone-500 truncate">
                  {user?.email}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-xl shadow-lg border border-stone-200 py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile user menu */}
      {userMenuOpen && (
        <div className="lg:hidden fixed top-14 right-4 z-50 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1">
          <div className="px-4 py-2 border-b border-stone-100">
            <p className="font-medium text-stone-800 truncate">{business?.name}</p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
