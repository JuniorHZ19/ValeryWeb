import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/home/home-page'),
    title: "Creaciones Valery's | Amigurumis personalizados hechos a mano",
  },
  {
    path: 'productos/:slug',
    loadComponent: () => import('@features/product/product-page'),
  },
  {
    path: 'admin',
    loadChildren: () => import('@features/admin/admin.routes'),
  },
  { path: '**', redirectTo: '' },
];
