<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["primerNombre"];
    $apellido = $_POST["apellido"];
    $email = $_POST["email"];
    $mensaje = $_POST["Mensaje"];

    echo "<h2>Datos recibidos:</h2>";
    echo "<p><strong>Nombre:</strong> " . htmlspecialchars($nombre) . "</p>";
    echo "<p><strong>Apellido:</strong> " . htmlspecialchars($apellido) . "</p>";
    echo "<p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>";
    echo "<p><strong>Mensaje:</strong> " . htmlspecialchars($mensaje) . "</p>";
}
?>
