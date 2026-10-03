//app/api/admin/export/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const validateOnly = url.searchParams.get("validateOnly") === "true";

    // 🔐 Password is read from the Authorization header: "Bearer <password>"
    const denied = requireAdmin(request);
    if (denied) return denied;

    // Login-check only — no export needed
    if (validateOnly) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const admin = supabaseAdmin;
    if (!admin) {
      console.error("Supabase admin client is not configured");
      return NextResponse.json(
        { error: "Supabase admin client is not configured" },
        { status: 500 }
      );
    }

    // 🗄️ Fetch from SQL view
    const { data, error } = await admin.from("vendor_full_export").select("*");

    if (error) {
      console.error("Supabase error (vendor_full_export):", error);
      return NextResponse.json(
        { error: "Failed to fetch vendor data" },
        { status: 500 }
      );
    }

    const rows = data ?? [];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vendors");

    if (rows.length === 0) {
      sheet.addRow(["No vendor data available"]);
    } else {
      const columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: 25,
      }));
      sheet.columns = columns as any;

      rows.forEach((row: any) => {
        const formatted: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          let v: any = value;
          if (v && (key.endsWith("_at") || key === "created_at" || key === "updated_at")) {
            try { v = new Date(v as any).toISOString(); } catch { /* ignore */ }
          }
          if (Array.isArray(v) || (v && typeof v === "object")) {
            v = JSON.stringify(v);
          }
          formatted[key] = v;
        }
        sheet.addRow(formatted);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `vendors-${new Date().toISOString().replace(/[:.]/g, "-")}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
