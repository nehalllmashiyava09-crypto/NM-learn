/* NM Learn LMS — shared app logic (demo / front-end) */

(function () {
  "use strict";

  const STORAGE_KEY = "nmlearn_session";

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setSession(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function depthPrefix() {
    const path = location.pathname.replace(/\\/g, "/");
    if (/\/(student|teacher|admin)\//.test(path)) return "../";
    return "";
  }

  function requireAuth(roles) {
    const session = getSession();
    const p = depthPrefix();
    if (!session) {
      location.href = p + "login.html";
      return null;
    }
    if (roles && !roles.includes(session.role)) {
      const map = { student: "student/dashboard.html", teacher: "teacher/dashboard.html", admin: "admin/dashboard.html" };
      location.href = p + map[session.role];
      return null;
    }
    return session;
  }

  function brandHTML(p) {
    return `<a class="brand" href="${p}index.html">
      <span class="brand-mark">NM</span>
      <span><strong>NM Learn</strong><small>Learning Platform</small></span>
    </a>`;
  }

  function renderPublicHeader() {
    const el = document.getElementById("public-header");
    if (!el) return;
    const p = depthPrefix();
    const session = getSession();
    const dash = session
      ? `${p}${session.role}/dashboard.html`
      : `${p}login.html`;
    el.innerHTML = `
      <header class="public-header">
        <div class="inner">
          ${brandHTML(p)}
          <nav class="public-nav">
            <a href="${p}index.html#courses">Courses</a>
            <a href="${p}index.html#features">Features</a>
            <a href="${p}index.html#live">Live Learning</a>
            <a href="${p}index.html#exams">Assessments</a>
            <a href="${p}index.html#faq">FAQs</a>
          </nav>
          <div class="public-actions">
            ${session
              ? `<a class="btn-nm btn-outline-nm btn-sm-nm" href="${dash}">My Learning</a>`
              : `<a class="btn-nm btn-outline-nm btn-sm-nm" href="${p}login.html">Log in</a>
                 <a class="btn-nm btn-primary-nm btn-sm-nm" href="${p}register.html">Create account</a>`}
          </div>
        </div>
      </header>`;
  }

  function renderPublicFooter() {
    const el = document.getElementById("public-footer");
    if (!el) return;
    const p = depthPrefix();
    el.innerHTML = `
      <footer class="site-footer">
        <div class="container-nm">
          <div class="row g-4">
            <div class="col-md-4">
              ${brandHTML(p).replace('color: inherit', 'color:#fff').replace('var(--ink)', '#fff')}
              <p class="mt-3" style="color:rgba(255,255,255,.7)">A secure online learning platform for students, teachers, and institutions — focused entirely on education.</p>
            </div>
            <div class="col-6 col-md-2">
              <h5>Learn</h5>
              <a href="${p}index.html#courses">Courses</a>
              <a href="${p}index.html#live">Live Classes</a>
              <a href="${p}index.html#exams">Monthly Exams</a>
              <a href="${p}index.html#certificates">Certificates</a>
            </div>
            <div class="col-6 col-md-2">
              <h5>Platform</h5>
              <a href="${p}login.html">Student Login</a>
              <a href="${p}login.html">Teacher Login</a>
              <a href="${p}register.html">Create Account</a>
              <a href="${p}index.html#features">Features</a>
            </div>
            <div class="col-md-4">
              <h5>Learning Focus</h5>
              <p style="color:rgba(255,255,255,.7);font-size:.92rem;margin:0">No ads. No sales popups. Just structured learning, teacher-led live sessions, notes, assignments, exams, and certificates.</p>
            </div>
          </div>
          <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
            <span>© ${new Date().getFullYear()} NM Learn. All rights reserved.</span>
            <span>Secure · Role-based · Student-first</span>
          </div>
        </div>
      </footer>`;
  }

  function studentNav(active) {
    const items = [
      ["dashboard.html", "bi-grid-1x2", "Dashboard"],
      ["courses.html", "bi-journal-bookmark", "My Courses"],
      ["live-classes.html", "bi-camera-video", "Live Classes"],
      ["notes.html", "bi-file-earmark-text", "Notes"],
      ["assignments.html", "bi-pencil-square", "Assignments"],
      ["quizzes.html", "bi-question-circle", "Quizzes"],
      ["exams.html", "bi-clipboard2-check", "Monthly Exams"],
      ["discussions.html", "bi-chat-dots", "Discussions"],
      ["attendance.html", "bi-calendar-check", "Attendance"],
      ["grades.html", "bi-bar-chart", "Grades"],
      ["certificates.html", "bi-award", "Certificates"],
      ["notifications.html", "bi-bell", "Notifications"],
      ["payments.html", "bi-receipt", "Payments"],
      ["profile.html", "bi-person", "Profile"],
    ];
    return items.map(([href, icon, label]) =>
      `<a class="side-link ${active === href ? "active" : ""}" href="${href}"><i class="bi ${icon}"></i>${label}</a>`
    ).join("");
  }

  function teacherNav(active) {
    const items = [
      ["dashboard.html", "bi-grid-1x2", "Dashboard"],
      ["courses.html", "bi-collection", "My Courses"],
      ["create-course.html", "bi-plus-circle", "Create Course"],
      ["live-classes.html", "bi-broadcast", "Live Classes"],
      ["students.html", "bi-people", "Students"],
      ["assignments.html", "bi-pencil-square", "Assignments"],
      ["quizzes.html", "bi-question-circle", "Quizzes"],
      ["exams.html", "bi-clipboard2-check", "Exams"],
      ["attendance.html", "bi-calendar-check", "Attendance"],
      ["grades.html", "bi-bar-chart", "Grading"],
      ["announcements.html", "bi-megaphone", "Announcements"],
      ["certificates.html", "bi-award", "Certificates"],
      ["discussions.html", "bi-chat-dots", "Discussions"],
      ["profile.html", "bi-person", "Profile"],
    ];
    return items.map(([href, icon, label]) =>
      `<a class="side-link ${active === href ? "active" : ""}" href="${href}"><i class="bi ${icon}"></i>${label}</a>`
    ).join("");
  }

  function adminNav(active) {
    const items = [
      ["dashboard.html", "bi-speedometer2", "Dashboard"],
      ["teachers.html", "bi-person-badge", "Teachers"],
      ["students.html", "bi-people", "Students"],
      ["courses.html", "bi-journal-bookmark", "Courses"],
      ["payments.html", "bi-credit-card", "Payments"],
      ["certificates.html", "bi-award", "Certificates"],
      ["exams.html", "bi-clipboard2-check", "Exam Schedules"],
      ["reports.html", "bi-file-earmark-bar-graph", "Reports"],
      ["analytics.html", "bi-graph-up", "Analytics"],
      ["security.html", "bi-shield-lock", "Security"],
      ["permissions.html", "bi-key", "Permissions"],
    ];
    return items.map(([href, icon, label]) =>
      `<a class="side-link ${active === href ? "active" : ""}" href="${href}"><i class="bi ${icon}"></i>${label}</a>`
    ).join("");
  }

  function firstName(fullName) {
    const n = (fullName || "Learner").trim();
    return n.split(/\s+/)[0];
  }

  function timeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function roleHelloSub(role) {
    if (role === "student") return "Ready to continue learning? Your courses, live classes, and progress are waiting.";
    if (role === "teacher") return "Your classroom tools are ready — host live sessions, grade work, and guide students.";
    return "Here’s your platform overview — users, courses, security, and performance at a glance.";
  }

  function helloBannerHTML(session, role) {
    const name = firstName(session.name);
    return `
      <section class="hello-banner" aria-label="Greeting">
        <div class="hello-kicker"><i class="bi bi-brightness-high"></i> ${timeGreeting()}</div>
        <h1 class="hello-title">Hello, <span class="hello-name">${name}</span></h1>
        <p class="hello-sub">${roleHelloSub(role)}</p>
      </section>`;
  }

  function renderAppShell(role, activePage) {
    const mount = document.getElementById("app-shell");
    if (!mount) return;
    const session = requireAuth([role]);
    if (!session) return;

    const p = "../";
    const nav = role === "student" ? studentNav(activePage)
      : role === "teacher" ? teacherNav(activePage)
      : adminNav(activePage);

    const isDashboard = activePage === "dashboard.html";
    const pageLabel = document.title.split("|")[0].trim();
    const content = mount.innerHTML;
    const hello = isDashboard ? helloBannerHTML(session, role) : "";

    mount.innerHTML = `
      <div class="app-shell">
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
        <aside class="sidebar" id="sidebar">
          <div class="px-2 pb-3 mb-2" style="border-bottom:1px solid var(--line)">
            ${brandHTML(p)}
            <div class="mt-2"><span class="role-pill">${role}</span></div>
          </div>
          <div class="side-section">Menu</div>
          ${nav}
          <div class="mt-auto pt-3 px-2">
            <button class="btn-nm btn-outline-nm btn-sm-nm btn-block" id="logoutBtn" type="button"><i class="bi bi-box-arrow-right"></i> Log out</button>
          </div>
        </aside>
        <div class="main-wrap">
          <div class="topbar">
            <div class="d-flex align-items-center gap-2">
              <button class="icon-btn menu-toggle-app" id="menuToggle" type="button" aria-label="Menu"><i class="bi bi-list"></i></button>
              <div>
                <p class="topbar-title">${isDashboard ? "NM Learn" : pageLabel}</p>
                ${isDashboard ? "" : `<div style="font-size:.92rem;font-weight:750;font-family:var(--display);color:var(--ink);margin-top:.1rem">${firstName(session.name)}</div>`}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <div class="search-box"><i class="bi bi-search" style="color:var(--muted)"></i><input placeholder="Search courses, notes..." aria-label="Search"></div>
              <a class="icon-btn" href="notifications.html" aria-label="Notifications" style="${role === "admin" ? "display:none" : ""}"><i class="bi bi-bell"></i></a>
              <a class="avatar" href="${role === "admin" ? "dashboard.html" : "profile.html"}" title="${session.name}">${session.initials}</a>
            </div>
          </div>
          <div class="page-content">${hello}${content}</div>
        </div>
      </div>`;

    document.getElementById("menuToggle")?.addEventListener("click", () => {
      document.getElementById("sidebar")?.classList.add("open");
      document.getElementById("sidebarOverlay")?.classList.add("show");
    });
    document.getElementById("sidebarOverlay")?.addEventListener("click", () => {
      document.getElementById("sidebar")?.classList.remove("open");
      document.getElementById("sidebarOverlay")?.classList.remove("show");
    });
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      clearSession();
      location.href = p + "login.html";
    });
  }

  function initAuthForms() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;
        const role = loginForm.role.value;
        if (!email || !password) return;
        const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Learner";
        const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        setSession({ email, role, name, initials, loggedInAt: Date.now() });
        location.href = `${role}/dashboard.html`;
      });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = registerForm.name.value.trim();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value;
        if (!name || !email || !password) return;
        if (password.length < 8) {
          showToast("Password must be at least 8 characters.");
          return;
        }
        const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        setSession({ email, role: "student", name, initials, loggedInAt: Date.now() });
        showToast("Account created. Email verification sent (demo).");
        setTimeout(() => { location.href = "student/dashboard.html"; }, 700);
      });
    }
  }

  function showToast(msg) {
    let t = document.querySelector(".toast-nm");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast-nm";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
  }

  function initFaq() {
    document.querySelectorAll(".faq-item .faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const open = item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
        if (!open) item.classList.add("open");
      });
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  function initExamTimer() {
    const el = document.getElementById("examTimer");
    if (!el) return;
    let seconds = Number(el.dataset.seconds || 3600);
    const label = el.querySelector("[data-time]");
    const tick = () => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      if (label) label.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (seconds <= 0) {
        showToast("Time is up. Submitting exam...");
        setTimeout(() => { location.href = "exams.html"; }, 1000);
        return;
      }
      seconds -= 1;
      setTimeout(tick, 1000);
    };
    tick();
  }

  function initOptions() {
    document.querySelectorAll(".option-nm").forEach((opt) => {
      opt.addEventListener("click", () => {
        const group = opt.parentElement;
        group.querySelectorAll(".option-nm").forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
        const input = opt.querySelector("input");
        if (input) input.checked = true;
      });
    });
  }

  // Expose helpers for inline pages
  window.NMLearn = {
    getSession,
    setSession,
    clearSession,
    requireAuth,
    renderAppShell,
    showToast,
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderPublicHeader();
    renderPublicFooter();
    initAuthForms();
    initFaq();
    initReveal();
    initExamTimer();
    initOptions();

    const shell = document.getElementById("app-shell");
    if (shell) {
      const role = shell.dataset.role;
      const page = shell.dataset.page;
      renderAppShell(role, page);
    }
  });
})();
