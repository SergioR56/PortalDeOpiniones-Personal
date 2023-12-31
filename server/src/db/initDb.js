//Importamos las variables de entorno en nuestro fichero ".env".
require('dotenv').config();

//Importamos la funcion que nos permite obtener una conexion libre con la base de datos.
const getDb = require('./getDb');

//Funcion que borrara las tablas de la base de datos (si existe) y las volvera a crear.
const main = async () => {
    // Variable que almacenará una conexión libre con la base de datos.
    let connection;
    try {
        connection = await getDb();

        console.log('Borrando tablas...');

        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS posts');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(` 
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                username VARCHAR(30) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('user', 'admin') DEFAULT 'user',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                userId INT UNSIGNED NOT NULL,
                text VARCHAR(500) NOT NULL,
                image VARCHAR(100),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES users(id)
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                userId INT UNSIGNED NOT NULL,
                postId INT UNSIGNED NOT NULL, 
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(userId) REFERENCES users(id),
                FOREIGN KEY(postId) REFERENCES posts(id)
            )
        `);

        console.log('¡Tablas creadas!');
    } catch (err) {
        console.log(err);
    } finally {
        //Si existe una conexion, la liberamos.
        if (connection) connection.release();

        //Finalizamos el proceso.
        process.exit();
    }
};
//Llamamos a la funcion principal.
main();
