require('dotenv').config();
const crypto = require("crypto");

const order_id = "ORDER-26-1750014743885";
const status_code = "200";
const gross_amount = "249000.00";
const serverKey = process.env.MIDTRANS_SERVER_KEY;

console.log("Server Key:", serverKey);
console.log("Is undefined?", serverKey === undefined);
console.log("Env Key (from process.env):", process.env.MIDTRANS_SERVER_KEY);


const signature = crypto
  .createHash("sha512")
  .update(order_id + status_code + gross_amount + serverKey)
  .digest("hex");

console.log("Signature Key:", signature);
