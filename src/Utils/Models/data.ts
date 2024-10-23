export interface DataItem {
    name: string;
    description: string;
    price: string;
    manufacturer: string;
    model: string;
    vehicletype: string;
    quantity: string;
    transmission: string;
    fueltype: string;
}

export interface DataDisplayProps {
    data: DataItem[];
}