import axios from 'axios';
import { tokenStore } from './token.store';
import { API_BASE_URL } from '@/src/configs/environment.config';

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export async function refreshToken(): Promise<boolean> {
  if (refreshing && refreshPromise) return refreshPromise;

  refreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) return false;

      const res = await axios.post(
        `${API_BASE_URL}/refresh`,
        { refresh_token: refreshToken }
      );

      tokenStore.setAccess(res.data.access_token);
      if (res.data.refresh_token) {
        tokenStore.setRefresh(res.data.refresh_token);
      }

      return true;
    } catch {
      tokenStore.clear();
      return false;
    } finally {
      refreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
