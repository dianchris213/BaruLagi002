import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Repeat,
  User,
  Wallet,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, formatDateTime } from "@/lib/format";
import { bills, transactions, formatRupiah, monthKey } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catatan Keuangan Dian — Ringkasan Harian" },
      {
        name: "description",
        content:
          "Pantau transaksi terbaru, tagihan bulanan, pendapatan bersih, dan ringkasan uang dalam satu tampilan sederhana.",
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

const CURRENT_MONTH = "2026-09";

function Index() {
  const recent = useMemo(
    () => [...transactions].sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 5),
    [],
  );

  const summary = useMemo(() => {
    const month = transactions.filter((t) => monthKey(t.at) === CURRENT_MONTH);
    const income = month.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = month.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, []);

  const upcoming = useMemo(
    () =>
      bills
        .filter((b) => !b.paid)
        .sort((a, b) => (a.due < b.due ? -1 : 1))
        .slice(0, 3),
    [],
  );

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto min-h-screen w-full max-w-[480px] pb-28">
        <header className="flex items-center gap-3 rounded-b-2xl bg-surface px-5 py-6 shadow-card">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary">
            <User className="size-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Selamat Datang Kembali</p>
            <p className="text-xl font-bold text-foreground">Dian</p>
          </div>
        </header>

        <main className="space-y-4 px-4 pt-4">
          <section
            aria-label="Ringkasan bulan ini"
            className="rounded-2xl bg-surface p-4 shadow-card"
          >
            <h2 className="text-base font-bold text-foreground">Bulan Ini</h2>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatRupiah(summary.net)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted px-3 py-2">
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ArrowUpRight className="size-3 text-income" aria-hidden="true" /> Pemasukan
                </p>
                <p className="text-sm font-bold text-income">{formatRupiah(summary.income)}</p>
              </div>
              <div className="rounded-xl bg-muted px-3 py-2">
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ArrowDownRight className="size-3 text-expense" aria-hidden="true" /> Pengeluaran
                </p>
                <p className="text-sm font-bold text-expense">{formatRupiah(summary.expense)}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold text-foreground">Transaksi Terbaru</h2>
              <Link to="/finance" className="text-[11px] font-semibold text-primary">
                Lihat semua
              </Link>
            </div>
            <div className="mt-3">
              {recent.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Belum ada transaksi"
                  description="Transaksi terbaru kamu akan muncul di sini."
                />
              ) : (
                <ul className="divide-y divide-border">
                  {recent.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Receipt className="size-4 text-foreground" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDateTime(t.at)}</p>
                      </div>
                      <p
                        className={`shrink-0 text-sm font-bold ${
                          t.type === "income" ? "text-income" : "text-expense"
                        }`}
                      >
                        {t.type === "income" ? "+" : "−"}
                        {formatRupiah(t.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-bold text-foreground">Tagihan Terdekat</h2>
              <Link to="/bills" className="text-[11px] font-semibold text-primary">
                Lihat semua
              </Link>
            </div>
            <div className="mt-3">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="Belum ada tagihan"
                  description="Tambahkan tagihan rutin agar tidak terlewat."
                />
              ) : (
                <ul className="divide-y divide-border">
                  {upcoming.map((b) => (
                    <li key={b.id} className="flex items-center gap-3 py-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <b.icon className="size-4 text-foreground" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{b.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Jatuh tempo {formatDate(b.due)}
                        </p>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Repeat className="size-3" aria-hidden="true" />
                          Siklus {b.cycle}
                        </span>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-foreground">
                        {formatRupiah(b.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
