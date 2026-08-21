"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (memberId) params.set("member_id", memberId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const res = await fetch(`/api/attendance?${params}`);
    const data = await res.json();
    if (res.ok) {
      setRecords(data.attendance);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, memberId, from, to]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  return (
    <div>
      <h1 className="font-display text-3xl text-gradient-gold mb-8">
        Attendance Log
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Member ID (optional)"
          value={memberId}
          onChange={(e) => {
            setMemberId(e.target.value);
            setPage(1);
          }}
          className="bg-cardBackground border border-borderGold rounded-lg px-4 py-2 text-white min-w-[200px] focus:outline-none"
        />
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            setPage(1);
          }}
          className="bg-cardBackground border border-borderGold rounded-lg px-4 py-2 text-white"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            setPage(1);
          }}
          className="bg-cardBackground border border-borderGold rounded-lg px-4 py-2 text-white"
        />
      </div>

      {loading ? (
        <p className="text-textSecondary">Loading…</p>
      ) : (
        <div className="overflow-x-auto glass-panel rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderGold text-textSecondary text-left">
                <th className="p-4">Member</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Checked in</th>
                <th className="p-4">Method</th>
                <th className="p-4">Marked by</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-borderGold/50 hover:bg-white/5"
                >
                  <td className="p-4">{r.member_name}</td>
                  <td className="p-4">{r.member_phone}</td>
                  <td className="p-4">
                    {new Date(r.checked_in_at).toLocaleString()}
                  </td>
                  <td className="p-4 capitalize">
                    {r.method.replace("_", " ")}
                  </td>
                  <td className="p-4">{r.marked_by_name ?? "—"}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-textSecondary">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded border border-borderGold disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-textSecondary">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded border border-borderGold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
