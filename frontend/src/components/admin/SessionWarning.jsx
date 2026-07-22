import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { msUntilExpiry, isTokenValid } from '@/lib/auth';
import { notifyGlobal } from '@/lib/notifier';

const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export default function SessionWarning() {
  const [msLeft, setMsLeft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem('token');
      if (!isTokenValid(token)) {
        if (token) {
          localStorage.removeItem('token');
          notifyGlobal('Session expired — logged out', { type: 'warning' });
        }
        navigate('/login');
        return;
      }
      setMsLeft(msUntilExpiry(token));
    };

    check();
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (msLeft === null || msLeft > WARNING_THRESHOLD) return null;

  const minutesLeft = Math.max(1, Math.ceil(msLeft / 60000));

  return (
    <div className="bg-[var(--blood)] text-black text-xs font-bold uppercase tracking-widest px-6 py-2 flex items-center justify-between">
      <span>Session expires in ~{minutesLeft} min — save your work</span>
      <button onClick={() => navigate('/login')} className="underline hover:no-underline">
        Re-login now
      </button>
    </div>
  );
}