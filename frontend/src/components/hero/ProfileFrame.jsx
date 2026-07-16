import { motion } from 'framer-motion';
import profilePic from '../../assets/pas_foto.jpg';

export default function ProfileFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative w-40 h-40 md:w-52 md:h-52 mx-auto mb-8"
    >
      <div
        className="absolute inset-0 bg-[var(--blood)] translate-x-3 translate-y-3"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)' }}
      />

      <img
        src={profilePic}
        alt="Portrait"
        className="relative z-10 w-full h-full object-cover border-2 border-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)' }}
      />

      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-white z-20" />
    </motion.div>
  );
}