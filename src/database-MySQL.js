var mysql = require('mysql');

//Configuración
var mysqlConn = mysql.createConnection({
    host: 'localhost',
    database: 'pruebainfodesign',
    user: 'root',
    password: '12345'
});

//Conexión
mysqlConn.connect( (err) => {
    if (err) {
        throw err;
    } else {
        console.log('Conexión a DB MYSQL exitosa');
    }
});

//Exportación
module.exports = mysqlConn;