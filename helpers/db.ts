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
    console.log("DB connection established!");
    return conn;
};


export default initDBConnection;