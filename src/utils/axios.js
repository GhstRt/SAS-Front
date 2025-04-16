import axios from 'axios';

// Token yenileme için interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expire olduysa ve bu istek zaten refresh denemesi değilse
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        axios.defaults.headers.common['Authorization'] = 'Token z8vpx5l3fqkwn7m1dj9trsahguy42bo6ceqxtkih';
        // Refresh token ile yeni access token al
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        },
        {
          headers: {
            'Content-Type': 'application/json',  // JSON formatında veri gönderiyoruz
            'Authorization': 'Token z8vpx5l3fqkwn7m1dj9trsahguy42bo6ceqxtkih'
          }
        });

        // Yeni token'ı kaydet
        localStorage.setItem('accessToken', response.data.access);
        
        // Orijinal isteği yeni token ile tekrarla
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token da geçersizse kullanıcıyı logout yap
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Her istekte token'ı header'a ekle
axios.interceptors.request.use(
  (config) => {
    // Refresh token isteği yapılıyorsa, Authorization header'ı eklememek için kontrol et
    if (config.url && config.url.includes('/api/token/refresh/')) {
      return config; // Refresh token isteği, header eklemeden devam et
    }

    // Diğer tüm istekler için access token ekle
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axios;
