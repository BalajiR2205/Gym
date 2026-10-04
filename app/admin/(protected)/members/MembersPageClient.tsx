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
    <div className="space-y-6">
      {successInfo && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-emerald-900 font-bold text-sm">
              ✓ Member created: {successInfo.memberCode}
            </p>
            <p className="text-emerald-700 text-xs mt-0.5 font-medium">
              {successInfo.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => showQr(successInfo.memberId, successInfo.name)}
              className="text-xs bg-[#171717] text-white font-bold px-3.5 py-1.5 rounded-full hover:bg-[#2A2A28] transition-colors"
            >
              View QR
            </button>
            <button
              type="button"
              onClick={() => setSuccessInfo(null)}
              className="text-xs border border-[#171717]/15 px-3.5 py-1.5 rounded-full hover:bg-black/5 transition-colors text-[#171717] font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#171717] tracking-tight">
            Members Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#5F5F5A] mt-1">
            Manage active memberships, plans, renewal dates, and personal QR codes.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="bg-[#171717] text-white font-display font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#2A2A28] active:scale-[0.99] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, phone, email, member code…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-[#171717]/15 rounded-xl px-4 py-2.5 text-[#171717] placeholder:text-[#5F5F5A]/50 text-sm min-w-[260px] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717] shadow-sm transition-all"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border border-[#171717]/15 rounded-xl px-4 py-2.5 text-[#171717] text-sm focus:outline-none focus:ring-2 focus:ring-[#171717]/10 focus:border-[#171717] shadow-sm font-medium"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="frozen">Frozen</option>
        </select>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="p-12 text-center text-[#5F5F5A] text-sm bg-white rounded-2xl border border-[#171717]/10 shadow-sm">
          Loading members…
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-[#171717]/10 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#171717]/10 bg-[#F8F6F2] text-[#5F5F5A] text-left text-[11px] font-display font-bold uppercase tracking-wider">
                <th className="p-4">Member</th>
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
                  className="border-b border-[#171717]/5 hover:bg-[#FAF9F6] transition-colors"
                >
                  <td className="p-4 font-medium text-[#171717]">
                    <div className="font-bold">{m.full_name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {m.member_code && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/5 text-[#171717]">
                          {m.member_code}
                        </span>
                      )}
                      {m.email && (
                        <span className="text-xs text-[#5F5F5A] truncate max-w-[180px]">
                          {m.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-[#5F5F5A] font-mono text-xs">{m.phone}</td>
                  <td className="p-4 capitalize text-[#171717] font-medium">{m.plan.replace("_", " ")}</td>
                  <td className="p-4 text-xs text-[#5F5F5A]">{m.expires_at}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-block ${
                        m.status === "active"
                          ? "bg-emerald-100 text-emerald-800"
                          : m.status === "expired"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-sky-100 text-sky-800"
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
                        className="text-xs font-bold text-[#171717] hover:bg-black/5 px-2.5 py-1 rounded-lg border border-[#171717]/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => showQr(m.id, m.full_name)}
                        className="text-xs font-bold text-[#171717] hover:bg-black/5 px-2.5 py-1 rounded-lg border border-[#171717]/10 transition-colors"
                      >
                        QR Code
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#5F5F5A] text-sm">
                    No members found matching your search.
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

      {/* Add / Edit Member Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-7 sm:p-9 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#171717]/15 shadow-editorial-lg text-[#171717]">
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#171717] tracking-tight mb-4">
              {editingId ? "Edit Member" : "New Member Registration"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. member@example.com"
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                />
              </div>

              <div>
                <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.date_of_birth}
                  onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                  className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Plan
                  </label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 font-medium"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">3 Months (Quarterly)</option>
                    <option value="semi_annual">6 Months (Semi-Annual)</option>
                    <option value="annual">1 Year (Annual)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10 font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="frozen">Frozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                    Joined Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.joined_at}
                    onChange={(e) => setForm({ ...form, joined_at: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                  />
                </div>
                {editingId && (
                  <div>
                    <label className="block text-[11px] font-display font-bold uppercase tracking-wider text-[#171717] mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={form.expires_at}
                      onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                      className="w-full bg-[#F8F6F2] border border-[#171717]/15 rounded-xl px-3.5 py-2.5 text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#171717]/10"
                    />
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-xs font-medium p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#171717] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-full hover:bg-[#2A2A28] transition-colors shadow-sm"
                >
                  Save Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-[#171717]/15 text-[#171717] font-semibold text-xs uppercase tracking-wider py-3 rounded-full hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-7 sm:p-9 text-center border border-[#171717]/15 shadow-editorial-lg text-[#171717] max-w-sm w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-[#171717] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              Personal Pass
            </div>
            <h3 className="font-display font-black text-xl text-[#171717] tracking-tight mb-1">
              {qrModal.name}
            </h3>
            <p className="text-xs text-[#5F5F5A] mb-5">
              Member check-in personal badge
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrModal.url}
              alt={`QR code for ${qrModal.name}`}
              className="mx-auto rounded-2xl bg-[#F8F6F2] p-4 border border-[#171717]/10 shadow-inner"
              width={260}
              height={260}
            />

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#171717]/8">
              <button
                type="button"
                onClick={() => {
                  if (qrModal?.memberId) rotateQr(qrModal.memberId);
                }}
                className="text-xs font-bold text-[#5F5F5A] hover:text-[#171717] underline transition-colors"
              >
                Rotate secret
              </button>
              <button
                type="button"
                onClick={() => setQrModal(null)}
                className="text-xs font-bold bg-[#171717] text-white px-5 py-2 rounded-full hover:bg-[#2A2A28] transition-colors"
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
