const express = require('express');
const app = express();

const manifest = {
  "id": "com.colecoes.nuvio",
  "name": "Coleções Rocky e Godfather",
  "version": "1.0.0",
  "resources": ["catalog", "meta"],
  "types": ["movie"],
  "catalogs": [
    {"type": "movie", "id": "godfather", "name": "Poderoso Chefão"},
    {"type": "movie", "id": "rocky", "name": "Rocky"}
  ]
};

const collections = {
  godfather: [
    {id: "tmdb:238", type: "movie", name: "The Godfather", year: 1972},
    {id: "tmdb:239", type: "movie", name: "The Godfather Part II", year: 1974},
    {id: "tmdb:240", type: "movie", name: "The Godfather Part III", year: 1990},
    {id: "tmdb:490", type: "movie", name: "The Godfather Coda", year: 2020}
  ],
  rocky: [
    {id: "tmdb:519", type: "movie", name: "Rocky", year: 1976},
    {id: "tmdb:520", type: "movie", name: "Rocky II", year: 1979},
    {id: "tmdb:521", type: "movie", name: "Rocky III", year: 1982},
    {id: "tmdb:615", type: "movie", name: "Rocky IV", year: 1985},
    {id: "tmdb:786", type: "movie", name: "Rocky V", year: 1990},
    {id: "tmdb:8563", type: "movie", name: "Rocky Balboa", year: 2006},
    {id: "tmdb:337401", type: "movie", name: "Creed", year: 2015},
    {id: "tmdb:398949", type: "movie", name: "Creed II", year: 2018},
    {id: "tmdb:958028", type: "movie", name: "Creed III", year: 2023}
  ]
};

app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  const coll = collections[req.params.id] || [];
  res.json({ metas: coll });
});

app.get('/meta/:type/:id.json', (req, res) => {
  res.json({ meta: {} });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
