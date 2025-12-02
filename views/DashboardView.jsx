
import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Heart, Calendar as CalendarIcon } from 'lucide-react';

function DashboardView({ stats, elders, activities }) {
  const upcomingActivities = activities
    .filter(a => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Adultos Mayores</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalElders}</p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeElders}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Beneficiarios Nutrición</p>
              <p className="text-3xl font-bold text-amber-600">{stats.nutritionBeneficiaries}</p>
            </div>
            <Heart className="w-12 h-12 text-amber-500" />
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actividades Próximas</p>
              <p className="text-3xl font-bold text-purple-600">{stats.upcomingActivities}</p>
            </div>
            <CalendarIcon className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cronograma de Actividades</h3>
          <div className="space-y-3">
            {upcomingActivities.length > 0 ? upcomingActivities.map(activity => (
              <div key={activity.id} className={`activity-card activity-${activity.type}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(activity.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {activity.time && `- ${activity.time}`}
                    </p>
                  </div>
                  <span className={`status-${activity.status === 'scheduled' ? 'pending' : activity.status}`}>
                    {activity.status === 'scheduled' ? 'Programada' : 
                     activity.status === 'active' ? 'Activa' : 'Completada'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No hay actividades próximas.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Salud</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-red-700">Patologías más comunes</span>
              <span className="font-semibold text-red-800">Diabetes, Hipertensión</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Discapacidades registradas</span>
              <span className="font-semibold text-blue-800">
                {elders.reduce((acc, elder) => acc + elder.disabilities.length, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700">Medicamentos activos</span>
              <span className="font-semibold text-green-800">
                {elders.reduce((acc, elder) => acc + elder.medications.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardView;
