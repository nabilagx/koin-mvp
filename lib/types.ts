export type Role = "ADMIN" | "PARENT" | "CHILD" | "CANTEEN";
export type Status = "active" | "inactive" | "pending" | "suspended" | "blocked" | "frozen" | "success" | "failed" | "approved" | "rejected";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  role: Role;
  status: string;
  created_at: string;
};

export type ChildSummary = {
  id: string;
  parent_id: string;
  user_id: string;
  name: string;
  email: string;
  school_name: string | null;
  grade: string | null;
  daily_limit: number;
  card_uid: string | null;
  card_id: string | null;
  card_label: string | null;
  card_status: string | null;
  balance: number;
};

export type ParentRow = {
  id: string;
  user_id: string;
  phone: string | null;
  address_optional: string | null;
  created_at: string;
};

export type CanteenRow = {
  id: string;
  user_id: string;
  canteen_name: string;
  owner_name: string;
  school_name: string | null;
  phone: string | null;
  has_nfc_device: boolean;
  status: string;
  created_at: string;
};

export type TransactionRow = {
  id: string;
  child_id: string | null;
  canteen_id: string | null;
  card_id: string | null;
  amount: number;
  status: string;
  failure_reason: string | null;
  created_at: string;
};
