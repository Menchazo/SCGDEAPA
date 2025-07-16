import React from 'react';
import { motion } from 'framer-motion';
import { Database, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsView = ({ toast }) => {

  const handleConnectSupabase = () => {
    toast({
      title: "Conexión a Supabase",
      description: (
        <div>
          <p className="mb-2">Para conectar tu base de datos Supabase, sigue estos pasos:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Haz clic en el botón de <strong>Integraciones</strong> en la esquina superior derecha.</li>
            <li>Selecciona <strong>Supabase</strong> y sigue las instrucciones para conectar tu cuenta y proyecto.</li>
            <li>Una vez completado, tus datos se sincronizarán automáticamente.</li>
          </ol>
        </div>
      ),
      duration: 10000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Database className="w-6 h-6 mr-3 text-orange-600" />
          Conexión a Base de Datos Externa
        </h3>
        <p className="text-gray-600 mb-4">
          Para garantizar la persistencia y seguridad de los datos, te recomendamos conectar el sistema a una base de datos externa. Actualmente, la información se guarda localmente en tu navegador.
        </p>
        <p className="text-gray-600 mb-6">
          Nuestra solución recomendada es <strong>Supabase</strong>, una plataforma de código abierto que ofrece una base de datos PostgreSQL, autenticación, y almacenamiento de archivos de manera sencilla y escalable.
        </p>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-2">Ventajas de usar Supabase:</h4>
          <ul className="list-disc list-inside text-orange-700 space-y-1 text-sm">
            <li>Tus datos estarán seguros y respaldados en la nube.</li>
            <li>Podrás acceder a la información desde cualquier dispositivo.</li>
            <li>Facilita la escalabilidad y el mantenimiento del sistema a largo plazo.</li>
          </ul>
        </div>
        <div className="mt-6">
          <Button onClick={handleConnectSupabase} className="btn-primary">
            <Link className="w-4 h-4 mr-2" />
            Ver Instrucciones para Conectar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsView;