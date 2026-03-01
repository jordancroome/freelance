const { create, renderBody } = require('./_lib/oauth2');

module.exports = async (req, res) => {
  const code = req.query.code;
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  const oauth2 = create();

  try {
    const tokenParams = {
      code,
      redirect_uri: `https://${host}/api/callback`,
    };
    const accessToken = await oauth2.getToken(tokenParams);

    res.status(200).send(
      renderBody('success', {
        token: accessToken.token.access_token,
        provider: 'github',
      })
    );
  } catch (e) {
    res.status(200).send(renderBody('error', e));
  }
};
