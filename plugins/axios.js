// plugins/axios.js
import axios from 'axios';

export default ({ app }) => {
  // Set the base URL for Axios requests
  axios.defaults.baseURL = process.env.API_BASE_URL;

  // Optionally, you can set headers or other configurations here
  axios.defaults.headers.common['Authorization'] = 'Bearer your-access-token';

  // Inject axios into the context as $axios
  app.$axios = axios;
};
