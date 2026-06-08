import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

export const login = (creds) => api.post('/login', creds);
export const getKaryawan = (search = '') => api.get(`/karyawan?search=${search}`);
export const getKaryawanById = (id) => api.get(`/karyawan/${id}`);
export const createKaryawan = (data) => api.post('/karyawan', data);
export const deleteKaryawan = (id) => api.delete(`/karyawan/${id}`);

export const getPenempatan = (search = '') => api.get(`/penempatan?search=${search}`);
export const getJabatan = (search = '') => api.get(`/jabatan?search=${search}`);
export const getKlien = (search = '') => api.get(`/klien?search=${search}`);

