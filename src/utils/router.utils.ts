export const getDashboardRoute = (role: string | undefined): string => {
  switch (role) {
    case 'admin_system':
      return '/admin/dashboard';
    case 'business_manager':
      return '/manager/dashboard';
    case 'staff_employee':
      return '/staff/dashboard';
    case 'client':
      return '/client/dashboard';
    default:
      return '/dashboard';
  }
};

export const getRoleFromRoute = (route: string): string | undefined => {
  if (route.startsWith('/admin')) return 'admin_system';
  if (route.startsWith('/manager')) return 'business_manager';
  if (route.startsWith('/staff')) return 'staff_employee';
  if (route.startsWith('/client')) return 'client';
  return undefined;
};
