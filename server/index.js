import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Es recomendable usar variables de entorno para el token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-4419716397229857-031914-b5f0878b92176088c433afb031c2c8d8-2190588468'
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [{
        title: req.body.title,
        quantity: Number(req.body.quantity),
        unit_price: Number(req.body.price),
        currency_id: "COP"
      }],
      back_urls: {
        success: "https://eltiempo.com",
        failure: "https://eltiempo.com",
        pending: "https://eltiempo.com"
      },
      auto_return: "approved"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

// Exporta la app para que Vercel la use como función serverless
export default app;
