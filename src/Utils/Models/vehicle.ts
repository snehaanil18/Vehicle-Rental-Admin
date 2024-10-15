export interface VehicleDetails {
    name: string;
    description: string;
    price: string;
    model: string;
    manufacturer: string;
    quantity: string;
    vehicletype: string;
    transmission: string;
    fueltype: string;
    images: File[];  
}

export interface Vehicle {
    id: string;
    name: string;
    description: string;
    fueltype: string;
    vehicletype: string;
    transmission: string;
    price: string;
    quantity: string;
    images: File[];
    primaryprimaryImageIndex: number;
    otherimages: string[];
    primaryimage:string;
}

export interface VehicleListProps {
    vehicles?: Vehicle[]; 
    sortByPrice?: boolean;
}

export interface VehicleEdit {
    id: string;
    name: string;
    description: string;
    fueltype: string;
    vehicletype: string;
    transmission: string;
    price: string;
    quantity: string;
    images: File[];
    primaryprimaryImageIndex: number;
    otherimages: string[];
    primaryimage: string | File;
}