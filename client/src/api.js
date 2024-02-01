let apiUrl;

if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  apiUrl = 'http://localhost:3000/api';
} else {
  apiUrl = 'https://fitness-buddy-hwm.cyclic.app/api';
}

export default apiUrl;
