// src/composables/salon-form/useSalonFormUtils.ts
import type { SalonFormData } from '../../types/Salon-Types';

// Interfaces locais
export interface Step {
  label: string;
}

export interface DayConfig {
  label: string;
}

export interface LocationDetails {
  street: string;
  suburb: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

// ✅ Validações CORRIGIDAS - Sem uso de String() em objetos
export const validateRequired = (value: unknown): string | true => {
  if (!value || (typeof value === 'string' && value.trim() === '') || value === 0) {
    return 'Este campo é obrigatório';
  }
  return true;
};

export const validateEmail = (value: unknown): string | true => {
  if (!value) return 'Este campo é obrigatório';

  // ✅ CORREÇÃO: Verificar se é string antes de usar
  if (typeof value !== 'string') {
    return 'Por favor, insira um email válido';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Por favor, insira um email válido';
  }
  return true;
};

export const validateNameSalon = (value: unknown): string | true => {
  const required = validateRequired(value);
  if (required !== true) return required;

  // ✅ CORREÇÃO: Verificar se é string antes de usar
  if (typeof value !== 'string') {
    return 'O nome deve ser um texto válido';
  }

  if (value.length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres';
  }

  if (value.length > 100) {
    return 'O nome deve ter no máximo 100 caracteres';
  }

  return true;
};

export const validateDescription = (value: unknown): string | true => {
  const required = validateRequired(value);
  if (required !== true) return required;

  // ✅ CORREÇÃO: Verificar se é string antes de usar
  if (typeof value !== 'string') {
    return 'A descrição deve ser um texto válido';
  }

  if (value.length < 10) {
    return 'A descrição deve ter pelo menos 10 caracteres';
  }

  if (value.length > 500) {
    return 'A descrição deve ter no máximo 500 caracteres';
  }

  return true;
};

export const validateCoordinate = (value: unknown): string | true => {
  if (value === null || value === undefined || value === '') {
    return 'Este campo é obrigatório';
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Por favor, insira um número válido';
  }

  if (numValue < -90 || numValue > 90) {
    return 'Valor fora do intervalo válido para coordenadas';
  }

  return true;
};

export const validatePhone = (value: unknown, isRequired: boolean = true): string | true => {
  // ✅ CORREÇÃO: Verificar se é string antes de usar
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return isRequired ? 'Este campo é obrigatório' : true;
  }

  if (typeof value !== 'string') {
    return 'Número de telefone inválido';
  }

  const digits = value.replace(/\D/g, '');
  if (digits.length < 9) {
    return 'Número de telefone inválido (mínimo 9 dígitos)';
  }

  return true;
};

export const validatePrice = (value: unknown): string | true => {
  if (!value && value !== 0) return 'Este campo é obrigatório';

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Por favor, insira um preço válido';
  }

  if (numValue < 0) {
    return 'O preço não pode ser negativo';
  }

  if (numValue > 10000) {
    return 'O preço não pode ser superior a 10.000 MT';
  }

  return true;
};

export const validateDuration = (value: unknown): string | true => {
  if (!value) return 'Este campo é obrigatório';

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return 'Por favor, insira uma duração válida';
  }

  if (numValue < 15) {
    return 'A duração mínima é 15 minutos';
  }

  if (numValue > 480) {
    return 'A duração máxima é 480 minutos (8 horas)';
  }

  if (numValue % 15 !== 0) {
    return 'A duração deve ser múltipla de 15 minutos';
  }

  return true;
};

// Formatação
export const formatPhone = (value: string): string => {
  if (!value) return '';

  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';

  // Formato Moçambicano: +258 XX XXX XXXX
  if (digits.startsWith('258')) {
    const rest = digits.substring(3);
    if (rest.length <= 2) {
      return `+258 ${rest}`;
    } else if (rest.length <= 5) {
      return `+258 ${rest.substring(0, 2)} ${rest.substring(2)}`;
    } else if (rest.length <= 8) {
      return `+258 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5)}`;
    } else {
      return `+258 ${rest.substring(0, 2)} ${rest.substring(2, 5)} ${rest.substring(5, 8)}`;
    }
  }

  return `+${digits}`;
};

