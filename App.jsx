import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { useApp } from '@/hooks/useApp';
import AdminLayout from '@/components/layout/AdminLayout';
import PublicPage from '@/components/views/PublicPage';
import Login from '@/components/auth/Login';
import ElderModal from '@/components/modals/ElderModal';
import ActivityModal from '@/components/modals/ActivityModal';
import RaffleModal from '@/components/modals/RaffleModal';
import { AnimatePresence } from 'framer-motion';

// A simple loading component
const AppLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Cargando...</p>
      <p className="text-sm text-gray-500">Iniciando la aplicación</p>
    </div>
  </div>
);

function App() {
  const {
    authLoading, // Get the loading state
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
    handleSaveElder,
    handleDeleteElder,
    handleSaveActivity,
    handleSaveRaffle,
    handleDrawRaffleWinner,
    handleSaveNutritionBeneficiaries,
    showModal,
    modalType,
    selectedElder,
    selectedActivity,
    openModal,
    closeModal,
    toast,
    filteredElders,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  } = useApp();

  // Show a loading screen while checking for authentication
  if (authLoading) {
    return <AppLoading />;
  }

  // Show login screen if triggered
  if (showLogin) {
    return <Login onLogin={handleLogin} onBack={() => handleShowLogin(false)} />;
  }
  
  // If not authenticated, show the public page
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Portal Comunitario - UPTAG</title>
          <meta name="description" content="Portal de consulta para las actividades y beneficios de los adultos mayores del consejo comunal." />
        </Helmet>
        <PublicPage 
          elders={elders} 
          activities={activities}
          stats={stats}
          onAdminLogin={() => handleShowLogin(true)}
        />
        <Toaster />
      </>
    );
  }

  // If authenticated, show the admin layout
  return (
    <>
      <AdminLayout
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        elders={elders}
        setElders={setElders}
        activities={activities}
        setActivities={setActivities}
        stats={stats}
        onEditElder={(elder) => openModal('edit-elder', elder)}
        onDeleteElder={handleDeleteElder}
        onAddElder={() => openModal('add-elder')}
        onViewElder={(elder) => openModal('view-elder', elder)}
        onAddActivity={() => openModal('add-activity')}
        onEditActivity={(activity) => openModal('edit-activity', activity)}
        onViewActivity={(activity) => openModal('view-activity', activity)}
        onAddRaffle={() => openModal('add-raffle')}
        onEditRaffle={(raffle) => openModal('edit-raffle', raffle)}
        onViewRaffle={(raffle) => openModal('view-raffle', raffle)}
        onDrawRaffleWinner={handleDrawRaffleWinner}
        onSaveNutritionBeneficiaries={handleSaveNutritionBeneficiaries}
        toast={toast}
        filteredElders={filteredElders}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      <AnimatePresence>
        {showModal && modalType.includes('elder') && (
          <ElderModal
            type={modalType.split('-')[0]}
            elder={selectedElder}
            onSave={handleSaveElder}
            onClose={closeModal}
          />
        )}
        {showModal && modalType.includes('activity') && (
          <ActivityModal
            type={modalType.split('-')[0]}
            activity={selectedActivity}
            onSave={handleSaveActivity}
            onClose={closeModal}
            elders={elders}
            toast={toast}
          />
        )}
        {showModal && modalType.includes('raffle') && (
          <RaffleModal
            type={modalType.split('-')[0]}
            raffle={selectedActivity}
            onSave={handleSaveRaffle}
            onClose={closeModal}
            elders={elders}
            toast={toast}
          />
        )}
      </AnimatePresence>

      <Toaster />
    </>
  );
}

export default App;
