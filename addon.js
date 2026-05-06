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
const metaCache = {};

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Coleções Nuvio</title><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Roboto',sans-serif;overflow-x:hidden;background:#000}.hero{position:relative;width:100%;height:100vh;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center}.hero::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(to right,rgba(255,255,255,0.06) 0px,rgba(255,255,255,0.12) 2px,transparent 4px,transparent 120px);filter:blur(1px);opacity:0.6;z-index:1}.hero::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 20% 100%,rgba(255,255,255,0.15),transparent 60%),radial-gradient(ellipse at 50% 100%,rgba(255,255,255,0.12),transparent 70%),radial-gradient(ellipse at 80% 100%,rgba(255,255,255,0.1),transparent 70%);mix-blend-mode:screen;opacity:0.5;z-index:2}.fog{position:absolute;inset:0;background:radial-gradient(circle at 30% 80%,rgba(255,255,255,0.08),transparent 60%),radial-gradient(circle at 70% 85%,rgba(255,255,255,0.06),transparent 65%);filter:blur(20px);opacity:0.4;z-index:3}.floor{position:absolute;bottom:0;width:100%;height:30%;background:linear-gradient(to top,rgba(255,255,255,0.08),transparent);opacity:0.3;z-index:4}.content{position:relative;z-index:10;text-align:center;color:#fff}.content h1{font-size:4rem;font-weight:700;margin-bottom:20px;text-shadow:0 0 30px rgba(255,255,255,0.3);letter-spacing:2px}.content p{font-size:1.2rem;color:rgba(255,255,255,0.8);text-shadow:0 0 20px rgba(255,255,255,0.2);font-weight:300}.status{margin-top:30px;padding:15px 30px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);border-radius:8px;display:inline-block;backdrop-filter:blur(10px)}.status-dot{display:inline-block;width:10px;height:10px;background:#fff;border-radius:50%;margin-right:10px;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}.status-text{color:rgba(255,255,255,0.9);font-size:0.95rem;font-weight:500}.footer{position:absolute;bottom:20px;width:100%;text-align:center;color:rgba(255,255,255,0.5);font-size:0.9rem;z-index:11;font-weight:300}.manifest-info{margin-top:40px;font-size:0.85rem;color:rgba(255,255,255,0.6)}.manifest-info p{font-weight:400}.manifest-info code{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);padding:8px 15px;border-radius:4px;font-family:'Courier New',monospace;color:#fff;display:inline-block;margin-top:10px;word-break:break-all;font-weight:500}@media (max-width:768px){.content h1{font-size:2.5rem}.content p{font-size:1rem}}</style></head><body><div class="hero"><div class="fog"></div><div class="floor"></div><div class="content"><h1>Coleções Nuvio</h1><p>Addon de Metadados Online</p><div class="status"><span class="status-dot"></span><span class="status-text">Sistema Online</span></div><div class="manifest-info"><p>Manifest disponível em:</p><code>${process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000'}/manifest.json</code></div></div><div class="footer"><p>Desenvolvido por Lucas Assunção | Uso privado, sem fins comerciais</p></div></div></body></html>`);
});

app.get('/manifest.json', (req, res) => res.json(manifest));
app.get('/catalog/:type/:id.json', (req, res) => res.json({ metas: collections[req.params.id] || [] }));
app.get('/meta/:type/:id.json', (req, res) => {
  const imdbId = req.params.id;
  const movie = movies[imdbId];
  if (!movie) return res.json({ meta: {} });
  if (metaCache[imdbId]) return res.json({ meta: metaCache[imdbId] });
  const posterUrl = posters[movie.tmdbId];
  if (posterUrl) {
    const meta = { id: imdbId, type: "movie", name: movie.name, year: movie.year, description: movie.desc, poster: posterUrl, background: posterUrl };
    metaCache[imdbId] = meta;
    return res.json({ meta });
  }
  res.json({ meta: {} });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Addon Coleções Nuvio rodando em porta ${port}`));
