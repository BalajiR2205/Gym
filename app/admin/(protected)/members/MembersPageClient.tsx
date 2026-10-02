"use client";

import { useCallback, useEffect, useState } from "react";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string | null;
  plan: string;
  joined_at: string;
  expires_at: string;
  date_of_birth: string | null;
  member_number: number;
  member_code: string;
  status: string;
};

const emptyForm = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  date_of_birth: "",
  plan: "monthly",
  joined_at: new Date().toISOString().slice(0, 10),
  expires_at: "",
  status: "active",
};

export default function MembersPageClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [qrModal, setQrModal] = useState<{ memberId: string; name: string; url: string } | null>(
    null
  );
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    memberCode: string;
    memberId: string;
    name: string;
  } | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/members?${params}`);
    const data = await res.json();
    if (res.ok) {
      setMembers(data.members);
      setTotalPages(data.pagination.total_pages);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccessInfo(null);
  }

  function openEdit(member: Member) {
    setEditingId(member.id);
    const nameParts = member.full_name.split(" ");
    setForm({
      first_name: member.first_name || nameParts[0] || "",
      last_name: member.last_name || nameParts.slice(1).join(" ") || "",
      phone: member.phone,
      email: member.email ?? "",
      date_of_birth: member.date_of_birth ?? "",
      plan: member.plan,
      joined_at: member.joined_at,
      expires_at: member.expires_at,
      status: member.status,
    });
    setShowForm(true);
    setError("");
    setSuccessInfo(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessInfo(null);

    const url = editingId ? `/api/members/${editingId}` : "/api/members";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to save member");
      return;
    }

    if (!editingId && res.status === 201) {
      const memberCode = data.member?.member_code;
      const memberId = data.member?.id;
      const memberName = data.member?.full_name;
      if (memberCode && memberId && memberName) {
        setSuccessInfo({ memberCode, memberId, name: memberName });
      }
    }

    setShowForm(false);
    fetchMembers();
  }

  async function showQr(memberId: string, memberName: string) {
    const res = await fetch(`/api/members/${memberId}/qr`);
    const data = await res.json();
    if (res.ok) {
      setQrModal({ memberId, name: memberName, url: data.qr_image_data_url });
    }
  }

  async function rotateQr(memberId: string) {
    const res = await fetch(`/api/members/${memberId}/qr?rotate=true`);
    const data = await res.json();
    if (res.ok) {
      setQrModal({ memberId, name: qrModal?.name ?? "", url: data.qr_image_data_url });
    }
  }

  return (
    <div>
      {successInfo && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-emerald-400 font-semibold text-sm">
              Member created: {successInfo.memberCode}
            </p>
            <p className="text-textSecondary text-xs mt-0.5">
              {successInfo.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => showQr(successInfo.memberId, successInfo.name)}
              className="text-sm bg-gold text-black font-semibold px-3 py-1.5 rounded-lg hover:bg-gold-dark transition-colors"
            >
              View QR
            </button>
            <button
              type="button"
              onClick={() => setSuccessInfo(null)}
              className="text-sm border border-borderGold px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl text-gradient-gold">Members</h1>
        <button
          type="button"
          onClick={openCreate}
          className="bg-gold text-black font-semibold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors"
        >
          + Add Member
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          placeholder="Search name, phone, email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-cardBackground border border-borderGold rounded-lg px-4 py-2 text-white min-w-[240px] focus:outline-none focus:border-gold/50"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-cardBackground border border-borderGold rounded-lg px-4 py-2 text-white focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="frozen">Frozen</option>
        </select>
      </div>

      {loading ? (
        <p className="text-textSecondary">Loading…</p>
      ) : (
        <div className="overflow-x-auto glass-panel rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderGold text-textSecondary text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-borderGold/50 hover:bg-white/5"
                >
                  <td className="p-4 font-medium">
                    <div>{m.full_name}</div>
                    {m.member_code && (
                      <div className="text-xs text-textSecondary font-mono mt-0.5">
                        {m.member_code}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{m.phone}</td>
                  <td className="p-4 capitalize">{m.plan}</td>
                  <td className="p-4">{m.expires_at}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs capitalize ${
                        m.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : m.status === "expired"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(m)}
                        className="text-gold hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => showQr(m.id, m.full_name)}
                        className="text-gold hover:underline text-xs"
                      >
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-textSecondary">
                    No members found.
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

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl text-gold mb-4">
              {editingId ? "Edit Member" : "New Member"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                ["first_name", "First name", "text"],
                ["last_name", "Last name", "text"],
                ["phone", "Phone", "tel"],
                ["email", "Email", "email"],
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-sm text-textSecondary mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={key !== "email"}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-textSecondary mb-1">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) =>
                    setForm({ ...form, date_of_birth: e.target.value })
                  }
                  className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-textSecondary mb-1">
                    Plan
                  </label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">3 Months (Quarterly)</option>
                    <option value="semi_annual">6 Months (Semi-Annual)</option>
                    <option value="annual">1 Year (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-textSecondary mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-textSecondary mb-1">
                    Joined
                  </label>
                  <input
                    type="date"
                    required
                    value={form.joined_at}
                    onChange={(e) =>
                      setForm({ ...form, joined_at: e.target.value })
                    }
                    className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white"
                  />
                </div>
                {editingId && (
                  <div>
                    <label className="block text-sm text-textSecondary mb-1">
                      Expires
                    </label>
                    <input
                      type="date"
                      value={form.expires_at}
                      onChange={(e) =>
                        setForm({ ...form, expires_at: e.target.value })
                      }
                      className="w-full bg-cardBackground border border-borderGold rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                )}
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-black font-semibold py-2 rounded-lg"
                >
                  Save
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

      {qrModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-2xl p-6 text-center">
            <h3 className="font-display text-lg text-gold mb-4">
              QR — {qrModal.name}
            </h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrModal.url}
              alt={`QR code for ${qrModal.name}`}
              className="mx-auto rounded-lg bg-white p-2"
              width={280}
              height={280}
            />
            <div className="flex gap-3 mt-4 justify-center">
              <button
                type="button"
                onClick={() => {
                  if (qrModal?.memberId) rotateQr(qrModal.memberId);
                }}
                className="text-sm text-gold hover:underline"
              >
                Rotate secret
              </button>
              <button
                type="button"
                onClick={() => setQrModal(null)}
                className="text-sm text-textSecondary hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
