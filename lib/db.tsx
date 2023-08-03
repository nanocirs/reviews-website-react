import { RowDataPacket, Connection } from "mysql2";

const mysql = require('mysql2');

export function databaseConnection() : Connection {
     return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}
    
export async function isConnectionOpen(connection : Connection) {
    try {
        const [rows] = await connection.promise().query<RowDataPacket[]>('SELECT 1');
        return true;
    } 
    catch {
        return false;
    }    
}
