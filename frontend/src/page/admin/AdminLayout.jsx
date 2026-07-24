import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import SessionWarning from '@/components/admin/SessionWarning';

export default function AdminLayout() {
    useEffect(() => {
        document.title = "ADMIN | Backdoor";
    }, []);

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
                <SessionWarning />
                <Outlet />
            </main>
        </div>
    );
}