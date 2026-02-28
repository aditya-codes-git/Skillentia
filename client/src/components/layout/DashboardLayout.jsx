import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full focus:outline-none">
                <div className="py-8 px-8 sm:px-10 lg:px-12 max-w-7xl mx-auto h-full">
                    {/* Outlet renders the matched child route component */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
