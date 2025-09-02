import { get, post, put, del } from './client';

export const apiListPortfolios = () => get('/api/portfolios');
export const apiGetPortfolio = (id) => get(`/api/portfolios/${id}`);
export const apiCreatePortfolio = (payload) => post('/api/portfolios', payload);
export const apiUpdatePortfolio = (id, payload) => put(`/api/portfolios/${id}`, payload);
export const apiDeletePortfolio = (id) => del(`/api/portfolios/${id}`);
export const apiDuplicatePortfolio = (id) => post(`/api/portfolios/${id}/duplicate`);