import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardView from '@/components/views/DashboardView';
import EldersView from '@/components/views/EldersView';
import ActivitiesView from '@/components/views/ActivitiesView';
import RafflesView from '@/components/views/RafflesView';
import NutritionView from '@/components/views/NutritionView';
import HealthView from '@/components/views/HealthView';

const AdminLayout = ({
  currentView, setCurrentView, handleLogout,
  elders, setElders, activities, setActivities, stats,
  onEditElder, onDeleteElder, onAddElder, onViewElder,
  onAddActivity, onEditActivity, onViewActivity,
  onAddRaffle, onEditRaffle, onViewRaffle, onDrawRaffleWinner,
  onSaveNutritionBeneficiaries,
  onSaveHealthRecord, 
  onOpenHealthModal, 
  toast,
  filteredElders, searchTerm, setSearchTerm, filterStatus, setFilterStatus
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const viewTitles = {
    dashboard: 'Panel Principal',
    elders: 'Gestión de Adultos Mayores',
    activities: 'Actividades Culturales',
    raffles: 'Gestión de Rifas',
    nutrition: 'Bolsas de Nutrición',
    health: 'Gestión de Salud',
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView key="dashboard" stats={stats} elders={elders} activities={activities} />;
      case 'elders':
        return <EldersView 
                  key="elders"
                  elders={filteredElders}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  onEdit={onEditElder}
                  onDelete={onDeleteElder}
                  onAdd={onAddElder}
                  onView={onViewElder}
                />;
      case 'activities':
        return <ActivitiesView 
                  key="activities" 
                  activities={activities.filter(a => a.type === 'cultural')} 
                  onAdd={onAddActivity}
                  onEdit={onEditActivity}
                  onView={onViewActivity}
                  elders={elders}
                />;
      case 'raffles':
        return <RafflesView 
                  key="raffles" 
                  activities={activities.filter(a => a.type === 'raffle')} 
                  onAdd={onAddRaffle}
                  onEdit={onEditRaffle}
                  onView={onViewRaffle}
                  onDrawWinner={onDrawRaffleWinner}
                  elders={elders}
                  setActivities={setActivities}
                  toast={toast}
                />;
      case 'nutrition':
        return <NutritionView 
                  key="nutrition" 
                  elders={elders} 
                  setElders={setElders}
                  onSave={onSaveNutritionBeneficiaries} 
                  toast={toast} 
                />;
      case 'health':
        return <HealthView 
                  key="health" 
                  elders={elders} 
                  onOpenModal={onOpenHealthModal} // Pass the function to open the modal
                  toast={toast} 
                />;
      default:
        return <DashboardView key="dashboard" stats={stats} elders={elders} activities={activities} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{viewTitles[currentView] || 'Panel Principal'} - Sistema de Gestión UPTAG</title>
        <meta name="description" content={`Panel de administración: ${viewTitles[currentView]}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="lg:ml-64">
          <Header
            title={viewTitles[currentView]}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="p-6">
            <AnimatePresence mode="wait">
              {renderView()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
