"use client";

import { useState } from "react";
import { PenLine, Radio, Wand2 } from "lucide-react";

function readInput(inputId: string) {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  return input?.value.trim() ?? "";
}

function writeInput(inputId: string, value: string) {
  const input = document.getElementById(inputId) as HTMLInputElement | null;
  if (!input) return;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

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
    // Plain text cards are accepted for MVP fallback.
  }
  if (clean.startsWith("KOIN-")) return clean;
  return "";
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

export function WebNfcCardTools({
  inputId,
  childSelectId,
  allowGenerate = false,
  allowWrite = false,
  compact = false
}: {
  inputId: string;
  childSelectId?: string;
  allowGenerate?: boolean;
  allowWrite?: boolean;
  compact?: boolean;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  function getSupportError() {
    if (!window.isSecureContext) return "Web NFC butuh HTTPS atau localhost.";
    if (!("NDEFReader" in window)) return "NFC belum didukung di browser ini. Gunakan Chrome Android atau input manual UID.";
    return "";
  }

  function generateUid() {
    const select = childSelectId ? document.getElementById(childSelectId) as HTMLSelectElement | null : null;
    const selectedName = select?.selectedOptions?.[0]?.textContent ?? "CARD";
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    const uid = `KOIN-${makeSlug(selectedName)}-${random}`;
    writeInput(inputId, uid);
    setStatus(`UID dibuat: ${uid}`);
  }

  async function scan() {
    const error = getSupportError();
    if (error) {
      setStatus(error);
      return;
    }
    setBusy(true);
    setStatus("Izinkan akses NFC lalu tempelkan kartu NTAG213 ke belakang HP.");
    try {
      const controller = new AbortController();
      const reader = new NDEFReader();
      reader.onreading = (event) => {
        for (const record of event.message.records) {
          const uid = extractCardUid(decodeRecord(record));
          if (uid) {
            writeInput(inputId, uid);
            setStatus(`UID kartu terbaca: ${uid}`);
            controller.abort();
            setBusy(false);
            return;
          }
        }
        setStatus("Kartu terbaca, tetapi tidak ada card_uid KOIN di NDEF.");
        controller.abort();
        setBusy(false);
      };
      reader.onreadingerror = () => {
        setStatus("Gagal membaca kartu. Coba tempelkan kartu lagi.");
        setBusy(false);
      };
      await reader.scan({ signal: controller.signal });
    } catch (error) {
      if ((error as Error).name !== "AbortError") setStatus((error as Error).message || "Gagal memulai scan NFC.");
      setBusy(false);
    }
  }

  async function write() {
    const error = getSupportError();
    if (error) {
      setStatus(error);
      return;
    }
    const card_uid = readInput(inputId);
    if (!card_uid) {
      setStatus("Isi atau generate card_uid dulu sebelum menulis kartu.");
      return;
    }
    setBusy(true);
    setStatus("Izinkan akses NFC lalu tempelkan kartu NTAG213 ke belakang HP.");
    try {
      const reader = new NDEFReader();
      await reader.write({ records: [{ recordType: "text", data: JSON.stringify({ card_uid }) }] });
      setStatus("Kartu berhasil ditulis.");
    } catch (error) {
      setStatus((error as Error).message || "Gagal menulis kartu NFC.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={compact ? "grid gap-2" : "rounded-3xl border border-line bg-lilac/50 p-4"}>
      {!compact ? <p className="mb-3 text-sm font-black text-mint">Scan/Tulis Kartu NFC</p> : null}
      <div className="flex flex-wrap gap-2">
        {allowGenerate ? <button className="btn-secondary" type="button" onClick={generateUid}><Wand2 size={16} /> Generate UID KOIN</button> : null}
        <button className="btn-secondary" type="button" disabled={busy} onClick={scan}><Radio size={16} /> {busy ? "Menunggu kartu..." : "Scan NFC"}</button>
        {allowWrite ? <button className="btn-primary" type="button" disabled={busy} onClick={write}><PenLine size={16} /> Write to NFC Card</button> : null}
      </div>
      <p className="mt-3 text-xs font-semibold text-ink/60">{status || "Tempelkan kartu NTAG213 ke belakang HP. Input manual UID tetap tersedia untuk demo laptop."}</p>
    </div>
  );
}
