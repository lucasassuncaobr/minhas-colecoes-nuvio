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

// IMDB IDs (principais para BetteePosters)
const imdbIds = {
  '238': 'tt0068646',
  '239': 'tt0071562',
  '240': 'tt0099674',
  '490': 'tt13111040',
  '519': 'tt0075148',
  '520': 'tt0079817',
  '521': 'tt0084683',
  '615': 'tt0089927',
  '786': 'tt0100405',
  '8563': 'tt0479143',
  '337401': 'tt3322380',
  '398949': 'tt7916416',
  '958028': 'tt11214590'
};

const collections = {
  godfather: [
    {id: "tt0068646", type: "movie", name: "The Godfather", year: 1972},
    {id: "tt0071562", type: "movie", name: "The Godfather Part II", year: 1974},
    {id: "tt0099674", type: "movie", name: "The Godfather Part III", year: 1990},
    {id: "tt13111040", type: "movie", name: "The Godfather Coda", year: 2020}
  ],
  rocky: [
    {id: "tt0075148", type: "movie", name: "Rocky", year: 1976},
    {id: "tt0079817", type: "movie", name: "Rocky II", year: 1979},
    {id: "tt0084683", type: "movie", name: "Rocky III", year: 1982},
    {id: "tt0089927", type: "movie", name: "Rocky IV", year: 1985},
    {id: "tt0100405", type: "movie", name: "Rocky V", year: 1990},
    {id: "tt0479143", type: "movie", name: "Rocky Balboa", year: 2006},
    {id: "tt3322380", type: "movie", name: "Creed", year: 2015},
    {id: "tt7916416", type: "movie", name: "Creed II", year: 2018},
    {id: "tt11214590", type: "movie", name: "Creed III", year: 2023}
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
  const id = req.params.id.replace('tt', '');
  res.json({ meta: {} });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
