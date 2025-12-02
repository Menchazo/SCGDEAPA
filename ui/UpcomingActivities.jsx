
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const UpcomingActivities = ({ activities }) => {
  // Get today's date at the beginning of the day for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = activities
    .filter(act => new Date(act.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Let's show the next 5 activities

  // If there are no upcoming activities, we don't render anything.
  if (upcoming.length === 0) {
    return null;
  }

  const getTypeInfo = (type) => {
    switch (type) {
      case 'taller':
        return { label: 'Taller', color: 'bg-blue-100 text-blue-800' };
      case 'charla':
        return { label: 'Charla', color: 'bg-indigo-100 text-indigo-800' };
      case 'baile':
        return { label: 'Baile', color: 'bg-pink-100 text-pink-800' };
      default:
        return { label: 'Evento', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="pt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Próximas Actividades</h2>
        <p className="text-lg text-gray-600 mt-2">¡No te pierdas nuestros próximos eventos y talleres!</p>
      </div>
      <div className="max-w-4xl mx-auto space-y-4">
        {upcoming.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20 flex flex-col sm:flex-row justify-between items-start"
          >
            <div className="flex-1 mb-4 sm:mb-0">
                <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeInfo(activity.type).color}`}>
                        {getTypeInfo(activity.type).label}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
            </div>
            <div className="flex-shrink-0 sm:ml-6 text-left sm:text-right">
                <div className="flex items-center text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium">{new Date(activity.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">{activity.time}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingActivities;
