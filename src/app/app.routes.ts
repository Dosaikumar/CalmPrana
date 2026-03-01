import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'frequency',
    loadComponent: () => import('./pages/frequency/frequency.page').then(m => m.FrequencyPage)
  }
];
