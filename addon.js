const express = require('express');
const app = express();

// ============================================
// CONFIGURAÇÃO DO MANIFEST
// ============================================
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

// ============================================
// BASE DE DADOS - FILMES
// ============================================
const movies = {
  // PODEROSO CHEFÃO
  'tt0068646': { tmdbId: 238, name: 'The Godfather', year: 1972, desc: 'O clássico do crime organizado', collection: 'godfather' },
  'tt0071562': { tmdbId: 239, name: 'The Godfather Part II', year: 1974, desc: 'A continuação épica do saga Corleone', collection: 'godfather' },
  'tt0099674': { tmdbId: 240, name: 'The Godfather Part III', year: 1990, desc: 'O capítulo final da trilogia', collection: 'godfather' },
  
  // ROCKY
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

// ============================================
// CAPAS TMDB (URLs verificadas)
// ============================================
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

// ============================================
// COLLECTIONS (geradas automaticamente)
// ============================================
const buildCollections = () => {
  const collections = { godfather: [], rocky: [] };
  
  Object.entries(movies).forEach(([imdbId, data]) => {
    collections[data.collection].push({
      id: imdbId,
      type: "movie",
      name: data.name,
      year: data.year
    });
  });
  
  return collections;
};

const collections = buildCollections();
const metaCache = {};

// ============================================
// ROTAS
// ============================================

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Coleções Nuvio</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 40px 20px;
        }
        
        .container { 
          max-width: 1200px; 
          margin: 0 auto;
          flex: 1;
        }
        
        .header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        h1 { 
          font-size: 3em; 
          margin-bottom: 10px; 
          color: #ffd700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }
        
        .subtitle { 
          color: #999; 
          font-size: 1.1em;
          margin-bottom: 30px;
        }
        
        .disclaimer {
          background: rgba(255,193,7,0.1);
          border: 1px solid rgba(255,193,7,0.3);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 40px;
          font-size: 0.9em;
          line-height: 1.6;
          color: #ddd;
        }
        
        .disclaimer strong {
          color: #ffd700;
        }
        
        .collections { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 30px;
          margin-bottom: 50px;
        }
        
        @media (max-width: 768px) {
          .collections {
            grid-template-columns: 1fr;
          }
          h1 { font-size: 2em; }
        }
        
        .collection { 
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,215,0,0.2);
          padding: 30px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
        }
        
        .collection h2 { 
          color: #ffd700; 
          margin-bottom: 25px; 
          font-size: 1.8em;
          border-bottom: 2px solid rgba(255,215,0,0.3);
          padding-bottom: 15px;
        }
        
        .movies { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 15px; 
        }
        
        .movie { 
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(255,215,0,0.05) 100%);
          padding: 18px;
          border-radius: 8px;
          text-align: center;
          font-size: 1em;
          border: 1px solid rgba(255,215,0,0.2);
          transition: all 0.3s ease;
        }
        
        .movie:hover {
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(255,215,0,0.1) 100%);
          border-color: rgba(255,215,0,0.5);
          transform: translateY(-2px);
        }
        
        .movie-name {
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        
        .movie-year { 
          color: #999; 
          font-size: 0.85em;
        }
        
        .info { 
          text-align: center; 
          padding: 20px; 
          background: rgba(0,0,0,0.3); 
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid rgba(255,215,0,0.2);
        }
        
        .info p { 
          color: #999; 
          line-height: 1.8;
          margin: 8px 0;
        }
        
        .info code {
          background: rgba(0,0,0,0.5);
          padding: 4px 8px;
          border-radius: 4px;
          color: #ffd700;
          font-family: 'Courier New', monospace;
        }
        
        footer {
          text-align: center;
          padding: 30px 20px;
          border-top: 1px solid rgba(255,215,0,0.2);
          color: #999;
          font-size: 0.9em;
        }
        
        footer strong {
          color: #ffd700;
        }
        
        .stats {
          display: flex;
          justify-content: space-around;
          margin-top: 15px;
          font-size: 0.95em;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .stat-item {
          padding: 10px 20px;
          background: rgba(255,215,0,0.1);
          border-radius: 6px;
          border: 1px solid rgba(255,215,0,0.2);
        }
        
        .stat-item strong {
          color: #ffd700;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📱 Coleções Nuvio</h1>
          <p class="subtitle">Addon de Metadados para Gerenciamento de Coleções</p>
        </div>
        
        <div class="disclaimer">
          <strong>⚠️ Aviso Legal:</strong> Este addon é fornecido exclusivamente para fins de organização e visualização de metadados de coleções de filmes. Ele NÃO contém streams, downloads ou qualquer conteúdo de mídia protegido. É de uso privado, sem fins comerciais, lucrativos ou qualquer atividade que viole as leis de streaming. O desenvolvedor não é responsável pelo uso impróprio deste addon.
        </div>
        
        <div class="collections">
          <div class="collection">
            <h2>🎭 Poderoso Chefão</h2>
            <div class="movies">
              ${collections.godfather.map(m => `<div class="movie"><div class="movie-name">${m.name}</div><div class="movie-year">${m.year}</div></div>`).join('')}
            </div>
          </div>
          
          <div class="collection">
            <h2>🥊 Rocky</h2>
            <div class="movies">
              ${collections.rocky.map(m => `<div class="movie"><div class="movie-name">${m.name}</div><div class="movie-year">${m.year}</div></div>`).join('')}
            </div>
          </div>
        </div>
        
        <div class="info">
          <p><strong>URL do Manifest:</strong></p>
          <code>${process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000'}/manifest.json</code>
          
          <div class="stats">
            <div class="stat-item"><strong>Total de Filmes:</strong> ${Object.keys(movies).length}</div>
            <div class="stat-item"><strong>Coleções:</strong> 2</div>
            <div class="stat-item"><strong>Versão:</strong> ${manifest.version}</div>
          </div>
        </div>
      </div>
      
      <footer>
        <p>Addon desenvolvido por <strong>Lucas Assunção</strong></p>
        <p>© 2026 - Coleções Nuvio | Uso privado, sem fins comerciais</p>
      </footer>
    </body>
    </html>
  `;
  res.send(html);
});

app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

app.get('/catalog/:type/:id.json', (req, res) => {
  const coll = collections[req.params.id] || [];
  res.json({ metas: coll });
});

app.get('/meta/:type/:id.json', (req, res) => {
  const imdbId = req.params.id;
  const movie = movies[imdbId];
  
  if (!movie) return res.json({ meta: {} });
  if (metaCache[imdbId]) return res.json({ meta: metaCache[imdbId] });
  
  const posterUrl = posters[movie.tmdbId];
  if (posterUrl) {
    const meta = {
      id: imdbId,
      type: "movie",
      name: movie.name,
      year: movie.year,
      description: movie.desc,
      poster: posterUrl,
      background: posterUrl
    };
    metaCache[imdbId] = meta;
    return res.json({ meta });
  }
  
  res.json({ meta: {} });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Addon Coleções Nuvio rodando em porta ${port}`));
