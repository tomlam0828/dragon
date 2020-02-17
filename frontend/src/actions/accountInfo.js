import { fetchFromAccount } from './account';
import { ACCOUNT_INFO } from './types';

export const fetchAccountInfo = () => fetchFromAccount({
    endpoint: 'info',
    options: { credential: 'include' },
    FETCH_TYPE: ACCOUNT_INFO.FETCH,
    ERROR: ACCOUNT_INFO.FETCH_ERROR,
    SUCCESS_TYPE: ACCOUNT_INFO.FETCH_SUCCESS
})