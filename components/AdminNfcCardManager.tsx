"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PenLine, Radio, RefreshCw, Wand2 } from "lucide-react";
import { rewriteCardAction } from "@/app/actions/admin";
import { formatStatus } from "@/lib/labels";

type ChildOption = {
  id: string;
  name: string;
};

function decodeRecord(record: NDEFRecord) {
  if (!record.data) return "";
  const view = record.data instanceof DataView ? record.data : new DataView(record.data);
  return new TextDecoder(record.encoding || "utf-8").decode(view);
}

function extractCardUid(text: string) {
  const clean = text.trim();
  if (!clean) return "";
  try {
    const parsed = JSON.parse(clean) as { card_uid?: unknown };
    if (typeof parsed.card_uid === "string") return parsed.card_uid.trim();
  } catch {
    // Plain text KOIN UID is accepted for older/demo cards.
  }
  return clean.startsWith("KOIN-") ? clean : "";
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toUpperCase()
    .slice(0, 18) || "CARD";
}

function nfcSupportError() {
  if (!window.isSecureContext) return "NFC membutuhkan HTTPS atau localhost.";
  if (!("NDEFReader" in window)) return "Browser/HP tidak mendukung NFC. Gunakan Chrome Android atau input manual.";
  return "";
}

async function readNfcUid() {
  const supportError = nfcSupportError();
  if (supportError) throw new Error(supportError);
  return await new Promise<string>((resolve, reject) => {
    const controller = new AbortController();
    const reader = new NDEFReader();
    reader.onreading = (event) => {
      for (const record of event.message.records) {
        const uid = extractCardUid(decodeRecord(record));
        if (uid) {
          controller.abort();
          resolve(uid);
          return;
        }
      }
      controller.abort();
      reject(new Error("Kartu terbaca, tetapi tidak ada UID Kartu KOIN."));
    };
    reader.onreadingerror = () => reject(new Error("Gagal membaca kartu. Coba tempelkan kartu lagi."));
    reader.scan({ signal: controller.signal }).catch(reject);
  });
}

async function writeNfcUid(card_uid: string) {
  const supportError = nfcSupportError();
  if (supportError) throw new Error(supportError);
  const reader = new NDEFReader();
  await reader.write({ records: [{ recordType: "text", data: JSON.stringify({ card_uid }) }] });
}

