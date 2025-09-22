
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapInput from '@/components/ui/MapInput';
import 'leaflet/dist/leaflet.css';

function ElderModal({ type, elder, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: elder?.name || '',
    age: elder?.age || '',
    cedula: elder?.cedula || '',
    phone: elder?.phone || '',
    address: elder?.address || '',
    latitude: elder?.latitude || null,
    longitude: elder?.longitude || null,
    emergencyContact: elder?.emergencyContact || '',
    pathologies: elder?.pathologies || [],
    medications: elder?.medications || [],
    disabilities: elder?.disabilities || [],
    nutritionBeneficiary: elder?.nutritionBeneficiary || false,
    status: elder?.status || 'active',
    imageUrl: elder?.imageUrl || ''
  });

  const [newPathology, setNewPathology] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newDisability, setNewDisability] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleLocationChange = (newLocation) => {
    setFormData(prev => ({
      ...prev,
      latitude: newLocation.lat,
      longitude: newLocation.lng,
      address: newLocation.address || prev.address
    }));
  };

  const handleAddItem = (field, value, setValue) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setValue('');
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const isViewOnly = type === 'view';
  
  const locationValue = { lat: formData.latitude, lng: formData.longitude };

  const renderViewMode = () => (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        {elder.imageUrl ? (
          <img src={elder.imageUrl} alt={elder.name} className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white"><User className="w-12 h-12" /></div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 text-center md:text-left">{elder.name}</h3>
          <p className="text-gray-600 text-center md:text-left">{elder.age} años</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label><p className="text-gray-900">{elder.cedula}</p></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label><p className="text-gray-900">{elder.phone}</p></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><p className="text-gray-900 break-words">{elder.address || 'N/A'}</p></div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Estado</label><span className={`status-${elder.status}`}>{elder.status === 'active' ? 'Activo' : 'Inactivo'}</span></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Beneficiario de Nutrición</label><span className={elder.nutritionBeneficiary ? 'badge badge-success' : 'badge badge-danger'}>{elder.nutritionBeneficiary ? 'Sí' : 'No'}</span></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contacto de Emergencia</label><p className="text-gray-900">{elder.emergencyContact}</p></div>
        </div>
      </div>

      {elder.latitude && elder.longitude && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación Registrada</label>
          <MapInput value={{ lat: elder.latitude, lng: elder.longitude }} isViewOnly={true} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Patologías</h4>
          <div className="space-y-1">{elder.pathologies.length > 0 ? elder.pathologies.map((p, i) => <span key={i} className="badge badge-danger block">{p}</span>) : <p className="text-gray-500 text-sm">Ninguna</p>}</div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Medicamentos</h4>
          <div className="space-y-1">{elder.medications.length > 0 ? elder.medications.map((m, i) => <span key={i} className="badge badge-success block">{m}</span>) : <p className="text-gray-500 text-sm">Ninguno</p>}</div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Discapacidades</h4>
          <div className="space-y-1">{elder.disabilities.length > 0 ? elder.disabilities.map((d, i) => <span key={i} className="badge badge-primary block">{d}</span>) : <p className="text-gray-500 text-sm">Ninguna</p>}</div>
        </div>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="section-title">Información Personal</h3>
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Perfil" className="w-24 h-24 rounded-full object-cover" />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-12 h-12 text-gray-400" /></div>
            )}
            <Button type="button" size="icon" className="absolute bottom-0 right-0 rounded-full w-8 h-8 bg-orange-600 hover:bg-orange-700" onClick={() => fileInputRef.current.click()}>
                <Camera className="w-4 h-4 text-white" />
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
              <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Edad *</label><input type="number" className="input-field" value={formData.age} onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Cédula *</label><input type="text" className="input-field" value={formData.cedula} onChange={(e) => setFormData({ ...formData, cedula: e.target.value })} required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label><input type="text" className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Contacto de Emergencia</label><input type="text" className="input-field" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} placeholder="Nombre - Teléfono" /></div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Ubicación y Dirección</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fijar Ubicación en el Mapa</label>
          <MapInput value={locationValue} onChange={handleLocationChange} isViewOnly={isViewOnly} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección (autocompletada por el mapa)</label>
          <textarea
            className="input-field" 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="La dirección aparecerá aquí. Puede editarla o agregar detalles."
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Información de Salud</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Patologías</label>
          <div className="flex space-x-2 mb-2"><input type="text" className="input-field flex-1" value={newPathology} onChange={(e) => setNewPathology(e.target.value)} placeholder="Agregar patología" /><Button type="button" onClick={() => handleAddItem('pathologies', newPathology, setNewPathology)} className="btn-secondary"><Plus className="w-4 h-4" /></Button></div>
          <div className="flex flex-wrap gap-2">{formData.pathologies.map((p, i) => <span key={i} className="badge badge-danger flex items-center space-x-1"><span>{p}</span><button type="button" onClick={() => handleRemoveItem('pathologies', i)} className="ml-1 hover:text-red-800"><X className="w-3 h-3" /></button></span>)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos</label>
          <div className="flex space-x-2 mb-2"><input type="text" className="input-field flex-1" value={newMedication} onChange={(e) => setNewMedication(e.target.value)} placeholder="Agregar medicamento" /><Button type="button" onClick={() => handleAddItem('medications', newMedication, setNewMedication)} className="btn-secondary"><Plus className="w-4 h-4" /></Button></div>
          <div className="flex flex-wrap gap-2">{formData.medications.map((m, i) => <span key={i} className="badge badge-success flex items-center space-x-1"><span>{m}</span><button type="button" onClick={() => handleRemoveItem('medications', i)} className="ml-1 hover:text-green-800"><X className="w-3 h-3" /></button></span>)}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discapacidades</label>
          <div className="flex space-x-2 mb-2"><input type="text" className="input-field flex-1" value={newDisability} onChange={(e) => setNewDisability(e.target.value)} placeholder="Agregar discapacidad" /><Button type="button" onClick={() => handleAddItem('disabilities', newDisability, setNewDisability)} className="btn-secondary"><Plus className="w-4 h-4" /></Button></div>
          <div className="flex flex-wrap gap-2">{formData.disabilities.map((d, i) => <span key={i} className="badge badge-primary flex items-center space-x-1"><span>{d}</span><button type="button" onClick={() => handleRemoveItem('disabilities', i)} className="ml-1 hover:text-blue-800"><X className="w-3 h-3" /></button></span>)}</div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Estado</label><select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></div>
          <div className="flex items-center space-x-3 pt-8"><input type="checkbox" id="nutritionBeneficiary" checked={formData.nutritionBeneficiary} onChange={(e) => setFormData({ ...formData, nutritionBeneficiary: e.target.checked })} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" /><label htmlFor="nutritionBeneficiary" className="text-sm font-medium text-gray-700">Beneficiario de Nutrición</label></div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" className="btn-primary">{type === 'add' ? 'Crear Perfil' : 'Guardar Cambios'}</Button>
      </div>
    </form>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="modal-content scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {type === 'add' ? 'Agregar Adulto Mayor' : type === 'edit' ? 'Editar Adulto Mayor' : 'Ver Perfil'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        {isViewOnly ? renderViewMode() : renderEditMode()}
      </motion.div>
    </motion.div>
  );
}

export default ElderModal;
