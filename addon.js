const express = require('express');
const axios = require('axios');
const app = express();

const TMDB_API_KEY = '591d3d2beca9f7f746e95deab4f78893';
const TMDB_URL = 'https://api.themoviedb.org/3/movie';

// Cache simples em memória
const metaCache = {};

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

// Metadados pré-configurados (garante informações corretas)
const movieData = {
  '238': {
    title: 'The Godfather',
    year: 1972,
    description: 'O clássico do crime organizado',
    poster: 'https://image.tmdb.org/t/p/w500/6MR0zcRBj1C9R5dCEk8YD6u1H4f.jpg',
    background: 'https://image.tmdb.org/t/p/w500/eFsqydu0EQHx8HkYQ14EipXHWJH.jpg',
    runtime: 175
  },
  '239': {
    title: 'The Godfather Part II',
    year: 1974,
    description: 'A continuação épica do saga Corleone',
    poster: 'https://image.tmdb.org/t/p/w500/tHbCWy0OYueC4hxU8KD5789O51V.jpg',
    background: 'https://image.tmdb.org/t/p/w500/xfVMlKKpqHUHVs36TthIzfNB7KV.jpg',
    runtime: 202
  },
  '240': {
    title: 'The Godfather Part III',
    year: 1990,
    description: 'O capítulo final da trilogia',
    poster: 'https://image.tmdb.org/t/p/w500/cjZGPgw7XTSQF_vwWK7V2cJc0Cz.jpg',
    background: 'https://image.tmdb.org/t/p/w500/oIJpL1vqPLCeGXC1aHH1YZOsZNW.jpg',
    runtime: 161
  },
  '490': {
    title: 'The Godfather Coda: The Death of Michael Corleone',
    year: 2020,
    description: 'Recorte remasterizado do Parte III',
    poster: 'https://image.tmdb.org/t/p/w500/8YfCEMpE9KlEBfWWrIEaBjEg20H.jpg',
    background: 'https://image.tmdb.org/t/p/w500/gfBh0qOp1QZEjF0qfLCy05HlVT8.jpg',
    runtime: 138
  },
  '519': {
    title: 'Rocky',
    year: 1976,
    description: 'O lutador que subiu do nada',
    poster: 'https://image.tmdb.org/t/p/w500/bnlEWsewhQq8MTsHy5gHRJyL4I6.jpg',
    background: 'https://image.tmdb.org/t/p/w500/7ZKWEbUMaUfJJGlVP7v9mLKNYRc.jpg',
    runtime: 120
  },
  '520': {
    title: 'Rocky II',
    year: 1979,
    description: 'Rocky volta ao ringue',
    poster: 'https://image.tmdb.org/t/p/w500/xFXKQxXGqKdIXW3YcIDIEaHbNfJ.jpg',
    background: 'https://image.tmdb.org/t/p/w500/hKD0Cg72kJMFpBMeRQlV1wppNJL.jpg',
    runtime: 119
  },
  '521': {
    title: 'Rocky III',
    year: 1982,
    description: 'Rocky enfrenta o Punhador de Aço',
    poster: 'https://image.tmdb.org/t/p/w500/1nMpJRDDaKFHYG5zPVzuRKJQCaV.jpg',
    background: 'https://image.tmdb.org/t/p/w500/dHUAIcQFSGGQZdVbBJPfAE1ZuZm.jpg',
    runtime: 115
  },
  '615': {
    title: 'Rocky IV',
    year: 1985,
    description: 'Rocky vs o Gigante Soviético',
    poster: 'https://image.tmdb.org/t/p/w500/5LiLsEWKDvRnW2QDl8X6PX5RcTz.jpg',
    background: 'https://image.tmdb.org/t/p/w500/rvEGNK0BQrLfm3FtT5CZCxiR1I4.jpg',
    runtime: 127
  },
  '786': {
    title: 'Rocky V',
    year: 1990,
    description: 'Rocky treinando uma nova geração',
    poster: 'https://image.tmdb.org/t/p/w500/KxfVfB1qVYD3OKzHh3Tc3X6LkwN.jpg',
    background: 'https://image.tmdb.org/t/p/w500/bvLNX1cPrQGLjT6BL3ObtLTh6xD.jpg',
    runtime: 115
  },
  '8563': {
    title: 'Rocky Balboa',
    year: 2006,
    description: 'Rocky retorna ao ringue após anos',
    poster: 'https://image.tmdb.org/t/p/w500/mAjP5ueXhpVkLk6wUVxVyDC8Kj5.jpg',
    background: 'https://image.tmdb.org/t/p/w500/vYB6R1VjYTYaRD6CbP5E0ks0PV8.jpg',
    runtime: 102
  },
  '337401': {
    title: 'Creed',
    year: 2015,
    description: 'O herdeiro do legado de Rocky',
    poster: 'https://image.tmdb.org/t/p/w500/rwt6H4H4TQY0mAvq6pXGtCB0M5m.jpg',
    background: 'https://image.tmdb.org/t/p/w500/Lm2hhMhY3fTK5m0b56MgQ4nvPRr.jpg',
    runtime: 133
  },
  '398949': {
    title: 'Creed II',
    year: 2018,
    description: 'Adonis enfrenta o filho do inimigo de Rocky',
    poster: 'https://image.tmdb.org/t/p/w500/v3QyprWZOsXW8drg84CeHkreplies.jpg',
    background: 'https://image.tmdb.org/t/p/w500/2DEp0LsA8j5J5qN0rwdMMJxG5Z3.jpg',
    runtime: 130
  },
  '958028': {
    title: 'Creed III',
    year: 2023,
    description: 'Adonis vs seu amigo do passado',
    poster: 'https://image.tmdb.org/t/p/w500/X8n8Bzt0MHXi2piZGeDVKGmUXcD.jpg',
    background: 'https://image.tmdb.org/t/p/w500/jBJRDhf5ZqKA9kh6OJ55tD6sVkz.jpg',
    runtime: 115
  }
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
  const id = req.params.id.replace('tmdb:', '');
  
  // Check cache first
  if (metaCache[id]) {
    return res.json({ meta: metaCache[id] });
  }
  
  // Use pre-configured data
  if (movieData[id]) {
    const meta = {
      id: `tmdb:${id}`,
      type: "movie",
      name: movieData[id].title,
      year: movieData[id].year,
      poster: movieData[id].poster,
      background: movieData[id].background,
      description: movieData[id].description,
      runtime: movieData[id].runtime
    };
    metaCache[id] = meta;
    return res.json({ meta });
  }
  
  res.json({ meta: {} });
});

app.get('/stream/:type/:id', (req, res) => {
  res.json({ streams: [] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
