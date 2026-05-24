/* Global type declarations for Google Maps API */

declare namespace google {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, options?: MapOptions);
      setCenter(center: LatLng | LatLngLiteral): void;
      getCenter(): LatLng;
      addListener(eventName: string, handler: (...args: any[]) => void): void;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setPosition(position: LatLng | LatLngLiteral): void;
      getPosition(): LatLng | undefined;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng | LatLngLiteral;
      mapTypeControl?: boolean;
      fullscreenControl?: boolean;
      streetViewControl?: boolean;
      [key: string]: any;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string;
      [key: string]: any;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    namespace places {
      class Autocomplete {
        constructor(input: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: (...args: any[]) => void): void;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        fields?: string[];
        [key: string]: any;
      }

      interface PlaceResult {
        formatted_address?: string;
        geometry?: {
          location: LatLng;
          [key: string]: any;
        };
        address_components?: AddressComponent[];
        [key: string]: any;
      }

      interface AddressComponent {
        long_name: string;
        short_name: string;
        types: string[];
      }
    }

    class Geocoder {
      geocode(request: GeocodeRequest, callback: (results: GeocoderResult[] | null, status: string) => void): void;
    }

    interface GeocodeRequest {
      location?: LatLng | LatLngLiteral;
      address?: string;
      [key: string]: any;
    }

    interface GeocoderResult {
      formatted_address: string;
      geometry: {
        location: LatLng;
        [key: string]: any;
      };
      [key: string]: any;
    }
  }
}
