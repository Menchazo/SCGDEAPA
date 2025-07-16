
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Eye, Gift, Check, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function RafflesView({ activities, onAdd, onEdit, onView, elders, setActivities, toast }) {
  const [winner, setWinner] = useState(null);

  const handleDrawWinner = (raffle) => {
    if (raffle.participants.length === 0) {
      toast({
        title: "No hay participantes",
        description: "Agrega participantes antes de sortear un ganador.",
        variant: "destructive",
      });
      return;
    }
    const winnerId = raffle.participants[Math.floor(Math.random() * raffle.participants.length)];
    const winnerInfo = elders.find(e => e.id === winnerId);
    setWinner(winnerInfo);

    const updatedActivities = activities.map(act => 
      act.id === raffle.id ? { ...act, status: 'completed', winner: winnerInfo } : act
    );
    setActivities(updatedActivities);

    toast({
      title: "¡Tenemos un ganador!",
      description: `${winnerInfo.name} ha ganado la rifa "${raffle.title}".`,
    });
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
        {activities.map(raffle => (
          <div key={raffle.id} className="glass-effect rounded-xl p-6 card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{raffle.title}</h3>
                <p className="text-gray-600">Premio: {raffle.prize}</p>
              </div>
              <span className={`status-${raffle.status}`}>
                {raffle.status === 'active' ? 'Activa' : 'Finalizada'}
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
              {raffle.winner && (
                <div className="flex justify-between items-center p-2 bg-green-100 rounded-lg">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    <span className="text-sm text-green-800">Ganador:</span>
                  </div>
                  <span className="font-semibold text-green-800">{raffle.winner.name}</span>
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
              {raffle.status === 'active' && (
                <Button size="sm" className="btn-primary flex-1" onClick={() => handleDrawWinner(raffle)}>
                  <Check className="w-4 h-4 mr-1" />
                  Sortear Ganador
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No hay rifas activas</h3>
          <p className="text-gray-500">Crea la primera rifa</p>
        </div>
      )}
    </motion.div>
  );
}

export default RafflesView;
