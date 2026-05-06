const express = require('express');
const axios = require('axios');
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

// Descrições e dados adicionais
const movieDetails = {
  'tt0068646': { description: 'O clássico do crime organizado', runtime: 175 },
  'tt0071562': { description: 'A continuação épica do saga Corleone', runtime: 202 },
  'tt0099674': { description: 'O capítulo final da trilogia', runtime: 161 },
  'tt0075148': { description: 'O lutador que subiu do nada', runtime: 120 },
  'tt0079817': { description: 'Rocky volta ao ringue', runtime: 119 },
  'tt0084683': { description: 'Rocky enfrenta o Punhador de Aço', runtime: 115 },
  'tt0089927': { description: 'Rocky vs o Gigante Soviético', runtime: 127 },
  'tt0100405': { description: 'Rocky treinando uma nova geração', runtime: 115 },
  'tt0479143': { description: 'Rocky retorna ao ringue após anos', runtime: 102 },
  'tt3322380': { description: 'O herdeiro do legado de Rocky', runtime: 133 },
  'tt7916416': { description: 'Adonis enfrenta o filho do inimigo de Rocky', runtime: 130 },
  'tt11214590': { description: 'Adonis vs seu amigo do passado', runtime: 115 }
};

const metaCache = {};

app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  const coll = collections[req.params.id] || [];
  res.json({ metas: coll });
});

app.get('/meta/:type/:id.json', async (req, res) => {
  const id = req.params.id;
  
  if (metaCache[id]) {
    return res.json({ meta: metaCache[id] });
  }
  
  try {
    const imdbId = id.replace('imdb:', '').replace('tt', '');
    const posterUrl = `https://btttr.cc/poster/imdb/poster-default/${imdbId}.jpg?tag=none&lang=pt-BR&rs=IM`;
    
    const meta = {
      id: id,
      type: "movie",
      description: movieDetails[id]?.description || '',
      runtime: movieDetails[id]?.runtime || 0,
      poster: posterUrl,
      background: posterUrl
    };
    
    metaCache[id] = meta;
    res.json({ meta });
  } catch (err) {
    res.json({ meta: {} });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
