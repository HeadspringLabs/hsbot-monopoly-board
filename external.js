import 'isomorphic-unfetch';
import { API_HOST } from './constants';

const mapResponse = async (response) => {
  const code = response.status;
  let body = {};

  if (code === 200) {
    body = await response.json()
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
      return { NO_RESPONSE: false, API_ERROR: true };
    });
  } else if (code === 400 || code === 409) {
    body = await response.text();
  } else if (code === 500) {
    console.error.error(await response.text());
  }

  return body;
};

const externalFetch = (method, ctx) => {
  const fullUrl = `${API_HOST}/external/`;

  const headers = {};
  headers['Content-Type'] = 'application/json';

  const request = {
    method,
    headers
  };

  return fetch(fullUrl, request)
    .then(mapResponse)
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
      return { NO_RESPONSE: true, API_ERROR: true };
    });
};

export default {
  getData: async ctx => externalFetch('GET', ctx)
};
