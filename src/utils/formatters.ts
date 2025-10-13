export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    confirmed: 'Confirmado',
    pending: 'Pendente',
    canceled: 'Cancelado',
    completed: 'Concluído',
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    confirmed: 'positive',
    pending: 'warning',
    canceled: 'negative',
    completed: 'info',
  };
  return statusColors[status] || 'grey';
};

export const formatBookingDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatFeedbackDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getServiceIcon = (serviceName: string): string => {
  const icons: Record<string, string> = {
    'Corte de Cabelo': 'cut',
    Manicure: 'spa',
    Barba: 'content_cut',
    Coloração: 'brush',
    Massagem: 'spa',
    Pedicure: 'pedicure',
    Maquiagem: 'palette',
    Depilação: 'content_cut',
  };
  return icons[serviceName] || 'spa';
};
