const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  PARENT: "Orang Tua",
  CHILD: "Anak",
  CANTEEN: "Kantin"
};

const statusLabels: Record<string, string> = {
  ADMIN: "Admin",
  PARENT: "Orang Tua",
  CHILD: "Anak",
  CANTEEN: "Kantin",
  active: "Aktif",
  inactive: "Tidak Aktif",
  pending: "Menunggu",
  suspended: "Ditangguhkan",
  blocked: "Diblokir",
  frozen: "Dibekukan",
  replaced: "Diganti",
  success: "Berhasil",
  failed: "Gagal",
  refunded: "Dikoreksi",
  settlement: "Berhasil",
  expired: "Kedaluwarsa",
  cancelled: "Dibatalkan",
  open: "Terbuka",
  in_review: "Ditinjau",
  resolved: "Selesai",
  rejected: "Ditolak",
  approved: "Disetujui",
  completed: "Selesai",
  closed: "Ditutup",
  partial: "Sebagian",
  "Coming Soon": "Segera Hadir",
  "Belum ada": "Belum Ada",
  "Belum punya kartu": "Belum Punya Kartu"
};

const entityLabels: Record<string, string> = {
  users: "Pengguna",
  parents: "Orang Tua",
  children: "Anak",
  canteens: "Kantin",
  cards: "Kartu",
  transactions: "Transaksi",
  transaction_items: "Item Transaksi",
  topup_transactions: "Top Up",
  support_reports: "Laporan Kendala",
  audit_logs: "Log Aktivitas",
  savings_pockets: "Celengan",
  saving_requests: "Pengajuan Pencairan",
  missions: "Misi",
  products: "Produk",
  wallets: "Saldo"
};

const fieldLabels: Record<string, string> = {
  daily_limit: "Limit Harian",
  remaining_limit_today: "Sisa Limit Hari Ini",
  balance: "Saldo",
  card_uid: "UID Kartu",
  card_label: "Label Kartu",
  child: "Anak",
  children: "Anak",
  parent: "Orang Tua",
  parents: "Orang Tua",
  canteen: "Kantin",
  canteens: "Kantin",
  saving_request: "Pengajuan Pencairan",
  saving_requests: "Pengajuan Pencairan",
  savings_pocket: "Celengan",
  savings_pockets: "Celengan",
  mission: "Misi",
  missions: "Misi",
  product: "Produk",
  products: "Produk",
  amount: "Nominal",
  status: "Status",
  failure_reason: "Alasan Gagal",
  created_at: "Waktu Dibuat",
  updated_at: "Waktu Diperbarui",
  school_name: "Sekolah",
  grade: "Kelas",
  order_id: "ID Pesanan"
};

const actionLabels: Record<string, string> = {
  assign_card: "Pasang Kartu",
  create_child: "Buat Anak",
  create_savings_pocket: "Buat Celengan",
  create_mission: "Buat Misi",
  update_child_pin: "Ubah PIN Anak",
  update_child_profile: "Ubah Profil Anak",
  update_card_status: "Ubah Status Kartu",
  update_canteen_status: "Ubah Status Kantin",
  set_daily_limit: "Ubah Limit Harian",
  top_up_wallet: "Top Up Saldo",
  move_to_savings: "Pindah ke Celengan",
  review_saving_request: "Tinjau Pengajuan Pencairan",
  approve_mission: "Setujui Misi",
  submit_mission: "Kirim Misi",
  RESET_CHILD_PIN: "Reset PIN Anak",
  UPDATE_CHILD_PROFILE: "Ubah Profil Anak",
  ADMIN_UPDATE_CHILD_PROFILE: "Ubah Profil Anak",
  TOPUP_SETTLEMENT_SIMULATION: "Simulasi Pembayaran Berhasil",
  REWRITE_NFC_CARD: "Tulis Ulang Kartu NFC",
  REASSIGN_NFC_CARD: "Pindahkan Kartu NFC",
  REQUEST_CARD: "Ajukan Kartu",
  REVIEW_SUPPORT_REPORT: "Tinjau Laporan Kendala"
};

export function formatRole(role?: string | null) {
  if (!role) return "-";
  return roleLabels[role] ?? role;
}

export function formatStatus(status?: string | null) {
  if (!status) return "-";
  return statusLabels[status] ?? status.replace(/_/g, " ");
}

export function formatEntityName(entity?: string | null) {
  if (!entity) return "-";
  return entityLabels[entity] ?? entity.replace(/_/g, " ");
}

export function formatFieldLabel(field?: string | null) {
  if (!field) return "-";
  return actionLabels[field] ?? fieldLabels[field] ?? field.replace(/_/g, " ");
}
