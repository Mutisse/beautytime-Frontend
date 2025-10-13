// src/router/staffEmployee.Routes.ts
import type { RouteRecordRaw } from 'vue-router';

const staffEmployeeRoutes: RouteRecordRaw[] = [
  {
    path: '/staffEmployee',
    component: () => import('layouts/StaffLayout.vue'),
    meta: { requiresAuth: true, requiredRole: 'staff' },
    children: [
      {
        path: 'dashboard',
        name: 'staff-dashboard',
        component: () => import('pages/staff/EmployeesStaffDashboardPage.vue'),
        meta: {
          title: 'Dashboard - Funcionário',
          requiresAuth: true,
          requiredRole: 'staff',
        },
      },
      {
        path: 'schedule',
        name: 'staff-schedule',
        component: () => import('pages/staff/SchedulePage.vue'),
        meta: {
          title: 'Minha Agenda',
          requiresAuth: true,
          requiredRole: 'staff',
        },
      },
      {
        path: 'clients',
        name: 'staff-clients',
        component: () => import('pages/staff/ClientsPage.vue'),
        meta: {
          title: 'Gestão de Clientes',
          requiresAuth: true,
          requiredRole: 'staff',
        },
      },
    ],
  },
];

export default staffEmployeeRoutes;
