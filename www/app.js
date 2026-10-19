'use strict';

// ---------- Константы ----------

const STORE_KEY = 'vbsal.v1';
const APP_VERSION = '1.2';
const BREATH_PRICE = 500;   // «второе дыхание» прибавляется к цене процедуры
const WORKER_SHARE = 0.4;   // банщикам остаётся 40% (минус 60%)
const DEFAULT_RATE = 4500;
const DEFAULT_BATHERS = 2;
const MAX_BATHERS = 5;

const DEFAULT_SERVICES = [
  ['Догрев', 1500],
  ['Детское парение', 1500],
  ['Берёзовая помывка', 1900],
  ['Быстрое парение', 2000],
  ['Скрабирование', 2500],
  ['Доп.пар', 3000],
  ['Кузнец', 4000],
  ['Дубовый молот', 5000],
  ['Наковальня', 5750],
  ['Стальная лавка', 6000],
  ['Авторское парение', 6000],
  ['Банный король', 7000],
  ['Стахановское', 10000],
  ['Купель', 1250],
];

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const MONTHS_PREP = ['январе', 'феврале', 'марте', 'апреле', 'мае', 'июне', 'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAYS_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

const svg = (body, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;

const ICON = {
  chart: svg('<path d="M3 21h18"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="5" width="3" height="13" rx="1"/><rect x="16" y="8" width="3" height="10" rx="1"/>'),
  left: svg('<path d="M15 5l-7 7 7 7"/>'),
  right: svg('<path d="M9 5l7 7-7 7"/>'),
  gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  close: svg('<path d="M18 6L6 18M6 6l12 12"/>'),
  wind: svg('<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>'),
  flame: svg('<path d="M12 22c4 0 7-2.8 7-6.9 0-3.4-2.4-5.8-3.9-8.4-.5 1.9-1.6 3.1-3 3.6.3-3-1.2-5.8-3.6-8.3C8.4 5.6 5 8.7 5 15.1 5 19.2 8 22 12 22z"/>'),
  users: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
  leaf: svg('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'),
  coins: svg('<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M16.71 13.88l.7.71-2.82 2.82"/>'),
  wallet: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>'),
  moon: svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
  refresh: svg('<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>'),
  tag: svg('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>'),
};

// ---------- Хранилище ----------

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultServices() {
  return DEFAULT_SERVICES.map(([name, price]) => ({ id: uid(), name, price }));
}

function defaultState() {
  return {
    settings: { rate: DEFAULT_RATE, recalc: false, theme: 'dark' },
    services: defaultServices(),
    days: {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const base = defaultState();
      return {
        settings: { ...base.settings, ...s.settings },
        services: Array.isArray(s.services) ? s.services : base.services,
        days: s.days && typeof s.days === 'object' ? s.days : {},
      };
    }
  } catch (e) { /* повреждённые данные — начинаем с чистого листа */ }
  return defaultState();
}

let state = loadState();

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* нет места */ }
}

if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

// ---------- Даты и расчёт ----------

const pad = (n) => String(n).padStart(2, '0');
const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function todayKey() {
  const t = new Date();
  return keyOf(t.getFullYear(), t.getMonth(), t.getDate());
}

function newDay() {
  return { shift: false, rate: state.settings.rate, bathers: DEFAULT_BATHERS, procs: [] };
}

function ensureDay(key) {
  if (!state.days[key]) state.days[key] = newDay();
  return state.days[key];
}

const procPrice = (p) => p.price + (p.breath ? BREATH_PRICE : 0);
const procSum = (d) => d.procs.reduce((s, p) => s + procPrice(p), 0);
const dayRate = (d) => (d.shift ? (d.rate ?? state.settings.rate) : 0);
const dayTips = (d) => d.tips || 0;   // в днях до версии 1.1 поля нет
const hasData = (d) => !!d && (d.shift || d.procs.length > 0 || dayTips(d) > 0);

// (ставка за смену, если отмечена) + (процедуры − 60%) / банщиков + личные чаевые
function dayEarn(d) {
  if (!d) return 0;
  return Math.round(dayRate(d) + (procSum(d) * WORKER_SHARE) / (d.bathers || DEFAULT_BATHERS) + dayTips(d));
}

