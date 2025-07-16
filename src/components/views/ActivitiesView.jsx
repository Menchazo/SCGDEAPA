
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Edit, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ActivitiesView({ activities, onAdd, onEdit, onView, elders }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Actividades Culturales</h2>
        <Button onClick={onAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activities.map(activity => (
          <div key={activity.id} className="glass-effect rounded-xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
              <span className={`status-${activity.status === 'scheduled' ? 'pending' : activity.status}`}>
                {activity.status === 'scheduled' ? 'Programada' : 'Completada'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 inline mr-2" />
                {new Date(activity.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} - {activity.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Ubicación:</span> {activity.location}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-medium mr-1">Participantes:</span> 
                <span>{activity.participants?.length || 0}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(activity)}>
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onView(activity)}>
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalles
              </Button>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No hay actividades culturales</h3>
          <p className="text-gray-500">Crea la primera actividad cultural</p>
        </div>
      )}
    </motion.div>
  );
}

export default ActivitiesView;
