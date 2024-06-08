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

function fetchMovieDetails(title) {
  const params = new URLSearchParams({
    apikey: apiKey,
    t: title,
    plot: 'short'
  });

  return fetch(`${url}?${params}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    if (movie && movie.Response === "True") {
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
                          <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>
                      </div>
                  </div>
                  
                </div>
          `;
      moviesContainer.innerHTML += movieCard;
    }
  });
}

function fetchAndDisplayMovies() {
  const moviePromises = movieTitles.map(title => fetchMovieDetails(title));
  Promise.all(moviePromises)
    .then(movies => {
      displayMovies(movies);
    });
}

fetchAndDisplayMovies();