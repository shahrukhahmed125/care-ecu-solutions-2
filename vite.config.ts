import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          immobiliser: path.resolve(__dirname, 'immobiliser.html'),
          ecuRemapping: path.resolve(__dirname, 'ecu-remapping.html'),
          airbagModuleRepairs: path.resolve(__dirname, 'airbag-module-repairs.html'),
          carSpareKeys: path.resolve(__dirname, 'car-spare-keys.html'),
          onlineOfflineCoding: path.resolve(__dirname, 'online-offline-coding.html'),
          retrofit: path.resolve(__dirname, 'retrofit.html'),
          ecuRepairDataRecovery: path.resolve(__dirname, 'ecu-repair-data-recovery.html'),
          carDiagnostics: path.resolve(__dirname, 'car-diagnostics.html'),
          adblueSystemMalfunction: path.resolve(__dirname, 'adblue-system-malfunction.html'),
          testimonials: path.resolve(__dirname, 'testimonials.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          bookAppointment: path.resolve(__dirname, 'book-appointment.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacyPolicy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
