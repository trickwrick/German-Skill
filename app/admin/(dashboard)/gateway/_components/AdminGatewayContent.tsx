"use client";

import { useState } from "react";
import { type GatewaySectionData } from "../../../../../lib/gatewayStore";
import AdminImageUploadField from "../../../_components/AdminImageUploadField";

export default function AdminGatewayContent({ initialData }: { initialData: GatewaySectionData }) {
  const [data, setData] = useState<GatewaySectionData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ text: "Saved successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to save changes.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  function handleStepChange(index: number, field: "title" | "text", value: string) {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setData({ ...data, steps: newSteps });
  }

  return (
    <div className="adm-page">
      <h1 className="adm-page-title">Homepage Settings</h1>

      {message && (
        <div style={{ padding: "12px 16px", marginBottom: "24px", borderRadius: "8px", background: message.type === "success" ? "#dcfce7" : "#fee2e2", color: message.type === "success" ? "#166534" : "#991b1b" }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: "#fff", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "1.25rem", color: "#1e293b", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" }}>Gateway Section</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Heading</label>
            <input 
              type="text" 
              value={data.heading} 
              onChange={(e) => setData({ ...data, heading: e.target.value })} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Subtitle</label>
            <textarea 
              value={data.subtitle} 
              onChange={(e) => setData({ ...data, subtitle: e.target.value })} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Description</label>
            <textarea 
              value={data.description} 
              onChange={(e) => setData({ ...data, description: e.target.value })} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "100px", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "0.9rem" }}>Steps Heading</label>
            <input 
              type="text" 
              value={data.stepsHeading} 
              onChange={(e) => setData({ ...data, stepsHeading: e.target.value })} 
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>
          
          <AdminImageUploadField
            label="Image Source"
            value={data.imageSrc}
            folder="general"
            uploadLabel="gateway"
            placeholder="/gateway.jpg"
            onChange={(path) => setData({ ...data, imageSrc: path })}
          />
        </div>

        <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", color: "#1e293b" }}>Steps</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
          {data.steps.map((step, index) => (
            <div key={index} style={{ padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ marginBottom: "12px", fontSize: "0.95rem" }}>Step {index + 1}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input 
                  type="text" 
                  value={step.title} 
                  placeholder="Step Title"
                  onChange={(e) => handleStepChange(index, "title", e.target.value)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
                <textarea 
                  value={step.text} 
                  placeholder="Step Description"
                  onChange={(e) => handleStepChange(index, "text", e.target.value)} 
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", minHeight: "80px", fontFamily: "inherit" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right" }}>
          <button 
            type="submit" 
            disabled={isSaving}
            style={{ padding: "12px 24px", background: "#e31e24", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
