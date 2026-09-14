import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Bike,
  Droplet,
  Receipt,
  Repeat,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catatan Keuangan Dian — Ringkasan Harian" },
      {
        name: "description",
        content:
          "Pantau transaksi terbaru, tagihan bulanan, pendapatan bersih, dan saldo wallet serta cash dalam satu tampilan sederhana.",
      },
      { property: "og:title", content: "Catatan Keuangan Dian — Ringkasan Harian" },
      {
        property: "og:description",
        content:
          "Transaksi terbaru, tagihan bulanan, dan ringkasan uang dalam satu halaman mobile-first.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const transactions = [
  { name: "Drivers Shopee", total: "Rp. 10.000", at: "2026-09-14T09:15:00+07:00" },
  { name: "Keperluan Ayah", total: "Rp. 10.000", at: "2026-09-13T19:40:00+07:00" },
  { name: "Keperluan Ibu", total: "Rp. 10.000", at: "2026-09-12T08:05:00+07:00" },
];

const bills = [
  { name: "Sepeda", icon: Bike, cycle: "31", total: "Rp. 390.000", due: "2026-09-24" },
  { name: "Air", icon: Droplet, cycle: "28", total: "Rp. 390.000", due: "2026-09-24" },
  { name: "Listrik", icon: Zap, cycle: "25", total: "Rp. 390.000", due: "2026-09-24" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto min-h-screen w-full max-w-[480px] pb-28">
        <header className="flex items-center gap-3 rounded-b-2xl bg-surface px-5 py-6 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary">
            <User className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Selamat Datang Kembali</p>
            <p className="text-xl font-bold text-foreground">Dian</p>
          </div>
        </header>

        <main className="space-y-4 px-4 pt-4">
          <section className="rounded-2xl bg-surface p-4 shadow-card">
            <h2 className="text-base font-bold text-foreground">Transaksi Terbaru</h2>
            <div className="mt-3">
              {transactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Belum ada transaksi"
                  description="Transaksi terbaru kamu akan muncul di sini."
                />
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((t) => (
                    <div key={t.name} className="flex items-center gap-3 py-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Receipt className="size-4 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDateTime(t.at)}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-0.5 text-income">
                            <ArrowUpRight className="size-3" />
                            Rp. 10.000
                          </span>
                          <span className="flex items-center gap-0.5 text-expense">
                            <ArrowDownRight className="size-3" />
                            Rp. 10.000
                          </span>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-foreground">{t.total}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-4 shadow-card">
            <h2 className="text-base font-bold text-foreground">Tagihan Bulanan</h2>
            <div className="mt-3">
              {bills.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="Belum ada tagihan"
                  description="Tambahkan tagihan rutin agar tidak terlewat."
                />
              ) : (
                <div className="divide-y divide-border">
                  {bills.map((b) => (
                    <div key={b.name} className="flex items-center gap-3 py-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <b.icon className="size-4 text-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{b.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Jatuh tempo {formatDate(b.due)} •{" "}
                          <span className="text-expense">10 Hari Lagi</span>
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-foreground">{b.total}</p>
                        <span className="flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                          <Repeat className="size-3" />
                          {b.cycle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-5 text-center shadow-card">
            <p className="text-sm font-medium text-muted-foreground">Pendapatan Bersih Driver</p>
            <p className="mt-1 text-2xl font-bold text-foreground">Rp. 50.000</p>
          </section>

          <section className="mb-8 rounded-2xl bg-surface p-5 shadow-card">
            <h2 className="flex items-center justify-center gap-2 text-base font-bold text-foreground">
              <Banknote className="size-5" />
              Ringkasan Uang
            </h2>
            <div className="mt-4 grid grid-cols-2 divide-x divide-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Wallet</p>
                <p className="mt-1 font-bold text-foreground">Rp. 100.000</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Cash</p>
                <p className="mt-1 font-bold text-foreground">Rp. 100.000</p>
              </div>
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
