const express = require('express');
require('isomorphic-unfetch');

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
    console.error(await response.text());
  }

  return {
    SUCCESS: code === 200,
    NO_CONTENT: code === 204,
    BAD_REQUEST: code === 400 || code === 409,
    UNAUTHORIZED: code === 401,
    NOT_FOUND: code === 404,
    ERROR: code === 500,

    API_ERROR: code === 500 || code === 404,

    body
  };
};

module.exports = () => {
  const router = express.Router();

  const wrapAsync = handler => (req, res) => handler(req)
    .then(result => res.json(result))
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
      return { NO_RESPONSE: true, API_ERROR: true };
    });

  router.get(/^\/external/, wrapAsync(async (req) => {
    let url = req.url;

    url = 'https://hsbot.blob.core.windows.net/hsbot-brain/brain-dump.json';

    const headers = {};
    headers['Content-Type'] = req.headers['content-type'];

    const request = {
      headers,
      method: 'GET',
      body: {}
    };

    return fetch(url, request)
      .then(result => mapResponse(result))
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
        return { NO_RESPONSE: true, API_ERROR: true };
      });
  }));

  return router;
};
