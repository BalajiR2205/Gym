import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-textSecondary">Loading…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
