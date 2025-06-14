const crypto = require("crypto");

const order_id = "ORDER-16-1749898757205";
const status_code = "200";
const gross_amount = "189000.00";
const serverKey = "SB-Mid-server-OjFxIdMj7F43Tga4Riyj8jAT";

const signature = crypto
  .createHash("sha512")
  .update(order_id + status_code + gross_amount + serverKey)
  .digest("hex");

console.log("Signature Key:", signature);
