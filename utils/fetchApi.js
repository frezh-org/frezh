import axios from 'axios';

const API_URL = `https://api.openaq.org/v1`;

export default async ({
  method = 'GET',
  endpoint = '/',
  data,
  headers = {},
  params = {},
  cancelToken,
}) => {
  try {
    return await axios({
      method,
      url: API_URL + endpoint,
      data,
      params,
      headers,
      cancelToken,
    });
  } catch (error) {
    console.log(error);
    return {
      status: error.statusCode,
      message: error.message,
    };
  }
};
