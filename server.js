// server.js
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

// Coloca aqui a tua connection string do MongoDB
const uri = "mongodb+srv://joaopsb1222_db_user:<db_password>@cluster0.xj8ss3u.mongodb.net/game?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let collection;

async function start() {
    try {
        await client.connect();
        const db = client.db("game");
        collection = db.collection("players");
        console.log("MongoDB conectado");
    } catch (err) {
        console.error("Erro ao conectar MongoDB:", err);
    }
}

start();

// === Rotas ===

// Guardar posição do jogador
app.post("/save", async (req, res) => {
    try {
        const player = req.body;
        await collection.updateOne(
            { id: "player1" }, 
            { $set: player }, 
            { upsert: true }
        );
        res.json({ status: "ok" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "erro" });
    }
});

// Carregar posição do jogador
app.get("/load", async (req, res) => {
    try {
        const player = await collection.findOne({ id: "player1" });
        res.json(player || { x: 100, y: 100 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ x: 100, y: 100 });
    }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
