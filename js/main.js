const apiKey = 'tu_clave_de_api';
const movieTitle = 'The Matrix'; // Título de la película que deseas buscar

// Construye la URL de la solicitud
const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

// Realiza la solicitud GET
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Maneja la respuesta de la API
    console.log(data);
    // Aquí puedes trabajar con los datos de la película
  })
  .catch(error => {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error('Error:', error);
  });
