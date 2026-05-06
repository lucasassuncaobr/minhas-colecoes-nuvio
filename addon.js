const express = require('express');
const app = express();

const manifest = {
  "id": "com.colecoes.nuvio",
  "name": "Coleções Nuvio",
  "version": "1.0.0",
  "resources": ["catalog", "meta"],
  "types": ["movie"],
  "catalogs": [
    {"type": "movie", "id": "godfather", "name": "Poderoso Chefão"},
    {"type": "movie", "id": "rocky", "name": "Rocky"}
  ]
};

const movies = {
  'tt0068646': { tmdbId: 238, name: 'The Godfather', year: 1972, desc: 'O clássico do crime organizado', collection: 'godfather' },
  'tt0071562': { tmdbId: 239, name: 'The Godfather Part II', year: 1974, desc: 'A continuação épica do saga Corleone', collection: 'godfather' },
  'tt0099674': { tmdbId: 240, name: 'The Godfather Part III', year: 1990, desc: 'O capítulo final da trilogia', collection: 'godfather' },
  'tt0075148': { tmdbId: 519, name: 'Rocky', year: 1976, desc: 'O lutador que subiu do nada', collection: 'rocky' },
  'tt0079817': { tmdbId: 520, name: 'Rocky II', year: 1979, desc: 'Rocky volta ao ringue', collection: 'rocky' },
  'tt0084683': { tmdbId: 521, name: 'Rocky III', year: 1982, desc: 'Rocky enfrenta o Punhador de Aço', collection: 'rocky' },
  'tt0089927': { tmdbId: 615, name: 'Rocky IV', year: 1985, desc: 'Rocky vs o Gigante Soviético', collection: 'rocky' },
  'tt0100405': { tmdbId: 786, name: 'Rocky V', year: 1990, desc: 'Rocky treinando uma nova geração', collection: 'rocky' },
  'tt0479143': { tmdbId: 8563, name: 'Rocky Balboa', year: 2006, desc: 'Rocky retorna ao ringue após anos', collection: 'rocky' },
  'tt3076658': { tmdbId: 337401, name: 'Creed', year: 2015, desc: 'O herdeiro do legado de Rocky', collection: 'rocky' },
  'tt4772622': { tmdbId: 398949, name: 'Creed II', year: 2018, desc: 'Adonis enfrenta o filho do inimigo de Rocky', collection: 'rocky' },
  'tt11145118': { tmdbId: 958028, name: 'Creed III', year: 2023, desc: 'Adonis vs seu amigo do passado', collection: 'rocky' },
};

const posters = {
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
  958028: 'https://image.tmdb.org/t/p/w500/X8n8Bzt0MHXi2piZGeDVKGmUXcD.jpg',
};

const buildCollections = () => {
  const collections = { godfather: [], rocky: [] };
  Object.entries(movies).forEach(([imdbId, data]) => {
    collections[data.collection].push({ id: imdbId, type: "movie", name: data.name, year: data.year });
  });
  return collections;
};

const collections = buildCollections();
const 
