import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark mode for the futuristic AI feel
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                // Side effect to update DOM immediately for smoothness
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { theme: newTheme };
            }),
            setTheme: (theme) => {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                set({ theme });
            }
        }),
        {
            name: 'skillentia-theme-storage',
        }
    )
);
