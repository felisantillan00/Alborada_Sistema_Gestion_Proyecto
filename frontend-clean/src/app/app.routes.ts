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
                path: 'ventas',
                loadComponent: () =>
                    import('./pages/ventas/ventas/ventas')
                        .then(m => m.Ventas)
            },
            {
                path: 'compras',
                loadComponent: () =>
                    import('./pages/compras/compras/compras')
                        .then(m => m.Compras)
            },

            {
                path: 'reparaciones',
                loadComponent: () =>
                    import('./pages/reparaciones/reparaciones')
                        .then(m => m.Reparaciones)
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