export function AdminNfcCardManager({ childOptions }: { childOptions: ChildOption[] }) {
  const router = useRouter();
  const [childId, setChildId] = useState("");
  const [oldCardUid, setOldCardUid] = useState("");
  const [newCardUid, setNewCardUid] = useState("");
  const [cardLabel, setCardLabel] = useState("");
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedChild = childOptions.find((child) => child.id === childId);

  function generateUid() {
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    setNewCardUid(`KOIN-${makeSlug(selectedChild?.name ?? "CARD")}-${random}`);
    setMessage("UID baru dibuat. Tulis ke NFC lalu sinkronkan database.");
  }

  function scanExistingCard() {
    setMessage("Izinkan akses NFC lalu tempelkan kartu lama.");
    startTransition(async () => {
      try {
        const uid = await readNfcUid();
        setOldCardUid(uid);
        if (!newCardUid) setNewCardUid(uid);
        setMessage(`Kartu lama terbaca: ${uid}`);
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  function scanAndSync() {
    setMessage("Scan kartu yang sudah tertulis untuk sinkronisasi database.");
    startTransition(async () => {
      try {
        const uid = await readNfcUid();
        setNewCardUid(uid);
        const result = await rewriteCardAction({
          old_card_uid: oldCardUid,
          new_card_uid: uid,
          child_id: childId,
          card_label: cardLabel,
          status,
          confirmed: true,
          write_confirmed: true
        });
        setMessage(result.message);
        if (result.ok) router.refresh();
      } catch (error) {
        setMessage((error as Error).message);
      }
    });
  }

  function writeRewriteAndSync() {
    if (!childId || !newCardUid) {
      setMessage("Pilih anak dan isi/generate UID Kartu baru terlebih dahulu.");
      return;
    }
    setMessage("Memvalidasi kartu sebelum rewrite...");
    startTransition(async () => {
      let confirmed = false;
      const validation = await rewriteCardAction({
        old_card_uid: oldCardUid,
        new_card_uid: newCardUid,
        child_id: childId,
        card_label: cardLabel,
        status,
        write_confirmed: false
      });
      if (validation.needs_confirmation) {
        confirmed = window.confirm(validation.message);
        if (!confirmed) {
          setMessage("Rewrite dibatalkan.");
          return;
        }
      } else if (!validation.ok) {
        setMessage(validation.message);
        return;
      }

      try {
        setMessage("Izinkan akses NFC lalu tempelkan kartu NTAG213 untuk rewrite.");
        await writeNfcUid(newCardUid);
      } catch (error) {
        setMessage((error as Error).message || "Gagal menulis NFC.");
        return;
      }

      const result = await rewriteCardAction({
        old_card_uid: oldCardUid,
        new_card_uid: newCardUid,
        child_id: childId,
        card_label: cardLabel,
        status,
        confirmed,
        write_confirmed: true
      });

      if (!result.ok) {
        setMessage(`Kartu berhasil ditulis, tetapi database gagal diperbarui. ${result.message} Silakan scan kartu dan sinkronkan ulang.`);
        return;
      }

      setOldCardUid(newCardUid);
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <section className="panel mb-5 grid gap-4 rounded-lg p-5">
      <div>
        <h2 className="text-lg font-black">Scan / Tulis / Rewrite Kartu NFC</h2>
        <p className="mt-1 text-sm text-ink/60">Rewrite NFC akan menulis NDEF dan menyinkronkan UID Kartu di Supabase. Jika database gagal, gunakan Scan & Sync.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <select className="field" value={childId} onChange={(event) => setChildId(event.target.value)} required>
          <option value="">Pilih anak</option>
          {childOptions.map((child) => <option value={child.id} key={child.id}>{child.name}</option>)}
        </select>
        <input className="field" value={oldCardUid} onChange={(event) => setOldCardUid(event.target.value)} placeholder="UID Kartu lama opsional" />
        <input className="field" value={newCardUid} onChange={(event) => setNewCardUid(event.target.value)} placeholder="UID Kartu baru" />
        <input className="field" value={cardLabel} onChange={(event) => setCardLabel(event.target.value)} placeholder="Label Kartu" />
        <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="active">{formatStatus("active")}</option>
          <option value="frozen">{formatStatus("frozen")}</option>
          <option value="blocked">{formatStatus("blocked")}</option>
          <option value="replaced">{formatStatus("replaced")}</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" type="button" onClick={generateUid} disabled={isPending}><Wand2 size={16} /> Generate UID KOIN</button>
        <button className="btn-secondary" type="button" onClick={scanExistingCard} disabled={isPending}>
          {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Radio size={16} />}
          {isPending ? "Memindai..." : "Scan Kartu Lama"}
        </button>
        <button className="btn-primary" type="button" onClick={writeRewriteAndSync} disabled={isPending}>
          {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <PenLine size={16} />}
          {isPending ? "Menulis & sinkron..." : "Tulis / Rewrite NFC + Sync DB"}
        </button>
        <button className="btn-secondary" type="button" onClick={scanAndSync} disabled={isPending}>
          {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <RefreshCw size={16} />}
          {isPending ? "Sinkronisasi..." : "Scan & Sync Kartu NFC"}
        </button>
      </div>
      <div className={`rounded-3xl border px-4 py-3 text-sm font-semibold ${message.includes("gagal") || message.includes("dibatalkan") || message.includes("tidak") ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
        {message || "Tempelkan kartu NTAG213 ke belakang HP saat diminta. Admin tetap boleh melihat UID Kartu lengkap."}
      </div>
    </section>
  );
}
