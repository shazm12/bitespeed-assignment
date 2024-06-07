import { ConnectionOptions } from 'mysql2';
import mysql from 'mysql2/promise';

const initDBConnection = async() => {
    const connOptions: ConnectionOptions = { 
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'root',
        database: 'ForDev'
    };
    
    const conn = await mysql.createConnection(connOptions);
    return conn;
};

const db = initDBConnection().then((dbConn) => dbConn);

export default db;