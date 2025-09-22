
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HealthModal({ type, elder, elders, onSave, onClose, toast }) {
  const [formData, setFormData] = useState({
    recordType: 'medication', // medication, pathology, disability
    description: '',
    selectedElders: [],
  });

  useEffect(() => {
    if (type === 'add-record' && elder) {
      setFormData(prev => ({ ...prev, selectedElders: [elder.id] }));
    }
  }, [type, elder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggleElderSelection = (elderId) => {
    setFormData(prev => {
      const isSelected = prev.selectedElders.includes(elderId);
      if (isSelected) {
        return { ...prev, selectedElders: prev.selectedElders.filter(id => id !== elderId) };
      } else {
        return { ...prev, selectedElders: [...prev.selectedElders, elderId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.selectedElders.length === 0) {
        toast({
            title: "Selección requerida",
            description: "Por favor, selecciona al menos un adulto mayor.",
            variant: "destructive",
        });
        return;
    }
    if (!formData.description.trim()) {
        toast({
            title: "Descripción requerida",
            description: "Por favor, ingresa una descripción para el registro.",
            variant: "destructive",
        });
        return;
    }
    onSave(formData);
    onClose();
  };
  
  const title = type === 'add-record' ? `Nuevo Registro para ${elder?.name}` : 'Asignar Tratamiento General';
  const isAssigningGeneral = type === 'assign-treatment';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isAssigningGeneral && (
            <div className='glass-effect p-4 rounded-lg'>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Seleccionar Adultos Mayores</h3>
                <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin">
                    {elders.map(e => (
                        <div key={e.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100">
                            <input
                                type="checkbox"
                                id={`elder-${e.id}`}
                                checked={formData.selectedElders.includes(e.id)}
                                onChange={() => handleToggleElderSelection(e.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`elder-${e.id}`} className="text-gray-700">{e.name}</label>
                        </div>
                    ))}
                </div>
            </div>
          )}

          <div>
            <label htmlFor="recordType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Registro
            </label>
            <select
              id="recordType"
              name="recordType"
              value={formData.recordType}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="medications">Medicamento</option>
              <option value="pathologies">Patología</option>
              <option value="disabilities">Discapacidad</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder={formData.recordType === 'medications' ? 'Ej: Losartán 50mg, 1 vez al día' : 'Ej: Diabetes tipo 2'}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Registro
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default HealthModal;
