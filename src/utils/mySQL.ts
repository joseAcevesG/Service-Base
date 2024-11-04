import mariadb from "mariadb";

const pool = mariadb.createPool({
	host: process.env.MYSQL_HOST || "localhost",
	user: process.env.MySQL_USER,
	password: process.env.MySQL_PASSWORD,
	database: process.env.MySQL_DATABASE,
});

export default pool;
