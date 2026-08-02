/* NM Learn — Exam engine + Live class interactions */

(function () {
  "use strict";

  const EXAM_KEY = "nmlearn_exam_answers";

  const QUESTIONS = [
    { id: 1, type: "mcq", text: "Which CSS property controls the direction of flex items?", options: ["flex-direction", "justify-content", "align-items", "flex-wrap"], answer: 0 },
    { id: 2, type: "mcq", text: "What does HTML stand for?", options: ["Hyper Text Markup Language", "HighText Machine Language", "Hyper Tool Multi Language", "Home Tool Markup Language"], answer: 0 },
    { id: 3, type: "mcq", text: "Which tag creates a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
    { id: 4, type: "mcq", text: "Inline CSS is written using which attribute?", options: ["class", "style", "css", "font"], answer: 1 },
    { id: 5, type: "mcq", text: "Which symbol is used for an ID selector in CSS?", options: [".", "#", "*", "&"], answer: 1 },
    { id: 6, type: "mcq", text: "JavaScript is primarily used for?", options: ["Styling pages", "Structuring content", "Adding interactivity", "Database design only"], answer: 2 },
    { id: 7, type: "mcq", text: "Which method selects an element by ID in JavaScript?", options: ["querySelectorAll", "getElementById", "getElementsByClassName", "getElement"], answer: 1 },
    { id: 8, type: "mcq", text: "What does DOM stand for?", options: ["Document Object Model", "Data Object Mode", "Digital Ordinance Model", "Document Order Map"], answer: 0 },
    { id: 9, type: "mcq", text: "Which HTTP method is typically used to create a resource in REST?", options: ["GET", "POST", "DELETE", "HEAD"], answer: 1 },
    { id: 10, type: "mcq", text: "In React, what are reusable UI building blocks called?", options: ["Modules", "Components", "Packages", "Hooks only"], answer: 1 },
    { id: 11, type: "mcq", text: "Which hook stores state in a functional React component?", options: ["useEffect", "useState", "useMemo", "useRef"], answer: 1 },
    { id: 12, type: "mcq", text: "Node.js is mainly used for?", options: ["Frontend styling", "Server-side JavaScript", "Photo editing", "Only mobile apps"], answer: 1 },
    { id: 13, type: "mcq", text: "Express.js is a framework for?", options: ["Python", "PHP", "Node.js", "Java"], answer: 2 },
    { id: 14, type: "mcq", text: "MongoDB stores data as?", options: ["Tables only", "Documents (JSON-like)", "CSV files", "XML only"], answer: 1 },
    { id: 15, type: "mcq", text: "JWT is commonly used for?", options: ["Image compression", "Authentication tokens", "CSS minification", "DNS routing"], answer: 1 },
    { id: 16, type: "mcq", text: "Which Git command uploads local commits to remote?", options: ["git pull", "git push", "git fetch", "git clone"], answer: 1 },
    { id: 17, type: "mcq", text: "Box model in CSS includes?", options: ["content, padding, border, margin", "only margin", "only flex", "only grid tracks"], answer: 0 },
    { id: 18, type: "mcq", text: "Which is a semantic HTML element?", options: ["<div>", "<span>", "<article>", "<b>"], answer: 2 },
    { id: 19, type: "mcq", text: "media queries are mainly used for?", options: ["Database queries", "Responsive design", "API keys", "Encryption"], answer: 1 },
    { id: 20, type: "mcq", text: "fetch() in JavaScript is used to?", options: ["Style DOM", "Make network requests", "Compile CSS", "Create folders"], answer: 1 },
    { id: 21, type: "mcq", text: "Which status code means OK?", options: ["404", "500", "200", "301"], answer: 2 },
    { id: 22, type: "mcq", text: "LocalStorage data persists until?", options: ["Page refresh only", "Browser close only", "Cleared by user/code", "Never saved"], answer: 2 },
    { id: 23, type: "mcq", text: "Which is NOT a JavaScript data type?", options: ["String", "Boolean", "Float32Matrix", "Number"], answer: 2 },
    { id: 24, type: "mcq", text: "In Flexbox, justify-content controls?", options: ["Main axis alignment", "Font size", "Z-index", "Border radius"], answer: 0 },
    { id: 25, type: "mcq", text: "npm is used for?", options: ["Package management in Node ecosystem", "Hosting DNS", "Drawing UI", "Video encoding"], answer: 0 },
    { id: 26, type: "desc", text: "Explain the difference between Frontend and Backend development with one example each." },
    { id: 27, type: "desc", text: "When would you choose CSS Flexbox over CSS Grid? Give a practical example." },
    { id: 28, type: "desc", text: "Describe how HTTPS improves security compared to HTTP." },
    { id: 29, type: "desc", text: "Write steps to create a simple REST API endpoint using Express.js (in words)." },
    { id: 30, type: "desc", text: "Explain how you would structure a final Full Stack project (frontend + backend + database)." }
  ];

  function loadAnswers() {
    try { return JSON.parse(localStorage.getItem(EXAM_KEY) || "{}"); } catch { return {}; }
  }
  function saveAnswers(data) {
    localStorage.setItem(EXAM_KEY, JSON.stringify(data));
  }

  function initExamPage() {
    const root = document.getElementById("examRoot");
    if (!root) return;

    let current = 1;
    let flagged = new Set();
    let answers = loadAnswers();

    const total = QUESTIONS.length;
    root.innerHTML = `
      <div class="exam-timer mb-3" id="examTimer" data-seconds="3600">
        <div>
          <strong>Full Stack Bootcamp · Month 2 Exam</strong>
          <div style="font-size:.8rem;color:var(--muted)">Auto-save on · Anti-cheating mode · ${total} questions</div>
        </div>
        <div class="text-end">
          <div>Time left: <strong data-time>60:00</strong></div>
          <div class="autosave-pill" id="autoSaveStatus"><i class="bi bi-check2-circle"></i> Ready</div>
        </div>
      </div>
      <div class="exam-layout">
        <aside class="card-nm card-pad static exam-nav-card">
          <strong style="font-size:.9rem">Question map</strong>
          <div class="q-grid mt-2" id="qMap"></div>
          <div style="font-size:.75rem;color:var(--muted);margin-top:.75rem">
            <div>Answered: <span id="answeredCount">0</span> / ${total}</div>
            <div>Flagged: <span id="flaggedCount">0</span></div>
          </div>
        </aside>
        <div>
          <div id="examPanels"></div>
          <div class="exam-actions">
            <button class="btn-nm btn-outline-nm btn-sm-nm" type="button" id="prevQ">Previous</button>
            <button class="btn-nm btn-outline-nm btn-sm-nm" type="button" id="nextQ">Next</button>
            <button class="btn-nm btn-outline-nm btn-sm-nm" type="button" id="flagQ"><i class="bi bi-flag"></i> Flag</button>
            <button class="btn-nm btn-outline-nm btn-sm-nm" type="button" id="saveQ">Save progress</button>
            <button class="btn-nm btn-primary-nm btn-sm-nm" type="button" id="submitExam">Submit exam</button>
          </div>
        </div>
      </div>`;

    const map = root.querySelector("#qMap");
    const panels = root.querySelector("#examPanels");

    QUESTIONS.forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-dot";
      btn.textContent = q.id;
      btn.dataset.qid = q.id;
      btn.addEventListener("click", () => showQuestion(q.id));
      map.appendChild(btn);

      const panel = document.createElement("div");
      panel.className = "exam-panel question-card";
      panel.dataset.qid = q.id;
      if (q.type === "mcq") {
        panel.innerHTML = `
          <div class="badge-nm mb-2">MCQ · Question ${q.id} of ${total}</div>
          <h2 style="font-size:1.1rem">${q.text}</h2>
          <div class="options">
            ${q.options.map((opt, i) => `
              <label class="option-nm ${String(answers[q.id]) === String(i) ? "selected" : ""}">
                <input type="radio" name="q${q.id}" value="${i}" ${String(answers[q.id]) === String(i) ? "checked" : ""}>
                <span>${opt}</span>
              </label>`).join("")}
          </div>`;
      } else {
        panel.innerHTML = `
          <div class="badge-nm mb-2">Descriptive · Question ${q.id} of ${total}</div>
          <h2 style="font-size:1.1rem">${q.text}</h2>
          <textarea class="form-control desc-answer" rows="6" placeholder="Type your answer... (auto-saves)">${answers[q.id] || ""}</textarea>`;
      }
      panels.appendChild(panel);
    });

    function markAutosave(msg) {
      const el = root.querySelector("#autoSaveStatus");
      if (el) el.innerHTML = `<i class="bi bi-check2-circle"></i> ${msg}`;
    }

    function persist() {
      saveAnswers(answers);
      markAutosave("Saved " + new Date().toLocaleTimeString());
      updateMap();
    }

    function updateMap() {
      let answered = 0;
      map.querySelectorAll(".q-dot").forEach((dot) => {
        const id = Number(dot.dataset.qid);
        const has = answers[id] !== undefined && answers[id] !== "";
        if (has) answered += 1;
        dot.classList.toggle("answered", has);
        dot.classList.toggle("current", id === current);
        dot.classList.toggle("flagged", flagged.has(id));
      });
      root.querySelector("#answeredCount").textContent = answered;
      root.querySelector("#flaggedCount").textContent = flagged.size;
    }

    function showQuestion(id) {
      current = id;
      panels.querySelectorAll(".exam-panel").forEach((p) => {
        p.classList.toggle("active", Number(p.dataset.qid) === id);
      });
      updateMap();
    }

    panels.addEventListener("click", (e) => {
      const opt = e.target.closest(".option-nm");
      if (!opt) return;
      const panel = opt.closest(".exam-panel");
      const qid = Number(panel.dataset.qid);
      panel.querySelectorAll(".option-nm").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      const input = opt.querySelector("input");
      if (input) {
        input.checked = true;
        answers[qid] = input.value;
        persist();
      }
    });

    panels.addEventListener("input", (e) => {
      if (!e.target.classList.contains("desc-answer")) return;
      const panel = e.target.closest(".exam-panel");
      const qid = Number(panel.dataset.qid);
      answers[qid] = e.target.value;
      persist();
    });

    root.querySelector("#prevQ").addEventListener("click", () => showQuestion(Math.max(1, current - 1)));
    root.querySelector("#nextQ").addEventListener("click", () => showQuestion(Math.min(total, current + 1)));
    root.querySelector("#flagQ").addEventListener("click", () => {
      if (flagged.has(current)) flagged.delete(current);
      else flagged.add(current);
      updateMap();
      window.NMLearn?.showToast(flagged.has(current) ? "Question flagged" : "Flag removed");
    });
    root.querySelector("#saveQ").addEventListener("click", () => {
      persist();
      window.NMLearn?.showToast("Progress saved");
    });
    root.querySelector("#submitExam").addEventListener("click", () => {
      const answered = Object.keys(answers).filter((k) => answers[k] !== "").length;
      if (answered < 5) {
        window.NMLearn?.showToast("Please answer at least 5 questions before submitting");
        return;
      }
      if (!confirm(`Submit exam? Answered ${answered}/${total}`)) return;

      let score = 0;
      let mcqTotal = 0;
      QUESTIONS.forEach((q) => {
        if (q.type !== "mcq") return;
        mcqTotal += 1;
        if (String(answers[q.id]) === String(q.answer)) score += 1;
      });
      const percent = Math.round((score / mcqTotal) * 100);
      localStorage.setItem("nmlearn_exam_result", JSON.stringify({
        score, mcqTotal, percent, answered, total, at: Date.now()
      }));
      localStorage.removeItem(EXAM_KEY);
      window.NMLearn?.showToast("Exam submitted");
      setTimeout(() => { location.href = "exam-result.html"; }, 600);
    });

    showQuestion(1);

    // timer (re-init after HTML injected)
    const timerEl = root.querySelector("#examTimer");
    let seconds = Number(timerEl.dataset.seconds || 3600);
    const label = timerEl.querySelector("[data-time]");
    const tick = () => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      if (label) label.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (seconds <= 0) {
        window.NMLearn?.showToast("Time is up. Submitting...");
        root.querySelector("#submitExam").click();
        return;
      }
      seconds -= 1;
      setTimeout(tick, 1000);
    };
    tick();
  }

  function initLiveSession() {
    const root = document.getElementById("liveRoot");
    if (!root) return;
    const role = root.dataset.role; // student | teacher

    const stage = root.querySelector("[data-live-stage]");
    const chatBox = root.querySelector("[data-chat-messages]");
    const chatInput = root.querySelector("[data-chat-input]");
    const sendBtn = root.querySelector("[data-chat-send]");
    const status = root.querySelector("[data-live-status]");

    function setStatus(text) {
      if (status) status.textContent = text;
    }

    function addChat(who, text) {
      if (!chatBox || !text.trim()) return;
      const div = document.createElement("div");
      div.className = "chat-bubble";
      div.innerHTML = `<strong>${who}:</strong> ${escapeHtml(text)}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    sendBtn?.addEventListener("click", () => {
      const val = chatInput.value;
      addChat("You", val);
      chatInput.value = "";
      window.NMLearn?.showToast("Message sent");
    });
    chatInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendBtn?.click();
    });

    root.querySelectorAll("[data-live-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.liveAction;
        const allowed = btn.dataset.allowed === "true";

        if (!allowed) {
          window.NMLearn?.showToast("Permission denied: only teacher can use this");
          setStatus("Blocked: teacher-only control");
          return;
        }

        if (action === "mic" || action === "cam" || action === "hand") {
          btn.classList.toggle("active-toggle");
          const on = btn.classList.contains("active-toggle");
          const labels = { mic: "Microphone", cam: "Camera", hand: "Raise hand" };
          window.NMLearn?.showToast(`${labels[action]} ${on ? "ON" : "OFF"}`);
          setStatus(`${labels[action]} ${on ? "enabled" : "disabled"}`);
          return;
        }

        if (action === "share") {
          btn.classList.toggle("active-toggle");
          const on = btn.classList.contains("active-toggle");
          stage?.classList.toggle("has-share", on);
          stage?.classList.remove("has-board");
          const board = root.querySelector("[data-whiteboard]");
          if (board) board.hidden = true;
          window.NMLearn?.showToast(on ? "Screen sharing started" : "Screen sharing stopped");
          setStatus(on ? "Screen share active" : "Screen share stopped");
          return;
        }

        if (action === "board") {
          btn.classList.toggle("active-toggle");
          const on = btn.classList.contains("active-toggle");
          stage?.classList.toggle("has-board", on);
          stage?.classList.remove("has-share");
          const board = root.querySelector("[data-whiteboard]");
          if (board) board.hidden = !on;
          window.NMLearn?.showToast(on ? "Whiteboard opened" : "Whiteboard closed");
          setStatus(on ? "Whiteboard active" : "Whiteboard closed");
          return;
        }

        if (action === "record") {
          btn.classList.toggle("active-toggle");
          const on = btn.classList.contains("active-toggle");
          window.NMLearn?.showToast(on ? "Recording started" : "Recording stopped");
          setStatus(on ? "Recording…" : "Recording stopped");
          return;
        }

        if (action === "muteall") {
          window.NMLearn?.showToast("All students muted");
          setStatus("Students muted by host");
          return;
        }

        if (action === "waiting") {
          window.NMLearn?.showToast("Waiting room: 2 students admitted");
          setStatus("Waiting room updated");
          addChat("System", "2 students admitted from waiting room");
          return;
        }

        if (action === "attendance") {
          window.NMLearn?.showToast("Attendance marked for joined students");
          setStatus("Attendance saved");
          return;
        }

        if (action === "startcall") {
          // students never get this; teachers already in host mode
          window.NMLearn?.showToast("Session already live");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Wait until app shell finishes wrapping page content
    setTimeout(() => {
      initExamPage();
      initLiveSession();
    }, 0);
  });
})();