function cleanupDay(key) {
  const d = state.days[key];
  if (d && !d.shift && d.procs.length === 0 && !dayTips(d) && d.bathers === DEFAULT_BATHERS) delete state.days[key];
}

function monthStats(y, m) {
  const dim = daysIn(y, m);
  const perDay = [];
  const top = new Map();
  let shifts = 0, procs = 0, rateSum = 0, tipsSum = 0, total = 0, active = 0;
  for (let i = 1; i <= dim; i++) {
    const d = state.days[keyOf(y, m, i)];
    const earn = hasData(d) ? dayEarn(d) : 0;
    perDay.push(earn);
    if (!hasData(d)) continue;
    active++;
    total += earn;
    if (d.shift) { shifts++; rateSum += dayRate(d); }
    tipsSum += dayTips(d);
    procs += d.procs.length;
    for (const p of d.procs) top.set(p.name, (top.get(p.name) || 0) + 1);
  }
  const topList = [...top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { dim, perDay, shifts, procs, rateSum, tipsSum, percentSum: total - rateSum - tipsSum, total, active, topList };
}

// ---------- Навигация ----------

const now = new Date();
const view = {
  month: { y: now.getFullYear(), m: now.getMonth() },
  statsMonth: { y: now.getFullYear(), m: now.getMonth() },
  statsBar: null,
};
let navDepth = 0;

function currentRoute() {
  const [name, arg] = location.hash.replace(/^#\/?/, '').split('/');
  return { name: name || 'calendar', arg };
}

function go(path) {
  navDepth++;
  location.hash = '#/' + path;
}

// Возвращает false, если назад уже некуда (корневой экран).
function back() {
  if (isSheetOpen()) { closeSheet(); return true; }
  if (currentRoute().name === 'calendar') return false;
  if (navDepth > 0) { navDepth--; history.back(); } else location.replace('#/');
  return true;
}

function shiftMonth(mon, delta) {
  const d = new Date(mon.y, mon.m + delta, 1);
  return { y: d.getFullYear(), m: d.getMonth() };
}

// ---------- Экран: календарь ----------

function renderCalendar() {
  const { y, m } = view.month;
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const rows = Math.ceil((offset + daysIn(y, m)) / 7);
  const today = todayKey();

  let cells = '';
  for (let i = 0; i < rows * 7; i++) {
    const date = new Date(y, m, 1 - offset + i);
    const key = keyOf(date.getFullYear(), date.getMonth(), date.getDate());
    const d = state.days[key];
    const cls = ['cell'];
    if (date.getMonth() !== m) cls.push('other');
    if (key === today) cls.push('today');
    if (d && d.shift) cls.push('shift');
    const amt = hasData(d) ? dayEarn(d) : 0;
    cells += `<button class="${cls.join(' ')}" data-action="open-day" data-key="${key}">
      ${d && !d.shift && d.procs.length ? '<span class="dot"></span>' : ''}
      <span>${date.getDate()}</span>
      ${amt ? `<span class="amt">${fmt(amt)}</span>` : ''}
    </button>`;
  }

  const st = monthStats(y, m);

  return `<div class="screen">
    <header class="topbar cal">
      <button class="icon-btn" data-action="stats" aria-label="Статистика">${ICON.chart}</button>
      <button class="icon-btn" data-action="prev-month" aria-label="Предыдущий месяц">${ICON.left}</button>
      <h1 class="top-title" data-action="this-month">${MONTHS[m]} ${y}</h1>
      <button class="icon-btn" data-action="next-month" aria-label="Следующий месяц">${ICON.right}</button>
      <button class="icon-btn" data-action="settings" aria-label="Настройки">${ICON.gear}</button>
    </header>
    <div class="weekdays">${WEEKDAYS.map((w) => `<span>${w}</span>`).join('')}</div>
    <div class="cal-grid" id="cal-grid">${cells}</div>
    <button class="month-sum" data-action="stats">
      <div><div class="lbl">Смен</div><div class="val">${st.shifts}</div></div>
      <div class="right"><div class="lbl">Заработано в ${MONTHS_PREP[m]}</div><div class="val accent">${fmt(st.total)} ₽</div></div>
    </button>
  </div>`;
}

// ---------- Экран: день ----------

function renderDay(key) {
  const d = state.days[key] || newDay();
  const date = parseKey(key);
  const rate = d.shift ? dayRate(d) : state.settings.rate;

  const list = d.procs.length
    ? d.procs.map((p, i) => `<div class="proc">
        <div class="grow">
          <div class="proc-name">${esc(p.name)}</div>
          <div class="proc-price">${fmt(procPrice(p))} ₽</div>
        </div>
        <button class="chip ${p.breath ? 'on' : ''}" data-action="toggle-breath" data-i="${i}">${ICON.wind}2-е дыхание</button>
        <button class="del" data-action="del-proc" data-i="${i}" aria-label="Удалить">${ICON.close}</button>
      </div>`).join('')
    : '<div class="empty">Нажмите «+», чтобы добавить процедуру</div>';

  return `<div class="screen">
    <header class="topbar">
      <button class="icon-btn" data-action="back" aria-label="Назад">${ICON.left}</button>
      <div>
        <h1 class="top-title">${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}${hasData(d) ? '<span class="title-dot"></span>' : ''}</h1>
        <div class="top-sub">${WEEKDAYS_FULL[date.getDay()]}</div>
      </div>
      <span></span>
    </header>

    <div class="card">
      <button class="card-head tap" data-action="toggle-shift">
        <span class="tile orange">${ICON.flame}</span>
        <span class="grow">
          <div class="card-title">Смена</div>
          <div class="card-sub">Ставка ${fmt(rate)} ₽</div>
        </span>
        <span class="switch ${d.shift ? 'on' : ''}"></span>
      </button>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="tile green">${ICON.users}</span>
        <div class="grow"><div class="card-title">Банщиков в смене</div></div>
      </div>
      <div class="seg">
        ${Array.from({ length: MAX_BATHERS }, (_, i) => i + 1)
          .map((n) => `<button class="${d.bathers === n ? 'on' : ''}" data-action="set-bathers" data-n="${n}">${n}</button>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="tile blue">${ICON.leaf}</span>
        <div class="grow">
          <div class="card-title">Процедуры</div>
          ${d.procs.length ? `<div class="card-sub">${d.procs.length} шт.</div>` : ''}
        </div>
        <button class="add-btn" data-action="open-sheet" aria-label="Добавить процедуру">${ICON.plus}</button>
      </div>
      <div class="proc-list">${list}</div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="tile yellow">${ICON.coins}</span>
        <div class="grow"><div class="card-title">Чаевые</div></div>
        <label class="field tips-field">
          <input type="text" inputmode="numeric" pattern="[0-9]*" placeholder="0" data-field="tips" value="${dayTips(d) || ''}">
          <span class="suffix">₽</span>
        </label>
      </div>
    </div>

    <div class="result">
      <div><div class="lbl">ПРОЦЕДУР</div><div class="val">${d.procs.length}</div></div>
      <div class="sep"></div>
      <div><div class="lbl">ЗАРАБОТАНО</div><div class="val" id="day-earn">${fmt(dayEarn(d))}</div></div>
    </div>
  </div>`;
}

// ---------- Шторка выбора процедур ----------

const sheetRoot = () => document.getElementById('sheet-root');
const isSheetOpen = () => sheetRoot().classList.contains('open');

function procCount(key, name) {
  const d = state.days[key];
  return d ? d.procs.filter((p) => p.name === name).length : 0;
}

function openSheet() {
  const key = currentRoute().arg;
  const root = sheetRoot();
  root.innerHTML = `<div class="sheet-backdrop" data-action="close-sheet"></div>
    <div class="sheet" role="dialog" aria-label="Добавить процедуру">
      <div class="sheet-handle"></div>
      <div class="sheet-head">
        <h2>Добавить процедуру</h2>
        <button class="text-btn" data-action="close-sheet">Готово</button>
      </div>
      <div class="sheet-list">
        ${state.services.map((s) => {
          const c = procCount(key, s.name);
          return `<button class="svc" data-action="add-proc" data-id="${s.id}">
            <span class="svc-name">${esc(s.name)}</span>
            <span class="svc-price">${fmt(s.price)} ₽</span>
            <span class="badge ${c ? '' : 'hidden'}" data-badge="${s.id}">${c}</span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('open')));
}

function closeSheet(instant) {
  const root = sheetRoot();
  if (!root.classList.contains('open')) return;
  root.classList.remove('open');
  if (instant) root.innerHTML = '';
  else setTimeout(() => { if (!root.classList.contains('open')) root.innerHTML = ''; }, 280);
}

function updateSheetBadges(key) {
  for (const s of state.services) {
    const el = document.querySelector(`[data-badge="${s.id}"]`);
    if (!el) continue;
    const c = procCount(key, s.name);
    el.textContent = c;
    el.classList.toggle('hidden', !c);
  }
}

// ---------- Экран: статистика ----------

// Плавная кривая через точки (Catmull-Rom → кубические Безье)
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function renderSpark(st, y, m) {
  const t = new Date();
  const isCurrent = t.getFullYear() === y && t.getMonth() === m;
  const isFuture = new Date(y, m, 1) > t;
  const last = isFuture ? 1 : isCurrent ? t.getDate() : st.dim;
  const W = 300, H = 84, P = 6;
  let acc = 0;
  const cum = st.perDay.slice(0, last).map((v) => (acc += v));
  const max = Math.max(acc, 1);
  const pts = cum.map((v, i) => [
    P + (i / Math.max(st.dim - 1, 1)) * (W - 2 * P),
    H - P - (v / max) * (H - 2 * P - 10),
  ]);
  if (pts.length === 1) pts.push([pts[0][0] + 1, pts[0][1]]);
  const line = smoothPath(pts);
  const end = pts[pts.length - 1];
  const area = `${line} L${end[0].toFixed(1)},${H} L${pts[0][0]},${H} Z`;
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    <defs>
      <linearGradient id="sg" x1="0" x2="1"><stop offset="0" stop-color="#2f5bff"/><stop offset="1" stop-color="#62c8ff"/></linearGradient>
      <linearGradient id="sa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82f6" stop-opacity=".32"/><stop offset="1" stop-color="#3b82f6" stop-opacity="0"/></linearGradient>
      <filter id="glow" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <path d="${area}" fill="url(#sa)"/>
    <path d="${line}" fill="none" stroke="url(#sg)" stroke-width="2.4" filter="url(#glow)"/>
    <circle cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="4" fill="#9fdcff" filter="url(#glow)"/>
  </svg>`;
}

function renderBars(st) {
  const max = Math.max(...st.perDay, 1);
  const sel = view.statsBar;
  const cols = st.perDay.map((v, i) => {
    const tipCls = i < 3 ? 'tl' : i > st.dim - 4 ? 'tr' : '';
    const tip = sel === i ? `<span class="bar-tip ${tipCls}">${i + 1}: ${fmt(v)} ₽</span>` : '';
    const h = v ? Math.max((v / max) * 100, 4) : 0;
    return `<button class="bar-col ${sel === i ? 'sel' : ''}" data-action="stats-bar" data-i="${i}" aria-label="${i + 1} число">
      <span class="bar-track"><span class="bar-fill" style="height:${h}%">${tip}</span></span>
    </button>`;
  }).join('');
  const lbls = st.perDay.map((_, i) => {
    const day = i + 1;
    return `<span>${day === 1 || day % 5 === 0 ? day : ''}</span>`;
  }).join('');
  return `<div class="bars">${cols}</div><div class="bar-lbls">${lbls}</div>`;
}

function renderStats() {
  const { y, m } = view.statsMonth;
  const st = monthStats(y, m);
  const avg = st.active ? st.total / st.active : 0;
  const share = (v) => (st.total ? (v / st.total) * 100 : 0);
  const topMax = st.topList.length ? st.topList[0][1] : 1;

  const body = st.active ? `
    <div class="grid2">
      <div class="glass">
        <div class="s-label">Смены</div>
        <div class="s-mid">${st.shifts}</div>
        <div class="s-note">из ${st.dim} дней</div>
      </div>
      <div class="glass">
        <div class="s-label">Процедуры</div>
        <div class="s-mid">${st.procs}</div>
        <div class="s-note">за месяц</div>
      </div>
    </div>

    <div class="glass">
      <div class="g-head"><div class="g-title">Из чего сложилось</div></div>
      <div class="meter">
        <span>Ставка</span>
        <div class="meter-track"><div class="meter-fill warm" style="width:${share(st.rateSum)}%"></div></div>
        <span class="num">${fmt(st.rateSum)} ₽</span>
      </div>
      <div class="meter">
        <span>Процедуры</span>
        <div class="meter-track"><div class="meter-fill" style="width:${share(st.percentSum)}%"></div></div>
        <span class="num">${fmt(st.percentSum)} ₽</span>
      </div>
      ${st.tipsSum ? `<div class="meter">
        <span>Чаевые</span>
        <div class="meter-track"><div class="meter-fill tips" style="width:${share(st.tipsSum)}%"></div></div>
        <span class="num">${fmt(st.tipsSum)} ₽</span>
      </div>` : ''}
      <div class="meter">
        <span>В среднем</span>
        <span></span>
        <span class="num">${fmt(avg)} ₽ / день</span>
      </div>
    </div>

    <div class="glass">
      <div class="g-head">
        <div class="g-title">По дням</div>
        <span class="pill">${MONTHS[m]}</span>
      </div>
      ${renderBars(st)}
    </div>

    <div class="glass">
      <div class="g-head"><div class="g-title">Топ процедур</div></div>
      ${st.topList.length ? st.topList.map(([name, c], i) => `<div class="top-row">
        <span class="rank">${i + 1}</span>
        <div>
          <div class="top-name">${esc(name)}</div>
          <div class="meter-track"><div class="meter-fill" style="width:${(c / topMax) * 100}%"></div></div>
        </div>
        <span class="top-count">× ${c}</span>
      </div>`).join('') : '<div class="s-empty">Процедур пока не было</div>'}
    </div>
  ` : '<div class="glass"><div class="s-empty">В этом месяце пока нет данных</div></div>';

  return `<div class="screen">
    <header class="topbar">
      <button class="icon-btn" data-action="back" aria-label="Назад">${ICON.left}</button>
      <div class="month-nav">
        <button class="icon-btn" data-action="stats-prev" aria-label="Предыдущий месяц">${ICON.left}</button>
        <h1 class="top-title">${MONTHS[m]} ${y}</h1>
        <button class="icon-btn" data-action="stats-next" aria-label="Следующий месяц">${ICON.right}</button>
      </div>
      <span></span>
    </header>

    <div class="glass">
      <div class="g-head">
        <div class="s-label">Заработано в ${MONTHS_PREP[m]}</div>
        <span class="pill">${st.active} ${plural(st.active, 'день', 'дня', 'дней')}</span>
      </div>
      <div class="s-big">${fmt(st.total)}<small>₽</small></div>
      ${renderSpark(st, y, m)}
    </div>
    ${body}
  </div>`;
}

function plural(n, one, few, many) {
  const a = n % 10, b = n % 100;
  if (a === 1 && b !== 11) return one;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few;
  return many;
}

// ---------- Экран: настройки ----------

function renderSettings() {
  const s = state.settings;
  return `<div class="screen">
    <header class="topbar">
      <button class="icon-btn" data-action="back" aria-label="Назад">${ICON.left}</button>
      <h1 class="top-title">Настройки</h1>
      <span></span>
    </header>

    <div class="card">
      <div class="card-head">
        <span class="tile orange">${ICON.wallet}</span>
        <div class="grow"><div class="card-title">Ставка за смену</div></div>
      </div>
      <label class="field rate-field">
        <input type="text" inputmode="numeric" pattern="[0-9]*" data-field="rate" value="${s.rate}">
        <span class="suffix">₽</span>
      </label>
    </div>

    <div class="card">
      <button class="card-head tap" data-action="toggle-recalc">
        <span class="tile purple">${ICON.refresh}</span>
        <span class="grow">
          <div class="card-title">Пересчитывать прошлые смены</div>
          <div class="card-sub">${s.recalc ? 'Новая ставка применится ко всем отмеченным сменам' : 'Прошлые смены сохраняют свою ставку'}</div>
        </span>
        <span class="switch ${s.recalc ? 'on' : ''}"></span>
      </button>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="tile purple">${ICON.moon}</span>
        <div class="grow"><div class="card-title">Тема</div></div>
      </div>
      <div class="seg two">
        <button class="${s.theme !== 'light' ? 'on' : ''}" data-action="set-theme" data-theme="dark">Тёмная</button>
        <button class="${s.theme === 'light' ? 'on' : ''}" data-action="set-theme" data-theme="light">Светлая</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="tile blue">${ICON.tag}</span>
        <div class="grow"><div class="card-title">Прайс</div></div>
      </div>
      ${state.services.map((svc) => `<div class="svc-edit">
        <label class="field"><input type="text" data-field="svc-name" data-id="${svc.id}" value="${esc(svc.name)}"></label>
        <label class="field"><input type="text" inputmode="numeric" pattern="[0-9]*" data-field="svc-price" data-id="${svc.id}" value="${svc.price}"><span class="suffix">₽</span></label>
        <button class="del" data-action="del-service" data-id="${svc.id}" aria-label="Удалить услугу">${ICON.close}</button>
      </div>`).join('')}
      <button class="btn" data-action="add-service">Добавить услугу</button>
      <button class="btn ghost" data-action="reset-services">Вернуть стандартный прайс</button>
      <div class="hint">Изменения прайса не затрагивают уже внесённые дни.</div>
    </div>

    <div class="version">VBsal ${APP_VERSION}</div>
  </div>`;
}

const toInt = (v) => Math.max(0, parseInt(String(v).replace(/\D/g, ''), 10) || 0);

function setRate(rate) {
  state.settings.rate = rate;
  if (state.settings.recalc) {
    for (const d of Object.values(state.days)) if (d.shift) d.rate = rate;
  }
  save();
}

// ---------- Рендер и события ----------

function render() {
  const r = currentRoute();
  let html;
  if (r.name === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(r.arg || '')) html = renderDay(r.arg);
  else if (r.name === 'stats') html = renderStats();
  else if (r.name === 'settings') html = renderSettings();
  else { r.name = 'calendar'; html = renderCalendar(); }
  document.body.dataset.screen = r.name;
  document.getElementById('app').innerHTML = html;
}

function commitDay(key) {
  cleanupDay(key);
  save();
  render();
}

const actions = {
  'stats'() { view.statsMonth = { ...view.month }; view.statsBar = null; go('stats'); },
  'settings'() { go('settings'); },
  'back'() { back(); },
  'prev-month'() { view.month = shiftMonth(view.month, -1); render(); },
  'next-month'() { view.month = shiftMonth(view.month, 1); render(); },
  'this-month'() { const t = new Date(); view.month = { y: t.getFullYear(), m: t.getMonth() }; render(); },
  'open-day'(el) {
    const date = parseKey(el.dataset.key);
    view.month = { y: date.getFullYear(), m: date.getMonth() };
    go('day/' + el.dataset.key);
  },

  'toggle-shift'() {
    const key = currentRoute().arg;
    const d = ensureDay(key);
    d.shift = !d.shift;
    if (d.shift) d.rate = state.settings.rate;
    commitDay(key);
  },
  'set-bathers'(el) {
    const key = currentRoute().arg;
    ensureDay(key).bathers = Number(el.dataset.n);
    commitDay(key);
  },
  'toggle-breath'(el) {
    const key = currentRoute().arg;
    const p = ensureDay(key).procs[Number(el.dataset.i)];
    if (p) p.breath = !p.breath;
    commitDay(key);
  },
  'del-proc'(el) {
    const key = currentRoute().arg;
    ensureDay(key).procs.splice(Number(el.dataset.i), 1);
    commitDay(key);
  },
  'open-sheet'() { openSheet(); },
  'close-sheet'() { closeSheet(); },
  'add-proc'(el) {
    const key = currentRoute().arg;
    const svc = state.services.find((s) => s.id === el.dataset.id);
    if (!svc) return;
    ensureDay(key).procs.push({ name: svc.name, price: svc.price, breath: false });
    commitDay(key);
    updateSheetBadges(key);
    if (navigator.vibrate) navigator.vibrate(10);
  },

  'stats-prev'() { view.statsMonth = shiftMonth(view.statsMonth, -1); view.statsBar = null; render(); },
  'stats-next'() { view.statsMonth = shiftMonth(view.statsMonth, 1); view.statsBar = null; render(); },
  'stats-bar'(el) {
    const i = Number(el.dataset.i);
    view.statsBar = view.statsBar === i ? null : i;
    render();
  },

  'set-theme'(el) { state.settings.theme = el.dataset.theme; save(); applyTheme(); render(); },
  'toggle-recalc'() { state.settings.recalc = !state.settings.recalc; save(); render(); },
  'add-service'() {
    state.services.push({ id: uid(), name: 'Новая услуга', price: 0 });
    save();
    render();
    const inputs = document.querySelectorAll('[data-field="svc-name"]');
    const last = inputs[inputs.length - 1];
    if (last) { last.focus(); last.select(); }
  },
  'del-service'(el) {
    state.services = state.services.filter((s) => s.id !== el.dataset.id);
    save();
    render();
  },
  'reset-services'() {
    if (!confirm('Вернуть стандартный прайс? Ваши изменения в прайсе будут потеряны.')) return;
    state.services = defaultServices();
    save();
    render();
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el, e);
});

document.addEventListener('change', (e) => {
  const el = e.target;
  const f = el.dataset && el.dataset.field;
  if (!f) return;
  if (f === 'tips') {
    commitDay(currentRoute().arg);
  } else if (f === 'rate') {
    const v = toInt(el.value);
    el.value = v;
    setRate(v);
  } else {
    const svc = state.services.find((s) => s.id === el.dataset.id);
    if (!svc) return;
    if (f === 'svc-name') svc.name = el.value.trim() || svc.name;
    if (f === 'svc-price') { svc.price = toInt(el.value); el.value = svc.price; }
    save();
  }
});

// Чаевые: итог дня обновляется прямо во время ввода
document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.dataset || el.dataset.field !== 'tips') return;
  const d = ensureDay(currentRoute().arg);
  d.tips = toInt(el.value);
  save();
  const out = document.getElementById('day-earn');
  if (out) out.textContent = fmt(dayEarn(d));
});

// Enter на клавиатуре телефона — просто убрать фокус
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') e.target.blur();
});

