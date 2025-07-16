import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const UPTAG_LOGO_URL = "https://storage.googleapis.com/hostinger-horizons-assets-prod/bbd358f7-9965-4a13-9071-ba86ab3447e4/3a354a1a5d6defd8cfc9233a147ffbc9.jpg";

const Login = ({ onLogin, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8 w-full max-w-md relative"
      >
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 left-4"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center mb-8">
          <img src={UPTAG_LOGO_URL} alt="UPTAG Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold gradient-text mb-2">
            Acceso Administrativo
          </h1>
          <p className="text-gray-600">
            Consejo Comunal Territorio Social<br />
            Pantano Abajo I
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              name="username"
              className="input-field"
              placeholder="Ingrese su usuario"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <Button type="submit" className="w-full btn-primary">
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>Credenciales de prueba:</strong><br />
            Usuario: admin<br />
            Contraseña: admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;