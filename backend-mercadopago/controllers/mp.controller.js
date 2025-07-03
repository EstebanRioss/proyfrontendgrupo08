const axios = require("axios");
const crypto = require("crypto"); 
const mpCtrl = {};

mpCtrl.getPaymentlink = async (req, res) => {
  try {
    const { title, description, image, price } = req.body;

    const url = "https://api.mercadopago.com/checkout/preferences";
    const body = {
      items: [{
        title,
        description,
        picture_url: image,
        category_id: "general",
        quantity: 1,
        unit_price: price
      }],
      back_urls: {
        failure: "http://localhost:4200/pago/fallido",
        pending: "http://localhost:4200/pago/pendiente",
        success: "http://localhost:4200/pago/exitoso"
      },
      external_reference: `GENERICO-${Date.now()}`
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return res.status(200).json(payment.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: true, msg: "Error al crear pago" });
  }
};

mpCtrl.buyTicket = async (req, res) => {
  try {
    const {
      event_name,
      event_description,
      ticket_price,
      quantity,
      image_url
    } = req.body;

    const url = "https://api.mercadopago.com/checkout/preferences";

    const body = {
      items: [
        {
          title: `Entrada para ${event_name}`,
          description: event_description,
          picture_url: image_url,
          category_id: "tickets",
          quantity: quantity,
          unit_price: ticket_price
        }
      ],
      back_urls: {
        failure: "http://localhost:4200/pago/fallido",
        pending: "http://localhost:4200/pago/pendiente",
        success: "http://localhost:4200/pago/exitoso"
      },
      external_reference: `EVENTO-${Date.now()}`
    };

    const ticket = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return res.status(200).json(ticket.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      error: true,
      msg: "Error al generar enlace de compra de boletos"
    });
  }
};
mpCtrl.receiveWebhook = async (req, res) => {
  const signature = req.get("x-signature");
  const dataId = req.query["data.id"]; 
  const webhookType = req.query.type;
  const [ts, hash] = signature.split(",");
  const secret = process.env.WEBHOOK_SECRET; 
  if (!signature || !dataId) {
      return res.status(400).send("Faltan datos para la validación.");
  }
  if (!secret) {
    console.error("WEBHOOK_SECRET no está definido.");
    return res.status(400).send("Webhook secret not configured.");
  }
  
  const manifest = `data_id:${dataId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const expectedHash = hmac.digest("hex");
  
  if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))) {
    console.error("Firma de Webhook inválida.");
    return res.status(400).send("Invalid signature");
  }


  console.log("Notificación recibida y validada con éxito.");
  const { type, data } = req.body;

  if (webhookType === "payment") {
    try {
      const paymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${dataId}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      });

      const payment = paymentInfo.data;
      console.log("Información del pago:", payment);

    } catch (error) {
      console.error("Error al procesar webhook:", error);
      return res.status(500).send("Error procesando notificación");
    }
  }

  res.status(200).send("ok");
};

module.exports = mpCtrl;