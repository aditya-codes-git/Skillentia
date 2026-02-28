import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';

export default function DashboardLayout() {
    return (
        <div className="relative min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 flex flex-col pt-24 pb-12 w-full overflow-x-hidden">
            {/* Global background noise texture */}
            <div className="bg-noise"></div>

            <TopNav />

            <main className="flex-1 w-full relative z-10 flex flex-col focus:outline-none">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full h-full">
                    {/* Outlet renders the matched child route component */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
