/**
 * CH12 — Réception des deux évaluations indépendantes et nettoyage professeur.
 * À coller dans Extensions > Apps Script DU FICHIER PRIVÉ de notes.
 * Puis déployer en application Web (nouvelle version) exécutée par le propriétaire.
 * L'ancienne fonction de réception doit être remplacée, pas conservée en doublon.
 */
const CH12_SHEET_ID = '1gAf-Jnqz7xeVnkG-Bg1gWR9QWGk0NmfGGwjxQQkz-4w';
const CH12_NUMERICAL = 'Exercices numériques';
const CH12_PRESENTATION = 'Présentation des résultats';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧹 Effacer les résultats')
    .addItem('Effacer les exercices numériques', 'clearNumerical')
    .addItem('Effacer les présentations', 'clearPresentation')
    .addSeparator()
    .addItem('Effacer les deux séries de notes', 'clearBoth')
    .addToUi();
}

function clearNumerical() { clearCh12_([CH12_NUMERICAL]); }
function clearPresentation() { clearCh12_([CH12_PRESENTATION]); }
function clearBoth() { clearCh12_([CH12_NUMERICAL, CH12_PRESENTATION]); }

function clearCh12_(names) {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert('🧹 Suppression des données',
    'Cette opération efface toutes les réponses et notes des onglets :\n'
    + names.join('\n') + '\n\nLes titres des colonnes restent en place. L’ancien onglet Scores reste intact.\n\nConfirmer ?',
    ui.ButtonSet.YES_NO);
  if (answer !== ui.Button.YES) return;
  const ss = SpreadsheetApp.openById(CH12_SHEET_ID);
  let count = 0;
  names.forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) throw new Error('Onglet introuvable : ' + name);
    if (sh.getLastRow() > 1) {
      const range = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getMaxColumns());
      range.clearContent();
      count++;
    }
  });
  ui.alert('Nettoyage terminé : ' + count + ' onglet(s) vidé(s). Les en-têtes sont conservés.');
}

