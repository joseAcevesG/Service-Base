import { ResultSetHeader } from "mysql2";
import { User as UserType } from "../types";
import pool from "../utils/mySQL";

class User {
	create(client: UserType): Promise<UserType> {
		const sql = "INSERT INTO USERS (id, name, phone) VALUES (?, ?, ?)";

		return pool
			.query<ResultSetHeader>(sql, [client.id, client.name, client.phone])
			.then((result) => {
				return { ...client };
			})
			.catch((error) => {
				console.error(`Error creando usuario: ${error.message}`);
				return Promise.reject(
					new Error(`Error creando usuario: ${error.message}`),
				);
			});
	}

	update(client: UserType): Promise<UserType> {
		const sql = "UPDATE USERS SET name = ?, phone = ? WHERE id = ?";

		return pool
			.query<ResultSetHeader>(sql, [client.name, client.phone, client.id])
			.then((result) => {
				if (result.affectedRows === 0) {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				return client;
			})
			.catch((error) => {
				if (error.message.includes("ER_BAD_FIELD_ERROR")) {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				if (error.message === "Usuario no encontrado") {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				return Promise.reject(
					new Error(`Error actualizando usuario: ${error.message}`),
				);
			});
	}

	delete(id: string): Promise<void> {
		const sql = "DELETE FROM USERS WHERE id = ?";

		return pool
			.query(sql, [id])
			.then(() => {
				return; // No se devuelve nada
			})
			.catch((error) => {
				return Promise.reject(
					new Error(`Error eliminando usuario: ${error.message}`),
				);
			});
	}

	getAll(): Promise<UserType[]> {
		const sql = "SELECT id, name, phone FROM USERS";

		return pool
			.query(sql)
			.then((rows) => {
				return rows as UserType[];
			})
			.catch((error) => {
				return Promise.reject(
					new Error(`Error obteniendo usuarios: ${error.message}`),
				);
			});
	}

	get(id: string): Promise<UserType> {
		const sql = "SELECT id, name, phone FROM USERS WHERE id = ?";

		return pool
			.query(sql, [id])
			.then((rows) => {
				if (rows.length === 0) {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				return rows[0] as UserType;
			})
			.catch((error) => {
				if (error.message.includes("ER_BAD_FIELD_ERROR")) {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				if (error.message === "Usuario no encontrado") {
					return Promise.reject(new Error("Usuario no encontrado"));
				}
				return Promise.reject(
					new Error(`Error obteniendo usuario: ${error.message}`),
				);
			});
	}
}

export default new User();
