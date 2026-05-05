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

// Mapeamento IMDB IDs (para BetteePosters)
const imdbIds = {
  '238': 'tt0068646',      // The Godfather
  '239': 'tt0071562',      // The Godfather Part II
  '240': 'tt0099674',      // The Godfather Part III
  '490': 'tt13111040',     // The Godfather Coda
  '519': 'tt0075148',      // Rocky
  '520': 'tt0079817',      // Rocky II
  '521': 'tt0084683',      // Rocky III
  '615': 'tt0089927',      // Rocky IV
  '786': 'tt0100405',      // Rocky V
  '8563': 'tt0479143',     // Rocky Balboa
  '337401': 'tt3322380',   // Creed
  '398949': 'tt7916416',   // Creed II
  '958028': 'tt11214590'   // Creed III
};

// Dados dos filmes
const movieData = {
  '238': {
    title: 'The Godfather',
    year: 1972,
    description: 'O clássico do crime organizado. Vito Corleone, o patriarca de uma organização do crime organizado, transfere o controle de seu clandestino império para seu filho mais jovem, Michael.',
    runtime: 175
  },
  '239': {
    title: 'The Godfather Part II',
    year: 1974,
    description: 'A continuação épica do saga Corleone. A história alterna entre a ascensão de Vito Corleone e os primeiros anos de seu filho Michael como chefe da família.',
    runtime: 202
  },
  '240': {
    title: 'The Godfather Part III',
    year: 1990,
    description: 'O capítulo final da trilogia. Michael Corleone, agora no auge de seu poder, trabalha para deixar a família para trás e transferir o poder para a próxima geração.',
    runtime: 161
  },
  '490': {
    title: 'The Godfather Coda: The Death of Michael Corleone',
    year: 2020,
    description: 'Recorte remasterizado do Parte III com finais alternativos. Uma restauração cinematográfica de Francis Ford Coppola.',
    runtime: 138
  },
  '519': {
    title: 'Rocky',
    year: 1976,
    description: 'O lutador que subiu do nada. Um boxeador desconhecido de Filadélfia recebe a chance de lutar contra o campeão mundial de pesos pesados.',
    runtime: 120
  },
  '520': {
    title: 'Rocky II',
    year: 1979,
    description: 'Rocky volta ao ringue. Após a luta épica com Apollo Creed, Rocky é determinado a lutar novamente.',
    runtime: 119
  },
  '521': {
    title: 'Rocky III',
    year: 1982,
    description: 'Rocky enfrenta o Punhador de Aço. Um novo adversário desafiador emerge para enfrentar o campeão Rocky.',
    runtime: 115
  },
  '615': {
    title: 'Rocky IV',
    year: 1985,
    description: 'Rocky vs o Gigante Soviético. Rocky viaja para a União Soviética para enfrentar um atleta comunista poderoso.',
    runtime: 127
  },
  '786': {
    title: 'Rocky V',
    year: 1990,
    description: 'Rocky treinando uma nova geração. Rocky retorna a Filadélfia e treina um jovem lutador promissor.',
    runtime: 115
  },
  '8563': {
    title: 'Rocky Balboa',
    year: 2006,
    description: 'Rocky retorna ao ringue após anos. Agora com 60 anos, Rocky decide retornar aos ringues.',
    runtime: 102
  },
  '337401': {
    title: 'Creed',
    year: 2015,
    description: 'O herdeiro do legado de Rocky. Um jovem boxeador descobre que é filho de Apollo Creed e busca o treinamento de Rocky.',
    runtime: 133
  },
  '398949': {
    title: 'Creed II',
    year: 2018,
    description: 'Adonis enfrenta o filho do inimigo de Rocky. O filho do ex-inimigo de Rocky retorna como novo desafio.',
    runtime: 130
  },
  '958028': {
    title: 'Creed III',
    year: 2023,
    description: 'Adonis vs seu amigo do passado. Um inimigo do passado reaparece para desafiar Adonis novamente.',
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

const metaCache = {};

app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  const coll = collections[req.params.id] || [];
  res.json({ metas: coll });
});

app.get('/meta/:type/:id.json', (req, res) => {
  const tmdbId = req.params.id.replace('tmdb:', '');
  
  if (metaCache[tmdbId]) {
    return res.json({ meta: metaCache[tmdbId] });
  }
  
  if (movieData[tmdbId] && imdbIds[tmdbId]) {
    const imdbId = imdbIds[tmdbId];
    const meta = {
      id: `tmdb:${tmdbId}`,
      type: "movie",
      name: movieData[tmdbId].title,
      year: movieData[tmdbId].year,
      poster: `https://btttr.cc/poster/imdb/poster-default/${imdbId}.jpg?tag=none&lang=pt-BR&rs=IM`,
      background: `https://btttr.cc/poster/imdb/poster-default/${imdbId}.jpg?tag=none&lang=pt-BR&rs=IM`,
      description: movieData[tmdbId].description,
      runtime: movieData[tmdbId].runtime
    };
    metaCache[tmdbId] = meta;
    return res.json({ meta });
  }
  
  res.json({ meta: {} });
});

app.get('/stream/:type/:id', (req, res) => {
  res.json({ streams: [] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon running on port ${port}`));
