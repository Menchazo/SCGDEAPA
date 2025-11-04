
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, User, Users, CheckCircle, Heart, Calendar as CalendarIcon, X, Briefcase, GraduationCap, Database, Code, Wind, Zap, MapPin, Move } from 'lucide-react';
import UpcomingActivities from '@/components/ui/UpcomingActivities';

const UPTAG_LOGO_URL = "https://i.ibb.co/zTmjVWkm/Logo-UPTAG-NB.png";

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

const TechCard = ({ icon, name, description, color }) => {
    const Icon = icon;
    return (
        <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-lg shadow-sm backdrop-blur-sm">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{name}</h4>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

const Calendar = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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
    setSelectedDate(null);
  };

  const handleDayClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (activitiesByDate[date.toDateString()]) {
        setSelectedDate(date);
    }
  };

  const selectedActivities = useMemo(() => {
    if (!selectedDate) return [];
    return activitiesByDate[selectedDate.toDateString()] || [];
  }, [selectedDate, activitiesByDate]);

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
          const isSelected = selectedDate && selectedDate.toDateString() === date;
          return (
            <div 
              key={day} 
              className={`calendar-day ${hasEvent ? 'has-event' : ''} ${new Date().toDateString() === date ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {selectedDate && selectedActivities.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 pt-4 border-t border-white/20"
          >
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-700">
                    Actividades para el {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h4>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {selectedActivities.map(activity => (
                <div key={activity.id} className={`p-3 rounded-lg activity-card activity-${activity.type}`}>
                  <p className="font-semibold">{activity.title}</p>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                  <p className="text-sm font-medium text-gray-800">Hora: {activity.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

        <UpcomingActivities activities={activities} />
        
        <div className="pt-8">
           <Calendar activities={activities} />
        </div>

        <div className="pt-12">
            <div className="glass-effect rounded-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Sobre el Proyecto</h2>
                    <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                        Esta aplicación fue desarrollada como una solución tecnológica para la gestión de datos de los adultos mayores en el Consejo Comunal Territorio Social Pantano Abajo I.
                        El objetivo es optimizar los procesos, asegurar un seguimiento adecuado y mejorar la calidad de vida de nuestra valiosa comunidad.
                    </p>
                </div>

                <div className="pt-8 border-t border-white/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">El Corazón del Sistema: Tecnologías</h2>
                        <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">
                            Para construir este portal, se utilizó un conjunto de tecnologías modernas y eficientes, asegurando una experiencia de usuario rápida, segura y agradable.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TechCard icon={Code} name="React" description="Biblioteca líder para construir interfaces de usuario interactivas." color="bg-sky-500" />
                        <TechCard icon={Database} name="Supabase" description="Backend y base de datos (PostgreSQL) para gestionar toda la información de forma segura." color="bg-green-500" />
                        <TechCard icon={Wind} name="Tailwind CSS" description="Framework de CSS para un diseño moderno y responsivo." color="bg-cyan-500" />
                        <TechCard icon={Zap} name="Vite" description="Entorno de desarrollo ultrarrápido para una experiencia de programación fluida." color="bg-purple-500" />
                        <TechCard icon={MapPin} name="React Leaflet" description="Mapas interactivos para la geolocalización precisa de los beneficiarios." color="bg-lime-500" />
                        <TechCard icon={Move} name="Framer Motion" description="Animaciones fluidas para una navegación más atractiva y dinámica." color="bg-pink-500" />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Equipo de Desarrollo</h2>
                    </div>
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center p-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                                <GraduationCap className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Juliangie Ventura</h3>
                            <p className="text-gray-600 mt-1">
                                Estudiante del PNF Informática de la Universidad Politécnica Territorial de Falcón "Alonso Gamero" (UPTAG).
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                                <GraduationCap className="w-12 h-12" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Gladys Morles</h3>
                            <p className="text-gray-600 mt-1">
                                Estudiante del PNF Informática de la Universidad Politécnica Territorial de Falcón "Alonso Gamero" (UPTAG).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PublicPage;
