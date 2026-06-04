import { useState, useEffect, useRef } from "react";
 
// ── Математика матрицы Пифагора ──────────────────────────────────────────────
 
function digitSum(n) {
  while (n > 9) n = String(n).split("").reduce((a, b) => a + +b, 0);
  return n;
}
 
function calcMatrix(dateStr) {
  const [dd, mm, yyyy] = dateStr.split(".");
  const digits = (dd + mm + yyyy).split("").map(Number).filter(d => d > 0);
  const count = Array(10).fill(0);
  digits.forEach(d => count[d]++);
  const sum1 = digits.reduce((a, b) => a + b, 0);
  const A = digitSum(sum1);
  const sum2 = String(sum1).split("").reduce((a, b) => a + +b, 0);
  const B = digitSum(sum2);
  const C = digitSum(Math.abs(+dd[0] - A));
  const D = digitSum(A + B + C);
  [A, B, C, D, sum1 > 9 ? Math.floor(sum1 / 10) : null, sum1 % 10]
    .filter(Boolean)
    .forEach(d => { if (d > 0 && d <= 9) count[d]++; });
  return {
    cells: [count[1], count[2], count[3], count[4], count[5], count[6], count[7], count[8], count[9]],
    numbers: { A, B, C, D },
    raw: count,
  };
}
 
const TEASERS = {
  1: { label: "Характер", peek: (v) => v === 0 ? "Единиц нет — это редкость. Что это значит для характера, лучше разбирать отдельно." : v >= 4 ? `${v} единицы. Сильная воля — иногда на тебя работает, иногда против.` : `${v} единиц. Там есть кое-что про настойчивость, которую ты, возможно, в себе не замечаешь.` },
  5: { label: "Интуиция", peek: (v) => v === 0 ? "Пятёрок нет совсем. У таких людей логика почти всегда побеждает чутьё." : v >= 3 ? `${v} пятёрки. Скорее всего, ты чувствуешь людей раньше, чем понимаешь почему.` : `Пятёрка есть. Интуиция работает, но не всегда вовремя.` },
  7: { label: "Удача", peek: (v) => v === 0 ? "Семёрок нет. Это говорит кое-что важное про то, как у тебя устроена удача." : v >= 3 ? `${v} семёрки — редкая конфигурация. Там есть про везение и про твою роль.` : `Семёрка есть. Про её значение стоит поговорить отдельно.` },
  8: { label: "Карма", peek: (v) => v === 0 ? "Восьмёрок нет. Кармический долг чистый — или очень скрытый." : v >= 2 ? `${v} восьмёрки. Один из самых неочевидных показателей.` : `Восьмёрка есть. Что она несёт — лучше смотреть в полном расчёте.` },
  9: { label: "Память", peek: (v) => v === 0 ? "Девяток нет. Редкость — есть конкретная интерпретация для таких матриц." : v >= 3 ? `${v} девятки — сильная родовая память. Иногда ресурс, иногда груз.` : `Девятка есть. Что несёт в твоей дате — отдельная история.` },
};
 
const GRID_LABELS = ["Характер","Энергия","Интерес","Здоровье","Интуиция","Труд","Удача","Карма","Память"];
 
const SYSTEM_PROMPT = `Ты нумеролог-эксперт по матрице Пифагора. Общаешься тепло и по-человечески, как на личной консультации.
 
Правила:
- Никогда не раскрывай полную интерпретацию. Всегда оставляй самое интересное "за кадром".
- Говори коротко и ёмко. Одна мысль — одно-два предложения. Чередуй длинные и короткие.
- Не используй: "раскрыть потенциал", "это меняет всё", "таким образом", "более того", "помимо этого".
- Без длинных тире, без эмодзи.
- Не давай конкретных советов — только наблюдения и вопросы.
- Если спрашивают про цифру — дай один интересный факт, и скажи что остальное зависит от сочетания с другими ячейками.
- Примерно на 3-4 сообщении клиента мягко скажи что видишь кое-что важное, но это требует полного расчёта. Упомяни что полный расчёт стоит 490 рублей и даёт полную картину по всем 9 ячейкам плюс числа судьбы. Но не дави — просто скажи как факт.
- Пиши как живая речь.`;
 
