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
    size: string;
    cost: number;
    extension: number;
    productdescription: string;
    plpot: string;
}

export interface OrderJobTime {
    id: number;
    orderid: number;
    option: string;
    fp: number;
    plntr: number | null;
    vine: number | null;
    travel: number;
    total: number;
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
    lines: OrderLine[];
    jobtimes: OrderJobTime[];
}

export interface Product {
    id: number;
    productid: string;
    name: string;
    height: string;
    price: number;
}


export type AccountLocationItem = {
  accountid: string;
  locationcode: string;
  productcode: string;
  productdescription: string;
  quantity: number;
};

export type AccountLocation = {
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
