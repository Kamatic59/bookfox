import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, User, MapPin, Wrench } from 'lucide-react'

// Demo appointments
const appointments = [
  {
    id: 1,
    customer: 'Mike Thompson',
    service: 'AC Repair',
    time: '9:00 AM - 10:30 AM',
    address: '123 Main St, Bountiful',
    tech: 'John Smith',
    status: 'confirmed'
  },
  {
    id: 2,
    customer: 'Jennifer Adams',
    service: 'Annual Maintenance',
    time: '11:00 AM - 12:00 PM',
    address: '456 Oak Ave, Bountiful',
    tech: 'John Smith',
    status: 'confirmed'
  },
  {
    id: 3,
    customer: 'Sarah Mitchell',
    service: 'Water Heater Repair',
    time: '2:00 PM - 3:30 PM',
    address: '789 Pine Rd, Bountiful',
    tech: 'Unassigned',
    status: 'pending'
  },
]

const statusColors = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-stone-100 text-stone-600 border-stone-200',
}

export default function Calendar() {
  const [view, setView] = useState('day')
  const today = new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Calendar</h1>
          <p className="text-stone-500">Manage your schedule and appointments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          + New Appointment
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-stone-600" />
            </button>
            <h2 className="text-lg font-semibold text-stone-800 min-w-[200px] text-center">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-stone-600" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  view === v ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Day View */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-800 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className={`p-4 rounded-xl border ${statusColors[apt.status]} transition-colors hover:shadow-sm`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 opacity-60" />
                      <span>{apt.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 opacity-60" />
                      <span>{apt.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 opacity-60" />
                      <span className="text-sm">{apt.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                      apt.status === 'pending' ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {apt.status}
                    </span>
                    <p className="text-sm mt-2 text-stone-500">Tech: {apt.tech}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-800 mb-3">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-500">Total Jobs</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Confirmed</span>
                <span className="font-semibold text-green-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pending</span>
                <span className="font-semibold text-amber-600">1</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
            <h3 className="font-semibold text-stone-800 mb-2">AI Booked</h3>
            <p className="text-3xl font-bold text-blue-600">2</p>
            <p className="text-sm text-stone-500 mt-1">appointments this week</p>
          </div>
        </div>
      </div>
    </div>
  )
}
