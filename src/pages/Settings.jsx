import { useState } from 'react'
import { Building2, Phone, Clock, MapPin, Bot, Bell, Users, CreditCard } from 'lucide-react'

const tabs = [
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('business')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Settings</h1>
        <p className="text-stone-500">Configure your BookFox account</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <div className="sm:w-56 flex-shrink-0">
          <nav className="flex sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-stone-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'business' && <BusinessSettings />}
          {activeTab === 'ai' && <AISettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'team' && <TeamSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  )
}

function BusinessSettings() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">Business Information</h2>
        <p className="text-sm text-stone-500">Basic details about your business</p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Name</label>
          <input
            type="text"
            defaultValue="Kael's HVAC Services"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Business Phone</label>
          <input
            type="tel"
            defaultValue="+1 (801) 555-0100"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Service Area (Zip Codes)</label>
          <input
            type="text"
            defaultValue="84010, 84014, 84025, 84037"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
          <p className="text-xs text-stone-400 mt-1">Comma-separated zip codes where you provide service</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Opening Time</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Closing Time</label>
            <input
              type="time"
              defaultValue="18:00"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
                focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function AISettings() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-800">AI Assistant</h2>
        <p className="text-sm text-stone-500">Configure how your AI receptionist behaves</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Personality</label>
          <select className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300">
            <option value="friendly">Friendly & Warm</option>
            <option value="professional">Professional</option>
            <option value="direct">Direct & Efficient</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">AI Name</label>
          <input
            type="text"
            defaultValue="Alex"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
          />
          <p className="text-xs text-stone-400 mt-1">The name your AI will use when introducing itself</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Custom Greeting</label>
          <textarea
            rows={3}
            defaultValue="Hi there! Thanks for reaching out to Kael's HVAC Services. I'm Alex, and I'm here to help you get your issue resolved. What can I help you with today?"
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
          <div>
            <p className="font-medium text-stone-800">Emergency Detection</p>
            <p className="text-sm text-stone-500">AI prioritizes urgent issues like gas leaks, flooding</p>
          </div>
          <button className="relative w-11 h-6 bg-blue-600 rounded-full transition-colors">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-stone-100">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-800">Notification Settings</h2>
      <p className="text-sm text-stone-500 mb-6">Choose how you want to be notified</p>
      
      <div className="space-y-4">
        {[
          { label: 'New lead notifications', desc: 'Get notified when a new lead comes in' },
          { label: 'Booking confirmations', desc: 'When AI successfully books an appointment' },
          { label: 'Emergency alerts', desc: 'Urgent issues that need immediate attention' },
          { label: 'Daily summary', desc: 'Receive a daily recap of activity' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
            <div>
              <p className="font-medium text-stone-800">{item.label}</p>
              <p className="text-sm text-stone-500">{item.desc}</p>
            </div>
            <button className="relative w-11 h-6 bg-blue-600 rounded-full transition-colors">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamSettings() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-stone-800">Team Members</h2>
          <p className="text-sm text-stone-500">Manage your team and technicians</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          + Add Member
        </button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Kael (You)', role: 'Owner', status: 'Active' },
          { name: 'John Smith', role: 'Technician', status: 'On Job' },
        ].map((member, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-medium">{member.name[0]}</span>
              </div>
              <div>
                <p className="font-medium text-stone-800">{member.name}</p>
                <p className="text-sm text-stone-500">{member.role}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-800">Billing</h2>
      <p className="text-sm text-stone-500 mb-6">Manage your subscription and payment methods</p>

      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Current Plan</p>
            <p className="text-xl font-semibold text-stone-800">Free Trial</p>
            <p className="text-sm text-stone-500 mt-1">14 days remaining</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Upgrade
          </button>
        </div>
      </div>

      <div className="border-t border-stone-100 pt-6">
        <h3 className="font-medium text-stone-800 mb-4">Payment Method</h3>
        <button className="w-full p-4 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-stone-300 hover:text-stone-600 transition-colors">
          + Add Payment Method
        </button>
      </div>
    </div>
  )
}
