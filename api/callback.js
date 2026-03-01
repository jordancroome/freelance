const { create, renderBody } = require('./_lib/oauth2');

function htmlPage(scriptBody) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>${scriptBody}<\/script></body></html>`;
}

module.exports = async (req, res) => {
  const code = req.query.code;
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  const oauth2 = create();

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    const tokenParams = {
      code,
      redirect_uri: `https://${host}/api/callback`,
    };
    const accessToken = await oauth2.getToken(tokenParams);

    const script = renderBody('success', {
      token: accessToken.token.access_token,
      provider: 'github',
    });
    res.status(200).send(htmlPage(script));
  } catch (e) {
    const script = renderBody('error', e);
    res.status(200).send(htmlPage(script));
  }
};
