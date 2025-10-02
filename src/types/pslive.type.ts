export interface Address {
    id: number;
    name1: string;
    name2: string | null;
    address1: string;
    address2: string | null;
    address3: string | null;
    city: string;
    state: string;
    zip: number;
    phone: string;
    fax: string | null;
    contact: string;
    extension: string | null;
}

export interface OrderLine {
    id: number;
    orderid: number;
    productcode: string;
}

export interface Order {
    orderid: number;
    accoutlocid: string;
    accountlocation: number;
    contracttype: string;
    entrydate: string | null;
    salesrep: string;
    billto: number;
    technician: string;
    billing_address: Address;
    shipping_address: Address;
    fp: number;
    travel: number;
    total: number;
    lines: OrderLine[];
}

export interface Product {
    id: number;
    productid: string;
    name: string;
    height: string;
    price: number;
}


export type AccountLocationItem = {
    id: number;
    accountid: string;
    locationcode: string;
    productcode: string;
    quantity: number;
};

export type AccountLocation = {
    id: number;
    accountid: string;
    location: string;
    locationcode: string;
    locationitems: AccountLocationItem[];
};

export type Account = {
    accountid: string;
    address: number;
    billtoaddress: number;
    chemicalinfo: string | null;
    date: string;
    locations: AccountLocation[];
    miscnotes: string | null;
    waterinfo: string | null;
};

export type Technician = {
    id: number;
    firstname: string;
    lastname: string;
    techid: string;
}

export type ScheduleLine = {
    id: number;
    technician: string;
    day: string;
    orderid: number;
    account: string;
    totalmins: number;
    zipcode: number
}