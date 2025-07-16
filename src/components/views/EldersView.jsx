
import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, MoreVertical, Edit, Trash2, Eye, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EldersView({ elders, searchTerm, setSearchTerm, filterStatus, setFilterStatus, onEdit, onDelete, onAdd, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            className="filter-button"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          
          <Button onClick={onAdd} className="btn-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elders.map(elder => (
          <motion.div
            key={elder.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-xl p-6 card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {elder.imageUrl ? (
                  <img src={elder.imageUrl} alt={elder.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xl">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{elder.name}</h3>
                  <p className="text-sm text-gray-600">{elder.age} años</p>
                </div>
              </div>
              
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <strong>Cédula:</strong> {elder.cedula}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Teléfono:</strong> {elder.phone}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Dirección:</strong> {elder.address}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`status-${elder.status}`}>
                {elder.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
              {elder.nutritionBeneficiary && (
                <span className="badge badge-success">Nutrición</span>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(elder)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(elder)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(elder.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {elders.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron adultos mayores</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </motion.div>
  );
}

export default EldersView;
