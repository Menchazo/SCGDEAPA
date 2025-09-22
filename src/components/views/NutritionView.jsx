import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Check, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NutritionView({ elders, onSave, toast }) {
  const [isManaging, setIsManaging] = useState(false);
  const [selectedElders, setSelectedElders] = useState([]);

  useEffect(() => {
    setSelectedElders(elders.filter(e => e.nutritionBeneficiary).map(e => e.id));
  }, [elders]);

  const beneficiaries = elders.filter(elder => elder.nutritionBeneficiary);
  const nonBeneficiaries = elders.filter(elder => !elder.nutritionBeneficiary);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Lista de Entrega de Bolsas de Nutrición</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; color: #333; }
            h1, p { text-align: center; }
            h1 { font-size: 1.5rem; }
            p { font-size: 1.2rem; font-weight: normal; margin-bottom: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
            th, td { border: 1px solid #ccc; padding: 0.75rem; text-align: left; }
            th { background-color: #f4f4f4; }
            .signature-col { height: 3rem; }
            .date { text-align: right; margin-bottom: 1rem; font-size: 1rem; }
          </style>
        </head>
        <body>
          <h1>Lista de Entrega de Bolsas de Nutrición</h1>
          <p class="date"><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
          <table>
            <thead>
              <tr>
                <th style="width: 40%;">Nombre y Apellido</th>
                <th style="width: 25%;">Cédula</th>
                <th style="width: 35%;">Firma</th>
              </tr>
            </thead>
            <tbody>
              ${beneficiaries.length > 0
                ? beneficiaries.map(b => `
                  <tr>
                    <td>${b.name}</td>
                    <td>${b.cedula}</td>
                    <td class="signature-col"></td>
                  </tr>
                `).join('')
                : '<tr><td colspan="3" style="text-align: center;">No hay beneficiarios asignados.</td></tr>'
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

  const handleToggleSelection = (elderId) => {
    setSelectedElders(prev =>
      prev.includes(elderId)
        ? prev.filter(id => id !== elderId)
        : [...prev, elderId]
    );
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    onSave(selectedElders);
    setIsManaging(false);
  };

  const handleCancel = () => {
    setSelectedElders(elders.filter(e => e.nutritionBeneficiary).map(e => e.id));
    setIsManaging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Bolsas de Nutrición</h2>
        {!isManaging ? (
          <div className="flex space-x-2">
            <Button onClick={handlePrint} variant="outline" disabled={beneficiaries.length === 0}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Lista
            </Button>
            <Button onClick={() => setIsManaging(true)} className="btn-primary">
              <Edit className="w-4 h-4 mr-2" />
              Gestionar Beneficiarios
            </Button>
          </div>
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