// Utilitários de classes CSS - CORRIGIDOS
export const fieldClasses = (
  error: string,
  value: unknown,
): { 'has-error': boolean; 'has-success': boolean } => {
  // ✅ CORREÇÃO: Verificar tipo antes de usar String()
  let hasValue = false;

  if (typeof value === 'string') {
    hasValue = value.trim() !== '';
  } else if (typeof value === 'number') {
    hasValue = value !== 0;
  } else {
    hasValue = !!value;
  }

  return {
    'has-error': !!error,
    'has-success': hasValue && !error,
  };
};

export const serviceFieldClasses = (
  error: string,
  value: unknown,
): { 'has-error': boolean; 'has-success': boolean } => {
  // ✅ CORREÇÃO: Verificar tipo antes de usar String()
  let hasValue = false;

  if (typeof value === 'string') {
    hasValue = value.trim() !== '';
  } else if (typeof value === 'number') {
    hasValue = value !== 0;
  } else {
    hasValue = !!value;
  }

  return {
    'has-error': !!error,
    'has-success': hasValue && !error,
  };
};

// Inicialização de dados
export const getDefaultSalonData = (): SalonFormData & {
  featured: boolean;
  whatsapp: string;
  facebook: string;
  instagram: string;
  amenities: string[];
  neighborhood: string;
  province: string;
  community: string;
  zipCode: string;
  paymentMethods: string[];
  mobileWallets: string[];
  cancellationPolicy: string;
  lateArrivalPolicy: string;
  childrenPolicy: string;
  status: string;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  };
  employees_owner: string;
} => ({
  // Campos básicos
  nameSalon: '',
  description: '',
  address: '',
  city: '',
  latitude: 0,
  longitude: 0,
  priceRange: '$$',
  mainImage: '',
  phone: '',
  email: '',
  website: '',
  category: '',
  services: [],
  openingHours: [],
  featured: false,
  whatsapp: '',
  facebook: '',
  instagram: '',
  amenities: [],

  // Novos campos
  neighborhood: '',
  province: '',
  community: '',
  zipCode: '',
  paymentMethods: ['cash'],
  mobileWallets: [],
  cancellationPolicy: 'Cancelamento gratuito até 24 horas antes do serviço',
  lateArrivalPolicy: 'Tolerância de 15 minutos para atrasos',
  childrenPolicy: 'Crianças acima de 12 anos são bem-vindas sem acompanhante',
  status: 'pending',

  // Campos temporários para teste
  metadata: {
    createdBy: 'temp-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  employees_owner: 'temp-manager-id',
});

export const getDaysOfWeek = (): Record<string, DayConfig> => ({
  monday: { label: 'Segunda-feira' },
  tuesday: { label: 'Terça-feira' },
  wednesday: { label: 'Quarta-feira' },
  thursday: { label: 'Quinta-feira' },
  friday: { label: 'Sexta-feira' },
  saturday: { label: 'Sábado' },
  sunday: { label: 'Domingo' },
});

export const getSteps = (): Step[] => [
  { label: 'Informações Básicas' },
  { label: 'Localização' },
  { label: 'Contato' },
  { label: 'Serviços' },
  { label: 'Comodidades' },
  { label: 'Pagamento' },
  { label: 'Horário' },
];

export const getAmenitiesLabels = () => ({
  coffee: 'Café',
  tea: 'Chá',
  water: 'Água',
  snacks: 'Snacks',
  free_parking: 'Estacionamento Gratuito',
  paid_parking: 'Estacionamento Pago',
  valet: 'Manobrista',
  tv: 'Televisão',
  wifi: 'Wi-Fi Gratuito',
  magazines: 'Revistas',
  music: 'Música Ambiente',
  air_conditioning: 'Ar Condicionado',
  heating: 'Aquecedor',
  restroom: 'Banheiro',
  changing_table: 'Fraldário',
  wheelchair_access: 'Acesso para Cadeirantes',
  elevator: 'Elevador',
  ramp: 'Rampa de Acesso',
  security: 'Segurança',
  cctv: 'Circuito Fechado',
  smoke_free: 'Ambiente Livre de Fumo',
});
