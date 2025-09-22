import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Eye, Check, Award, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

function RafflesView({ activities, onAdd, onEdit, onView, onDrawWinner, elders, toast }) {

  const handlePrint = (raffle) => {
    const winnerInfo = raffle.winner_id ? elders.find(e => e.id === raffle.winner_id) : null;
    const participantsList = raffle.participants?.map(id => elders.find(e => e.id === id)?.name || 'Desconocido').join(', ') || 'Ninguno';

    const printContent = `
      <html>
        <head>
          <title>Detalles de la Rifa</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1, h2 { color: #333; }
            .content { border: 1px solid #ddd; padding: 1.5rem; border-radius: 8px; }
            .field { margin-bottom: 1rem; }
            .field-label { font-weight: bold; color: #555; }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>Detalles de la Rifa</h1>
            <div class="field">
              <span class="field-label">Título:</span> ${raffle.title}
            </div>
            <div class="field">
              <span class="field-label">Premio:</span> ${raffle.prize}
            </div>
            <div class="field">
              <span class="field-label">Estado:</span> ${raffle.status === 'completed' ? 'Finalizada' : 'Activa'}
            </div>
            ${winnerInfo ? `<div class="field"><span class="field-label">Ganador:</span> ${winnerInfo.name}</div>` : ''}
            <h2>Participantes</h2>
            <p>${participantsList}</p>
          </div>
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
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Rifas</h2>
        <Button onClick={onAdd} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Rifa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activities.map(raffle => {
          const winnerInfo = raffle.winner_id ? elders.find(e => e.id === raffle.winner_id) : null;

          return (
            <div key={raffle.id} className="glass-effect rounded-xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{raffle.title}</h3>
                  <p className="text-gray-600">Premio: {raffle.prize}</p>
                </div>
                <span className={`status-${raffle.status}`}>
                  {raffle.status === 'completed' ? 'Finalizada' : 'Activa'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fecha de cierre:</span>
                  <span className="font-medium">{new Date(raffle.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Participantes:</span>
                  <span className="font-medium">{raffle.participants?.length || 0}</span>
                </div>
                {winnerInfo && (
                  <div className="flex justify-between items-center p-2 bg-green-100 rounded-lg">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-green-600" />
                      <span className="text-sm text-green-800">Ganador:</span>
                    </div>
                    <span className="font-semibold text-green-800">{winnerInfo.name}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(raffle)} disabled={raffle.status === 'completed'}>
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onView(raffle)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrint(raffle)}>
                  <Printer className="w-4 h-4 mr-1" />
                  Imprimir
                </Button>
                {raffle.status !== 'completed' && (
                  <Button size="sm" className="btn-primary flex-1" onClick={() => onDrawWinner(raffle)}>
                    <Check className="w-4 h-4 mr-1" />
                    Sortear Ganador
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default RafflesView;
