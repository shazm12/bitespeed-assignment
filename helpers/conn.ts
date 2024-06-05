import mysql, { ConnectionOptions } from 'mysql2';

const connOptions: ConnectionOptions = { 
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'ForDev'
};

const conn = mysql.createConnection(connOptions);


conn.connect((err: mysql.QueryError | null) => {
    if(err) {
        console.error("Error in connection"+ err.stack);
        return;
    }
    console.log('Connected as id ' + conn.threadId);
    
});



export default conn;
