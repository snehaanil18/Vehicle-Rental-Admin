export interface Manufacturer {
    id: string;
    name: string;
}

export interface Model {
    id: string;
    name: string;
    year: number;
    manufacturerid: string; 
  }
  