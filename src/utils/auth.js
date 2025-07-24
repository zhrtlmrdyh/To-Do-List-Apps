export function logout(navigate) {
  console.log('🚪 Proses logout...');
  localStorage.clear();
  navigate('/login', { replace: true });
}

export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}