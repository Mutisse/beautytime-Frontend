// types/leaflet-custom.d.ts
import 'leaflet';

declare module 'leaflet' {
  interface Marker {
    customData?: {
      id: string;
      name?: string;
      address?: string;
      rating?: number;
      priceRange?: string;
    };
  }
}

export interface CustomMarker extends L.Marker {
  customData?: {
    id: string;
    name?: string;
    address?: string;
    rating?: number;
    priceRange?: string;
  };
}