// ── Кнопка оплаты ────────────────────────────────────────────────────────────
// Замени PAYMENT_URL на свою ссылку (ЮКасса, Тинькофф, Boosty и т.д.)
const PAYMENT_URL = "https://example.com/pay"; // <-- вставь сюда свою ссылку на оплату
 
function PaymentBanner({ dob, onClose }) {
  return (
    <div style={bannerStyles.overlay} onClick={onClose}>
      <div style={bannerStyles.box} onClick={e => e.stopPropagation()}>
        <div style={bannerStyles.close} onClick={onClose}>✕</div>
        <div style={bannerStyles.eyebrow}>Полный расчёт</div>
        <div style={bannerStyles.price}>490 ₽</div>
        <div style={bannerStyles.dob}>{dob}</div>
        <div style={bannerStyles.list}>
          <div style={bannerStyles.item}><span style={bannerStyles.dot}/> Все 9 ячеек с подробной интерпретацией</div>
          <div style={bannerStyles.item}><span style={bannerStyles.dot}/> Числа судьбы A, B, C, D — что они значат</div>
          <div style={bannerStyles.item}><span style={bannerStyles.dot}/> Сочетания ячеек и скрытые паттерны</div>
          <div style={bannerStyles.item}><span style={bannerStyles.dot}/> Кармические задачи и сильные стороны</div>
        </div>
        <a
          href={`${PAYMENT_URL}?dob=${dob}`}
          target="_blank"
          rel="noopener noreferrer"
          style={bannerStyles.btn}
        >
          Получить полный расчёт
        </a>
        <div style={bannerStyles.hint}>Результат придёт в течение 24 часов</div>
      </div>
    </div>
  );
}
 
