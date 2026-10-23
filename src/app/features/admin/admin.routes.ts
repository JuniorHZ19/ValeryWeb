import type { Routes } from '@angular/router';
import { adminGuard } from '@core/auth/admin.guard';
import { AdminLayout } from './layout/admin-layout';

/** /admin — lazy loaded; everything except the login page requires an admin session. */
export default [
  {
    path: 'login',
    loadComponent: () => import('./login/login-page'),
    title: 'Ingresar | Panel de administración',
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'productos' },
      {
        path: 'productos',
        loadComponent: () => import('./products/product-list'),
        title: 'Productos | Panel de administración',
      },
      {
        path: 'productos/nuevo',
        loadComponent: () => import('./products/product-form'),
        title: 'Nuevo producto | Panel de administración',
      },
      {
        path: 'productos/:id',
        loadComponent: () => import('./products/product-form'),
        title: 'Editar producto | Panel de administración',
      },
      {
        path: 'categorias',
        loadComponent: () => import('./categories/category-list'),
        title: 'Categorías | Panel de administración',
      },
      {
        path: 'categorias/nueva',
        loadComponent: () => import('./categories/category-form'),
        title: 'Nueva categoría | Panel de administración',
      },
      {
        path: 'categorias/:id',
        loadComponent: () => import('./categories/category-form'),
        title: 'Editar categoría | Panel de administración',
      },
      {
        path: 'sitio',
        loadComponent: () => import('./site/site-form'),
        title: 'Información del sitio | Panel de administración',
      },
    ],
  },
] satisfies Routes;
