const LINKS = [
  { label: 'github', href: 'https://github.com/yourusername' },
  { label: 'linkedin', href: 'https://linkedin.com/in/yourusername' },
  { label: 'email', href: 'mailto:you@example.com' },
];

export default function TerminalFooter() {
  return (
    <footer className="bg-black border-t-2 border-neutral-800 py-10 px-8 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div className="text-gray-500 text-sm">
          <span className="text-[var(--blood)]">$</span> connection_established --status=online
        </div>
        <div className="flex gap-8">
          {LINKS.map(link => (
            
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm uppercase tracking-widest transition-none hover:text-[var(--blood)]"
            >
              [{link.label}]
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}