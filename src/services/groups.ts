import axios, { Axios, AxiosResponse } from 'axios';
import { GroupType } from '../types/GroupType';
import { GridRowId } from '@mui/x-data-grid';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getGroups = (): Promise<AxiosResponse<GroupType[]>> => api.get('/groups');
export const addGroup = (group: { name: string}): Promise<AxiosResponse<GroupType>> => api.post('/groups', group);
export const deleteGroup = (id: number | GridRowId): Promise<AxiosResponse<void>> => api.delete(`/groups/${id}`);
