import axios from 'axios';
import Cookies from 'js-cookie';

const ApiClient = axios.create({
    baseURL: 'https://2hand.monoinfinity.net/api/v1.0',
});

// Thiết lập interceptor để tự động thêm token vào header
ApiClient.interceptors.request.use((config) => {
    const token = Cookies.get('_auth');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(token);
    return config;

});

export default ApiClient;
