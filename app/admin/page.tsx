"use client";

import { useState, KeyboardEvent } from "react";
import { Lock, Download, ShieldCheck, Loader2, LogOut } from "lucide-react";
import { EntityManager } from "@/components/admin/entity-manager";
import { entities } from "@/lib/admin-entities";

type Tab = keyof typeof entities;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("vendors");

  // Password is sent in the Authorization header — never in the URL.
  const authHeaders = (pwd: string) => ({
    Authorization: `Bearer ${pwd}`,
  });

  const handleLogin = async () => {
    const pwd = password.trim();
    if (!pwd) {
      setError("Please enter admin password");
      return;
    }
    setError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/export?validateOnly=true", {
        method: "GET",
        headers: authHeaders(pwd),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Invalid admin password");
      }
      setLoggedIn(true);
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoggedIn(false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/export", {
        method: "GET",
        headers: authHeaders(password.trim()),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to export vendors");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendors.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong during export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoggingIn && !loggedIn) handleLogin();
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setPassword("");
    setError(null);
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Logged in as Admin
              </p>
              <h1 className="text-2xl font-semibold">Open Machining Admin</h1>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-70"
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Export vendors (.xlsx)
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1" aria-label="Admin sections">
            {(Object.keys(entities) as Tab[]).map((key) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                aria-current={tab === key ? "page" : undefined}
                className={`rounded-t-md px-5 py-2.5 text-sm font-semibold transition ${
                  tab === key ? "bg-slate-100 text-slate-900" : "text-slate-300 hover:text-white"
                }`}
              >
                {entities[key].label}
              </button>
            ))}
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <EntityManager key={tab} def={entities[tab]} password={password.trim()} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/5 border border-white/10 shadow-2xl rounded-2xl px-6 py-7 sm:px-8 sm:py-9 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/40">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">Admin Access</h1>
              <p className="text-sm text-slate-300 mt-1">Manage vendors and tenders.</p>
            </div>
          </div>

            <>
              <label className="block text-xs font-medium text-slate-200 mb-1.5">
                Admin Password
              </label>
              <div className="relative mb-3">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 w-px h-4 bg-slate-600/70" />
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/15 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400 transition"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs mb-3 bg-red-950/40 border border-red-500/40 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Checking…</>
                ) : (
                  <><ShieldCheck className="h-4 w-4" />Login as Admin</>
                )}
              </button>

              <p className="mt-3 text-[11px] text-slate-400 text-center">
                This area is restricted. Your activity may be logged.
              </p>
            </>
        </div>
      </div>
    </div>
  );
}
