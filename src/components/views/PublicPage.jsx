import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, User, Users, CheckCircle, Heart, Calendar as CalendarIcon, X, BarChart2, CalendarDays, Gift, Shield } from 'lucide-react';

const UPTAG_LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/bbd358f7-9965-4a13-9071-ba86ab3447e4/3a354a1a5d6defd8cfc9233a147ffbc9.jpg";

const StatCard = ({ icon, label, value, color }) => {
  const Icon = icon;
  return (
    <div className="stats-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <Icon className={`w-12 h-12 text-${color}-500`} />
      </div>
    </div>
  );
};

const Calendar = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  const activitiesByDate = useMemo(() => {
    const map = {};
    activities.forEach(activity => {
      const date = new Date(activity.date).toDateString();
      if (!map[date]) {
        map[date] = [];
      }
      map[date].push(activity);
    });
    return map;
  }, [activities]);

  const changeMonth = (offset) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  return (
    <div className="glass-effect rounded-xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Calendario de Actividades</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>Anterior</Button>
          <span className="font-medium text-center w-36">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>Siguiente</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500">
        <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
        {days.map(day => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
          const hasEvent = !!activitiesByDate[date];
          return (
            <div key={day} className={`calendar-day ${hasEvent ? 'has-event' : ''} ${new Date().toDateString() === date ? 'today' : ''}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const PublicPage = ({ elders, activities, stats, onAdminLogin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundElder, setFoundElder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const result = elders.find(
      elder => elder.name.toLowerCase().includes(searchTerm.toLowerCase()) || elder.cedula.includes(searchTerm)
    );
    setFoundElder(result);
    setSearched(true);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setFoundElder(null);
    setSearched(false);
  };

  const elderActivities = useMemo(() => {
    if (!foundElder) return [];
    return activities.filter(activity => activity.participants?.includes(foundElder.id));
  }, [foundElder, activities]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
         <div className="flex items-center space-x-3">
            <img src={UPTAG_LOGO_URL} alt="UPTAG Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-2xl font-bold gradient-text">Portal Comunitario</h1>
              <p className="text-gray-600">Consejo Comunal Territorio Social Pantano Abajo I</p>
            </div>
         </div>
        <Button onClick={onAdminLogin} variant="outline">
          <User className="w-4 h-4 mr-2" />
          Acceso Admin
        </Button>
      </header>

      <main className="space-y-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Consulta tu Información</h2>
            <p className="text-lg text-gray-600 mt-2">Ingresa tu nombre o cédula para ver tus beneficios y actividades asignadas.</p>
        </div>

        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    className="search-input w-full py-3"
                    placeholder="Buscar por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary rounded-lg">
                    <Search className="w-5 h-5"/>
                </Button>
            </form>
        </div>

        <AnimatePresence>
        {searched && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
            >
            {foundElder ? (
              <div className="glass-effect rounded-xl p-6">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        {foundElder.imageUrl ? (
                        <img src={foundElder.imageUrl} alt={foundElder.name} className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white">
                            <User className="w-10 h-10" />
                        </div>
                        )}
                        <div>
                        <h3 className="text-2xl font-bold text-gray-800">{foundElder.name}</h3>
                        <p className="text-gray-600">Cédula: {foundElder.cedula}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearSearch}><X className="w-5 h-5"/></Button>
                 </div>
                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-lg text-gray-700 mb-3">Beneficios Asignados</h4>
                        <div className="space-y-2">
                           <div className={`flex items-center p-3 rounded-lg ${foundElder.nutritionBeneficiary ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Heart className={`w-5 h-5 mr-3 ${foundElder.nutritionBeneficiary ? 'text-green-600' : 'text-red-600'}`} />
                                <span className={`font-medium ${foundElder.nutritionBeneficiary ? 'text-green-800' : 'text-red-800'}`}>
                                    {foundElder.nutritionBeneficiary ? 'Beneficiario de Nutrición' : 'No es beneficiario de Nutrición'}
                                </span>
                           </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-700 mb-3">Actividades Inscritas</h4>
                        <div className="space-y-2">
                            {elderActivities.length > 0 ? elderActivities.map(act => (
                                <div key={act.id} className={`p-3 rounded-lg activity-card activity-${act.type}`}>
                                    <p className="font-semibold">{act.title}</p>
                                    <p className="text-sm">{new Date(act.date).toLocaleDateString('es-ES', {day: '2-digit', month: 'long', year: 'numeric'})} - {act.time}</p>
                                </div>
                            )) : (
                                <p className="text-gray-500 p-3 bg-gray-100 rounded-lg">No estás inscrito en ninguna actividad próxima.</p>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
            ) : (
                <div className="text-center p-6 bg-yellow-100 text-yellow-800 rounded-xl">
                    <p className="font-medium">No se encontró ningún registro con los datos ingresados.</p>
                    <p className="text-sm">Por favor, verifica la información o contacta al administrador.</p>
                </div>
            )}
            </motion.div>
        )}
        </AnimatePresence>


        <div className="pt-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Estadísticas Comunitarias</h2>
                <p className="text-lg text-gray-600 mt-2">Un vistazo a los datos de nuestra comunidad.</p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Adultos Mayores" value={stats.totalElders} color="orange" />
                <StatCard icon={CheckCircle} label="Activos en el programa" value={stats.activeElders} color="green" />
                <StatCard icon={Heart} label="Beneficiarios de Nutrición" value={stats.nutritionBeneficiaries} color="amber" />
                <StatCard icon={CalendarIcon} label="Actividades Próximas" value={stats.upcomingActivities} color="purple" />
             </div>
        </div>
        
        <div className="pt-8">
           <Calendar activities={activities} />
        </div>

      </main>
    </div>
  );
};

export default PublicPage;