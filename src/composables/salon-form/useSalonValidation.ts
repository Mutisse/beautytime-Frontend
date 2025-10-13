// composables/salon-form/useSalonValidation.ts

import { ref } from 'vue';
import type {
  ValidationResult,
  SalonFormData,
  SalonService,
  OpeningHours,
} from '../../types/Salon-Types';
import {
  validateRequired,
  validateNameSalon,
  validateDescription,
  validateEmail,
  validatePhone,
  validateCoordinate,
  validatePrice,
  validateDuration,
} from './useSalonFormUtils';

export const useSalonValidation = () => {
  // ✅ CORREÇÃO: Removida variável $q não utilizada
  const errors = ref<Record<string, string>>({});
  const serviceErrors = ref<Record<string, string>>({});

  const validateField = (
    fieldName: string,
    value: unknown,
    validatorFn: (value: unknown) => string | true,
  ): ValidationResult => {
    if (!validatorFn || typeof validatorFn !== 'function') {
      console.error(`Validador inválido para o campo ${fieldName}`, validatorFn);
      errors.value[fieldName] = 'Configuração de validação inválida';
      return { isValid: false, error: 'Configuração de validação inválida' };
    }

    try {
      const validationResult = validatorFn(value);
      errors.value[fieldName] = validationResult === true ? '' : validationResult;
      return {
        isValid: validationResult === true,
        error: validationResult === true ? '' : validationResult,
      };
    } catch (error) {
      console.error(`Erro ao validar campo ${fieldName}:`, error);
      errors.value[fieldName] = 'Erro durante a validação';
      return { isValid: false, error: 'Erro durante a validação' };
    }
  };

  const validateServiceField = (
    index: number,
    field: string,
    value: unknown,
    validatorFn: (value: unknown) => string | true,
  ): boolean => {
    const key = `service_${index}_${field}`;

    if (!validatorFn || typeof validatorFn !== 'function') {
      serviceErrors.value[key] = 'Configuração de validação inválida';
      return false;
    }

    try {
      const validationResult = validatorFn(value);
      serviceErrors.value[key] = validationResult === true ? '' : validationResult;
      return validationResult === true;
    } catch (error) {
      console.error(`Erro ao validar campo de serviço ${key}:`, error);
      serviceErrors.value[key] = 'Erro durante a validação';
      return false;
    }
  };

  const validateServices = (services: SalonService[]): boolean => {
    serviceErrors.value = {};

    if (services.length === 0) {
      errors.value.services = 'Adicione pelo menos um serviço';
      return false;
    }

    let isValid = true;

    services.forEach((service, index) => {
      const nameValid = validateServiceField(index, 'name', service.name, validateRequired);
      const priceValid = validateServiceField(index, 'price', service.price, validatePrice);
      const durationValid = validateServiceField(
        index,
        'duration',
        service.duration,
        validateDuration,
      );
      const categoryValid = validateServiceField(
        index,
        'category',
        service.category,
        validateRequired,
      );

      if (!nameValid || !priceValid || !durationValid || !categoryValid) {
        isValid = false;
      }
    });

    if (isValid) {
      delete errors.value.services;
    }

    return isValid;
  };

  const validateCurrentStep = (currentStep: number, salon: SalonFormData): boolean => {
    let isValid = true;

    if (currentStep === 1) {
      // Informações básicas
      isValid = validateField('nameSalon', salon.nameSalon, validateNameSalon).isValid && isValid;
      isValid =
        validateField('description', salon.description, validateDescription).isValid && isValid;
      isValid = validateField('category', salon.category, validateRequired).isValid && isValid;
      isValid = validateField('priceRange', salon.priceRange, validateRequired).isValid && isValid;
    } else if (currentStep === 2) {
      // Localização
      isValid = validateField('address', salon.address, validateRequired).isValid && isValid;
      isValid = validateField('city', salon.city, validateRequired).isValid && isValid;
      isValid =
        validateField('neighborhood', salon.neighborhood, validateRequired).isValid && isValid;
      isValid = validateField('province', salon.province, validateRequired).isValid && isValid;
      isValid = validateField('latitude', salon.latitude, validateCoordinate).isValid && isValid;
      isValid = validateField('longitude', salon.longitude, validateCoordinate).isValid && isValid;
    } else if (currentStep === 3) {
      // Contato
      isValid = validateField('phone', salon.phone, validatePhone).isValid && isValid;
      isValid = validateField('email', salon.email, validateEmail).isValid && isValid;
    } else if (currentStep === 4) {
      // Serviços
      isValid = validateServices(salon.services) && isValid;
    } else if (currentStep === 5) {
      // Comodidades - não requer validação obrigatória
      isValid = true;
    } else if (currentStep === 6) {
      // Pagamento
      if (salon.paymentMethods.length === 0) {
        errors.value.paymentMethods = 'Selecione pelo menos um método de pagamento';
        isValid = false;
      } else {
        delete errors.value.paymentMethods;
      }

      // Valida carteiras móveis se mobile_wallet estiver selecionado
      if (salon.paymentMethods.includes('mobile_wallet') && salon.mobileWallets.length === 0) {
        errors.value.mobileWallets = 'Selecione pelo menos uma carteira móvel';
        isValid = false;
      } else {
        delete errors.value.mobileWallets;
      }
    } else if (currentStep === 7) {
      // Horário
      const hasValidHours = salon.openingHours?.some(
        (hours: OpeningHours) => hours.isClosed !== true,
      );

      if (!hasValidHours) {
        errors.value.openingHours = 'Defina pelo menos um dia de funcionamento';
        isValid = false;
      } else {
        delete errors.value.openingHours;
      }
    }

    return isValid;
  };

  const clearErrors = (): void => {
    errors.value = {};
    serviceErrors.value = {};
  };

  const getServiceError = (index: number, field: string): string => {
    return serviceErrors.value[`service_${index}_${field}`] || '';
  };

  const hasServiceError = (index: number): boolean => {
    return Object.keys(serviceErrors.value).some((key) => key.startsWith(`service_${index}_`));
  };

  const getAllErrors = (): Record<string, string> => {
    return {
      ...errors.value,
      ...serviceErrors.value,
    };
  };

  return {
    errors,
    serviceErrors,
    validateField,
    validateServiceField,
    validateServices,
    validateCurrentStep,
    clearErrors,
    getServiceError,
    hasServiceError,
    getAllErrors,
  };
};
