"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, EyeOff, Minus, Plus, Radio, RotateCcw, ShoppingCart, Trash2 } from "lucide-react";
import { createCanteenTransactionAction, previewCanteenCardAction, type CanteenCardPreview } from "@/app/actions/canteen";
import { formatRupiah } from "@/lib/format";
import { SubmitButton } from "@/components/SubmitButton";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

type Product = {
  id: string;
  name: string;
  price: number | string;
  is_active: boolean;
};

type CartItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
};

type PosStep = "products" | "tap" | "pin";

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
    // Plain text KOIN UID is allowed for old/demo cards.
  }
  return clean.startsWith("KOIN-") ? clean : "";
}

function maskUid(uid: string) {
  if (!uid) return "";
  return `•••${uid.slice(-3)}`;
}

function shuffleDigits() {
  return [..."0123456789"].sort(() => Math.random() - 0.5);
}

export function CanteenPos({ products }: { products: Product[] }) {
  const activeProducts = products.filter((product) => product.is_active);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<PosStep>("products");
  const [cardUid, setCardUid] = useState("");
  const [preview, setPreview] = useState<CanteenCardPreview | null>(null);
  const [pin, setPin] = useState("");
  const [digits, setDigits] = useState(() => shuffleDigits());
  const [manualMode, setManualMode] = useState(false);
  const [manualUid, setManualUid] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.subtotal, 0), [cart]);

  function addToCart() {
    const product = activeProducts.find((item) => item.id === productId);
    if (!product) return;
    const price = Number(product.price);
    const nextQty = Math.max(qty, 1);
    setCart((items) => [...items, { product_id: product.id, name: product.name, price, qty: nextQty, subtotal: price * nextQty }]);
    setProductId("");
    setQty(1);
  }

  function startTransaction() {
    if (cart.length === 0 || total <= 0) {
      setNotice("Pilih produk terlebih dahulu sebelum memproses transaksi.");
      return;
    }
    setStep("tap");
    setNotice("Tempelkan kartu siswa untuk membaca data.");
  }

  function resetTransaction() {
    setCart([]);
    setStep("products");
    setCardUid("");
    setManualUid("");
    setPreview(null);
    setPin("");
    setDigits(shuffleDigits());
    setNotice("Transaksi baru siap. Pilih produk terlebih dahulu.");
  }

  function setPreviewFromUid(uid: string) {
    if (!uid) {
      setNotice("Kartu tidak dikenal.");
      return;
    }
    setCardUid(uid);
    setNotice("Kartu terbaca. Mengambil preview data anak...");
    startTransition(async () => {
      const result = await previewCanteenCardAction(uid, total);
      setPreview(result);
      if (!result.ok || !result.can_continue) {
        setNotice(result.reason ?? "Kartu tidak bisa dipakai.");
        return;
      }
      setDigits(shuffleDigits());
      setPin("");
      setStep("pin");
      setNotice(result.warning ?? "Kartu berhasil terbaca. Minta anak memasukkan PIN.");
    });
  }

  async function scanNfc() {
    if (!window.isSecureContext) {
      setNotice("NFC tidak tersedia di browser ini. Gunakan Chrome Android dan HTTPS.");
      return;
    }
    if (!("NDEFReader" in window)) {
      setNotice("NFC tidak tersedia di browser ini. Gunakan Chrome Android dan HTTPS.");
      return;
    }
    setNotice("Membaca kartu... Izinkan akses NFC lalu tempelkan kartu siswa.");
    try {
      const controller = new AbortController();
      const reader = new NDEFReader();
      reader.onreading = (event) => {
        for (const record of event.message.records) {
          const uid = extractCardUid(decodeRecord(record));
          if (uid) {
            controller.abort();
            setPreviewFromUid(uid);
            return;
          }
        }
        controller.abort();
        setNotice("Kartu terbaca, tetapi data KOIN tidak ditemukan.");
      };
      reader.onreadingerror = () => setNotice("Gagal membaca kartu. Tempelkan kartu lagi.");
      await reader.scan({ signal: controller.signal });
    } catch (error) {
      if ((error as Error).name !== "AbortError") setNotice((error as Error).message || "Gagal memulai scan NFC.");
    }
  }

  function appendPin(value: string) {
    if (pin.length >= 8) return;
    setPin((current) => `${current}${value}`);
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-2 sm:grid-cols-4">
        {["Pilih Produk", "Tap Kartu", "Input PIN", "Hasil"].map((label, index) => {
          const active = (step === "products" && index === 0) || (step === "tap" && index === 1) || (step === "pin" && index === 2);
          return <div className={`rounded-2xl border px-4 py-3 text-sm font-black ${active ? "border-mint bg-lilac text-mint" : "border-line bg-white text-ink/50"}`} key={label}>Langkah {index + 1}: {label}</div>;
        })}
      </div>

      {notice ? <div className="rounded-3xl border border-line bg-white p-4 text-sm font-bold text-ink/70">{notice}</div> : null}

      <section className="rounded-3xl bg-lilac/60 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-black text-mint"><ShoppingCart size={18} /> Langkah 1: Pilih Produk</p>
        <div className="grid gap-2 md:grid-cols-[1fr_132px_auto]">
          <select className="field" value={productId} onChange={(event) => setProductId(event.target.value)}>
            <option value="">Pilih produk aktif</option>
            {activeProducts.map((product) => <option value={product.id} key={product.id}>{product.name} - {formatRupiah(Number(product.price))}</option>)}
          </select>
          <div className="flex items-center rounded-2xl border border-line bg-white px-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl bg-lilac text-mint" type="button" onClick={() => setQty((value) => Math.max(value - 1, 1))}><Minus size={16} /></button>
            <input className="w-full border-0 bg-transparent text-center text-sm font-black outline-none" min={1} type="number" value={qty} onChange={(event) => setQty(Number(event.target.value))} />
            <button className="grid h-9 w-9 place-items-center rounded-xl bg-lilac text-mint" type="button" onClick={() => setQty((value) => value + 1)}><Plus size={16} /></button>
          </div>
          <button className="btn-secondary" type="button" onClick={addToCart}>Tambah ke keranjang</button>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="font-black">Keranjang</p>
          <span className="rounded-full bg-gold/25 px-3 py-1 text-xs font-black text-ink">{cart.length} item</span>
        </div>
        {cart.length === 0 ? (
          <div className="mt-3"><EmptyState title="Keranjang kosong" description="Pilih produk dulu. POS normal tidak memakai input UID manual." /></div>
        ) : (
          <div className="mt-3 divide-y divide-line">
            {cart.map((item, index) => (
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-3 text-sm" key={`${item.product_id}-${index}`}>
                <span><strong>{item.name}</strong><br /><span className="text-ink/50">{formatRupiah(item.price)} x {item.qty}</span></span>
                <span className="font-black">{formatRupiah(item.subtotal)}</span>
                <button className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600" type="button" onClick={() => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label="Hapus item"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-gold/25 p-4">
          <p className="text-sm font-black">Total transaksi: <span className="text-2xl">{formatRupiah(total)}</span></p>
          <button className="btn-primary" type="button" onClick={startTransaction}>Proses Transaksi</button>
        </div>
      </section>

      {step !== "products" ? (
        <section className="rounded-3xl bg-ink p-5 text-white">
          <p className="flex items-center gap-2 text-sm font-black text-gold"><Radio size={18} /> Langkah 2: Tap Kartu Siswa</p>
          <p className="mt-2 text-sm text-white/65">Kantin tidak perlu melihat UID kartu. UID hanya dipakai internal untuk validasi server.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn-primary" type="button" onClick={scanNfc} disabled={isPending}>{isPending ? "Membaca kartu..." : "Scan Kartu NFC"}</button>
            <button className="btn-secondary" type="button" onClick={() => setManualMode((value) => !value)}><EyeOff size={16} /> Mode uji / UID manual</button>
          </div>
          {manualMode ? (
            <div className="mt-4 grid gap-2 rounded-3xl bg-white/10 p-4 sm:grid-cols-[1fr_auto]">
              <input className="field text-ink" value={manualUid} onChange={(event) => setManualUid(event.target.value)} placeholder="UID manual untuk demo/dev" />
              <button className="btn-secondary" type="button" onClick={() => setPreviewFromUid(manualUid)}>Gunakan UID Uji</button>
            </div>
          ) : null}
          {cardUid ? <p className="mt-3 text-xs font-semibold text-white/60">UID internal: {maskUid(cardUid)}</p> : null}
        </section>
      ) : null}

      {preview ? (
        <section className={`rounded-3xl border p-5 ${preview.ok ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-black">{preview.ok ? <CheckCircle2 size={20} /> : null}{preview.ok ? "Kartu terbaca" : "Kartu tidak valid"}</p>
            <StatusBadge status={preview.card_status ?? (preview.ok ? "active" : "failed")} />
          </div>
          {preview.ok ? (
            <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <p>Nama Anak: <strong>{preview.child_name}</strong></p>
              <p>Kelas: <strong>{preview.grade ?? "-"}</strong></p>
              <p>Sekolah: <strong>{preview.school_name ?? "-"}</strong></p>
              <p>Sisa Limit Hari Ini: <strong>{formatRupiah(Number(preview.remaining_limit_today ?? 0))}</strong></p>
            </div>
          ) : <p className="mt-3 text-sm font-semibold text-red-700">{preview.reason}</p>}
          {preview.warning ? <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-700">{preview.warning}</p> : null}
        </section>
      ) : null}

      {step === "pin" && preview?.can_continue ? (
        <form action={createCanteenTransactionAction} className="grid gap-4 rounded-3xl border border-line bg-white p-5">
          <input type="hidden" name="cart_items" value={JSON.stringify(cart)} />
          <input type="hidden" name="card_uid" value={cardUid} />
          <input type="hidden" name="pin" value={pin} />
          <p className="text-sm font-black text-mint">Langkah 3: Masukkan PIN Anak</p>
          <div className="rounded-3xl bg-lilac/60 p-4 text-center">
            <p className="text-3xl tracking-[0.45em]">{pin ? "•".repeat(pin.length) : "••••"}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {digits.map((digit) => <button className="rounded-2xl border border-line bg-white p-4 text-xl font-black shadow-sm" type="button" onClick={() => appendPin(digit)} key={digit}>{digit}</button>)}
            <button className="btn-secondary" type="button" onClick={() => setPin((value) => value.slice(0, -1))}>Hapus</button>
            <button className="btn-secondary" type="button" onClick={() => setPin("")}>Bersihkan</button>
          </div>
          <SubmitButton className="btn-primary w-full" pendingText="Memproses transaksi...">Proses Pembayaran</SubmitButton>
          <button className="btn-secondary w-full" type="button" onClick={resetTransaction}><RotateCcw size={16} /> Transaksi Baru</button>
        </form>
      ) : null}
    </div>
  );
}
