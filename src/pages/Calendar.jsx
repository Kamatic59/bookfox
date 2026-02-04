import { useState } from 'react';

// Mock appointments data
const mockAppointments = [
  { id: 1, title: 'Pipe Repair', customer: 'John Smith', phone: '(385) 555-0101', time: '9:00 AM', duration: '2h', status: 'confirmed', address: '123 Main St, Salt Lake City' },
  { id: 2, title: 'Water Heater Install', customer: 'Sarah Johnson', phone: '(385) 555-0102', time: '11:30 AM', duration: '3h', status: 'confirmed', address: '456 Oak Ave, Bountiful' },
  { id: 3, title: 'Drain Cleaning', customer: 'Mike Davis', phone: '(385) 555-0103', time: '3:00 PM', duration: '1h', status: 'pending', address: '789 Pine St, Centerville' },
];

// Calendar day component
function CalendarDay({ date, isToday, isSelected, hasAppointments, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
        isSelected
          ? 'bg-blue-600 text-white font-bold'
          : isToday
          ? 'bg-blue-100 text-blue-700 font-medium'
          : 'hover:bg-stone-100 text-stone-700'
      }`}
    >
      {date.getDate()}
      {hasAppointments && !isSelected && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
      )}
    </button>
  );
}

// Appointment card
function AppointmentCard({ appointment }) {
  const statusColors = {
    confirmed: 'border-l-emerald-500 bg-emerald-50/50',
    pending: 'border-l-amber-500 bg-amber-50/50',
    cancelled: 'border-l-red-500 bg-red-50/50',
  };

  return (
    <div className={`border-l-4 ${statusColors[appointment.status]} rounded-lg p-4 mb-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-stone-800">{appointment.title}</h4>
          <p className="text-stone-600 text-sm">{appointment.customer}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
          appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {appointment.status}
        </span>
      </div>
      
      <div className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-stone-600">
          <span>🕐</span>
          <span>{appointment.time} ({appointment.duration})</span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <span>📍</span>
          <span>{appointment.address}</span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <span>📞</span>
          <span>{appointment.phone}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 py-2 px-3 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
          Reschedule
        </button>
        <button className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

// Generate calendar days
function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  // Add empty slots for days before the first day of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
}

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState('week'); // day, week, month

  const days = generateCalendarDays(currentYear, currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Calendar</h1>
          <p className="text-stone-500 mt-1">Manage your appointments and schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 rounded-xl p-1">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  view === v ? 'bg-white shadow text-stone-800' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mini Calendar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-800">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex gap-1">
              <button 
                onClick={goToPrevMonth}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={goToNextMonth}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-stone-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => (
              <div key={i} className="flex justify-center py-1">
                {date ? (
                  <CalendarDay
                    date={date}
                    isToday={date.toDateString() === today.toDateString()}
                    isSelected={date.toDateString() === selectedDate.toDateString()}
                    hasAppointments={date.getDate() % 3 === 0}
                    onClick={() => setSelectedDate(date)}
                  />
                ) : (
                  <div className="w-10 h-10" />
                )}
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-stone-200">
            <h3 className="text-sm font-medium text-stone-800 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 text-sm">Total Appointments</span>
                <span className="font-bold text-stone-800">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 text-sm">Confirmed</span>
                <span className="font-bold text-emerald-600">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-600 text-sm">Pending</span>
                <span className="font-bold text-amber-600">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day View / Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-800">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-stone-500 text-sm">
                  {mockAppointments.length} appointments scheduled
                </p>
              </div>
              <button 
                onClick={() => setSelectedDate(today)}
                className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {mockAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-stone-800 mb-2">No appointments</h3>
                <p className="text-stone-500">No appointments scheduled for this day</p>
              </div>
            ) : (
              <div className="space-y-1">
                {mockAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 mt-6">
            <h2 className="text-lg font-bold text-stone-800 mb-4">Upcoming This Week</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-xs text-blue-600 font-medium">Feb</span>
                    <span className="text-lg font-bold text-blue-700">{5 + i}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">Water Heater Inspection</p>
                    <p className="text-stone-500 text-sm">9:00 AM • Sarah Johnson</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
