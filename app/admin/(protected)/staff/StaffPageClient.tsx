"use client";

import { useCallback, useEffect, useState } from "react";

type StaffMember = {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string;
  role: string;
  created_at: string;
};

const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  role: "FRONT_DESK" as StaffRole,
};

type StaffRole = "ADMIN" | "FRONT_DESK" | "TRAINER";

export default function StaffPageClient() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/staff");
    const data = await res.json();
    if (res.ok) {
      setStaff(data.staff);
    }
    setLoading(false);
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

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create staff");
      return;
    }

    setSuccess(`Staff created: ${data.staff.full_name} (${data.staff.role})`);
    setShowForm(false);
    setForm(emptyForm);
    fetchStaff();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-gradient-gold">Staff</h1>
        <button
          type="button"
          onClick={openCreate}
          className="bg-gold text-black font-semibold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Staff
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <p className="text-textSecondary">Loading…</p>
      ) : (
        <div className="overflow-x-auto glass-panel rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderGold text-textSecondary text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-borderGold/50 hover:bg-white/5"
                >
                  <td className="p-4 font-medium">{s.full_name}</td>
                  <td className="p-4">{s.email || s.auth_user_id}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-xs capitalize bg-blue-500/20 text-blue-400">
                      {s.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-textSecondary">
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg">
            <h2 className="font-display text-xl text-gold mb-4">
              Add Staff Member
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-textSecondary mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-textSecondary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-textSecondary mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-textSecondary mb-1">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as StaffRole })
                  }
                  className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="FRONT_DESK">Front Desk</option>
                  <option value="TRAINER">Trainer</option>
                </select>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-black font-semibold py-2 rounded-lg"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-borderGold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