// Свайп по календарю — смена месяца
let touchX = null, touchY = null;
document.addEventListener('touchstart', (e) => {
  if (!e.target.closest('#cal-grid')) { touchX = null; return; }
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  touchX = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    view.month = shiftMonth(view.month, dx < 0 ? 1 : -1);
    render();
  }
}, { passive: true });

window.addEventListener('hashchange', () => {
  closeSheet(true);
  if (currentRoute().name === 'calendar') navDepth = 0;
  render();
  window.scrollTo(0, 0);
});

// Кнопка «назад» на Android (внутри APK)
const Cap = window.Capacitor;
if (Cap && Cap.isNativePlatform && Cap.isNativePlatform() && Cap.Plugins && Cap.Plugins.App) {
  Cap.Plugins.App.addListener('backButton', () => { if (!back()) Cap.Plugins.App.exitApp(); });
} else if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Тема: атрибут на <html>, цвет системных панелей браузера/телефона
function applyTheme() {
  const light = state.settings.theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const meta = (n) => document.querySelector(`meta[name="${n}"]`);
  meta('theme-color').content = light ? '#f4f4f8' : '#111214';
  meta('apple-mobile-web-app-status-bar-style').content = light ? 'default' : 'black-translucent';
  meta('color-scheme').content = light ? 'light' : 'dark';
  const bars = Cap && Cap.Plugins && Cap.Plugins.SystemBars;
  // DARK = светлые значки для тёмного фона, LIGHT — наоборот
  if (bars && bars.setStyle) bars.setStyle({ style: light ? 'LIGHT' : 'DARK' }).catch(() => {});
}

applyTheme();
render();
