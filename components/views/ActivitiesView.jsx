import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Edit, Eye, Users, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ActivitiesView({ activities, onAdd, onEdit, onView, elders }) {

  const handlePrint = (activity) => {
    const participantsDetails = activity.participants
      ?.map(id => elders.find(e => e.id === id))
      .filter(Boolean); // Ensure no undefined entries if an elder is deleted

    const printContent = `
      <html>
        <head>
          <title>Lista de Asistencia: ${activity.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; color: #333; }
            h1, h2 { text-align: center; }
            h1 { font-size: 1.5rem; }
            h2 { font-size: 1.2rem; font-weight: normal; margin-bottom: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
            th, td { border: 1px solid #ccc; padding: 0.75rem; text-align: left; }
            th { background-color: #f4f4f4; }
            .signature-col { height: 3rem; }
          </style>
        </head>
        <body>
          <h1>Lista de Asistencia</h1>
          <h2>Actividad: ${activity.title}</h2>
          <p><strong>Fecha:</strong> ${new Date(activity.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <table>
            <thead>
              <tr>
                <th style="width: 40%;">Nombre y Apellido</th>
                <th style="width: 25%;">Cédula</th>
                <th style="width: 35%;">Firma</th>
              </tr>
            </thead>
            <tbody>
              ${participantsDetails && participantsDetails.length > 0
                ? participantsDetails.map(p => `
                  <tr>
                    <td>${p.name}</td>
                    <td>${p.cedula}</td>
                    <td class="signature-col"></td>
                  </tr>
                `).join('')
                : '<tr><td colspan="3" style="text-align: center;">No hay participantes inscritos.</td></tr>'
              }
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

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

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(activity)}>
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={() => onView(activity)}>
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalles
              </Button>
              <Button variant="outline" size="sm" onClick={() => handlePrint(activity)}>
                <Printer className="w-4 h-4 mr-1" />
                Imprimir Asistencia
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
