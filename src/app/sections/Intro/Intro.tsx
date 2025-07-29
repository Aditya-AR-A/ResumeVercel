"use client";

import React from "react";
import Image from "next/image";

export default function Intro() {
  return (
    <section
      id="intro"
      style={{
        marginBottom: 64,
        textAlign: "center",
        padding: "48px 0 56px 0",
        background: "linear-gradient(135deg, #fffbe6 0%, #ffd966 100%)",
        borderRadius: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        position: "relative",
      }}
    >
      {/* Profile Image */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image
          src="https://avatars.githubusercontent.com/u/126697615?v=4"
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #fff8c6",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: 24,
          }}
        />
        {/* Name */}
        <h1 style={{ fontSize: "2.8rem", fontWeight: 700, margin: 0, color: "#222" }}>Aditya Raj</h1>
        {/* Title */}
        <p style={{ fontSize: "1.3rem", color: "#b38b00", margin: "12px 0 0 0", fontWeight: 500 }}>
          Data Scientist & Python Developer
        </p>
        {/* About */}
        <p style={{ color: "#444", margin: "24px 0 0 0", maxWidth: 540, fontSize: "1.08rem", lineHeight: 1.7 }}>
          Software developer and data scientist with strong expertise in full-stack, deep learning, and machine learning. Experienced in building AI-powered tools (e.g. Chess Helper, VS Code Copilot extension), and delivering insights through structured models in Python/TensorFlow. Holds a Data Science Certification (IBM via Simplilearn) and demonstrated impact via notable projects in NLP, clustering, and predictive modeling.
        </p>
        {/* Links */}
        <div style={{ display: "flex", gap: 28, marginTop: 32, justifyContent: "center" }}>
          {/* Email */}
          <a href="mailto:adityaraj.anshukumar50@gmail.com" title="Email" style={{ color: "#b38b00", fontSize: 28 }}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/></svg>
          </a>
          {/* GitHub */}
          <a href="https://github.com/Aditya-AR-A" target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: "#b38b00", fontSize: 28 }}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
          </a>
          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/aditya-raj-921a08352/" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{ color: "#b38b00", fontSize: 28 }}>
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
} 