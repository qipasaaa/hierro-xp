(function () {
  'use strict';

  var STORAGE_KEY = 'hierroxp_state_v2';
  var CIRC = 2 * Math.PI * 86;

  var ROUTINES = [
    { id: 'calentamiento', name: 'Calentamiento RAMP (5 min)', focus: 'Activación antes de entrenar', equip: 'any', warmup: true, locked: false,
      exercises: [
        { name: 'Marcha en el puesto o saltos suaves (Raise)', sets: 1 },
        { name: 'Círculos de cadera, hombro y tobillo (Mobilize)', sets: 1 },
        { name: 'Sentadilla sin peso x10 (Activate)', sets: 2 },
        { name: 'Puente de glúteo x12 (Activate)', sets: 2 },
        { name: 'Repeticiones ligeras del primer ejercicio de hoy (Potentiate)', sets: 1 }
      ] },

    // ---- Mancuernas ----
    { id: 'empuje', name: 'Empuje con Mancuernas', focus: 'Pecho / Hombro / Tríceps', equip: 'mancuernas', locked: false,
      exercises: [
        { name: 'Press militar de pie', sets: 4 },
        { name: 'Press banca en el suelo', sets: 4 },
        { name: 'Elevaciones laterales', sets: 3 },
        { name: 'Extensión de tríceps sobre cabeza', sets: 3 }
      ] },
    { id: 'tiron', name: 'Tirón y Espalda', focus: 'Espalda / Bíceps', equip: 'mancuernas', locked: false,
      exercises: [
        { name: 'Remo a una mano', sets: 4 },
        { name: 'Remo renegado', sets: 3 },
        { name: 'Curl martillo', sets: 3 },
        { name: 'Curl bíceps supinado', sets: 3 }
      ] },
    { id: 'piernas', name: 'Tren Inferior en Casa', focus: 'Piernas / Glúteo', equip: 'mancuernas', locked: false,
      exercises: [
        { name: 'Sentadilla goblet', sets: 4 },
        { name: 'Zancadas caminando', sets: 3 },
        { name: 'Peso muerto rumano', sets: 4 },
        { name: 'Elevación de gemelos', sets: 3 }
      ] },
    { id: 'fallo', name: 'Brazos al Fallo', focus: 'Bíceps / Tríceps intenso', equip: 'mancuernas', locked: true,
      exercises: [
        { name: 'Curl bíceps al fallo', sets: 4 },
        { name: 'Press francés al fallo', sets: 4 },
        { name: 'Curl martillo al fallo', sets: 3 },
        { name: 'Fondos en banco', sets: 3 }
      ] },
    { id: 'metabolico', name: 'Full Body Metabólico', focus: 'Circuito completo', equip: 'mancuernas', locked: true,
      exercises: [
        { name: 'Sentadilla con press', sets: 4 },
        { name: 'Burpee con mancuernas', sets: 3 },
        { name: 'Remo + peso muerto', sets: 4 },
        { name: 'Plancha con toque de hombro', sets: 3 }
      ] },

    // ---- Sin equipo / calistenia ----
    { id: 'suave', name: 'Full Body Suave', focus: 'Principiantes · sin equipo', equip: 'bodyweight', tier: 'principiante', locked: false,
      exercises: [
        { name: 'Sentadilla asistida (apoyo en silla)', sets: 3 },
        { name: 'Flexiones de rodillas', sets: 3 },
        { name: 'Plancha corta (15-20s)', sets: 3 },
        { name: 'Puente de glúteo', sets: 3 }
      ] },
    { id: 'empuje_cal', name: 'Empuje Calistenia', focus: 'Pecho / Hombro / Tríceps', equip: 'bodyweight', tier: 'intermedio', locked: false,
      exercises: [
        { name: 'Flexiones estándar', sets: 4 },
        { name: 'Fondos en silla', sets: 3 },
        { name: 'Flexión pike (hombro)', sets: 3 }
      ] },
    { id: 'tiron_cal', name: 'Tirón Calistenia', focus: 'Espalda / Postura', equip: 'bodyweight', tier: 'intermedio', locked: true,
      exercises: [
        { name: 'Remo invertido (mesa o barra baja)', sets: 4 },
        { name: 'Superman', sets: 3 },
        { name: 'Retracción escapular en pared', sets: 3 }
      ] },
    { id: 'piernas_cal', name: 'Piernas Calistenia', focus: 'Piernas / Glúteo', equip: 'bodyweight', tier: 'intermedio', locked: true,
      exercises: [
        { name: 'Sentadilla búlgara', sets: 4 },
        { name: 'Zancadas', sets: 3 },
        { name: 'Puente unilateral', sets: 3 }
      ] },

    { id: 'rodillas_fuertes', name: 'Rodillas Fuertes (Prevención)', focus: 'Glúteo / Isquios / Estabilidad', equip: 'any', locked: false,
      exercises: [
        { name: 'Sentadilla búlgara (unilateral)', sets: 3 },
        { name: 'Puente de glúteo a una pierna', sets: 3 },
        { name: 'Zancada lateral', sets: 3 },
        { name: 'Peso muerto rumano a una pierna', sets: 3 }
      ] },

    { id: 'jefe', name: 'Jefe Semanal: Circuito de Hierro', focus: 'Desafío AMRAP 12 min', equip: 'any', locked: true, boss: true,
      exercises: [
        { name: 'AMRAP 12min: 10 sentadillas + 10 remo/flexiones + 10 press/pike', sets: 1 }
      ] }
  ];

  var POSES = [
    { name: 'Sentadilla profunda', cue: 'Bajá lo más que puedas manteniendo los talones apoyados.' },
    { name: 'Zancada con giro de torso', cue: 'Zancada al frente y girá el torso hacia la pierna adelantada.' },
    { name: 'Puente de glúteo unilateral', cue: 'Apoyá un pie, elevá la cadera, sostené 3 segundos por lado.' }
  ];

  var BADGES = [
    { id: 'primera_serie', icon: '🏋️', name: 'Primera Serie' },
    { id: 'racha_3', icon: '🔥', name: 'Racha x3' },
    { id: 'racha_7', icon: '🔥🔥', name: 'Racha x7' },
    { id: 'nivel_5', icon: '⭐', name: 'Nivel 5' },
    { id: 'nivel_10', icon: '🌟', name: 'Nivel 10' },
    { id: 'cazador_jefes', icon: '👑', name: 'Cazador de Jefes' }
  ];

  var TIPS_SHARED = [
    'La técnica primero, el peso después — así progresás sin lesionarte.',
    'Entre 5 y 10 minutos de calentamiento dinámico pueden reducir a la mitad las lesiones por sobrecarga.',
    'Tomá agua entre series — el rendimiento baja notoriamente con la deshidratación.',
    'Si algo duele distinto a "cansancio muscular", paralo. No hay medalla por entrenar lesionado.',
    'Dormir bien es parte del entrenamiento: ahí es cuando el músculo se repara de verdad.',
    'El estancamiento es normal — variá reps, tempo o descanso antes de asumir que algo falla.'
  ];
  // Investigación: los hombres responden más a desafío/competencia/tracking; las mujeres más a
  // bienestar, curiosidad y vínculo social — y los mensajes centrados en "bajar de peso" bajan
  // la motivación femenina en vez de subirla. Por eso los tres grupos usan marcos distintos,
  // no contenido inventado.
  var TIPS_MASCULINO = [
    '¿Le podés ganar a tu marca de la semana pasada? Anotá tus series y superate.',
    'Cada racha es un desafío contra vos mismo. ¿Hasta dónde la vas a estirar?',
    'Los hombres se lesionan más seguido entrenando que las mujeres — casi siempre por saltarse el calentamiento o cargar de más muy rápido. Ni se te ocurra.',
    'Hoy no se trata de ser el más fuerte del gimnasio, sino más fuerte que el de ayer.'
  ];
  var TIPS_FEMENINO = [
    'Levantar pesas no te va a poner "voluminosa" de la nada — te falta testosterona para eso, es fisiológico. Lo que sí vas a ganar es fuerza real.',
    'El entrenamiento de fuerza no es solo estética: mejora tu ánimo, tu sueño y tu energía del día a día.',
    'Fortalecer glúteos e isquiotibiales reduce hasta 67% el riesgo de lesión de rodilla, según estudios en atletas mujeres — por eso están en tus rutinas.',
    'Tu cuerpo suele resistir más series antes de fatigarse que el de un hombre promedio, según estudios de fisiología muscular — no le tengas miedo a sumar una serie extra.'
  ];
  var TIPS_NEUTRAL = [
    'La constancia le gana a la intensidad: mejor 20 minutos hoy que nada.',
    'Un día de energía baja no arruina tu progreso. Aparecer ya es ganar.',
    'El cuerpo se adapta al estrés que le das — por eso el progreso gradual funciona mejor que el extremo.',
    'Cada racha empieza con un solo día. Hoy puede ser ese día.'
  ];
  var QUOTES = [
    { text: '"¡Yeah buddy! Lightweight, baby!"', author: 'Ronnie Coleman, 8 veces Mr. Olympia' },
    { text: 'Todos quieren ser fisicoculturistas, pero nadie quiere levantar peso de verdad.', author: 'Ronnie Coleman' },
    { text: 'No hay secreto: solo hay que hacerlo.', author: 'Ronnie Coleman' },
    { text: 'No tenés que ser grandioso. Solo tenés que ser vos mismo.', author: 'Chris Bumstead (CBum), 5 veces Mr. Olympia Classic Physique' },
    { text: 'Las últimas tres o cuatro repeticiones son las que hacen crecer el músculo.', author: 'Arnold Schwarzenegger' }
  ];

  var defaultWater = { day: null, count: 0, goal: 8 };

  function tipsPoolFor(visual) {
    var extra = visual === 'femenino' ? TIPS_FEMENINO : (visual === 'masculino' ? TIPS_MASCULINO : TIPS_NEUTRAL);
    return TIPS_SHARED.concat(extra);
  }

  var defaultState = {
    name: '', equip: 'mancuernas', experience: 'principiante', visualStyle: 'masculino', ageBracket: '18-29',
    xp: 0, streak: 0, lastWorkoutDay: null,
    badges: [], premium: false, history: {}, onboarded: false, joinedAt: null, checkIn: {},
    cycle: { enabled: false, lastStart: null, length: 28 },
    water: { day: null, count: 0, goal: 8 }
  };

  var state = loadState();
  var activeRoutine = null;
  var poseAnswers = {};
  var restCyclesThisSession = 0;
  var openDemoIdx = {};
  var hrDevice = null, hrChar = null;

  var restTotalMs = 90000, restRemainingMs = restTotalMs, restRunning = false, restEndTime = 0, restInterval = null;

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign({}, defaultState, JSON.parse(raw));
    } catch (e) {}
    return Object.assign({}, defaultState);
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function dayOfYear() {
    var d = new Date();
    var start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }

  function levelFromXp(xp) { return Math.floor(xp / 100) + 1; }
  function xpIntoLevel(xp) { return xp % 100; }

  // ---------- Toasts ----------
  function toast(msg) {
    var stack = document.getElementById('toastStack');
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    stack.appendChild(el);
    setTimeout(function () { el.remove(); }, 3000);
  }

  function addXp(amount) {
    var beforeLevel = levelFromXp(state.xp);
    state.xp += amount;
    var afterLevel = levelFromXp(state.xp);
    var today = todayKey();
    state.history[today] = (state.history[today] || 0) + amount;
    checkBadges();
    saveState();
    renderHeader();
    if (amount >= 10) toast('+' + amount + ' XP');
    if (afterLevel > beforeLevel) toast('⚡ ¡Subiste a nivel ' + afterLevel + '!');
  }

  function updateAppBadge() {
    try {
      if ('setAppBadge' in navigator) {
        if (state.streak > 0) navigator.setAppBadge(state.streak);
        else if ('clearAppBadge' in navigator) navigator.clearAppBadge();
      }
    } catch (e) {}
  }

  function bumpStreak() {
    var todayStr = todayKey();
    if (state.lastWorkoutDay === todayStr) return;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yStr = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' + yesterday.getDate();
    if (state.lastWorkoutDay === yStr) state.streak += 1;
    else state.streak = 1;
    state.lastWorkoutDay = todayStr;
    checkBadges();
    saveState();
    updateAppBadge();
  }

  function renderQuote() {
    var q = QUOTES[(dayOfYear() + 3) % QUOTES.length];
    document.getElementById('quoteCard').innerHTML = q.text + '<span class="quote-author">— ' + q.author + '</span>';
  }

  function renderWater() {
    var today = todayKey();
    if (state.water.day !== today) { state.water.day = today; state.water.count = 0; saveState(); }
    var pct = Math.min(100, Math.round((state.water.count / state.water.goal) * 100));
    document.getElementById('waterText').textContent = state.water.count + ' / ' + state.water.goal + ' vasos';
    document.getElementById('waterBarFill').style.width = pct + '%';
  }
  document.getElementById('waterAddBtn').addEventListener('click', function () {
    state.water.count += 1;
    saveState();
    renderWater();
    if (state.water.count === state.water.goal) toast('💧 ¡Meta de agua del día cumplida!');
  });

  function unlockBadge(id) {
    if (state.badges.indexOf(id) === -1) {
      state.badges.push(id);
      saveState();
      var b = BADGES.filter(function (x) { return x.id === id; })[0];
      if (b) toast('🏅 Nueva medalla: ' + b.name);
    }
  }
  function checkBadges() {
    var lvl = levelFromXp(state.xp);
    if (state.xp > 0) unlockBadge('primera_serie');
    if (state.streak >= 3) unlockBadge('racha_3');
    if (state.streak >= 7) unlockBadge('racha_7');
    if (lvl >= 5) unlockBadge('nivel_5');
    if (lvl >= 10) unlockBadge('nivel_10');
  }

  // ---------- Screen routing ----------
  var screens = ['home', 'workout', 'mobility', 'progress', 'premium', 'profile'];
  function showScreen(name) {
    screens.forEach(function (s) {
      document.getElementById('screen-' + s).hidden = (s !== name);
    });
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-screen') === name);
    });
    if (name === 'home') renderHome();
    if (name === 'progress') renderProgress();
    if (name === 'mobility') resetMobility();
    if (name === 'profile') renderProfile();
  }

  // ---------- Onboarding ----------
  function wireChipGroup(containerId, onPick) {
    document.getElementById(containerId).addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      this.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      onPick(btn.getAttribute('data-val'));
    });
  }
  wireChipGroup('ageChoice', function (v) { state.ageBracket = v; });
  wireChipGroup('equipChoice', function (v) { state.equip = v; });
  wireChipGroup('expChoice', function (v) { state.experience = v; });
  wireChipGroup('visualChoice', function (v) {
    state.visualStyle = v;
    document.documentElement.setAttribute('data-visual', v);
  });

  document.getElementById('startBtn').addEventListener('click', function () {
    var nameVal = document.getElementById('nameInput').value.trim();
    state.name = nameVal || 'Atleta';
    state.onboarded = true;
    state.joinedAt = state.joinedAt || new Date().toISOString();
    saveState();
    enterApp();
  });

  function enterApp() {
    document.documentElement.setAttribute('data-visual', state.visualStyle);
    document.getElementById('screen-onboard').hidden = true;
    document.getElementById('topbar').hidden = false;
    document.getElementById('tabbar').hidden = false;
    showScreen('home');
    updateAppBadge();
  }

  // ---------- Header ----------
  function renderHeader() {
    var lvl = levelFromXp(state.xp);
    document.getElementById('levelChip').textContent = '⚡ Nv. ' + lvl;
  }

  // ---------- Home ----------
  function easiestRoutineFor(equip) {
    return ROUTINES.filter(function (r) { return !r.warmup && (r.equip === equip || r.equip === 'any') && !r.locked; })[0];
  }

  function computeAdapt(energy, mood) {
    var msg = '';
    if (energy === 'bajo') msg = 'Día de energía baja: bastaría con el Calentamiento o una rutina suave, pocas series.';
    else if (energy === 'medio') msg = 'Energía media: una rutina normal te va a sentar bien hoy.';
    else msg = 'Energía alta: buen día para ir a fondo — animate con una rutina más exigente.';
    if (mood === 'cansado') msg += ' Si el cuerpo pide descanso, un Calentamiento igual cuenta como avance.';
    if (mood === 'estresado') msg += ' Entrenar aunque sea un poco ayuda a bajar el estrés.';
    if (mood === 'motivado' && energy === 'alto') msg += ' 🔥 Buen momento para el Jefe Semanal si lo tenés desbloqueado.';
    return msg;
  }

  function renderCheckin() {
    var today = todayKey();
    var entry = state.checkIn[today];
    var card = document.getElementById('checkinCard');
    var adapt = document.getElementById('checkinAdapt');
    if (entry) {
      card.hidden = true;
      adapt.hidden = false;
      adapt.textContent = computeAdapt(entry.energy, entry.mood);
    } else {
      card.hidden = false;
      adapt.hidden = true;
    }
  }
  var pickedEnergy = null, pickedMood = null;
  wireChipGroup('energyChoice', function (v) { pickedEnergy = v; });
  wireChipGroup('moodChoice', function (v) { pickedMood = v; });
  document.getElementById('saveCheckinBtn').addEventListener('click', function () {
    if (!pickedEnergy || !pickedMood) { toast('Elegí energía y ánimo primero.'); return; }
    state.checkIn[todayKey()] = { energy: pickedEnergy, mood: pickedMood };
    saveState();
    renderCheckin();
    toast('Check-in guardado. ¡Vamos!');
  });

  function renderHome() {
    document.getElementById('homeGreeting').textContent = 'Hola, ' + state.name;
    var lvl = levelFromXp(state.xp);
    var into = xpIntoLevel(state.xp);
    document.getElementById('xpText').textContent = into + ' / 100 XP';
    document.getElementById('xpBarFill').style.width = into + '%';
    document.getElementById('streakNum').textContent = state.streak;
    document.getElementById('levelNum').textContent = lvl;
    document.getElementById('badgeNum').textContent = state.badges.length;
    document.getElementById('streakTile').classList.toggle('streak-active', state.streak > 0);
    renderHeader();

    renderQuote();
    renderWater();

    var pool = tipsPoolFor(state.visualStyle);
    document.getElementById('dailyTipCard').textContent = '💡 ' + pool[dayOfYear() % pool.length];

    var kneeTip = document.getElementById('kneeTip');
    if (state.visualStyle === 'femenino') {
      kneeTip.hidden = false;
      kneeTip.textContent = '🦵 Estudios en atletas mujeres muestran que fortalecer glúteos e isquiotibiales reduce hasta 67% el riesgo de lesión de rodilla (LCA). Por eso sumamos "Rodillas Fuertes" a tus rutinas.';
    } else {
      kneeTip.hidden = true;
    }

    var ageTip = document.getElementById('ageTip');
    if (state.ageBracket === '50+') {
      var boneNote = state.visualStyle === 'femenino'
        ? ' Después de la menopausia la densidad ósea baja más rápido — el entrenamiento de fuerza es una de las formas más efectivas de cuidarla.'
        : '';
      ageTip.hidden = false;
      ageTip.textContent = '⚖️ A partir de los 50, el equilibrio y la salud ósea importan tanto como la fuerza. Priorizá el calentamiento y no te saltees "Rodillas Fuertes" — ayuda a prevenir caídas.' + boneNote;
    } else {
      ageTip.hidden = true;
    }

    var tipEl = document.getElementById('beginnerTip');
    if (state.experience === 'principiante' && state.xp < 50) {
      var easy = easiestRoutineFor(state.equip);
      tipEl.hidden = false;
      tipEl.textContent = '👋 Como recién empezás: probá primero el "Calentamiento" y después "' + (easy ? easy.name : 'una rutina suave') + '" con pocas series. La constancia importa más que la intensidad.';
    } else {
      tipEl.hidden = true;
    }

    renderCheckin();

    var list = document.getElementById('routineList');
    list.innerHTML = '';
    ROUTINES.filter(function (r) { return r.equip === 'any' || r.equip === state.equip; }).forEach(function (r) {
      var locked = r.locked && !state.premium;
      var card = document.createElement('div');
      card.className = 'routine-card' + (r.boss ? ' boss' : '') + (r.warmup ? ' warmup' : '') + (locked ? ' locked' : '');
      card.innerHTML =
        '<div class="routine-info">' +
          '<span class="routine-name">' + (r.boss ? '👑 ' : (r.warmup ? '🔥 ' : '')) + r.name + '</span>' +
          '<span class="routine-focus">' + r.focus + '</span>' +
        '</div>' +
        '<span class="routine-badge ' + (locked ? 'locked' : (r.boss ? 'boss' : (r.warmup ? 'warmup' : 'go'))) + '">' +
          (locked ? 'Premium' : (r.boss ? 'Jefe' : (r.warmup ? 'Calentar' : 'Empezar'))) +
        '</span>';
      card.addEventListener('click', function () {
        if (locked) { showScreen('premium'); return; }
        openRoutine(r);
      });
      list.appendChild(card);
    });
  }

  // ---------- Workout ----------
  function openRoutine(routine) {
    activeRoutine = { def: routine, done: routine.exercises.map(function () { return 0; }) };
    restCyclesThisSession = 0;
    openDemoIdx = {};
    document.getElementById('workoutTitle').textContent = routine.name;
    document.getElementById('workoutFocus').textContent = routine.focus;
    renderExerciseList();
    resetRestTimer();
    showScreen('workout');
  }

  var POSE_ICONS = {
    squat: { head: [50, 20, 8], lines: ['M50,30 L50,54', 'M50,34 L32,44', 'M50,34 L68,44', 'M50,54 L36,66 L34,90', 'M50,54 L64,66 L66,90'] },
    lunge: { head: [40, 18, 8], lines: ['M40,26 L47,50', 'M43,32 L28,38', 'M43,32 L58,24', 'M47,50 L34,66 L28,90', 'M47,50 L64,72 L80,86'] },
    bridge: { head: [18, 76, 7], lines: ['M24,80 L58,58', 'M58,58 L74,74', 'M74,74 L88,74', 'M24,80 L14,88'], ground: 'M10,82 L92,82' },
    pushup: { head: [20, 54, 7], lines: ['M26,58 L86,76', 'M26,58 L22,68 L32,74'], ground: 'M10,76 L92,76' },
    overhead: { head: [50, 14, 8], lines: ['M50,22 L50,55', 'M50,55 L42,90', 'M50,55 L58,90', 'M50,26 L34,10', 'M50,26 L66,10', 'M30,9 L70,9'] },
    row: { head: [28, 34, 7], lines: ['M56,55 L32,40', 'M56,55 L48,90', 'M56,55 L64,88', 'M32,40 L44,46 L54,42'] },
    hinge: { head: [30, 36, 7], lines: ['M58,55 L34,40', 'M58,55 L50,90', 'M58,55 L66,88', 'M34,44 L30,76', 'M34,44 L38,76', 'M26,76 L42,76'] },
    plank: { head: [18, 52, 7], lines: ['M24,56 L86,76', 'M24,56 L22,66 L14,68'], ground: 'M8,76 L92,76' },
    generic: { head: [50, 18, 8], lines: ['M50,26 L50,58', 'M50,58 L42,90', 'M50,58 L58,90', 'M50,32 L34,50', 'M50,32 L66,50'] }
  };
  function poseIconHtml(type) {
    var p = POSE_ICONS[type] || POSE_ICONS.generic;
    var paths = p.lines.map(function (d) { return '<path d="' + d + '"/>'; }).join('');
    var ground = p.ground ? '<path class="ground" d="' + p.ground + '"/>' : '';
    return '<svg class="pose-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
      ground + paths + '<circle cx="' + p.head[0] + '" cy="' + p.head[1] + '" r="' + p.head[2] + '" fill="currentColor" stroke="none"/></svg>';
  }

  function demoTypeFor(name) {
    var n = name.toLowerCase();
    if (n.indexOf('círcul') !== -1 || n.indexOf('circul') !== -1) return 'mobility';
    if (n.indexOf('plancha') !== -1) return 'plank';
    if (n.indexOf('sentadilla') !== -1 || n.indexOf('burpee') !== -1) return 'squat';
    if (n.indexOf('zancada') !== -1) return 'lunge';
    if (n.indexOf('puente') !== -1) return 'bridge';
    if (n.indexOf('flexi') !== -1 || n.indexOf('fondos') !== -1 || n.indexOf('banca') !== -1) return 'pushup';
    if (n.indexOf('press militar') !== -1 || n.indexOf('pike') !== -1 || n.indexOf('francés') !== -1 || n.indexOf('frances') !== -1 || n.indexOf('sobre cabeza') !== -1 || n.indexOf('lateral') !== -1) return 'overhead';
    if (n.indexOf('remo') !== -1 || n.indexOf('curl') !== -1 || n.indexOf('retracción') !== -1 || n.indexOf('retraccion') !== -1) return 'row';
    if (n.indexOf('muerto rumano') !== -1) return 'hinge';
    return 'generic';
  }
  function demoMarkup(type) {
    if (type === 'plank') {
      return poseIconHtml('plank') + '<div class="demo-ring anim-hold"></div><span class="demo-caption">Sostené la posición, respirá con calma.</span>';
    }
    if (type === 'mobility') {
      return '<div class="demo-circle-track"><div class="orbit-rotator anim-mobility"><span class="demo-dot"></span></div></div><span class="demo-caption">Movimiento circular y controlado, sin trabar.</span>';
    }
    return poseIconHtml(type) + '<div class="demo-track-vertical"><span class="demo-dot anim-reps"></span></div><span class="demo-caption">Bajá controlado, subí con fuerza.</span>';
  }

  function renderExerciseList() {
    var list = document.getElementById('exerciseList');
    list.innerHTML = '';
    activeRoutine.def.exercises.forEach(function (ex, i) {
      var done = activeRoutine.done[i];
      var isOpen = !!openDemoIdx[i];
      var item = document.createElement('div');
      item.className = 'exercise-item';
      item.innerHTML =
        '<div class="exercise-row' + (done >= ex.sets ? ' complete' : '') + '">' +
          '<div><div class="exercise-name">' + ex.name + '</div>' +
          '<div class="exercise-sets">' + done + ' / ' + ex.sets + ' series</div></div>' +
          '<div style="display:flex;gap:6px;align-items:center;">' +
            '<button class="demo-toggle" data-idx="' + i + '">' + (isOpen ? '▼' : '▶') + '</button>' +
            '<button class="tap-count" data-idx="' + i + '">+1</button>' +
          '</div>' +
        '</div>' +
        '<div class="demo-panel" data-idx="' + i + '"' + (isOpen ? '' : ' hidden') + '>' + demoMarkup(demoTypeFor(ex.name)) + '</div>';
      list.appendChild(item);
    });
    list.querySelectorAll('.tap-count').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var ex = activeRoutine.def.exercises[idx];
        if (activeRoutine.done[idx] < ex.sets) {
          activeRoutine.done[idx] += 1;
          addXp(5);
          renderExerciseList();
        }
      });
    });
    list.querySelectorAll('.demo-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.getAttribute('data-idx');
        var panel = list.querySelector('.demo-panel[data-idx="' + idx + '"]');
        panel.hidden = !panel.hidden;
        openDemoIdx[idx] = !panel.hidden;
        btn.textContent = panel.hidden ? '▶' : '▼';
      });
    });
  }

  document.getElementById('finishRoutineBtn').addEventListener('click', function () {
    var totalSets = activeRoutine.def.exercises.reduce(function (a, e) { return a + e.sets; }, 0);
    var doneSets = activeRoutine.done.reduce(function (a, d) { return a + d; }, 0);
    if (doneSets >= totalSets * 0.7) {
      addXp(40);
      bumpStreak();
      if (activeRoutine.def.boss) { unlockBadge('cazador_jefes'); addXp(60); }
      renderHeader();
      toast('💪 Rutina terminada — buen trabajo, ' + state.name + '.');
    }
    showScreen('home');
  });
  document.getElementById('backHomeBtn').addEventListener('click', function () { showScreen('home'); });

  // ---------- Rest timer ----------
  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function renderRest() {
    document.getElementById('restTime').textContent = fmt(restRemainingMs);
    var frac = restTotalMs > 0 ? restRemainingMs / restTotalMs : 0;
    document.getElementById('ringFill').setAttribute('stroke-dashoffset', (CIRC * (1 - frac)).toFixed(1));
  }
  function resetRestTimer() {
    clearInterval(restInterval);
    restRunning = false;
    restRemainingMs = restTotalMs;
    document.getElementById('ringFill').classList.remove('done');
    document.getElementById('restLabel').textContent = 'DESCANSO LISTO';
    document.getElementById('restToggle').textContent = 'Iniciar descanso';
    renderRest();
  }
  function restTick() {
    restRemainingMs = restEndTime - Date.now();
    if (restRemainingMs <= 0) {
      clearInterval(restInterval);
      restRunning = false;
      restRemainingMs = 0;
      document.getElementById('ringFill').classList.add('done');
      document.getElementById('restLabel').textContent = '¡A LA SIGUIENTE SERIE!';
      document.getElementById('restToggle').textContent = 'Iniciar descanso';
      if (navigator.vibrate) { try { navigator.vibrate([200, 80, 200]); } catch (e) {} }
      restCyclesThisSession += 1;
      if (restCyclesThisSession % 3 === 0) toast('💧 Pausa: tomá agua antes de seguir.');
    }
    renderRest();
  }
  document.getElementById('restToggle').addEventListener('click', function () {
    if (restRunning) {
      clearInterval(restInterval);
      restRunning = false;
      restRemainingMs = Math.max(0, restEndTime - Date.now());
      this.textContent = 'Reanudar';
    } else {
      if (restRemainingMs <= 0) restRemainingMs = restTotalMs;
      restEndTime = Date.now() + restRemainingMs;
      restRunning = true;
      restInterval = setInterval(restTick, 200);
      document.getElementById('restLabel').textContent = 'DESCANSANDO';
      document.getElementById('ringFill').classList.remove('done');
      this.textContent = 'Pausar';
    }
  });
  document.getElementById('restMinus').addEventListener('click', function () {
    if (restRunning) return;
    restTotalMs = Math.max(15000, restTotalMs - 15000);
    restRemainingMs = restTotalMs;
    renderRest();
  });
  document.getElementById('restPlus').addEventListener('click', function () {
    if (restRunning) return;
    restTotalMs = Math.min(300000, restTotalMs + 15000);
    restRemainingMs = restTotalMs;
    renderRest();
  });

  // ---------- Smartwatch (Web Bluetooth heart rate) ----------
  function bluetoothSupported() { return 'bluetooth' in navigator; }
  function onHRChanged(e) {
    var value = e.target.value;
    var flags = value.getUint8(0);
    var hr = (flags & 0x1) === 0 ? value.getUint8(1) : value.getUint16(1, true);
    document.getElementById('hrReading').textContent = '❤️ ' + hr + ' BPM';
  }
  async function connectHR() {
    if (!bluetoothSupported()) {
      toast('Tu navegador no soporta conexión a smartwatch. Funciona en Chrome para Android con relojes BLE.');
      return;
    }
    try {
      var device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });
      hrDevice = device;
      var server = await device.gatt.connect();
      var service = await server.getPrimaryService('heart_rate');
      hrChar = await service.getCharacteristic('heart_rate_measurement');
      await hrChar.startNotifications();
      hrChar.addEventListener('characteristicvaluechanged', onHRChanged);
      document.getElementById('hrConnectBtn').textContent = 'Conectado ✓';
      toast('⌚ Smartwatch conectado');
    } catch (e) {
      toast('No se pudo conectar el smartwatch.');
    }
  }
  document.getElementById('hrConnectBtn').addEventListener('click', connectHR);
  if (!bluetoothSupported()) {
    document.getElementById('hrConnectBtn').textContent = 'No disponible en este navegador';
    document.getElementById('hrConnectBtn').disabled = true;
  }

  // ---------- Mobility ----------
  function resetMobility() {
    poseAnswers = {};
    var list = document.getElementById('poseList');
    list.innerHTML = '';
    POSES.forEach(function (p, i) {
      var card = document.createElement('div');
      card.className = 'pose-card';
      card.innerHTML =
        '<span class="pose-name">' + p.name + '</span>' +
        '<span class="pose-cue">' + p.cue + '</span>' +
        '<div class="pose-toggle">' +
          '<button data-i="' + i + '" data-v="ok">No molesta</button>' +
          '<button data-i="' + i + '" data-v="bad">Molesta / desigual</button>' +
        '</div>';
      list.appendChild(card);
    });
    list.querySelectorAll('.pose-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = btn.getAttribute('data-i'), v = btn.getAttribute('data-v');
        poseAnswers[i] = v;
        var siblings = btn.parentElement.querySelectorAll('button');
        siblings.forEach(function (b) { b.classList.remove('selected', 'ok', 'bad'); });
        btn.classList.add('selected', v);
      });
    });
    document.getElementById('mobilityResult').hidden = true;
  }
  document.getElementById('checkMobilityBtn').addEventListener('click', function () {
    var answered = Object.keys(poseAnswers).length;
    if (answered < POSES.length) { toast('Marcá las ' + POSES.length + ' posturas primero.'); return; }
    var badCount = Object.values(poseAnswers).filter(function (v) { return v === 'bad'; }).length;
    var result = document.getElementById('mobilityResult');
    if (badCount >= 2) {
      result.textContent = 'Marcaste molestia/asimetría en ' + badCount + ' de ' + POSES.length + ' posturas — es señal de una posible rotación o restricción de cadera. Sumá estiramientos de piriforme, flexor de cadera y movilidad de tobillo, con foco en el lado más tenso.';
    } else if (badCount === 1) {
      result.textContent = 'Una postura te generó molestia — probablemente puntual. Prestale atención esta semana y repetí el chequeo.';
    } else {
      result.textContent = 'Sin molestias en ninguna postura. Buena movilidad de base — seguí con tu rutina normal.';
    }
    result.hidden = false;
    addXp(10);
  });

  // ---------- Progress ----------
  function renderProgress() {
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      days.push({ label: ['D', 'L', 'M', 'M', 'J', 'V', 'S'][d.getDay()], xp: state.history[key] || 0 });
    }
    var max = Math.max(10, Math.max.apply(null, days.map(function (d) { return d.xp; })));
    var chart = document.getElementById('xpChart');
    var labels = document.getElementById('xpChartLabels');
    chart.innerHTML = ''; labels.innerHTML = '';
    days.forEach(function (d) {
      var bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = Math.max(3, (d.xp / max) * 90) + 'px';
      chart.appendChild(bar);
      var lab = document.createElement('span');
      lab.textContent = d.label;
      labels.appendChild(lab);
    });

    var grid = document.getElementById('badgeGrid');
    grid.innerHTML = '';
    BADGES.forEach(function (b) {
      var unlocked = state.badges.indexOf(b.id) !== -1;
      var el = document.createElement('div');
      el.className = 'badge' + (unlocked ? ' unlocked' : '');
      el.innerHTML = '<span class="badge-icon">' + b.icon + '</span><span class="badge-name">' + b.name + '</span>';
      grid.appendChild(el);
    });
  }

  // ---------- Premium ----------
  function showPremiumNote(msg) { document.getElementById('premiumNote').textContent = msg; }
  document.getElementById('premiumYearBtn').addEventListener('click', function () {
    showPremiumNote('Plan anual seleccionado ($29.990 CLP/año). La compra real se habilita cuando la app esté publicada y conectada a Google Play Billing.');
  });
  document.getElementById('premiumMonthBtn').addEventListener('click', function () {
    showPremiumNote('Plan mensual seleccionado ($4.990 CLP/mes). La compra real se habilita cuando la app esté publicada y conectada a Google Play Billing.');
  });

  // ---------- Profile ----------
  function initials(name) {
    return (name || 'A').trim().slice(0, 1).toUpperCase();
  }
  function renderProfile() {
    document.getElementById('avatarCircle').textContent = initials(state.name);
    document.getElementById('profileName').textContent = state.name;
    var joined = state.joinedAt ? new Date(state.joinedAt) : new Date();
    document.getElementById('profileMeta').textContent = 'Miembro desde ' + joined.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('profXp').textContent = state.xp;
    document.getElementById('profLevel').textContent = levelFromXp(state.xp);
    document.getElementById('profStreak').textContent = state.streak;
    document.getElementById('profBadges').textContent = state.badges.length;

    document.getElementById('profNameInput').value = state.name;
    setActiveChip('profAgeChoice', state.ageBracket);
    setActiveChip('profEquipChoice', state.equip);
    setActiveChip('profExpChoice', state.experience);
    setActiveChip('profVisualChoice', state.visualStyle);
    renderCycleSection();
  }
  function setActiveChip(containerId, val) {
    document.querySelectorAll('#' + containerId + ' button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-val') === val);
    });
  }
  wireChipGroup('profAgeChoice', function (v) { state.ageBracket = v; });
  wireChipGroup('profEquipChoice', function (v) { state.equip = v; });
  wireChipGroup('profExpChoice', function (v) { state.experience = v; });
  wireChipGroup('profVisualChoice', function (v) {
    state.visualStyle = v;
    document.documentElement.setAttribute('data-visual', v);
  });
  document.getElementById('saveProfileBtn').addEventListener('click', function () {
    var n = document.getElementById('profNameInput').value.trim();
    state.name = n || state.name;
    saveState();
    toast('Perfil actualizado');
    renderProfile();
  });
  // ---------- Cycle log (opt-in, local-only, informational) ----------
  function daysBetween(a, b) { return Math.floor((b - a) / 86400000); }
  function cyclePhaseLabel(dayInCycle, length) {
    if (dayInCycle <= 5) return 'Menstrual';
    if (dayInCycle <= Math.round(length / 2)) return 'Folicular';
    if (dayInCycle <= Math.round(length / 2) + 2) return 'Ovulación (aprox.)';
    return 'Lútea';
  }
  function renderCycleSection() {
    var on = !!state.cycle.enabled;
    setActiveChip('cycleToggle', on ? 'on' : 'off');
    document.getElementById('cycleFields').hidden = !on;
    var result = document.getElementById('cycleResult');
    if (on && state.cycle.lastStart) {
      var start = new Date(state.cycle.lastStart + 'T00:00:00');
      var length = state.cycle.length || 28;
      var diff = daysBetween(start, new Date());
      var dayInCycle = ((diff % length) + length) % length + 1;
      result.hidden = false;
      result.textContent = 'Día ' + dayInCycle + ' de tu ciclo — fase aproximada: ' + cyclePhaseLabel(dayInCycle, length) + '. Es una estimación para tu propio registro, no un diagnóstico.';
      document.getElementById('cycleStartInput').value = state.cycle.lastStart;
      document.getElementById('cycleLengthInput').value = length;
    } else {
      result.hidden = true;
    }
  }
  wireChipGroup('cycleToggle', function (v) {
    state.cycle.enabled = (v === 'on');
    if (!state.cycle.enabled) { state.cycle.lastStart = null; }
    saveState();
    renderCycleSection();
  });
  document.getElementById('saveCycleBtn').addEventListener('click', function () {
    var dateVal = document.getElementById('cycleStartInput').value;
    var lenVal = parseInt(document.getElementById('cycleLengthInput').value, 10);
    if (!dateVal) { toast('Elegí una fecha primero.'); return; }
    state.cycle.lastStart = dateVal;
    state.cycle.length = (lenVal >= 15 && lenVal <= 45) ? lenVal : 28;
    saveState();
    renderCycleSection();
    toast('Registro guardado — solo en este teléfono.');
  });

  document.getElementById('resetProgressBtn').addEventListener('click', function () {
    if (!confirm('¿Seguro que querés borrar todo tu progreso? No se puede deshacer.')) return;
    var keepVisual = state.visualStyle;
    state = Object.assign({}, defaultState);
    state.visualStyle = keepVisual;
    saveState();
    document.getElementById('screen-onboard').hidden = false;
    document.getElementById('topbar').hidden = true;
    document.getElementById('tabbar').hidden = true;
    document.getElementById('nameInput').value = '';
  });

  // ---------- Tab bar ----------
  document.getElementById('tabbar').addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    showScreen(btn.getAttribute('data-screen'));
  });

  // ---------- Boot ----------
  document.documentElement.setAttribute('data-visual', state.visualStyle);
  if (state.onboarded) {
    document.getElementById('nameInput').value = state.name;
    enterApp();
  }

  if ('serviceWorker' in navigator) {
    try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}
  }
})();
