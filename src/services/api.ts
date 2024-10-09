import axios, { Axios, AxiosResponse } from 'axios';
import { ContactType } from '../types/ContactType';
import { GridRowId } from '@mui/x-data-grid';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getContacts = (): Promise<AxiosResponse<ContactType[]>> => api.get('/contacts');
export const addContact = (contact: ContactType): Promise<AxiosResponse<ContactType>> => api.post('/contacts', contact);
export const updateContact = (id: number, contact: any): Promise<AxiosResponse<ContactType>> => api.put(`/contacts/${id}`, contact);
export const deleteContact = (id: number | GridRowId): Promise<AxiosResponse<void>> => api.delete(`/contacts/${id}`);
