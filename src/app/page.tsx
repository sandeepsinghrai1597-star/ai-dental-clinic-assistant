"use client";

import {
  Activity,
  AlertCircle,
  Award,
  BarChart3,
  Bot,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Lead = {
  name: string;
  phone: string;
  treatment: string;
  preferred_time: string;
  message: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const quickReplies = [
  "I have tooth pain",
  "Gum bleeding and sensitivity",
  "Book a cleaning",
  "Do you offer braces?",
  "Emergency appointment today",
  "Tooth care tips",
];

const appointments = [
  { name: "Ananya Mehta", service: "Root canal review", time: "9:30 AM", status: "Confirmed" },
  { name: "Rohan Iyer", service: "Emergency tooth pain", time: "11:00 AM", status: "Needs call" },
  { name: "Neha Kapoor", service: "Scaling and polishing", time: "2:15 PM", status: "Confirmed" },
];

const leadRows = [
  { name: "Arjun Rao", concern: "Dental implant consult", source: "Chat", score: "Hot" },
  { name: "Priya Menon", concern: "Teeth whitening", source: "Form", score: "Warm" },
  { name: "Kabir Shah", concern: "Wisdom tooth pain", source: "Chat", score: "Urgent" },
];

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Namaste, I am PearlCare's AI clinic assistant. I'm powered by advanced AI to help with your dental health questions and appointment booking. What can I help you with today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    treatment: "Emergency exam",
    preferred_time: "Morning",
    message: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [isSavingLead, setIsSavingLead] = useState(false);
  const [lastLeadName, setLastLeadName] = useState("");

  const dashboardStats = useMemo(
    () => [
      { label: "New leads", value: "28", detail: "+18% this week", icon: UserRound },
      { label: "Booked by AI", value: "16", detail: "6 same-day visits", icon: CalendarCheck },
      { label: "Response time", value: "2s", detail: "AI streaming response", icon: Clock3 },
      { label: "Follow-ups", value: "41%", detail: "lead to appointment", icon: Activity },
    ],
    [],
  );

  async function sendMessage(text = chatInput) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Add user message
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: "" }, // Placeholder for streaming response
    ]);
    setChatInput("");
    setIsChatOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", text: trimmed },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let fullResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        // Update the last message (assistant's response) with streamed content
        setMessages((current) => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: "assistant",
            text: fullResponse,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((current) => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "Sorry, I encountered an error. Please make sure Ollama is running and try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingLead(true);
    setLeadSubmitted(false);
    setLeadError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not save lead.");
      }

      setLastLeadName(lead.name);
      setLeadSubmitted(true);
      setLead({
        name: "",
        phone: "",
        treatment: "Emergency exam",
        preferred_time: "Morning",
        message: "",
      });
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : "Could not save lead.");
    } finally {
      setIsSavingLead(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="PearlCare Dental Studio home">
          <span className="brand-mark">
            <Sparkles size={20} />
          </span>
          PearlCare Dental Studio
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#assistant">Assistant</a>
          <a href="#lead">Book</a>
          <a href="#dashboard">Dashboard</a>
        </nav>
        <a className="header-cta" href="#lead">
          <Phone size={17} />
          Book visit
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <div className="eyebrow">
            <ShieldCheck size={18} />
            Trusted AI reception for Indian dental clinics
          </div>
          <h1>Premium Dental Care, Made Easier</h1>
          <p>
            A calm, reliable website assistant for modern dental clinics in India. It answers
            patient questions, captures appointment requests, and helps your team follow up with
            confidence.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setIsChatOpen(true)}>
              <MessageCircle size={19} />
              Talk to assistant
            </button>
            <a className="secondary-button" href="#dashboard">
              View clinic dashboard
              <ChevronRight size={18} />
            </a>
          </div>
          <div className="trust-row" aria-label="Clinic trust signals">
            <span>
              <Award size={17} />
              Premium patient intake
            </span>
            <span>
              <MapPin size={17} />
              Built for Indian cities
            </span>
            <span>
              <IndianRupee size={17} />
              Treatment-aware leads
            </span>
          </div>
        </div>
        <div className="hero-panel" aria-label="Live clinic status">
          <div>
            <span>Today</span>
            <strong>12 available appointment slots</strong>
          </div>
          <div>
            <span>Priority care</span>
            <strong>3 tooth pain cases flagged</strong>
          </div>
        </div>
      </section>

      <section className="section features" id="assistant">
        <div className="section-heading">
          <span>Patient-first experience</span>
          <h2>A premium first impression before the patient calls.</h2>
        </div>
        <div className="feature-grid">
          <article>
            <Bot />
            <h3>Gentle symptom triage</h3>
            <p>Recognizes tooth pain, swelling, cracked teeth, bleeding gums, and follow-up concerns.</p>
          </article>
          <article>
            <CalendarCheck />
            <h3>Clean appointment capture</h3>
            <p>Collects treatment, phone number, preferred time, and patient message in one simple flow.</p>
          </article>
          <article>
            <Stethoscope />
            <h3>Indian clinic services</h3>
            <p>Supports scaling, root canals, braces, aligners, implants, whitening, and emergency consults.</p>
          </article>
        </div>
      </section>

      <section className="section split" id="lead">
        <div className="lead-copy">
          <span>Appointment request</span>
          <h2>Make booking feel simple, private, and trustworthy.</h2>
          <p>
            The form is designed for Indian dental clinics: mobile-first, respectful, and clear
            about the next step. Every request goes directly into your Supabase leads table.
          </p>
          <ul>
            <li>
              <Check size={18} />
              Urgent pain and swelling cases are easy to identify
            </li>
            <li>
              <Check size={18} />
              Treatment interest stays attached to every enquiry
            </li>
            <li>
              <Check size={18} />
              Designed for WhatsApp-first, mobile-first patient behaviour
            </li>
          </ul>
        </div>

        <form className="lead-form" onSubmit={submitLead}>
          <div className="form-heading">
            <span>Book a consultation</span>
            <strong>We will call you back</strong>
          </div>
          <label>
            Full name
            <input
              value={lead.name}
              onChange={(event) => setLead({ ...lead, name: event.target.value })}
              placeholder="Aarav Sharma"
              required
            />
          </label>
          <label>
            Mobile number
            <input
              value={lead.phone}
              onChange={(event) => setLead({ ...lead, phone: event.target.value })}
              placeholder="+91 98765 43210"
              required
            />
          </label>
          <label>
            Treatment
            <select
              value={lead.treatment}
              onChange={(event) => setLead({ ...lead, treatment: event.target.value })}
            >
              <option>Emergency exam</option>
              <option>Scaling and polishing</option>
              <option>Teeth whitening</option>
              <option>Braces or aligners consult</option>
              <option>Dental implant consult</option>
              <option>Root canal consult</option>
              <option>Veneers consult</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Best time to call
            <select
              value={lead.preferred_time}
              onChange={(event) => setLead({ ...lead, preferred_time: event.target.value })}
            >
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </label>
          <label>
            Message
            <textarea
              value={lead.message}
              onChange={(event) => setLead({ ...lead, message: event.target.value })}
              placeholder="Tell us about pain, sensitivity, cosmetic goals, or preferred clinic timing..."
              required
            />
          </label>
          <button className="primary-button full-width" type="submit" disabled={isSavingLead}>
            {isSavingLead ? (
              <>
                <span className="button-spinner" aria-hidden="true" />
                Saving request
              </>
            ) : (
              "Send request"
            )}
          </button>
          {leadSubmitted ? (
            <div className="form-notice success" role="status">
              <CheckCircle2 size={22} />
              <div>
                <strong>Request received{lastLeadName ? ` for ${lastLeadName}` : ""}</strong>
                <span>
                  Your details were saved securely. Our clinic team will call during your preferred time.
                </span>
              </div>
              <button type="button" onClick={() => setLeadSubmitted(false)} aria-label="Dismiss success message">
                ×
              </button>
            </div>
          ) : null}
          {leadError ? (
            <div className="form-notice error" role="alert">
              <AlertCircle size={22} />
              <div>
                <strong>Request not sent</strong>
                <span>{leadError}</span>
              </div>
              <button type="button" onClick={() => setLeadError("")} aria-label="Dismiss error message">
                ×
              </button>
            </div>
          ) : null}
        </form>
      </section>

      <section className="section dashboard-section" id="dashboard">
        <div className="section-heading">
          <span>Admin dashboard</span>
          <h2>A calm clinic dashboard for faster follow-up.</h2>
        </div>
        <div className="dashboard">
          <div className="stat-grid">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article className="stat" key={stat.label}>
                  <Icon size={21} />
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </article>
              );
            })}
          </div>
          <div className="dashboard-body">
            <section className="queue">
              <div className="panel-title">
                <h3>Today&apos;s schedule</h3>
                <BarChart3 size={20} />
              </div>
              {appointments.map((item) => (
                <div className="row" key={`${item.name}-${item.time}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.service}</span>
                  </div>
                  <time>{item.time}</time>
                  <em>{item.status}</em>
                </div>
              ))}
            </section>
            <section className="queue">
              <div className="panel-title">
                <h3>Lead inbox</h3>
                <MessageCircle size={20} />
              </div>
              {leadRows.map((item) => (
                <div className="row" key={`${item.name}-${item.concern}`}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.concern}</span>
                  </div>
                  <time>{item.source}</time>
                  <em className={item.score === "Urgent" ? "urgent" : ""}>{item.score}</em>
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>

      <footer>
        <strong>PearlCare Dental Studio</strong>
        <span>Premium AI intake for Indian dental clinics</span>
      </footer>

      <div className={`chat-widget ${isChatOpen ? "open" : ""}`} aria-live="polite">
        {isChatOpen ? (
          <section className="chat-window" aria-label="Dental AI assistant chat">
            <div className="chat-header">
              <div>
                <strong>PearlCare Assistant</strong>
                <span>Online now</span>
              </div>
              <button aria-label="Close chat" onClick={() => setIsChatOpen(false)}>
                ×
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button key={reply} onClick={() => sendMessage(reply)} disabled={isLoading}>
                  {reply}
                </button>
              ))}
            </div>
            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Ask about appointments or symptoms"
                disabled={isLoading}
              />
              <button type="submit" aria-label="Send message" disabled={isLoading || !chatInput.trim()}>
                {isLoading ? (
                  <span className="button-spinner" aria-hidden="true" />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            </form>
          </section>
        ) : (
          <button className="chat-launcher" onClick={() => setIsChatOpen(true)} aria-label="Open chat">
            <MessageCircle size={25} />
          </button>
        )}
      </div>
    </main>
  );
}
