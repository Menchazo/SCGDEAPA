
import React from 'react';

export const initialElders = [
  {
    id: 1,
    name: 'María González',
    age: 72,
    cedula: '12345678',
    phone: '0414-1234567',
    address: 'Calle Principal #123',
    emergencyContact: 'Juan González - 0424-7654321',
    pathologies: ['Diabetes', 'Hipertensión'],
    medications: ['Metformina', 'Losartán'],
    disabilities: ['Movilidad reducida'],
    nutritionBeneficiary: true,
    status: 'active',
    imageUrl: ''
  },
  {
    id: 2,
    name: 'José Rodríguez',
    age: 68,
    cedula: '87654321',
    phone: '0416-9876543',
    address: 'Avenida Bolívar #456',
    emergencyContact: 'Ana Rodríguez - 0412-3456789',
    pathologies: ['Artritis'],
    medications: ['Ibuprofeno'],
    disabilities: [],
    nutritionBeneficiary: false,
    status: 'active',
    imageUrl: ''
  }
];

export const initialActivities = [
  {
    id: 1,
    title: 'Taller de Manualidades',
    type: 'cultural',
    date: '2025-08-15',
    time: '14:00',
    location: 'Salón Comunal',
    description: 'Taller de tejido y bordado para fomentar la creatividad y la socialización.',
    participants: [1, 2],
    status: 'scheduled'
  },
  {
    id: 2,
    title: 'Rifa Navideña',
    type: 'raffle',
    date: '2025-12-20',
    prize: 'Cesta Navideña',
    participants: [],
    status: 'active'
  },
  {
    id: 3,
    title: 'Clase de Baile',
    type: 'cultural',
    date: '2025-09-01',
    time: '10:00',
    location: 'Plaza Central',
    description: 'Clase de baile con música tradicional para ejercitarse y divertirse.',
    participants: [],
    status: 'scheduled'
  }
];
