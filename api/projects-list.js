// Returns a list of content/projects/*.json paths by listing the repo folder via GitHub API.
// Set Vercel env var GITHUB_REPO to e.g. jordancroome/freelance (owner/repo).
module.exports = async (req, res) => {
  const repo = process.env.GITHUB_REPO;
  if (!repo) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ paths: [] }));
    return;
  }
  try {
    const r = await fetch(
      `https://api.github.com/repos/${repo}/contents/content/projects`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!r.ok) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({ paths: [] }));
      return;
    }
    const data = await r.json();
    const paths = (Array.isArray(data) ? data : [])
      .filter((f) => f.name && f.name.endsWith('.json'))
      .map((f) => 'content/projects/' + f.name)
      .sort();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(JSON.stringify({ paths }));
  } catch (e) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ paths: [] }));
  }
};
