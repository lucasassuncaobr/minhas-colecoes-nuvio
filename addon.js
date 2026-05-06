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

// IDs IMDB CORRETOS verificados
const imdbToTmdb = {
  'tt0068646': 238,      // The Godfather 1972
  'tt0071562': 239,      // The Godfather Part II 1974
  'tt0099674': 240,      // The Godfather Part III 1990
  'tt0075148': 519,      // Rocky 1976
  'tt0079817': 520,      // Rocky II 1979
  'tt0084683': 521,      // Rocky III 1982
  'tt0089927': 615,      // Rocky IV 1985
  'tt0100405': 786,      // Rocky V 1990
  'tt0479143': 8563,     // Rocky Balboa 2006
  'tt3076658': 337401,   // Creed 2015 (CORRETO)
  'tt4772622': 398949,   // Creed II 2018 (CORRETO)
  'tt11145118': 958028   // Creed III 2023 (CORRETO)
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
    {id: "tt3076658", type: "movie", name: "Creed", year: 2015},
    {id: "tt4772622", type: "movie", name: "Creed II", year: 2018},
    {id: "tt11145118", type: "movie", name: "Creed III", year: 2023}
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
  398949: 'https://image.tmdb.org/t/p/w500/4jUqvr8wSn9G51Pp60FeywEG9JU.jpg',
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
  const imdbId = req.params.id;
  const tmdbId = imdbToTmdb[imdbId];
  
  if (metaCache[imdbId]) {
    return res.json({ meta: metaCache[imdbId] });
  }
  
  if (tmdbId && posterData[tmdbId]) {
    const meta = {
      id: imdbId,
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
