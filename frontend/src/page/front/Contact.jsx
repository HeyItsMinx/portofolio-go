import { motion } from 'framer-motion';

const CHANNELS = [
  { label: 'email', value: 'samuelrev04@gmail.com', href: 'mailto:samuelrev04@gmail.com' },
  { label: 'github', value: 'github.com/HeyItsMinx', href: 'https://github.com/HeyItsMinx' },
  { label: 'linkedin', value: 'linkedin.com/in/samuel-rev20', href: 'https://linkedin.com/in/samuel-rev20' },
];

export default function Contact() {
  return (
    <section className="min-h-[80vh] bg-black flex items-center px-8 py-24">
      <div className="max-w-3xl mx-auto w-full font-mono">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-[var(--blood)] text-sm mb-2"
        >
          <span className="text-gray-500">$</span> whoami --contact
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-white text-4xl md:text-6xl font-black uppercase tracking-tight mb-12"
        >
          Get In Touch
        </motion.h1>

        <div className="flex flex-col gap-4">
          {CHANNELS.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target={c.label !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
              className="group flex items-center justify-between border-2 border-neutral-800 hover:border-[var(--blood)] bg-black px-6 py-5 transition-colors duration-100"
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)' }}
            >
              <span className="text-gray-500 uppercase text-xs tracking-widest">[{c.label}]</span>
              <span className="text-white group-hover:text-[var(--blood)] transition-colors duration-100 text-lg">
                {c.value}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}