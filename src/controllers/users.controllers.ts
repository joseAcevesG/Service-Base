// cspell:disable
import { Request, Response } from "express";
import { Twilio } from "twilio";
import { v4 as uuidv4 } from "uuid";
import client from "../models/user";
import { User } from "../types";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const clientTwilio = new Twilio(accountSid, authToken);

class ClientController {
	getAll(req: Request, res: Response) {
		client
			.getAll()
			.then((clients) => {
				res.json(clients);
			})
			.catch(() => {
				res.status(500).send("Error al procesar la solicitud");
			});
	}

	get(req: Request, res: Response) {
		const { id } = req.params;
		client
			.get(id)
			.then((client) => {
				res.json(client);
			})
			.catch((error) => {
				console.log(error.message);
				if (error.message === "Cliente no encontrado") {
					res.status(404).send(error.message);
					return;
				}
				res.status(500).send("Error al procesar la solicitud");
			});
	}

	create(req: Request, res: Response) {
		const data: User = {
			id: uuidv4(),
			name: req.body.name,
			phone: req.body.phone,
		};

		client
			.create(data)
			.then((client) => {
				res.status(201).send(`Cliente creado con ID: ${client.id}`);
			})
			.catch(() => {
				res.status(500).send("Error al procesar la solicitud");
			});
	}

	update(req: Request, res: Response) {
		const { id } = req.params;
		const data: User = {
			id,
			name: req.body.name,
			phone: req.body.phone,
		};

		client
			.update(data)
			.then((client) => {
				res.send(`Cliente actualizado con ID: ${client.id}`);
			})
			.catch((error) => {
				if (error.message === "Cliente no encontrado") {
					res.status(404).send(error.message);
					return;
				}
				res.status(500).send("Error al procesar la solicitud");
			});
	}

	delete(req: Request, res: Response) {
		const { id } = req.params;
		client
			.delete(id)
			.then(() => {
				res.send(`Cliente eliminado con ID: ${id}`);
			})
			.catch(() => {
				res.status(500).send("Error al procesar la solicitud");
			});
	}

	callUser(req: Request, res: Response) {
		const { id } = req.params;
		client
			.get(id)
			.then((client) => {
				return clientTwilio.calls.create({
					url: "http://demo.twilio.com/docs/voice.xml",
					to: client.phone,
					from: twilioNumber,
				});
			})
			.then((call) => {
				res.send(`Llamada realizada con ID: ${call.sid}`);
			})
			.catch((error) => {
				if (error.message === "Cliente no encontrado") {
					res.status(404).send(error.message);
					return;
				}
				res.status(500).send("Error al procesar la solicitud");
			});
	}
}

export default new ClientController();
