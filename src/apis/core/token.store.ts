export const tokenStore = {
  getAccess: () => localStorage.getItem('access_token'),
  getRefresh: () => localStorage.getItem('refresh_token'),

  setAccess: (token: string) =>
    localStorage.setItem('access_token', token),

  setRefresh: (token: string) =>
    localStorage.setItem('refresh_token', token),


  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
