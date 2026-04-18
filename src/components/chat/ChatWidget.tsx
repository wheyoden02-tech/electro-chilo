import React, { useEffect, useRef, useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

/*
  Imagen oficial estilo sprite (repositorio oficial PokeAPI sprites)
  Profesor Oak (sprite clásico)
*/
const OAK_AVATAR = "/profesor-oak.jpeg";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function generateSessionId() {
  return crypto.randomUUID();
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("electrorepara_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const newId = generateSessionId();
      localStorage.setItem("electrorepara_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!WEBHOOK_URL) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          source: "web-electrorepara",
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "..." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error de conexión con la Pokédex.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tooltip estilo Pokédex */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "20px",
            background: "#b91c1c",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: window.innerWidth < 480 ? "12px" : "14px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            zIndex: 9998,
            border: "2px solid #7f1d1d",
          }}
        >
          Chatea acá si tienes dudas o consultas.
        </div>
      )}

      {/* Botón Pokédex */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(145deg,#ef4444,#b91c1c)",
          border: "4px solid #7f1d1d",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <img
          src={OAK_AVATAR}
          alt="Professor Oak"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </button>

      {/* Pokédex Popup */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            width: "100%",
            maxWidth: "420px",
            height: "100%",
            maxHeight: "680px",
            backgroundColor: "#dc2626",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            border: "4px solid #7f1d1d",
          }}
        >
          {/* Header tipo Pokédex */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#991b1b",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
            <img
              src={OAK_AVATAR}
              alt="Oak"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            Pokédex ElectroRepara
            <span
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </span>
          </div>

          {/* Pantalla LCD */}
          <div
            style={{
              flex: 1,
              margin: "16px",
              backgroundColor: "#0f172a",
              borderRadius: "12px",
              padding: "14px",
              overflowY: "auto",
              fontFamily: "monospace",
              color: "#22c55e",
              border: "3px inset #1e293b",
            }}
          >
            {messages.length === 0 && (
              <div style={{ opacity: 0.8 }}>
                {" > Sistema iniciado..."}
                <br />
                {" > Profesor Oak listo para asistir."}
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  color: msg.role === "user" ? "#38bdf8" : "#22c55e",
                }}
              >
                {msg.role === "user" ? "> Entrenador: " : "> Oak: "}
                {msg.content}
              </div>
            ))}

            {loading && <div>{" > Procesando consulta..."}</div>}

            <div ref={messagesEndRef} />
          </div>

          {/* Input estilo consola */}
          <div
            style={{
              padding: "14px",
              backgroundColor: "#991b1b",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ingresa consulta..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                fontFamily: "monospace",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0f172a",
                color: "#22c55e",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};