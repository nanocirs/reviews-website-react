const mysql = require('mysql2');

function databaseConnection() {
     return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}
    
async function isConnectionOpen(connection) {
    try {
        const [rows] = await connection.promise().query('SELECT 1');
        return true;
    } 
    catch (error) {
        return false;
    }    
}

module.exports = {
    databaseConnection,
    isConnectionOpen
}