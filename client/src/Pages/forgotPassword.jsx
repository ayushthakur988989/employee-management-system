import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestOtp = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/users/request-login-otp", { email });
      setMessage(data.message);
      setStep("otp");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send a code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/users/verify-login-otp", { email, otp });
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to verify the code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid auth-page forgot-page">
      <div className="row min-vh-100 justify-content-center align-items-center p-3">
        <main className="card shadow-lg border-0 p-4 p-md-5 auth-card otp-card">
          <Link to="/" className="text-decoration-none small">← Back to login</Link>
          <h1 className="h2 fw-bold mt-4">{step === "email" ? "Sign in with a code" : "Check your email"}</h1>
          <p className="text-muted">{step === "email" ? "We’ll send a secure one-time code to your registered email." : `Enter the six-digit code sent to ${email}.`}</p>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {step === "email" ? (
            <form onSubmit={requestOtp}>
              <label className="form-label fw-semibold" htmlFor="otp-email">Email address</label>
              <input id="otp-email" className="form-control mb-4" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <button className="btn btn-primary w-100 py-2" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send one-time code"}</button>
            </form>
          ) : (
            <form onSubmit={verifyOtp}>
              <label className="form-label fw-semibold" htmlFor="otp">One-time code</label>
              <input id="otp" className="form-control text-center otp-input mb-3" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required />
              <button className="btn btn-primary w-100 py-2 mb-3" disabled={isSubmitting}>{isSubmitting ? "Verifying..." : "Verify and sign in"}</button>
              <button className="btn btn-link w-100" type="button" onClick={() => { setStep("email"); setOtp(""); }}>Use a different email</button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
