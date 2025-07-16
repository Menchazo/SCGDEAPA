import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { initialElders, initialActivities } from '@/data/mockData';

export const useApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [elders, setElders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const savedElders = localStorage.getItem('elders');
    const savedActivities = localStorage.getItem('activities');
    const savedAuth = localStorage.getItem('isAuthenticated');
    
    setElders(savedElders ? JSON.parse(savedElders) : initialElders);
    setActivities(savedActivities ? JSON.parse(savedActivities) : initialActivities);
    if (savedAuth) {
      setIsAuthenticated(JSON.parse(savedAuth));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elders', JSON.stringify(elders));
  }, [elders]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
  };

  const handleShowLogin = (status) => {
    setShowLogin(status);
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type.includes('elder')) {
      setSelectedElder(data);
    } else if (type.includes('activity') || type.includes('raffle')) {
      setSelectedActivity(data);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedElder(null);
    setSelectedActivity(null);
    setModalType('');
  };

  const handleSaveElder = (elderData) => {
    if (selectedElder) {
      setElders(elders.map(elder => 
        elder.id === selectedElder.id ? { ...elderData, id: selectedElder.id } : elder
      ));
      toast({
        title: "Perfil actualizado",
        description: "Los datos del adulto mayor han sido actualizados.",
      });
    } else {
      const newElder = { ...elderData, id: Date.now(), status: 'active', imageUrl: elderData.imageUrl || '' };
      setElders([...elders, newElder]);
      toast({
        title: "Perfil creado",
        description: "Nuevo adulto mayor registrado exitosamente.",
      });
    }
    closeModal();
  };

  const handleDeleteElder = (elderId) => {
    setElders(elders.filter(elder => elder.id !== elderId));
    toast({
      title: "Perfil eliminado",
      description: "El perfil del adulto mayor ha sido eliminado.",
    });
  };

  const handleSaveActivity = (activityData) => {
    if (selectedActivity) {
      setActivities(activities.map(act => act.id === selectedActivity.id ? { ...activityData, id: act.id } : act));
      toast({ title: "Actividad actualizada", description: "La actividad ha sido actualizada." });
    } else {
      const newActivity = { ...activityData, id: Date.now(), status: 'scheduled', type: 'cultural' };
      setActivities([...activities, newActivity]);
      toast({ title: "Actividad creada", description: "Nueva actividad registrada." });
    }
    closeModal();
  };

  const handleSaveRaffle = (raffleData) => {
    if (selectedActivity) {
      setActivities(activities.map(act => act.id === selectedActivity.id ? { ...raffleData, id: act.id } : act));
      toast({ title: "Rifa actualizada", description: "La rifa ha sido actualizada." });
    } else {
      const newRaffle = { ...raffleData, id: Date.now(), status: 'active', type: 'raffle' };
      setActivities([...activities, newRaffle]);
      toast({ title: "Rifa creada", description: "Nueva rifa registrada." });
    }
    closeModal();
  };

  const filteredElders = elders.filter(elder => {
    const matchesSearch = elder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         elder.cedula.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || elder.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalElders: elders.length,
    activeElders: elders.filter(e => e.status === 'active').length,
    nutritionBeneficiaries: elders.filter(e => e.nutritionBeneficiary).length,
    upcomingActivities: activities.filter(a => new Date(a.date) >= new Date() && a.status === 'scheduled').length,
    pathologiesCount: elders.reduce((acc, e) => acc + e.pathologies.length, 0),
    disabilitiesCount: elders.reduce((acc, e) => acc + e.disabilities.length, 0),
  };

  return {
    isAuthenticated,
    showLogin,
    handleLogin,
    handleLogout,
    handleShowLogin,
    currentView,
    setCurrentView,
    elders,
    setElders,
    activities,
    setActivities,
    stats,
    selectedElder,
    selectedActivity,
    showModal,
    modalType,
    openModal,
    closeModal,
    handleSaveElder,
    handleDeleteElder,
    handleSaveActivity,
    handleSaveRaffle,
    toast,
    filteredElders,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  };
};