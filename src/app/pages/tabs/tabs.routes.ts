import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'breathing',
                loadComponent: () => import('../breathing/breathing.page').then((m) => m.BreathingPage),
            },
            {
                path: 'frequency',
                loadComponent: () => import('../frequency/frequency.page').then((m) => m.FrequencyPage),
            },
            {
                path: 'library',
                loadComponent: () => import('../library/library.page').then((m) => m.LibraryPage),
            },
            {
                path: 'dashboard',
                loadComponent: () => import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
            },
            {
                path: 'settings',
                loadComponent: () => import('../settings/settings.page').then((m) => m.SettingsPage),
            },
            {
                path: '',
                redirectTo: '/tabs/breathing',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/breathing',
        pathMatch: 'full',
    },
];
