const crypto = require('crypto');
const { create } = require('./_lib/oauth2');

function randomString() {
  return crypto.randomBytes(4).toString('hex');
}

module.exports = (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const oauth2 = create();

  const url = oauth2.authorizeURL({
    redirect_uri: `https://${host}/api/callback`,
    scope: ['repo', 'user'],
    state: randomString(),
  });

  res.writeHead(302, { Location: url });
  res.end();
};
