import { GroupType } from "./GroupType";

export type ContactType = {
    id?: number;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    street?: string;
    zipcode?: string;
    phone: string;
    email?: string;
    groups?: GroupType[];
}