import { post, get, put } from './client';

export const apiLogin = ({ email, password }) => post('/api/auth/login', { email, password });
export const apiRegister = ({ name, email, password }) => post('/api/auth/register', { name, email, password });
export const apiMe = () => get('/api/auth/me');
export const apiUpgradeSubscription = () => put('/api/auth/upgrade', {});
export const apiDowngradeSubscription = () => put('/api/auth/downgrade', {});