import { Suspense } from "react";
import SiteLogo from "../../components/SiteLogo";
import AdminLoginForm from "../_components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <SiteLogo className="site-logo site-logo-admin" />
          <span>Admin Panel</span>
        </div>
        <h1>Sign In</h1>
        <p>Use your admin credentials to access the dashboard.</p>
        <Suspense fallback={<p className="adm-login-loading">Loading...</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
