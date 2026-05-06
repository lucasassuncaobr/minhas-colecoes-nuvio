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

// Mapeamento IMDB -> TMDB (para puxar capas certas)
const imdbToTmdb = {
  'tt0068646': 238,      // The Godfather
  'tt0071562': 239,      // The Godfather Part II
  'tt0099674': 240,      // The Godfather Part III
  'tt0075148': 519,      // Rocky
  'tt0079817': 520,      // Rocky II
  'tt0084683': 521,      // Rocky III
  'tt0089927': 615,      // Rocky IV
  'tt0100405': 786,      // Rocky V
  'tt0479143': 8563,     // Rocky Balboa
  'tt3322380': 337401,   // Creed
  'tt7916416': 398949,   // Creed II
  'tt11214590': 958028   // Creed III
};

const collections = {
  godfather: [
    {id: "tt0068646", type: "movie", name: "The Godfather", year: 1972},
    {id: "tt0071562", type: "movie", name: "The Godfather Part II", year: 1974},
    {id: "tt0099674", type: "movie", name: "The Godfather Part III", year: 1990}
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

// Capas TMDB verificadas
const posterData = {
  238: 'https://image.tmdb.org/t/p/w500/6MR0zcRBj1C9R5dCEk8YD6u1H4f.jpg',
  239: 'https://image.tmdb.org/t/p/w500/tHbCWy0OYueC4hxU8KD5789O51V.jpg',
  240: 'https://image.tmdb.org/t/p/w500/cjZGPgw7XTSQF_vwWK7V2cJc0Cz.jpg',
  519: 'https://image.tmdb.org/t/p/w500/bnlEWsewhQq8MTsHy5gHRJyL4I6.jpg',
  520: 'https://image.tmdb.org/t/p/w500/xFXKQxXGqKdIXW3YcIDIEaHbNfJ.jpg',
  521: 'https://image.tmdb.org/t/p/w500/1nMpJRDDaKFHYG5zPVzuRKJQCaV.jpg',
  615: 'https://image.tmdb.org/t/p/w500/5LiLsEWKDvRnW2QDl8X6PX5RcTz.jpg',
  786: 'https://image.tmdb.org/t/p/w500/KxfVfB1qVYD3OKzHh3Tc3X6LkwN.jpg',
  8563: 'https://image.tmdb.org/t/p/w500/mAjP5ueXhpVkLk6wUVxVyDC8Kj5.jpg',
  337401: 'https://image.tmdb.org/t/p/w500/rwt6H4H4TQY0mAvq6pXGtCB0M5m.jpg',
  398949: 'https://image.tmdb.org/t/p/w500/v3QyprWZOsXW8drg84CeHkreplies.jpg',
  958028: 'https://image.tmdb.org/t/p/w500/X8n8Bzt0MHXi2piZGeDVKGmUXcD.jpg'
};

const metaCache = {};

app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  const coll = collections[req.params.id] || [];
  res.json({ metas: coll });
});

app.get('/meta/:type/:id.json', (req, res) => {
  const imdbId = req.params.id.replace('tt', '');
  const tmdbId = imdbToTmdb[imdbId];
  
  if (metaCache[imdbId]) {
    return res.json({ meta: metaCache[imdbId] });
  }
  
  if (tmdbId && posterData[tmdbId]) {
    const meta = {
      id: req.params.id,
      type: "movie",
      poster: posterData[tmdbId],
      background: posterData[tmdbId]
    };
    metaCache[imdbId] = meta;
    return res.json({ meta });
  }
  
  res.json({ meta: {} });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
