if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/service-worker.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(error => {
          console.error('ServiceWorker registration failed:', error);
      });
  });
}

const apiKey = '50a718ad'; 
const movieTitles = [
  'Inception',
  'The Matrix',
  'Interstellar',
  'The Dark Knight',
  'Pulp Fiction',
  'Fight Club',
  'Forrest Gump',
  'The Shawshank Redemption',
  'The Godfather',
  'The Lord of the Rings: The Fellowship of the Ring',
  'Star Wars: Episode IV - A New Hope',
  'The Empire Strikes Back',
  'The Silence of the Lambs',
  'Schindler\'s List',
  'Goodfellas'
];

const url = 'http://www.omdbapi.com/';
const CACHE_NAME = 'movies-cache-v1';

async function fetchMovieDetails(title) {
  const params = new URLSearchParams({
      apikey: apiKey,
      t: title,
      plot: 'short'
  });

  const requestUrl = `${url}?${params}`;
  try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(requestUrl);

      if (cachedResponse) {
          console.log(`Cache hit for: ${title}`);
          return await cachedResponse.json();
      } else {
          console.log(`Fetching from network: ${title}`);
          const networkResponse = await fetch(requestUrl);
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(requestUrl, networkResponse.clone());
          }
          return await networkResponse.json();
      }
  } catch (error) {
      console.error('Error fetching data:', error);
      return null;
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');
  if (!moviesContainer) {
      console.error('movies-container not found');
      return;
  }
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
      if (movie && movie.Response === "True") {
        const isFavorite = favoriteMovies.includes(movie.imdbID);
          const movieCard = `
              <div class="col s12 m6 l3">
                  <div class="card movie-card hoverable">
                      <div class="card-image">
                          <img src="${movie.Poster}" alt="Poster of ${movie.Title}">
                      </div>
                      <div class="card-content">
                          <span class="card-title">${movie.Title}</span>
                          <p><strong>Year:</strong> ${movie.Year}</p>
                          <p><strong>Director:</strong> ${movie.Director}</p>
                          <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                      </div>
                      <div class="card-action">
                            <a class="waves-effect waves-light btn ${isFavorite ? 'red' : ''}" onclick="toggleFavorite('${movie.imdbID}')">
                                ${isFavorite ? 'Quitar' : 'Favoritos'}
                            </a>
                        </div>
                  </div>
              </div>
          `;
          moviesContainer.innerHTML += movieCard;
      } else {
          console.warn(`pelicula no encontrada: ${JSON.stringify(movie)}`);
      }
  });
}

function toggleFavorite(movieId) {
    const index = favoriteMovies.indexOf(movieId);
    if (index === -1) {
        favoriteMovies.push(movieId);
    } else {
        favoriteMovies.splice(index, 1);
    }
    saveFavoriteMovies(favoriteMovies);
    fetchAndDisplayMovies(); 
}

let favoriteMovies = loadFavoriteMovies();
fetchAndDisplayMovies(); 
function fetchAndDisplayMovies() {
  const moviePromises = movieTitles.map(title => fetchMovieDetails(title));
  Promise.all(moviePromises).then(movies => {
      console.log('All movies fetched:', movies);
      displayMovies(movies);
  });
}
function saveFavoriteMovies(favorites) {
  localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
}

function loadFavoriteMovies() {
  const favoritesJSON = localStorage.getItem('favoriteMovies');
  return JSON.parse(favoritesJSON) || [];
}

fetchAndDisplayMovies();
