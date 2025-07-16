import React from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HealthView({ elders, toast }) {

  const handleFeatureNotImplemented = (description) => {
    toast({
      title: "Acción registrada (Simulación)",
      description: description,
    });
  };

  const eldersWithConditions = elders.filter(
    elder => elder.pathologies.length > 0 || elder.disabilities.length > 0
  );

  const renderTabContent = () => {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Adultos Mayores con Condiciones de Salud ({eldersWithConditions.length})
        </h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {eldersWithConditions.map(elder => (
            <div key={elder.id} className="p-4 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {elder.imageUrl ? (
                    <img src={elder.imageUrl} alt={elder.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                      {elder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{elder.name}</p>
                    <p className="text-sm text-gray-600">{elder.cedula}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleFeatureNotImplemented(`Nuevo registro de salud para ${elder.name}.`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Registro
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-1">Patologías</h4>
                  <div className="flex flex-wrap gap-1">
                    {elder.pathologies.length > 0 ? elder.pathologies.map((p, i) => <span key={i} className="badge badge-danger">{p}</span>) : <span className="text-xs text-gray-400">Ninguna</span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-1">Discapacidades</h4>
                  <div className="flex flex-wrap gap-1">
                    {elder.disabilities.length > 0 ? elder.disabilities.map((d, i) => <span key={i} className="badge badge-primary">{d}</span>) : <span className="text-xs text-gray-400">Ninguna</span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-1">Medicamentos</h4>
                  <div className="flex flex-wrap gap-1">
                    {elder.medications.length > 0 ? elder.medications.map((m, i) => <span key={i} className="badge badge-success">{m}</span>) : <span className="text-xs text-gray-400">Ninguno</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Salud</h2>
        <Button onClick={() => handleFeatureNotImplemented('Se ha asignado un nuevo tratamiento general.')} className="btn-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Asignar Tratamiento
        </Button>
      </div>
      
      {renderTabContent()}
    </motion.div>
  );
}

export default HealthView;