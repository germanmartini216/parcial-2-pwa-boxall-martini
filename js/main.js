if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js').then(registro => {
            console.log('Registro de ServiceWorker exitoso con alcance: ', registro.scope);
        }).catch(error => {
            console.error('El registro de ServiceWorker falló:', error);
        });
        window.addEventListener('offline', () => {
            mostrarNotificacionOffline();
        });
    });
}
function mostrarNotificacionOffline() {
    const notification = document.getElementById('offline-notification');
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000); 
}

const apiKey = '50a718ad';
const titulosDePeliculas = [
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
let peliculasFavoritas = cargarPeliculasFavoritas();
let peliculasGuardadas = [];

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    if (document.getElementById('movies-container')) {
        obtenerYMostrarPeliculas();
    }
    if (document.getElementById('favorites-container')) {
        mostrarPeliculasFavoritas();
    }
    actualizarBadge();
});





async function obtenerDetallesDePelicula(titulo) {
    const params = new URLSearchParams({
        apikey: apiKey,
        t: titulo,
        plot: 'short'
    });

    const requestUrl = `${url}?${params}`;

    try {
        const cache = await caches.open(CACHE_NAME);
        const respuestaEnCache = await cache.match(requestUrl);

        if (respuestaEnCache) {
            console.log(`Cache hit para: ${titulo}`);
            return await respuestaEnCache.json();
        } else {
            console.log(`Fetching from network: ${titulo}`);
            const respuestaDeRed = await fetch(requestUrl);
            if (respuestaDeRed && respuestaDeRed.status === 200) {
                cache.put(requestUrl, respuestaDeRed.clone());
                return await respuestaDeRed.json();
            } else {
                console.error('La respuesta de la red no fue correcta.');
                return null;
            }
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null;
    }
}

async function obtenerDetallesDePeliculaPorID(id) {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=short`;

    try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
            return await respuesta.json();
        } else {
            console.error('Error en la respuesta de la red.');
            return null;
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        return null;
    }
}

async function obtenerYMostrarPeliculas() {
    const promesasDePeliculas = titulosDePeliculas.map(titulo => obtenerDetallesDePelicula(titulo));
    const peliculas = await Promise.all(promesasDePeliculas);
    peliculasGuardadas = peliculas;
    console.log('Todas las películas obtenidas:', peliculas);
    mostrarPeliculas(peliculas);
}

async function mostrarPeliculasFavoritas() {
    const contenedorDeFavoritas = document.getElementById('favorites-container');
    const noFavoritas = document.getElementById('no-favorites');

    if (peliculasFavoritas.length === 0) {
        noFavoritas.style.display = 'block';
        contenedorDeFavoritas.style.display = 'none';
    } else {
        noFavoritas.style.display = 'none';
    }

    contenedorDeFavoritas.innerHTML = '';

    const promesasDePeliculas = peliculasFavoritas.map(id => obtenerDetallesDePeliculaPorID(id));
    const peliculas = await Promise.all(promesasDePeliculas);

    peliculas.forEach(pelicula => {
        if (pelicula && pelicula.Response === "True") {
            const tarjetaDePelicula = `
                <div class="col s12 m6 l3">
                    <div class="card movie-card hoverable">
                        <div class="card-image">
                            <img src="${pelicula.Poster}" alt="Poster de ${pelicula.Title}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${pelicula.Title}</span>
                            <p><strong>Año:</strong> ${pelicula.Year}</p>
                            <p><strong>Director:</strong> ${pelicula.Director}</p>
                            <p><strong>IMDb Rating:</strong> ${pelicula.imdbRating}</p>
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light btn-small amber modal-trigger" href="#modal" onclick="mostrarDetalles('${pelicula.imdbID}')">Detalles</a>
                        </div>
                    </div>
                </div>
            `;
            contenedorDeFavoritas.innerHTML += tarjetaDePelicula;
        } else {
            console.warn(`Película no encontrada: ${JSON.stringify(pelicula)}`);
        }
    });
    actualizarBadge();
}

function mostrarPeliculas(peliculas) {
    const contenedorDePeliculas = document.getElementById('movies-container');
    if (!contenedorDePeliculas) {
        console.error('movies-container no encontrado');
        return;
    }
    contenedorDePeliculas.innerHTML = '';

    peliculas.forEach(pelicula => {
        if (pelicula && pelicula.Response === "True") {
            const esFavorita = peliculasFavoritas.includes(pelicula.imdbID);
            const tarjetaDePelicula = `
                <div class="col s12 m6 l3">
                    <div class="card movie-card hoverable">
                        <div class="card-image">
                            <img src="${pelicula.Poster}" alt="Poster de ${pelicula.Title}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${pelicula.Title}</span>
                            <p><strong>Año:</strong> ${pelicula.Year}</p>
                            <p><strong>Director:</strong> ${pelicula.Director}</p>
                            <p><strong>IMDb Rating:</strong> ${pelicula.imdbRating}</p>
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light btn-small ${esFavorita ? 'red' : 'amber'}" onclick="alternarFavorito('${pelicula.imdbID}')">
                                ${esFavorita ? '<i class="material-icons">favorite</i>' : '<i class="material-icons">favorite_border</i>'}
                            </a>
                            <a class="waves-effect waves-light btn-small amber modal-trigger" href="#modal" onclick="mostrarDetalles('${pelicula.imdbID}')">Detalles</a>
                        </div>
                    </div>
                </div>
            `;
            contenedorDePeliculas.innerHTML += tarjetaDePelicula;
        } else {
            console.warn(`Película no encontrada: ${JSON.stringify(pelicula)}`);
        }
    });
}

function alternarFavorito(idPelicula) {
    const index = peliculasFavoritas.indexOf(idPelicula);
    if (index === -1) {
        peliculasFavoritas.push(idPelicula);
    } else {
        peliculasFavoritas.splice(index, 1);
    }
    guardarPeliculasFavoritas(peliculasFavoritas);
    obtenerYMostrarPeliculas();
    actualizarBadge();
}

async function mostrarDetalles(idPelicula) {
    const pelicula = await obtenerDetallesDePeliculaPorID(idPelicula);
    if (pelicula && pelicula.Response === "True") {
        document.getElementById('modal-title').textContent = pelicula.Title;
        document.getElementById('modal-poster').src = pelicula.Poster;
        document.getElementById('modal-year').textContent = `Año: ${pelicula.Year}`;
        document.getElementById('modal-director').textContent = `Director: ${pelicula.Director}`;
        document.getElementById('modal-plot').textContent = `Trama: ${pelicula.Plot}`;
        document.getElementById('modal-rating').textContent = `IMDb Rating: ${pelicula.imdbRating}`;
        const modal = M.Modal.getInstance(document.getElementById('modal'));
        modal.open();
    } else {
        console.error('No se pudieron obtener los detalles de la película');
    }
}



function guardarPeliculasFavoritas(favoritas) {
    localStorage.setItem('peliculasFavoritas', JSON.stringify(favoritas));
}

function cargarPeliculasFavoritas() {
    const favoritasJSON = localStorage.getItem('peliculasFavoritas');
    return favoritasJSON ? JSON.parse(favoritasJSON) : [];
}

function actualizarBadge() {
    const badge = document.getElementById('favorites-badge');
    badge.textContent = peliculasFavoritas.length;

}
