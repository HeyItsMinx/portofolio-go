import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}