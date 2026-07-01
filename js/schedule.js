// ========================================
// Ballard CrossFit — Schedule Page
// ========================================

const API_URL = 'https://api.chalkitpro.com/api/gymclasses/PublicCalendar/964';
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let rawClasses = [];
let currentView = 'week';
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', async () => {
  await loadSchedule();
  initControls();
  render();
});

async function loadSchedule() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rawClasses = await res.json();
  } catch {
    document.getElementById('scheduleBody').innerHTML =
      '<div class="no-classes">Unable to load schedule. Please try again later.</div>';
  }
}

function initControls() {
  document.getElementById('prevBtn').addEventListener('click', () => { navigate(-1); });
  document.getElementById('nextBtn').addEventListener('click', () => { navigate(1); });
  document.getElementById('todayBtn').addEventListener('click', () => { currentDate = new Date(); render(); });

  document.querySelectorAll('.schedule-view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.schedule-view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentView = tab.dataset.view;
      render();
    });
  });
}

function navigate(dir) {
  if (currentView === 'day') currentDate.setDate(currentDate.getDate() + dir);
  else if (currentView === 'week') currentDate.setDate(currentDate.getDate() + (dir * 7));
  else currentDate.setMonth(currentDate.getMonth() + dir);
  render();
}

function render() {
  updateDateLabel();
  const body = document.getElementById('scheduleBody');
  if (currentView === 'week') body.innerHTML = renderWeek();
  else if (currentView === 'day') body.innerHTML = renderDay();
  else body.innerHTML = renderMonth();
}

function updateDateLabel() {
  const label = document.getElementById('dateLabel');
  if (currentView === 'day') {
    label.textContent = `${DAY_LABELS_FULL[currentDate.getDay()]}, ${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getDate()}`;
  } else if (currentView === 'week') {
    const start = getWeekStart(currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    if (start.getMonth() === end.getMonth()) {
      label.textContent = `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
    } else {
      label.textContent = `${MONTH_NAMES[start.getMonth()].slice(0,3)} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()].slice(0,3)} ${end.getDate()}, ${end.getFullYear()}`;
    }
  } else {
    label.textContent = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getClassesForDate(date) {
  const dayName = DAYS[date.getDay()];
  const classes = [];

  for (const c of rawClasses) {
    const startDate = new Date(c.startDate);
    if (date < startDate) continue;
    if (c.endDate && date > new Date(c.endDate)) continue;

    const days = JSON.parse(c.daysOfWeek || '{}');
    if (!days[dayName] && !c.singleClass) continue;

    const dateStr = formatDateISO(date);
    const mod = (c.modifications || []).find(m => formatDateISO(new Date(m.date)) === dateStr);

    if (mod && mod.cancelled) continue;

    const startHour = mod ? mod.startHour : c.startHour;
    const startMinute = mod ? mod.startMinute : c.startMinute;
    const duration = mod ? mod.duration : c.duration;
    const coachRaw = mod ? mod.coachName : c.coachName;
    const limit = mod ? mod.classSizeLimit : c.classSizeLimit;

    let coach = '';
    if (coachRaw) {
      try {
        const parsed = JSON.parse(coachRaw);
        if (Array.isArray(parsed)) coach = parsed.map(p => p.displayName || `${p.firstName} ${p.lastName}`).join(', ');
        else coach = coachRaw;
      } catch { coach = coachRaw; }
    }

    const trackName = c.track ? c.track.trackName : c.className;

    classes.push({
      name: c.className,
      track: trackName,
      startHour, startMinute, duration,
      coach, limit,
      tag: getTagClass(trackName),
    });
  }

  classes.sort((a, b) => (a.startHour * 60 + a.startMinute) - (b.startHour * 60 + b.startMinute));
  return classes;
}

function getTagClass(track) {
  const t = track.toLowerCase();
  if (t.includes('crossfit')) return 'crossfit';
  if (t.includes('open gym')) return 'opengym';
  if (t.includes('vitality')) return 'vitality';
  return 'crossfit';
}

function formatTime(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDateISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isToday(d) {
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function renderClassItem(c) {
  return `
    <div class="class-item">
      <span class="class-time">${formatTime(c.startHour, c.startMinute)}</span>
      <div class="class-info">
        <span class="class-name">${c.name}</span>
        <div class="class-meta">
          ${c.duration}min${c.coach ? ` · ${c.coach}` : ''}
          <span class="class-tag class-tag-${c.tag}">${c.track}</span>
        </div>
      </div>
    </div>`;
}

// ---- Week View ----
function renderWeek() {
  const start = getWeekStart(currentDate);
  let html = '<div class="week-grid">';

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    const classes = getClassesForDate(day);
    const today = isToday(day) ? ' is-today' : '';

    html += `
      <div class="week-day${today}">
        <div class="week-day-header">
          <span>${DAY_LABELS_FULL[day.getDay()]}</span>
          <span class="day-date">${MONTH_NAMES[day.getMonth()].slice(0, 3)} ${day.getDate()}</span>
        </div>
        <div class="week-day-classes">
          ${classes.length ? classes.map(renderClassItem).join('') : '<div class="no-classes">No classes</div>'}
        </div>
      </div>`;
  }

  html += '</div>';
  return html;
}

// ---- Day View ----
function renderDay() {
  const classes = getClassesForDate(currentDate);
  const today = isToday(currentDate) ? ' is-today' : '';

  return `
    <div class="day-view${today}">
      <div class="week-day-header">
        <span>${DAY_LABELS_FULL[currentDate.getDay()]}</span>
        <span class="day-date">${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}</span>
      </div>
      <div class="week-day-classes">
        ${classes.length ? classes.map(renderClassItem).join('') : '<div class="no-classes">No classes scheduled</div>'}
      </div>
    </div>`;
}

// ---- Month View ----
function renderMonth() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  let html = '<div class="month-grid">';

  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
    html += `<div class="month-day-header">${d}</div>`;
  });

  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startPad);

  const totalCells = Math.ceil((startPad + lastDay.getDate()) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const isOther = day.getMonth() !== month;
    const today = isToday(day) ? ' is-today' : '';
    const classes = isOther ? [] : getClassesForDate(day);

    const dots = classes.slice(0, 8).map(c =>
      `<span class="month-class-dot ${c.tag}"></span>`
    ).join('');

    const count = classes.length > 0 ? `<div class="month-class-count">${classes.length} class${classes.length !== 1 ? 'es' : ''}</div>` : '';

    html += `
      <div class="month-day${isOther ? ' other-month' : ''}${today}">
        <div class="month-day-num">${day.getDate()}</div>
        <div>${dots}</div>
        ${count}
      </div>`;
  }

  html += '</div>';
  return html;
}
