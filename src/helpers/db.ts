import { ConnectionOptions } from "mysql2";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import fs from "fs";

dotenv.config();

const initDBConnection = async () => {
  const connOptions: ConnectionOptions = {
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT
      ? parseInt(process.env.MYSQL_DB_PORT, 10)
      : undefined,
    user: process.env.MYSQL_DB_USERNAME,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    ssl: {
      ca: fs.readFileSync(process.env.MYSQL_SSL_CA as string),
    },
  };

  const conn = await mysql.createConnection(connOptions);
  return conn;
};

export default initDBConnection;
