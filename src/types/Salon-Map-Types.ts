// types/Salon-Map-Types.ts

import type { SalonFormData } from './Salon-Types';

export interface SalonForMap {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  neighborhood: string;
  province: string;
  community?: string;
  zipCode?: string;
}

export interface LocationDetails {
  street: string;
  suburb: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

export interface MapMarkerData {
  id: string;
  name?: string;
  address?: string;
  rating?: number;
  priceRange?: string;
}

export interface MapMarker {
  id: string;
  lnglat: [number, number];
  color: 'blue' | 'red' | 'green' | 'yellow';
  title: string;
  type: 'user' | 'salon' | 'other';
  data?: MapMarkerData;
}

export interface RouteGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface RouteData {
  from: [number, number];
  to: [number, number];
  distance: number;
  duration: number;
  geometry: RouteGeometry;
}

export const toSalonForMap = (salon: SalonFormData): SalonForMap => {
  const result: SalonForMap = {
    latitude: salon.latitude,
    longitude: salon.longitude,
    address: salon.address,
    city: salon.city,
    neighborhood: salon.neighborhood,
    province: salon.province,
  };

  // Adicionar propriedades opcionais apenas se estiverem definidas
  if (salon.community !== undefined && salon.community !== null && salon.community !== '') {
    result.community = salon.community;
  }

  if (salon.zipCode !== undefined && salon.zipCode !== null && salon.zipCode !== '') {
    result.zipCode = salon.zipCode;
  }

  return result;
};

export const updateSalonFromMap = (salonForm: SalonFormData, salonMap: SalonForMap): void => {
  salonForm.latitude = salonMap.latitude;
  salonForm.longitude = salonMap.longitude;
  salonForm.address = salonMap.address;
  salonForm.city = salonMap.city;
  salonForm.neighborhood = salonMap.neighborhood;
  salonForm.province = salonMap.province;

  // Atribuir explicitamente ou undefined
  salonForm.community = salonMap.community;
  salonForm.zipCode = salonMap.zipCode;
};
