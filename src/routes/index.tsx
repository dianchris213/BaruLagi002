import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Home,
  Settings,
  User,
  Wallet,
  Bike,
  Droplets,
  Zap,
  Plus,
  Minus,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Keuangan Dian — Mini App" },
      {
        name: "description",
        content:
          "Pencatatan keuangan pribadi: dompet, tagihan bulanan, dan ringkasan uang dalam satu mini app mobile-first.",
      },
      { property: "og:title", content: "Keuangan Dian — Mini App" },
      {
        property: "og:description",
        content:
          "Dompet, tagihan bulanan interaktif, dan ringkasan uang dalam satu tampilan mobile-first.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- Data & persistence ---------- */

type Bill = { id: string; name: string; amount: number; daysLeft: number; icon: LucideIcon };
type WalletItem = { id: string; name: string; balance: number };
type Profile = { name: string; email: string; password: string };

const DEFAULT_BILLS: Bill[] = [
  { id: "sepeda", name: "Sepeda", amount: 390_000, daysLeft: 5, icon: Bike },
  { id: "air", name: "Air", amount: 75_000, daysLeft: 7, icon: Droplets },
  { id: "listrik", name: "Listrik", amount: 150_000, daysLeft: 10, icon: Zap },
];

const WALLETS: WalletItem[] = [
  { id: "shopee", name: "Driver Shopee", balance: 350_000 },
  { id: "ayah", name: "Keperluan Ayah", balance: 200_000 },
  { id: "ibu", name: "Keperluan Ibu", balance: 150_000 },
];

const LS_BILLS = "miniapp.paidBills";
const LS_PROFILE = "miniapp.profile";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

function loadPaid(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(LS_BILLS) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

function loadProfile(): Profile {
  try {
    const p = JSON.parse(localStorage.getItem(LS_PROFILE) ?? "null") as Profile | null;
    if (p && typeof p.name === "string") return p;
  } catch {
    /* ignore */
  }
  return { name: "Dian", email: "user@email.com", password: "" };
}

/* ---------- App ---------- */

function Index() {
  const [tab, setTab] = useState<"home" | "settings">("home");
  const [paid, setPaid] = useState<Record<string, boolean>>(() =>
    typeof window === "undefined" ? {} : loadPaid(),
  );
  const [profile, setProfile] = useState<Profile>(() =>
    typeof window === "undefined"
      ? { name: "Dian", email: "user@email.com", password: "" }
      : loadProfile(),
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_BILLS, JSON.stringify(paid));
  }, [paid]);

  const markPaid = (id: string) => setPaid((s) => ({ ...s, [id]: true }));

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const unpaidListrik = !paid["listrik"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="relative mx-auto min-h-screen w-full max-w-[480px] pb-24">
        {tab === "home" ? (
          <>
            {/* 1. Header */}
            <header className="flex items-center gap-3 px-5 pt-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-800">
                <User className="size-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">Selamat Datang Kembali</p>
                <p className="text-lg font-bold text-slate-800">{profile.name}</p>
              </div>
              <button
                type="button"
                aria-label="Notifikasi tagihan"
                className="relative flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <Bell className="size-5 text-slate-800" aria-hidden="true" />
                {unpaidListrik && (
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
                )}
              </button>
            </header>

            <main className="space-y-4 px-4 pt-4">
              {/* 2. Notifikasi banner */}
              {unpaidListrik && (
                <div
                  role="alert"
                  className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600"
                >
                  Pengingat: Tagihan Listrik jatuh tempo dalam 10 hari!
                </div>
              )}

              {/* 3. Daftar Dompet */}
              <section aria-label="Daftar Dompet" className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-800">Daftar Dompet</h2>
                <ul className="mt-2 divide-y divide-slate-100">
                  {WALLETS.map((w) => (
                    <li key={w.id} className="flex items-center gap-3 py-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <Wallet className="size-4 text-slate-800" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{w.name}</p>
                        <div className="mt-1 flex gap-2">
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                            <Plus className="size-3" aria-hidden="true" /> Pemasukan
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
                            <Minus className="size-3" aria-hidden="true" /> Pengeluaran
                          </span>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-slate-800">
                        {formatRupiah(w.balance)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 4. Tagihan Bulanan */}
              <section aria-label="Tagihan Bulanan" className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-800">Tagihan Bulanan</h2>
                <ul className="mt-2 divide-y divide-slate-100">
                  {DEFAULT_BILLS.map((b) => {
                    const isPaid = !!paid[b.id];
                    return (
                      <li key={b.id} className="flex items-center gap-3 py-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                          <b.icon className="size-4 text-slate-800" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800">{b.name}</p>
                          <p className="text-xs text-slate-500">{formatRupiah(b.amount)}</p>
                          {!isPaid && (
                            <p className="text-[11px] font-semibold text-rose-500">
                              {b.daysLeft} Hari Lagi
                            </p>
                          )}
                        </div>
                        {isPaid ? (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-500">
                            Lunas
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => markPaid(b.id)}
                            className="shrink-0 rounded-full bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
                          >
                            Bayar
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* 5. Pendapatan Bersih */}
              <section
                aria-label="Pendapatan Bersih"
                className="rounded-2xl bg-white p-5 text-center shadow-sm"
              >
                <p className="text-sm text-slate-500">Pendapatan Bersih Driver</p>
                <p className="mt-1 text-2xl font-bold text-emerald-500">Rp. 50.000</p>
              </section>

              {/* 6. Wallet Summary */}
              <section aria-label="Ringkasan Uang" className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-base font-bold text-slate-800">Ringkasan Uang</h2>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Wallet</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">Rp. 100.000</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Cash</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">Rp. 100.000</p>
                  </div>
                </div>
              </section>
            </main>
          </>
        ) : (
          /* ---------- Halaman Pengaturan ---------- */
          <main className="px-4 pt-8">
            <h1 className="text-xl font-bold text-slate-800">Pengaturan</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola profil akun kamu.</p>

            <form
              onSubmit={saveProfile}
              className="mt-5 space-y-4 rounded-2xl bg-white p-5 shadow-sm"
            >
              <div>
                <label htmlFor="nama" className="text-xs font-semibold text-slate-800">
                  Nama Lengkap
                </label>
                <input
                  id="nama"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-slate-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-semibold text-slate-800">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  type="password"
                  value={profile.password}
                  onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
              >
                Simpan Perubahan
              </button>
              {saved && (
                <p role="status" className="text-center text-xs font-semibold text-emerald-500">
                  Perubahan berhasil disimpan.
                </p>
              )}
            </form>
          </main>
        )}

        {/* 7. Bottom Navigation */}
        <nav
          aria-label="Navigasi utama"
          className="fixed bottom-0 left-1/2 z-10 w-full max-w-[480px] -translate-x-1/2 rounded-t-2xl bg-white shadow-lg"
        >
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setTab("home")}
              aria-current={tab === "home" ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold ${
                tab === "home" ? "text-slate-800" : "text-slate-400"
              }`}
            >
              <Home className="size-5" aria-hidden="true" />
              Home
            </button>
            <button
              type="button"
              onClick={() => setTab("settings")}
              aria-current={tab === "settings" ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-semibold ${
                tab === "settings" ? "text-slate-800" : "text-slate-400"
              }`}
            >
              <Settings className="size-5" aria-hidden="true" />
              Settings
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
