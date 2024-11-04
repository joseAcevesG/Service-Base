import path from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
import routes from "./routes";

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

app.use(routes);
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(port, () => {
	console.log(`App running in port ${port}`);
});
