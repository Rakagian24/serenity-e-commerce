export async function GET(req, { params }) {
  const orderId = params.id;
  const [orders] = await pool.query(
    `SELECT resi, courier FROM orders WHERE id = ?`,
    [orderId]
  );

  if (!orders.length) return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });

  const { resi, courier } = orders[0];
  if (!resi || !courier) return Response.json({ error: "Belum dikirim" }, { status: 400 });

  const fetchRes = await fetch(`https://api.rajaongkir.com/starter/waybill`, {
    method: "POST",
    headers: {
      key: process.env.RAJAONGKIR_API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      waybill: resi,
      courier: courier,
    }),
  });

  const json = await fetchRes.json();
  return Response.json(json.rajaongkir);
}
