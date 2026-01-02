import mysql from "mysql2/promise";
import { serverConfig } from "./serverConfig";

const pool = mysql.createPool({
  host: serverConfig.db.host,
  user: serverConfig.db.user,
  password: serverConfig.db.password,
  database: serverConfig.db.name,
  port: serverConfig.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
