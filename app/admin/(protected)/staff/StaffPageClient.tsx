"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, Shield, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

type StaffMember = {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string;
  role: StaffRole;
  created_at: string;
};

type StaffRole = "ADMIN" | "FRONT_DESK" | "TRAINER";

const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  role: "FRONT_DESK" as StaffRole,
};

export default function StaffPageClient() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (res.ok) {
        setStaff(data.staff ?? []);
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  function openCreate() {
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create staff member");
        return;
      }

      setSuccess(`Staff member created: ${data.staff.full_name} (${data.staff.role})`);
      setShowForm(false);
      setForm(emptyForm);
      fetchStaff();
    } catch {
      setError("An unexpected network error occurred.");
    }
  }

  function getRoleBadge(role: StaffRole) {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-900 border-purple-200/50";
      case "FRONT_DESK":
        return "bg-blue-100 text-blue-900 border-blue-200/50";
      case "TRAINER":
        return "bg-amber-100 text-amber-900 border-amber-200/50";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200/50";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-[#171717]">
            Staff Directory
          </h1>
          <p className="text-sm text-[#5F5F5A] mt-1">
            Manage admin, front desk, and trainer authorization credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#171717] text-white hover:bg-[#2A2A28] text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {success && (
        <div
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3 text-sm font-medium"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Staff Table */}
      {loading ? (
        <div className="p-12 text-center text-[#5F5F5A] text-sm bg-white rounded-2xl border border-[#171717]/10 shadow-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#171717]" />
          <span>Loading staff accounts…</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[#171717]/10 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#171717]/10 bg-[#F8F6F2] text-[#5F5F5A] text-left text-[11px] font-display font-bold uppercase tracking-wider">
                <th className="p-4">Name</th>
                <th className="p-4">Email / Login Account</th>
                <th className="p-4">Role</th>
                <th className="p-4">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[#171717]/5 hover:bg-[#FAF9F6] transition-colors"
                >
                  <td className="p-4 font-medium text-[#171717]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#171717]/5 border border-[#171717]/10 flex items-center justify-center text-xs font-bold text-[#171717]">
                        {s.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold">{s.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5F5F5A] font-mono text-xs">
                    {s.email || s.auth_user_id}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getRoleBadge(
                        s.role
                      )}`}
                    >
                      {s.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#5F5F5A]">
                    {new Date(s.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-[#5F5F5A]">
                    <div className="max-w-xs mx-auto flex flex-col items-center gap-2">
                      <Shield className="w-8 h-8 text-[#5F5F5A]/40" />
                      <p className="font-medium text-sm text-[#171717]">
                        No staff members found
                      </p>
                      <p className="text-xs text-[#5F5F5A]">
                        Click &quot;Add Staff Member&quot; to provision an admin or trainer account.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg border border-[#171717]/15 shadow-editorial-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-black text-xl text-[#171717]">
                  Add Staff Member
                </h2>
                <p className="text-xs text-[#5F5F5A] mt-0.5">
                  Create a new console account with role-based access controls.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#5F5F5A] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="staff@domain.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5F5F5A] mb-1.5">
                  Assigned Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as StaffRole })
                  }
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-4 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717]"
                >
                  <option value="FRONT_DESK">Front Desk (Attendance & Check-in)</option>
                  <option value="TRAINER">Trainer (Scanner & Attendance)</option>
                  <option value="ADMIN">Admin (Full System Permissions)</option>
                </select>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#171717]/8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-full border border-[#171717]/15 text-xs font-bold uppercase tracking-wider text-[#171717] hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#171717] text-white hover:bg-[#2A2A28] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
