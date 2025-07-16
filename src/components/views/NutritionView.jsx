
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NutritionView({ elders, setElders, toast }) {
  const [isManaging, setIsManaging] = useState(false);
  const [selectedElders, setSelectedElders] = useState(
    elders.filter(e => e.nutritionBeneficiary).map(e => e.id)
  );

  const handleToggleSelection = (elderId) => {
    setSelectedElders(prev =>
      prev.includes(elderId)
        ? prev.filter(id => id !== elderId)
        : [...prev, elderId]
    );
  };

  const handleSaveChanges = () => {
    const updatedElders = elders.map(elder => ({
      ...elder,
      nutritionBeneficiary: selectedElders.includes(elder.id)
    }));
    setElders(updatedElders);
    setIsManaging(false);
    toast({
      title: "Beneficiarios actualizados",
      description: "La lista de beneficiarios de nutrición ha sido guardada.",
    });
  };

  const handleCancel = () => {
    setSelectedElders(elders.filter(e => e.nutritionBeneficiary).map(e => e.id));
    setIsManaging(false);
  };

  const beneficiaries = elders.filter(elder => elder.nutritionBeneficiary);
  const nonBeneficiaries = elders.filter(elder => !elder.nutritionBeneficiary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Bolsas de Nutrición</h2>
        {!isManaging ? (
          <Button onClick={() => setIsManaging(true)} className="btn-primary">
            <Edit className="w-4 h-4 mr-2" />
            Gestionar Beneficiarios
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges} className="btn-primary">
              <Check className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      {isManaging ? (
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Beneficiarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {elders.map(elder => (
              <div 
                key={elder.id} 
                onClick={() => handleToggleSelection(elder.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center space-x-3 ${selectedElders.includes(elder.id) ? 'bg-green-100 border-green-300' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedElders.includes(elder.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                  {selectedElders.includes(elder.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span>{elder.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-green-700">
              Beneficiarios ({beneficiaries.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {beneficiaries.map(elder => (
                <div key={elder.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {elder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{elder.name}</p>
                      <p className="text-sm text-gray-600">{elder.cedula}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-red-700">
              No Beneficiarios ({nonBeneficiaries.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {nonBeneficiaries.map(elder => (
                <div key={elder.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {elder.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{elder.name}</p>
                      <p className="text-sm text-gray-600">{elder.cedula}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default NutritionView;
