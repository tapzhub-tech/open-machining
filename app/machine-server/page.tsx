"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, Factory, Users, Globe, Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import type { MachineServerStats } from "@/lib/supabase";

// ── Icon map ────────────────────────────────────────────────────────────────
const iconMap: Record<string, JSX.Element> = {
  Search: <Search className="h-6 w-6" />,
  Factory: <Factory className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
};

// ── KPI Cards ────────────────────────────────────────────────────────────────
const KpiCards = ({ stats }: { stats: MachineServerStats }) => {
  const kpis = [
    { title: "Registered Vendors", value: stats.vendorsCount, iconName: "Search" },
    { title: "Machines on Floor", value: stats.machinesCount, iconName: "Factory" },
    { title: "Skilled Technical Staff", value: stats.technicalStaffCount, iconName: "Users" },
    { title: "CNC Programmers", value: stats.programmersCount, iconName: "Globe" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
      {kpis.map((kpi) => (
        <Card
          key={kpi.title}
          className="shadow-none border-l-4 border-blue-500/50 hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            {iconMap[kpi.iconName] ?? <Search />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ── Bar Chart ────────────────────────────────────────────────────────────────
const BarChartSection = ({
  title, subtitle, data, colorHex,
}: {
  title: string; subtitle?: string;
  data: { name: string; count: number }[];
  colorHex: string;
}) => (
  <div className="py-10">
    <div className="mb-6">
      <h2 className="uppercase text-sm font-bold tracking-wider text-gray-700">{title}</h2>
      <h3 className="text-3xl font-bold tracking-tighter pt-2">{subtitle}</h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 50)}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 13 }} />
          <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "14px" }} />
          <Bar dataKey="count" fill={colorHex} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ── State List ───────────────────────────────────────────────────────────────
const StateList = ({
  title, subtitle, data,
}: {
  title: string; subtitle?: string;
  data: { name: string; count: number }[];
}) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="py-10">
      <div className="mb-6">
        <h2 className="uppercase text-sm font-bold tracking-wider text-gray-700">{title}</h2>
        <h3 className="text-3xl font-bold tracking-tighter pt-2">{subtitle}</h3>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between items-center py-2 border-b last:border-b-0">
            <span className="text-lg text-gray-700">{item.name}</span>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-32 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, (item.count / max) * 100)}%` }}
                />
              </div>
              <span className="font-semibold text-blue-700">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Workforce Summary ─────────────────────────────────────────────────────────
const WorkforceSummary = ({ stats }: { stats: MachineServerStats }) => {
  const ratio =
    stats.programmersCount > 0
      ? (stats.technicalStaffCount / stats.programmersCount).toFixed(1)
      : "—";

  return (
    <div className="py-10">
      <div className="mb-6">
        <h2 className="uppercase text-sm font-bold tracking-wider text-gray-700">CNC PROGRAMMERS</h2>
        <h3 className="text-3xl font-bold tracking-tighter pt-2">WORKFORCE SUMMARY</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between text-xl">
            <span className="text-gray-600">Skilled technical hands:</span>
            <span className="font-bold text-blue-700">{stats.technicalStaffCount}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span className="text-gray-600">CNC Programmers:</span>
            <span className="font-bold text-blue-700">{stats.programmersCount}</span>
          </div>
          <div className="flex justify-between text-xl">
            <span className="text-gray-600">Staff:Programmer Ratio:</span>
            <span className="font-bold text-blue-700">{ratio}:1</span>
          </div>
        </div>
        <div className="md:col-span-1 space-y-3 text-sm p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold text-gray-800">
            💡 Programming capacity — the bottleneck resource in most job shops.
          </p>
          <p className="text-gray-500">
            Network average. Lower means more programming depth per technician.
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Vendor Table ─────────────────────────────────────────────────────────────
type SortKey = "name" | "machines" | "staff" | "programmers" | "industries";

const VendorRegisterTable = ({ vendors }: { vendors: MachineServerStats["vendorDetails"] }) => {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = [...vendors].sort((a, b) => {
    let av: any = a[sortKey as keyof typeof a];
    let bv: any = b[sortKey as keyof typeof b];
    if (sortKey === "industries") { av = (av as string[]).length; bv = (bv as string[]).length; }
    if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const indicator = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="py-10">
      <h2 className="uppercase text-sm font-bold tracking-wider text-gray-700 mb-1">REGISTER</h2>
      <h3 className="text-3xl font-bold tracking-tighter pt-2">ALL VENDORS – CLICK A COLUMN TO SORT</h3>
      <div className="mt-6 bg-white p-4 rounded-xl shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
              {(["name", "machines", "staff", "programmers", "industries"] as SortKey[]).map((col) => (
                <th
                  key={col}
                  onClick={() => toggle(col)}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:bg-gray-100"
                >
                  {col.toUpperCase()}{indicator(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sorted.map((vendor, i) => (
              <tr key={vendor.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-4 text-sm text-gray-900">#{i + 1}</td>
                <td className="px-4 py-4">
                  <div className="text-base font-semibold">{vendor.name}</div>
                  <div className="text-sm text-gray-500">{vendor.location}</div>
                </td>
                <td className="px-4 py-4 text-sm text-right">{vendor.machines}</td>
                <td className="px-4 py-4 text-sm text-right">{vendor.staff}</td>
                <td className="px-4 py-4 text-sm text-right">{vendor.programmers}</td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {vendor.industries.map((ind, j) => (
                      <Badge key={j} variant="secondary" className="text-xs px-3 py-1 text-blue-700 bg-blue-100">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MachineServerPage() {
  const [stats, setStats] = useState<MachineServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/machine-server-stats")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load stats (${r.status})`);
        return r.json();
      })
      .then((data: MachineServerStats) => setStats(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-500 text-sm">Loading live network data…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 font-medium">Failed to load data</p>
            <p className="text-gray-500 text-sm max-w-sm">{error}</p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && stats && (
          <>
            <section aria-labelledby="kpi-heading" className="pt-6">
              <div className="mb-10">
                <h2 className="uppercase text-sm font-bold tracking-wider text-gray-700 mb-2">
                  KEY PERFORMANCE INDICATORS
                </h2>
                <h3 className="text-4xl font-bold tracking-tighter">Industrial Capacity Overview</h3>
              </div>
              <KpiCards stats={stats} />
            </section>

            <Separator className="my-12" />

            <BarChartSection
              title="COVERAGE"
              subtitle="What the network can build"
              data={stats.industryData}
              colorHex="#2563eb"
            />

            <Separator className="my-12" />

            <BarChartSection
              title="MACHINE TYPES ON FLOOR"
              subtitle={`${stats.machinesCount} UNITS`}
              data={stats.machineTypeData}
              colorHex="#f97316"
            />

            <Separator className="my-12" />

            <StateList
              title="BY STATE"
              subtitle="Geographic Distribution of Capacity"
              data={stats.stateData}
            />

            <Separator className="my-12" />

            <WorkforceSummary stats={stats} />

            <Separator className="my-12" />

            <VendorRegisterTable vendors={stats.vendorDetails} />

            <Separator className="my-12" />
          </>
        )}
      </main>
    </div>
  );
}
