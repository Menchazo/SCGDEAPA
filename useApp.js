import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useApp = () => {
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    };
    checkSession();

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (_event === 'SIGNED_IN') {
        setShowLogin(false);
      }
    });

    const fetchData = async () => {
      const { data: eldersData, error: eldersError } = await supabase.from('elders').select('*');
      if (eldersError) {
        console.error('Error fetching elders:', eldersError);
        toast({ title: "Error al cargar Adultos Mayores", description: eldersError.message, variant: "destructive" });
      } else {
        setElders(eldersData);
      }

      const { data: activitiesData, error: activitiesError } = await supabase.from('activities').select('*');
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        toast({ title: "Error al cargar Actividades", description: activitiesError.message, variant: "destructive" });
      } else {
        setActivities(activitiesData);
      }
    };
    fetchData();

    return () => {
      authListener?.unsubscribe();
    };
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Error de autenticación", description: "Correo o contraseña incorrectos.", variant: "destructive" });
    } else {
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente." });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('dashboard');
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión correctamente." });
  };

  const handleShowLogin = (status) => setShowLogin(status);

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type.includes('elder')) setSelectedElder(data);
    else if (type.includes('activity') || type.includes('raffle')) setSelectedActivity(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedElder(null);
    setSelectedActivity(null);
    setModalType('');
  };

  const handleSaveElder = async (elderData) => {
    const dataToSubmit = {
        name: elderData.name,
        birth_date: elderData.birth_date,
        age: elderData.age,
        cedula: elderData.cedula,
        phone: elderData.phone,
        address: elderData.address,
        latitude: elderData.latitude,
        longitude: elderData.longitude,
        emergencyContact: elderData.emergencyContact,
        pathologies: elderData.pathologies,
        medications: elderData.medications,
        disabilities: elderData.disabilities,
        nutritionBeneficiary: elderData.nutritionBeneficiary,
        status: elderData.status || 'active',
        imageUrl: elderData.imageUrl || '',
    };

    if (selectedElder) {
      const { data, error } = await supabase
        .from('elders')
        .update(dataToSubmit)
        .eq('id', selectedElder.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating elder:', error);
        toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
      } else {
        setElders(elders.map(elder => elder.id === selectedElder.id ? data : elder));
        toast({ title: "Perfil actualizado", description: "Los datos han sido actualizados." });
        closeModal();
      }
    } else {
      const { data, error } = await supabase
        .from('elders')
        .insert([dataToSubmit])
        .select()
        .single();

      if (error) {
        console.error('Error creating elder:', error);
        toast({ title: "Error al crear", description: error.message, variant: "destructive" });
      } else {
        setElders([...elders, data]);
        toast({ title: "Perfil creado", description: "Nuevo adulto mayor registrado." });
        closeModal();
      }
    }
  };

  const handleDeleteElder = async (elderId) => {
    const { error } = await supabase.from('elders').delete().eq('id', elderId);
    if (error) {
      console.error('Error deleting elder:', error);
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      setElders(elders.filter(elder => elder.id !== elderId));
      toast({ title: "Perfil eliminado", description: "El perfil ha sido eliminado." });
    }
  };

  const handleSaveActivity = async (activityData) => {
    const dataToSubmit = {
        title: activityData.title,
        type: 'cultural',
        date: activityData.date,
        time: activityData.time,
        location: activityData.location,
        description: activityData.description,
        participants: activityData.participants || [],
        status: activityData.status || 'scheduled',
    };

    if (selectedActivity) {
      const { data, error } = await supabase.from('activities').update(dataToSubmit).eq('id', selectedActivity.id).select().single();
      if (error) {
        toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
      } else {
        setActivities(activities.map(act => act.id === selectedActivity.id ? data : act));
        toast({ title: "Actividad actualizada" });
        closeModal();
      }
    } else {
      const { data, error } = await supabase.from('activities').insert([dataToSubmit]).select().single();
      if (error) {
        toast({ title: "Error al crear", description: error.message, variant: "destructive" });
      } else {
        setActivities([...activities, data]);
        toast({ title: "Actividad creada" });
        closeModal();
      }
    }
  };

  const handleSaveRaffle = async (raffleData) => {
    const dataToSubmit = {
        title: raffleData.title,
        type: 'raffle',
        date: raffleData.date,
        prize: raffleData.prize,
        participants: raffleData.participants || [],
        status: raffleData.status || 'active',
        winner_id: raffleData.winner_id || null,
    };
    
    if (selectedActivity) {
      const { data, error } = await supabase.from('activities').update(dataToSubmit).eq('id', selectedActivity.id).select().single();
      if (error) {
        toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
      } else {
        setActivities(activities.map(act => act.id === selectedActivity.id ? data : act));
        toast({ title: "Rifa actualizada" });
        closeModal();
      }
    } else {
      const { data, error } = await supabase.from('activities').insert([dataToSubmit]).select().single();
      if (error) {
        toast({ title: "Error al crear", description: error.message, variant: "destructive" });
      } else {
        setActivities([...activities, data]);
        toast({ title: "Rifa creada" });
        closeModal();
      }
    }
  };

  const handleDrawRaffleWinner = async (raffle) => {
    if (!raffle.participants || raffle.participants.length === 0) {
        toast({ title: "No hay participantes", variant: "destructive" });
        return;
    }
    const winnerId = raffle.participants[Math.floor(Math.random() * raffle.participants.length)];
    const winnerInfo = elders.find(e => e.id === winnerId);

    const { data, error } = await supabase.from('activities').update({ status: 'completed', winner_id: winnerId }).eq('id', raffle.id).select().single();
    if (error) {
      toast({ title: "Error al sortear", description: error.message, variant: "destructive" });
    } else {
      setActivities(activities.map(act => (act.id === raffle.id ? data : act)));
      toast({ title: "¡Tenemos un ganador!", description: `${winnerInfo?.name || 'Desconocido'} ha ganado.` });
    }
  };

  const handleSaveNutritionBeneficiaries = async (selectedIds) => {
    try {
      const toEnable = selectedIds;
      const toDisable = elders.filter(e => e.nutritionBeneficiary && !toEnable.includes(e.id)).map(e => e.id);
      
      const [enableResult, disableResult] = await Promise.all([
        toEnable.length > 0 ? supabase.from('elders').update({ nutritionBeneficiary: true }).in('id', toEnable) : Promise.resolve({ error: null }),
        toDisable.length > 0 ? supabase.from('elders').update({ nutritionBeneficiary: false }).in('id', toDisable) : Promise.resolve({ error: null }),
      ]);

      if (enableResult.error) throw enableResult.error;
      if (disableResult.error) throw disableResult.error;

      const updatedElders = elders.map(elder => ({ ...elder, nutritionBeneficiary: toEnable.includes(elder.id) }));
      setElders(updatedElders);
      toast({ title: "Beneficiarios actualizados", variant: "success" });
    } catch (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    }
  };
  
  const filteredElders = elders.filter(elder => {
    const nameMatch = elder.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const cedulaMatch = elder.cedula?.includes(searchTerm);
    return (nameMatch || cedulaMatch) && (filterStatus === 'all' || elder.status === filterStatus);
  });

  const stats = {
    totalElders: elders.length,
    activeElders: elders.filter(e => e.status === 'active').length,
    nutritionBeneficiaries: elders.filter(e => e.nutritionBeneficiary).length,
    upcomingActivities: activities.filter(a => a.date && new Date(a.date) >= new Date() && a.status === 'scheduled').length,
    pathologiesCount: elders.reduce((acc, e) => acc + (e.pathologies?.length || 0), 0),
    disabilitiesCount: elders.reduce((acc, e) => acc + (e.disabilities?.length || 0), 0),
  };

  return {
    authLoading,
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
    handleDrawRaffleWinner,
    handleSaveNutritionBeneficiaries,
    toast,
    filteredElders,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  };
};