export default function App() {
  const [step, setStep] = useState("input");
  const [dob, setDob] = useState("");
  const [matrix, setMatrix] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const chatEndRef = useRef(null);
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
 
  function formatDOB(val) {
    const digits = val.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + "." + digits.slice(2);
    return digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4);
  }
 
  function handleDOBChange(e) {
    setDob(formatDOB(e.target.value));
    setError("");
  }
 
  function validateDOB(d) {
    const parts = d.split(".");
    if (parts.length !== 3) return false;
    const [dd, mm, yyyy] = parts.map(Number);
    if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return false;
    if (dd < 1 || dd > 31 || mm < 1 || mm > 12 || yyyy < 1900 || yyyy > 2025) return false;
    return true;
  }
 
  function handleCalculate() {
    if (!validateDOB(dob)) { setError("Проверь дату — формат ДД.ММ.ГГГГ"); return; }
    setMatrix(calcMatrix(dob));
    setRevealed([]);
    setStep("reveal");
  }
 
  function revealCell(idx) {
    if (!revealed.includes(idx)) setRevealed(r => [...r, idx]);
  }
 
  function startChat() {
    const m = matrix;
    const top = [0, 4, 6, 7, 8].map(i => ({ i, v: m.cells[i] })).sort((a, b) => b.v - a.v)[0];
    const intro = `Дата ${dob} посчиталась. Матрица собрана.\n\nЧто сразу видно: ${GRID_LABELS[top.i].toLowerCase()} ${top.v === 0 ? "отсутствует совсем — это само по себе говорящий момент" : `стоит ${top.v}`}. Уже интересно.\n\nЧто хочешь разобрать первым?`;
    setMessages([{ role: "assistant", content: intro }]);
    setMsgCount(0);
    setStep("chat");
  }
 
  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const newCount = msgCount + 1;
    setMsgCount(newCount);
 
    const matrixContext = `Матрица Пифагора клиента (дата ${dob}):\nЯчейки: 1=${matrix.cells[0]}, 2=${matrix.cells[1]}, 3=${matrix.cells[2]}, 4=${matrix.cells[3]}, 5=${matrix.cells[4]}, 6=${matrix.cells[5]}, 7=${matrix.cells[6]}, 8=${matrix.cells[7]}, 9=${matrix.cells[8]}\nЧисла судьбы: A=${matrix.numbers.A}, B=${matrix.numbers.B}, C=${matrix.numbers.C}, D=${matrix.numbers.D}\nСообщений от клиента: ${newCount}`;
 
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT + "\n\n" + matrixContext,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Что-то пошло не так.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Связь прервалась, попробуй ещё раз." }]);
    }
    setLoading(false);
  }
 
  return (
    <div style={styles.root}>
      <div style={styles.bg} />
      {showPayment && <PaymentBanner dob={dob} onClose={() => setShowPayment(false)} />}
 
      {step === "input" && (
        <div style={styles.card}>
          <div style={styles.title}>Матрица Пифагора</div>
          <div style={styles.subtitle}>Введи дату рождения — посмотрим, что там</div>
          <input
            style={{ ...styles.input, borderColor: error ? "#e05a5a" : "#3a3060" }}
            placeholder="ДД.ММ.ГГГГ"
            value={dob}
            onChange={handleDOBChange}
            onKeyDown={e => e.key === "Enter" && handleCalculate()}
            maxLength={10}
          />
          {error && <div style={styles.error}>{error}</div>}
          <button style={styles.btn} onClick={handleCalculate}>Считать</button>
        </div>
      )}
 
      {step === "reveal" && matrix && (
        <div style={styles.card}>
          <div style={styles.title}>Матрица готова</div>
          <div style={styles.subtitle}>Нажми на подсвеченную ячейку, чтобы заглянуть</div>
          <div style={styles.grid}>
            {matrix.cells.map((val, i) => {
              const digit = i + 1;
              const teaser = TEASERS[digit];
              const isOpen = revealed.includes(i);
              const isFeatured = [0, 4, 6, 7, 8].includes(i);
              return (
                <div key={i}
                  style={{ ...styles.cell, ...(isFeatured ? styles.cellFeatured : {}), ...(isOpen ? styles.cellOpen : {}) }}
                  onClick={() => teaser && revealCell(i)}
                >
                  <div style={styles.cellNum}>{digit}</div>
                  <div style={styles.cellDigit}>{val > 0 ? String(digit).repeat(val) : "—"}</div>
                  <div style={styles.cellLabel}>{GRID_LABELS[i]}</div>
                  {isOpen && teaser && <div style={styles.cellTeaser}>{teaser.peek(val)}</div>}
                </div>
              );
            })}
          </div>
          <div style={styles.numbers}>
            {Object.entries(matrix.numbers).map(([k, v]) => (
              <div key={k} style={styles.numChip}>
                <span style={styles.numK}>{k}</span>
                <span style={styles.numV}>{v}</span>
              </div>
            ))}
          </div>
          {revealed.length >= 2 && (
            <button style={styles.btn} onClick={startChat}>Разобрать подробнее</button>
          )}
          <button style={styles.btnPay} onClick={() => setShowPayment(true)}>Полный расчёт — 490 ₽</button>
          <button style={styles.btnGhost} onClick={() => setStep("input")}>Другая дата</button>
        </div>
      )}
 
      {step === "chat" && (
        <div style={styles.chatWrap}>
          <div style={styles.chatHeader}>
            <span style={styles.chatTitle}>{dob}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={styles.payBtnSmall} onClick={() => setShowPayment(true)}>490 ₽ полный расчёт</button>
              <button style={styles.btnGhost} onClick={() => setStep("reveal")}>Матрица</button>
            </div>
          </div>
          <div style={styles.chatMessages}>
            {messages.map((m, i) => (
              <div key={i} style={m.role === "user" ? styles.msgUser : styles.msgBot}>
                {m.content.split("\n").map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                ))}
              </div>
            ))}
            {loading && <div style={styles.msgBot}><span style={styles.dots}>...</span></div>}
            {/* После 3 сообщений показываем мягкий баннер */}
            {msgCount >= 3 && !loading && messages[messages.length - 1]?.role === "assistant" && (
              <div style={styles.softBanner}>
                <div style={styles.softBannerText}>Хочешь увидеть полную картину?</div>
                <button style={styles.softBannerBtn} onClick={() => setShowPayment(true)}>
                  Полный расчёт — 490 ₽
                </button>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={styles.chatInputRow}>
            <input
              style={styles.chatInput}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Спроси про любую цифру..."
            />
            <button style={styles.sendBtn} onClick={sendMessage} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ── Стили основные ───────────────────────────────────────────────────────────
 
const styles = {
  root: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden", background: "#0d0b1e" },
  bg: { position: "fixed", inset: 0, background: "radial-gradient(ellipse at 30% 20%, #1a0f3c 0%, #0d0b1e 50%, #0a0818 100%)", zIndex: 0 },
  card: { position: "relative", zIndex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,140,255,0.15)", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 460, boxShadow: "0 8px 60px rgba(100,60,200,0.2)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: 11 },
  title: { fontSize: 24, fontWeight: 700, color: "#e8d9ff", textAlign: "center" },
  subtitle: { fontSize: 13, color: "rgba(200,180,255,0.5)", textAlign: "center", marginBottom: 4, fontFamily: "system-ui, sans-serif" },
  input: { background: "rgba(255,255,255,0.05)", border: "1px solid #3a3060", borderRadius: 10, padding: "13px 16px", fontSize: 22, color: "#e8d9ff", outline: "none", letterSpacing: "0.1em", textAlign: "center", fontFamily: "monospace" },
  error: { fontSize: 12, color: "#e05a5a", textAlign: "center", fontFamily: "system-ui, sans-serif" },
  btn: { background: "linear-gradient(135deg, #7c3aed, #4f1da8)", color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontFamily: "system-ui, sans-serif", cursor: "pointer", fontWeight: 600 },
  btnPay: { background: "linear-gradient(135deg, #b45309, #92400e)", color: "#fde68a", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontFamily: "system-ui, sans-serif", cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" },
  btnGhost: { background: "transparent", color: "rgba(180,140,255,0.45)", border: "none", fontSize: 12, fontFamily: "system-ui, sans-serif", cursor: "pointer", padding: "4px 0", textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, margin: "6px 0" },
  cell: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(140,100,255,0.1)", borderRadius: 10, padding: "9px 6px", cursor: "default", minHeight: 62, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.2s" },
  cellFeatured: { border: "1px solid rgba(180,140,255,0.3)", cursor: "pointer", background: "rgba(120,60,220,0.07)" },
  cellOpen: { border: "1px solid rgba(180,140,255,0.55)", background: "rgba(120,60,220,0.15)" },
  cellNum: { fontSize: 9, color: "rgba(160,120,255,0.35)", fontFamily: "monospace" },
  cellDigit: { fontSize: 11, color: "#c4a8ff", letterSpacing: "0.06em", fontFamily: "monospace", minHeight: 14 },
  cellLabel: { fontSize: 9, color: "rgba(160,130,200,0.45)", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.04em" },
  cellTeaser: { fontSize: 10, color: "rgba(220,200,255,0.8)", fontFamily: "system-ui, sans-serif", textAlign: "center", marginTop: 5, lineHeight: 1.4, borderTop: "1px solid rgba(180,140,255,0.12)", paddingTop: 5 },
  numbers: { display: "flex", gap: 7, justifyContent: "center" },
  numChip: { background: "rgba(120,60,220,0.1)", border: "1px solid rgba(180,140,255,0.18)", borderRadius: 8, padding: "5px 11px", display: "flex", gap: 5, alignItems: "center" },
  numK: { fontSize: 11, color: "rgba(180,140,255,0.45)", fontFamily: "system-ui, sans-serif" },
  numV: { fontSize: 16, color: "#c4a8ff", fontFamily: "monospace" },
  chatWrap: { position: "relative", zIndex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: 480, height: "100vh", maxHeight: 700, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,140,255,0.12)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)" },
  chatHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(180,140,255,0.1)" },
  chatTitle: { fontSize: 13, color: "#c4a8ff", fontFamily: "monospace", letterSpacing: "0.08em" },
  payBtnSmall: { background: "linear-gradient(135deg, #b45309, #92400e)", color: "#fde68a", border: "none", borderRadius: 8, padding: "6px 11px", fontSize: 11, fontFamily: "system-ui, sans-serif", cursor: "pointer", fontWeight: 600 },
  chatMessages: { flex: 1, overflowY: "auto", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 11 },
  msgBot: { alignSelf: "flex-start", background: "rgba(120,60,220,0.1)", border: "1px solid rgba(180,140,255,0.14)", borderRadius: "4px 14px 14px 14px", padding: "11px 14px", color: "#ddd0ff", fontSize: 14, lineHeight: 1.6, maxWidth: "85%", fontFamily: "system-ui, sans-serif" },
  msgUser: { alignSelf: "flex-end", background: "rgba(80,40,160,0.32)", borderRadius: "14px 4px 14px 14px", padding: "11px 14px", color: "#e8d9ff", fontSize: 14, lineHeight: 1.6, maxWidth: "80%", fontFamily: "system-ui, sans-serif" },
  dots: { opacity: 0.5 },
  softBanner: { alignSelf: "center", background: "rgba(180,100,20,0.12)", border: "1px solid rgba(250,200,80,0.2)", borderRadius: 14, padding: "14px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "90%" },
  softBannerText: { fontSize: 13, color: "rgba(253,230,138,0.7)", fontFamily: "system-ui, sans-serif", textAlign: "center" },
  softBannerBtn: { background: "linear-gradient(135deg, #b45309, #92400e)", color: "#fde68a", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontFamily: "system-ui, sans-serif", cursor: "pointer", fontWeight: 600 },
  chatInputRow: { display: "flex", gap: 7, padding: "12px 14px", borderTop: "1px solid rgba(180,140,255,0.1)", background: "rgba(0,0,0,0.2)" },
  chatInput: { flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(140,100,255,0.2)", borderRadius: 10, padding: "11px 13px", fontSize: 14, color: "#e8d9ff", outline: "none", fontFamily: "system-ui, sans-serif" },
  sendBtn: { background: "linear-gradient(135deg, #7c3aed, #4f1da8)", border: "none", borderRadius: 10, padding: "0 13px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};
 
// ── Стили баннера оплаты ──────────────────────────────────────────────────────
 
const bannerStyles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" },
  box: { position: "relative", background: "linear-gradient(160deg, #1a0f3c 0%, #0f0a24 100%)", border: "1px solid rgba(250,200,80,0.25)", borderRadius: 20, padding: "36px 32px", maxWidth: 380, width: "100%", display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 20px 80px rgba(180,80,0,0.25)" },
  close: { position: "absolute", top: 14, right: 16, color: "rgba(180,140,255,0.4)", fontSize: 16, cursor: "pointer", fontFamily: "system-ui" },
  eyebrow: { fontSize: 11, color: "rgba(253,230,138,0.5)", fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center" },
  price: { fontSize: 48, fontWeight: 700, color: "#fde68a", textAlign: "center", fontFamily: "'Georgia', serif", lineHeight: 1 },
  dob: { fontSize: 13, color: "rgba(200,180,255,0.4)", textAlign: "center", fontFamily: "monospace", letterSpacing: "0.08em" },
  list: { display: "flex", flexDirection: "column", gap: 8, margin: "4px 0" },
  item: { fontSize: 13, color: "rgba(220,200,255,0.75)", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.4 },
  dot: { width: 5, height: 5, borderRadius: "50%", background: "#fde68a", opacity: 0.6, flexShrink: 0, marginTop: 5 },
  btn: { display: "block", textAlign: "center", textDecoration: "none", background: "linear-gradient(135deg, #d97706, #92400e)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontFamily: "system-ui, sans-serif", cursor: "pointer", fontWeight: 700, marginTop: 4 },
  hint: { fontSize: 11, color: "rgba(180,140,255,0.35)", textAlign: "center", fontFamily: "system-ui, sans-serif" },
};
 