function doPost(e) {
  let attemptId = '', kind = '';
  try {
    if (!e || !e.parameter || !e.parameter.payload) throw new Error('Données de formulaire manquantes');
    const d = JSON.parse(e.parameter.payload);
    if (d.version !== 2) throw new Error('Version de formulaire incompatible');
    attemptId = String(d.attemptId || '');
    kind = String(d.kind || '');
    if (!/^[a-zA-Z0-9-]{10,100}$/.test(attemptId)) throw new Error('Identifiant de tentative invalide');
    if (!['numeric', 'presentation'].includes(kind)) throw new Error('Type d’évaluation inconnu');
    const student = safeText_(d.student, 80);
    const classe = safeText_(d.classe, 30);
    if (!student || !/^2nde (?:[1-9]|10)$/.test(classe)) throw new Error('Élève ou classe manquant');
    const evaluation = kind === 'numeric' ? gradeNumeric_(d.tasks) : gradePresentation_(d.values);
    const ss = SpreadsheetApp.openById(CH12_SHEET_ID);
    const sh = ss.getSheetByName(kind === 'numeric' ? CH12_NUMERICAL : CH12_PRESENTATION);
    if (!sh) throw new Error('Onglet de notes introuvable');
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    let receipt;
    try {
      const last = sh.getLastRow();
      let existing = -1;
      if (last > 1) {
        const ids = sh.getRange(2, 4, last - 1, 1).getValues();
        existing = ids.findIndex(row => String(row[0]) === attemptId);
      }
      if (existing >= 0) {
        const row = existing + 2;
        const storedScore = Number(sh.getRange(row, kind === 'numeric' ? 10 : 13).getValue());
        const storedReceipt = String(sh.getRange(row, kind === 'numeric' ? 13 : 15).getValue());
        return respond_({type:'son-result', ok:true, kind, attemptId, score:storedScore, total:5, receipt:storedReceipt});
      }
      receipt = Utilities.getUuid().slice(0,8).toUpperCase();
      const common = [new Date(), student, classe, attemptId];
      const row = kind === 'numeric'
        ? [...common, ...evaluation.points, evaluation.score,
           JSON.stringify(evaluation.details), JSON.stringify(d.tasks), receipt, 'Reçu']
        : [...common, ...evaluation.raw, evaluation.score,
           JSON.stringify(evaluation.details), receipt, 'Reçu'];
      sh.appendRow(row);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return respond_({type:'son-result', ok:true, kind, attemptId, score:evaluation.score, total:5, receipt});
  } catch(err) {
    return respond_({type:'son-result',ok:false,kind,attemptId,error:String(err.message || err)});
  }
}

function safeText_(v, max) {
  const str = String(v == null ? '' : v).trim().slice(0,max);
  // Neutraliser les formules dans les cellules dont le texte provient du navigateur.
  return /^[=+\-@]/.test(str) ? "'" + str : str;
}
function number_(v) {
  if (typeof v === 'string') v = v.trim().replace(',', '.');
  if (v === '' || v === null || v === undefined) throw new Error('Valeur numérique manquante');
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error('Nombre invalide');
  return n;
}
function near_(a, b, absolute, relative) {
  return Math.abs(a-b) <= Math.max(absolute, Math.abs(b)*relative);
}
function gradeNumeric_(tasks) {
  if (!Array.isArray(tasks) || tasks.length !== 5) throw new Error('Cinq exercices sont obligatoires');
  const modes = {v:0,D:0,dt:0}, details=[], points=[];
  tasks.forEach((t,i) => {
    const kind=String(t.kind),D=number_(t.D),dt=number_(t.measuredDt),v=number_(t.givenV),response=number_(t.response);
    if (!(kind in modes) || D<=0 || dt<=0 || v<=0 || response<=0) throw new Error('Exercice '+(i+1)+' invalide');
    modes[kind]++;
    const expected=kind==='v'?D/(dt/1000):kind==='D'?v*dt/1000:D/v*1000;
    const tolerance=kind==='dt'?Math.max(.025,.03*expected):Math.max(kind==='v'?5:.008,.04*expected);
    const ok=Math.abs(response-expected)<=tolerance;
    points.push(ok?1:0);
    details.push({number:i+1,kind,response,expected,points:ok?1:0});
  });
  if (modes.v!==2 || modes.D!==2 || modes.dt!==1) throw new Error('Composition de l’évaluation incorrecte');
  return {score:points.reduce((x,y)=>x+y,0),points,details};
}
function gradePresentation_(values) {
  if (!values || typeof values!=='object') throw new Error('Valeurs de présentation manquantes');
  const keys=['res_n','res_mean','res_sigma','res_u','res_u_round','res_mean_round','res_low','res_high'];
  const raw=keys.map(k => String(values[k] == null ? '' : values[k]).trim());
  const [n,m,s,u,ua,ma,l,h]=raw.map(number_);
  if (!Number.isInteger(n)||n<2||s<0||u<=0||ua<=0) throw new Error('Valeurs expérimentales non valides');
  const expected=s/Math.sqrt(n);
  if (!(expected>0)) throw new Error('Écart-type nul : calcul de la précision impossible avec cette trame');
  const scale=Math.pow(10,Math.floor(Math.log10(expected)));
  const rounded=Math.ceil(expected/scale-1e-12)*scale;
  const place=Math.pow(10,Math.floor(Math.log10(rounded)));
  const correctU=near_(u,expected,.005,.005);
  const correctRound=near_(ua,rounded,1e-8,1e-7);
  const correctMean=near_(ma,Math.round(m/place)*place,Math.max(1e-8,place*1e-5),1e-7);
  const correctBounds=near_(l,ma-ua,Math.max(1e-8,place*1e-5),1e-7)&&near_(h,ma+ua,Math.max(1e-8,place*1e-5),1e-7);
  const decimals=x=>String(x).replace(',','.').split('.')[1]?.length || 0;
  const rank=place<1?Math.max(0,-Math.round(Math.log10(place))):0;
  const formOk=correctBounds&&l<=ma&&ma<=h&&decimals(raw[5])===rank&&decimals(raw[6])===rank&&decimals(raw[7])===rank&&decimals(raw[4])===rank;
  const checks=[correctU,correctRound,correctMean,correctBounds,formOk];
  return {score:checks.filter(Boolean).length,raw,details:{
    incertitude_type:checks[0]?1:0,incertitude_arrondie:checks[1]?1:0,
    moyenne_arrondie:checks[2]?1:0,bornes:checks[3]?1:0,
    presentation_et_unites:checks[4]?1:0}};
}
function respond_(payload) {
  const json=JSON.stringify(payload).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><script>' +
    'try{window.top.postMessage(' + json + ',"*");}catch(e){}' +
    'try{window.parent.postMessage(' + json + ',"*");}catch(e){}' +
    '</'+'script><p>Réception traitée. Revenez sur la page de l’activité.</p>');
}
