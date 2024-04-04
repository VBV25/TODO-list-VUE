import axios from 'axios';

// Создание экземпляра axios
const instance = axios.create({
  baseURL: 'https://todo-list.edu-playground.ru/api/v1', // URL по умолчанию
  timeout: 1500,
});
//http://a430f081804b.vps.myjino.ru/api/v1/

// Добавление запроса наблюдателя
instance.interceptors.request.use(
  function (config) {
    const localStorageData = JSON.parse(localStorage.getItem('isAuthenticated'));
    // Делаем что-то перед отправкой запроса
    if (localStorageData) {
      const token = localStorageData.userData.token;
      config.headers['X-Base-Auth'] = token;
    }

    //if (token) {
    //  config.headers['X-Base-Auth'] = token;
    //}
    return config;
  },
  function (error) {
    // Обработка ошибки запроса
    return Promise.reject(error);
  },
);

// Добавление наблюдателя ответа
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Обработка ошибок ответа
    if (error.response.status === 401) {
      // Можно, например, обработать ошибку аутентификации
      this.$router.push('/auth');
    }
    return Promise.reject(error);
  },
);
// Экспорт готового экземпляра для переиспользования
export default instance;
