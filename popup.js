document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');

  const loadGamesData = async () => {
    try {
      const response = await fetch(chrome.runtime.getURL('games_rows.csv'));
      const csvText = await response.text();
      
      // Parse CSV data
      const rows = csvText.split('\n').slice(1); // Skip header row
      const games = rows
        .filter(row => row.trim()) // Filter empty rows
        .map(row => {
          const [uuid, slug, thumbnail_url, game_url] = row.split(',');
          return { uuid, slug, thumbnail_url, game_url };
        });

      // Create games grid
      const gamesGrid = document.createElement('div');
      gamesGrid.className = 'games-grid';

      // Add game cards
      games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';

        const title = game.slug.replace(/-/g, ' ');
        
        gameCard.innerHTML = `
          <img src="${game.thumbnail_url}" alt="${title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22>Image Failed</text></svg>'">
          <div class="game-info">
            <h3 class="game-title">${title}</h3>
            <a href="${game.game_url}" target="_blank" class="game-link">Play Now</a>
          </div>
        `;

        gamesGrid.appendChild(gameCard);
      });

      // Clear loading message and show games grid
      contentDiv.innerHTML = '';
      contentDiv.appendChild(gamesGrid);

    } catch (error) {
      contentDiv.innerHTML = `<div class="error">Failed to load: ${error.message}</div>`;
    }
  };

  loadGamesData();
}); 