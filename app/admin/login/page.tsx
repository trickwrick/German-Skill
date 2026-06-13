import { Suspense } from "react";
import SiteLogo from "../../components/SiteLogo";
import AdminLoginForm from "../_components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <SiteLogo className="site-logo site-logo-admin" />
        </div>
        <Suspense fallback={<p className="adm-login-loading">Loading...</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
