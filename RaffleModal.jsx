
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Check, Calendar, Gift, Info, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

function RaffleModal({ type, raffle, onSave, onClose, elders, toast }) {
  const [formData, setFormData] = useState({
    title: raffle?.title || '',
    prize: raffle?.prize || '',
    date: raffle?.date || '',
    participants: raffle?.participants || [],
    type: 'raffle',
    status: raffle?.status || 'active',
    winner: raffle?.winner || null
  });
  const [managingParticipants, setManagingParticipants] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleToggleParticipant = (elderId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(elderId)
        ? prev.participants.filter(id => id !== elderId)
        : [...prev.participants, elderId]
    }));
  };

  const renderViewMode = () => (
    <div className="p-6 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">{raffle.title}</h3>
      <div className="space-y-4">
        <p className="flex items-center"><Gift className="w-5 h-5 mr-3 text-orange-500" />Premio: {raffle.prize}</p>
        <p className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-orange-500" />Fecha del sorteo: {new Date(raffle.date).toLocaleDateString('es-ES')}</p>
        {raffle.winner && (
          <div className="flex items-center p-3 bg-green-100 rounded-lg">
            <Award className="w-6 h-6 mr-3 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Ganador</p>
              <p className="text-lg font-bold text-green-800">{raffle.winner.name}</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Users className="w-5 h-5 mr-2" />Participantes ({raffle.participants.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
          {raffle.participants.length > 0 ? raffle.participants.map(id => {
            const participant = elders.find(e => e.id === id);
            return <div key={id} className="p-2 bg-gray-100 rounded-md">{participant?.name || 'Participante no encontrado'}</div>;
          }) : <p className="text-gray-500">No hay participantes asignados.</p>}
        </div>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">Detalles de la Rifa</h3>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Título *</label><input type="text" className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Premio *</label><input type="text" className="input-field" value={formData.prize} onChange={(e) => setFormData({ ...formData, prize: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Cierre *</label><input type="date" className="input-field" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required /></div>
        </div>
      </div>

      <div className="form-section">
        <div className="flex justify-between items-center">
          <h3 className="section-title mb-0">Participantes ({formData.participants.length})</h3>
          <Button type="button" variant="outline" onClick={() => setManagingParticipants(!managingParticipants)}>
            {managingParticipants ? 'Cerrar Selección' : 'Gestionar Participantes'}
          </Button>
        </div>
        {managingParticipants && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-thin p-2 border rounded-lg">
            {elders.map(elder => (
              <div key={elder.id} onClick={() => handleToggleParticipant(elder.id)} className={`p-2 rounded-md cursor-pointer flex items-center space-x-2 ${formData.participants.includes(elder.id) ? 'bg-green-100' : 'bg-gray-50'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${formData.participants.includes(elder.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {formData.participants.includes(elder.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">{elder.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="btn-primary">{type === 'add' ? 'Crear Rifa' : 'Guardar Cambios'}</Button>
      </div>
    </form>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content scrollbar-thin" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {type === 'add' ? 'Nueva Rifa' : type === 'edit' ? 'Editar Rifa' : 'Detalles de la Rifa'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        {type === 'view' ? renderViewMode() : renderEditMode()}
      </motion.div>
    </motion.div>
  );
}

export default RaffleModal;
