import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const schedule = [
    { day: 'Monday', time: '08:00 AM - 09:30 AM', subject: 'Corporate Accounting', teacher: 'Prof. Rajesh Sharma (CA)', room: 'Room 401' },
    { day: 'Monday', time: '09:45 AM - 11:15 AM', subject: 'Macroeconomics', teacher: 'Dr. Ananya Kulkarni', room: 'Room 401' },
    { day: 'Tuesday', time: '08:00 AM - 09:30 AM', subject: 'Business Management', teacher: 'Prof. Vikram Pant', room: 'Room 402' },
    { day: 'Tuesday', time: '09:45 AM - 11:15 AM', subject: 'Corporate Accounting (Numericals)', teacher: 'Prof. Rajesh Sharma (CA)', room: 'Room 401' },
    { day: 'Wednesday', time: '08:00 AM - 09:30 AM', subject: 'Indian Economic Development', teacher: 'Dr. Ananya Kulkarni', room: 'Room 401' },
    { day: 'Wednesday', time: '09:45 AM - 11:15 AM', subject: 'Accounting Doubt Clinic', teacher: 'Prof. Rajesh Sharma (CA)', room: 'Seminar Hall' },
    { day: 'Thursday', time: '08:00 AM - 09:30 AM', subject: 'Corporate Accounting', teacher: 'Prof. Rajesh Sharma (CA)', room: 'Room 401' },
    { day: 'Thursday', time: '09:45 AM - 11:15 AM', subject: 'Business Management Case Studies', teacher: 'Prof. Vikram Pant', room: 'Room 402' },
    { day: 'Friday', time: '08:00 AM - 09:30 AM', subject: 'Macroeconomics Problem Solving', teacher: 'Dr. Ananya Kulkarni', room: 'Room 401' },
    { day: 'Friday', time: '09:45 AM - 11:15 AM', subject: 'CUET Domain Orientation', teacher: 'Faculty Team', room: 'Room 401' },
    { day: 'Saturday', time: '09:00 AM - 11:00 AM', subject: 'Weekly Diagnostic Mock Exam', teacher: 'Exam Committee', room: 'Exam Hall 1' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Weekly Class Timetable</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Scheduled lecture slots, doubt clearing clinics, and weekend diagnostic assessments.
        </p>
      </div>

      <div className="space-y-6">
        {days.map((day) => {
          const slots = schedule.filter((s) => s.day === day);
          return (
            <div key={day} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">{day}</span>
                <span className="text-xs font-semibold text-indigo-600">{slots.length} Sessions Scheduled</span>
              </div>

              <div className="divide-y divide-slate-100">
                {slots.map((slot, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-bold text-slate-800">{slot.time}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{slot.subject}</p>
                      <p className="text-slate-500">Faculty: {slot.teacher}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium self-start sm:self-auto">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{slot.room}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
