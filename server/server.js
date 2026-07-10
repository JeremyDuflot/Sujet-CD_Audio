require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cdRoutes = require("./Routes/cdRoutes");

const app = express();

app.disable("x-powered-by"); 
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", cdRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));