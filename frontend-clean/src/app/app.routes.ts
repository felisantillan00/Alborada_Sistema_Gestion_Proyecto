import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [

    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/dashboard/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },

            {
                path: 'inventario',
                loadComponent: () =>
                    import('./pages/inventario/inventario/inventario')
                        .then(m => m.Inventario)
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
