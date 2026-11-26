import { useState } from "react";
import { hasAnalyticsConsent, trackGA4 } from "../lib/ga4";

export default function LeadMagnetForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("sent");
      if (hasAnalyticsConsent()) {
        trackGA4("generate_lead", { source: "lead-magnet-form" });
        try {
          await fetch("/api/track-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "generate_lead",
              params: { source: "lead-magnet-form" },
              analyticsConsent: true,
            }),
          });
        } catch (trackingError) {
          console.warn("GA4 Measurement Protocol request failed:", trackingError);
        }
      }
      setTimeout(() => (window.location.href = "/thank-you"), 800);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-gold font-medium text-center py-4">
        ✓ Inscription réussie — redirection en cours…
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4"
      data-testid="lead-magnet-form"
    >
      <div>
        <label htmlFor="lm-name" className="block mb-1 text-sm text-ivory/80">
          Prénom ou nom
        </label>
        <input
          id="lm-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          placeholder="Votre prénom"
          className="border border-white/20 bg-ink-2 rounded w-full p-2 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
          data-testid="lm-name"
        />
      </div>
      <div>
        <label htmlFor="lm-email" className="block mb-1 text-sm text-ivory/80">
          Email
        </label>
        <input
          id="lm-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          className="border border-white/20 bg-ink-2 rounded w-full p-2 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
          data-testid="lm-email"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        data-testid="lm-submit"
        className="w-full bg-gold text-ink font-semibold py-2 px-4 rounded hover:bg-gold/90 transition disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours…" : "Obtenir le PDF gratuitement →"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center" role="alert">
          Une erreur s'est produite. Réessayez ou contactez-nous directement.
        </p>
      )}
    </form>
  );
}
