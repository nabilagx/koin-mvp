import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { markTopupStatusByOrderId, settleTopupOnce } from "@/lib/topup-settlement";

type MidtransNotification = {
  order_id?: string;
  transaction_status?: string;
  fraud_status?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
};

function verifySignature(payload: MidtransNotification, serverKey: string) {
  if (!payload.order_id || !payload.status_code || !payload.gross_amount || !payload.signature_key) return false;
  const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
  const signature = createHash("sha512").update(raw).digest("hex");
  return signature === payload.signature_key;
}

export async function POST(request: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return NextResponse.json({ ok: false, message: "MIDTRANS_SERVER_KEY belum dikonfigurasi." }, { status: 500 });

  const payload = await request.json() as MidtransNotification;
  if (!verifySignature(payload, serverKey)) {
    return NextResponse.json({ ok: false, message: "Signature Midtrans tidak valid." }, { status: 401 });
  }

  const order_id = payload.order_id;
  if (!order_id) return NextResponse.json({ ok: false, message: "order_id kosong." }, { status: 400 });

  const transaction_status = payload.transaction_status;
  const fraud_status = payload.fraud_status;

  try {
    if (transaction_status === "settlement" || (transaction_status === "capture" && fraud_status === "accept")) {
      const result = await settleTopupOnce({
        input: { order_id },
        actor_user_id: null,
        audit_action: "MIDTRANS_WEBHOOK_SETTLEMENT"
      });
      return NextResponse.json({ ok: true, message: result.message });
    }

    if (transaction_status === "expire") {
      await markTopupStatusByOrderId(order_id, "expired");
      return NextResponse.json({ ok: true, message: "Top-up expired." });
    }

    if (["cancel", "deny"].includes(transaction_status ?? "")) {
      await markTopupStatusByOrderId(order_id, "cancelled");
      return NextResponse.json({ ok: true, message: "Top-up cancelled." });
    }

    if (["failure"].includes(transaction_status ?? "")) {
      await markTopupStatusByOrderId(order_id, "failed");
      return NextResponse.json({ ok: true, message: "Top-up failed." });
    }

    return NextResponse.json({ ok: true, message: "Status Midtrans belum mengubah saldo." });
  } catch (error) {
    return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 500 });
  }
}
