const { AuthorizationCode } = require('simple-oauth2');

function create() {
  if (!process.env.OAUTH_CLIENT_ID || !process.env.OAUTH_CLIENT_SECRET) {
    throw new Error('OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET must be set');
  }
  return new AuthorizationCode({
    client: {
      id: process.env.OAUTH_CLIENT_ID,
      secret: process.env.OAUTH_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });
}

function renderBody(status, content) {
  return `
  const receiveMessage = (message) => {
    window.opener.postMessage(
      'authorization:github:${status}:${JSON.stringify(content)}',
      message.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  };
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
  `;
}

module.exports = { create, renderBody };
