"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Calendar, RefreshCw, UserCheck, X } from "lucide-react";

type AttendanceRecord = {
  id: string;
  member_id: string;
  member_name: string;
  member_phone: string;
  checked_in_at: string;
  method: string;
  marked_by_name: string | null;
};

export default function AttendancePageClient() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [memberId, setMemberId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (memberId) params.set("member_id", memberId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    try {
      const res = await fetch(`/api/attendance?${params}`);
      const data = await res.json();
      if (res.ok) {
        setRecords(data.attendance ?? []);
        setTotalPages(data.pagination?.total_pages ?? 1);
        if (typeof data.pagination?.total === "number") {
          setTotalCount(data.pagination.total);
        }
      }
    } catch {
      // Keep previous or empty
    } finally {
      setLoading(false);
    }
  }, [page, memberId, from, to]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const hasActiveFilters = Boolean(memberId || from || to);

  function clearFilters() {
    setMemberId("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-[#171717]">
            Attendance Log
          </h1>
          <p className="text-sm text-[#5F5F5A] mt-1">
            Real-time record of turnstile, QR, and front-desk member check-ins.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAttendance()}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-full border border-[#171717]/15 bg-white text-xs font-bold uppercase tracking-wider text-[#171717] hover:bg-black/5 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#171717]/10 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#5F5F5A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member ID or Name…"
            value={memberId}
            onChange={(e) => {
              setMemberId(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl pl-10 pr-4 py-2 text-[#171717] placeholder:text-[#5F5F5A]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5F5F5A] uppercase tracking-wider hidden sm:inline">
            From:
          </span>
          <div className="relative">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#5F5F5A] uppercase tracking-wider hidden sm:inline">
            To:
          </span>
          <div className="relative">
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#5F5F5A] hover:text-[#171717] hover:bg-black/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="p-12 text-center text-[#5F5F5A] text-sm bg-white rounded-2xl border border-[#171717]/10 shadow-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#171717]" />
          <span>Loading attendance entries…</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[#171717]/10 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#171717]/10 bg-[#F8F6F2] text-[#5F5F5A] text-left text-[11px] font-display font-bold uppercase tracking-wider">
                <th className="p-4">Member</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Checked In</th>
                <th className="p-4">Method</th>
                <th className="p-4">Marked By</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#171717]/5 hover:bg-[#FAF9F6] transition-colors"
                >
                  <td className="p-4 font-medium text-[#171717]">
                    <div className="font-bold">{r.member_name}</div>
                    <div className="text-[11px] font-mono text-[#5F5F5A] mt-0.5">
                      ID: {r.member_id.slice(0, 8)}…
                    </div>
                  </td>
                  <td className="p-4 text-[#5F5F5A] font-mono text-xs">
                    {r.member_phone}
                  </td>
                  <td className="p-4 text-xs text-[#171717] font-medium">
                    <div>
                      {new Date(r.checked_in_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-[11px] text-[#5F5F5A]">
                      {new Date(r.checked_in_at).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        r.method.toLowerCase().includes("qr")
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#F8F6F2] border border-[#171717]/10 text-[#171717]"
                      }`}
                    >
                      {r.method.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#5F5F5A]">
                    {r.marked_by_name ? (
                      <span className="font-medium text-[#171717]">
                        {r.marked_by_name}
                      </span>
                    ) : (
                      <span className="text-[#5F5F5A]/50">Automated</span>
                    )}
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-[#5F5F5A]">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <UserCheck className="w-8 h-8 text-[#5F5F5A]/40" />
                      <p className="font-medium text-sm text-[#171717]">
                        No check-ins recorded
                      </p>
                      <p className="text-xs text-[#5F5F5A]">
                        {hasActiveFilters
                          ? "Try clearing filters to see past check-ins."
                          : "Recent scans and entries will automatically populate here."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1.5 rounded-full border border-[#171717]/15 text-xs font-bold text-[#171717] bg-white hover:bg-black/5 disabled:opacity-40 transition-colors shadow-sm"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-xs text-[#5F5F5A] font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1.5 rounded-full border border-[#171717]/15 text-xs font-bold text-[#171717] bg-white hover:bg-black/5 disabled:opacity-40 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
