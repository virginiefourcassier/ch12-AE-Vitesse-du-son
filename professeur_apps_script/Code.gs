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
    .addSeparator()
    .addItem('Tout effacer, y compris l’ancien onglet Scores', 'clearAllIncludingLegacy')
    .addToUi();
}

function clearNumerical() { clearCh12_([CH12_NUMERICAL]); }
function clearPresentation() { clearCh12_([CH12_PRESENTATION]); }
function clearBoth() { clearCh12_([CH12_NUMERICAL, CH12_PRESENTATION]); }
function clearAllIncludingLegacy() { clearCh12_([CH12_NUMERICAL, CH12_PRESENTATION, 'Scores']); }

function clearCh12_(names) {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert('🧹 Suppression des données',
    'Cette opération efface toutes les réponses et notes des onglets :\n'
    + names.join('\n') + '\n\nLes titres des colonnes restent en place. L’ancien onglet Scores n’est effacé que si tu l’as explicitement sélectionné.\n\nConfirmer ?',
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
    if(kind==='measure')return receiveMeasure_(d);
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
    const expected=kind==='v'?D/(dt/1000):kind==='D'?v*dt/1000:dt;
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


// Mesures de paillasse : classeur privé distinct des notes, synthèses publiques uniquement.
const CH12_MEASURES_ID = '1fB9X_uX010M6tvFrcvLlqXMUyzVT2wZcXTxR7ZxLKvA';
const CH12_PUBLIC_STATS_ID = '1DXAthBSkv-H89I0oG4DaIU2e1HdOpwyxnP2ftK3VbnQ';

function receiveMeasure_(d) {
  const classe=String(d.classe||'').trim(),binome=number_(d.binome),D=number_(d.D),dt=number_(d.dt);
  if(!Array.from({length:10},(_,i)=>'2nde '+(i+1)).includes(classe)||!Number.isInteger(binome)||binome<1||binome>60||D<=0||dt<=0)
    throw new Error('Vérifie la classe, le binôme, la distance en mètres et le retard en millisecondes.');
  const speed=1000*D/dt;
  if(!Number.isFinite(speed)||speed<=0||speed>25000)throw new Error('Vérifie les unités : la célérité calculée est incompatible avec cette trame.');
  const ss=SpreadsheetApp.openById(CH12_MEASURES_ID),sh=ss.getSheetByName('Mesures');
  if(!sh)throw new Error('Onglet Mesures introuvable');
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  let receipt;
  try {
    const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
    const previous=rows.find(row=>String(row[6])===d.attemptId);
    if(previous){
      if(Number(previous[1])!==binome||Number(previous[2])!==D||Number(previous[3])!==dt||String(previous[5])!==classe)
        throw new Error('Cet identifiant correspond déjà à un autre relevé.');
      receipt=String(previous[7]);
    }else{
      receipt=Utilities.getUuid().slice(0,8).toUpperCase();
      const row=sh.getLastRow()+1;
      sh.appendRow([new Date(),binome,D,dt,'=1000*C'+row+'/D'+row,classe,d.attemptId,receipt]);
      SpreadsheetApp.flush();
    }
    refreshMeasureSummaries_();
  }finally{lock.releaseLock();}
  return respond_({type:'son-measure',ok:true,attemptId:d.attemptId,receipt,classe,binome,D,dt,speed});
}

function measureStatistics_(speeds) {
  const n=speeds.length,mean=n?speeds.reduce((a,b)=>a+b,0)/n:null;
  const sigma=n>1?Math.sqrt(speeds.reduce((a,v)=>a+(v-mean)**2,0)/(n-1)):null;
  const u=n>1?sigma/Math.sqrt(n):null;
  const start=n?Math.min(300,Math.floor(Math.min(...speeds)/10)*10):300;
  const end=n?Math.max(450,(Math.floor(Math.max(...speeds)/10)+1)*10):450;
  const bins=[];
  for(let low=start;low<end;low+=10)bins.push([low+' ≤ v < '+(low+10),speeds.filter(v=>v>=low&&v<low+10).length]);
  return {n,mean,sigma,u,bins};
}

function writeMeasureSummary_(sh,speeds,label) {
  const data=measureStatistics_(speeds);
  sh.getRange('A1:C5').setValues([
    ['SYNTHÈSE — '+label,'Valeur','Unité'],
    ['Nombre de mesures valides',data.n,''],
    ['Célérité moyenne',data.mean===null?'':data.mean,'m/s'],
    ['Écart-type expérimental',data.sigma===null?'':data.sigma,'m/s'],
    ['Incertitude-type sur la moyenne',data.u===null?'':data.u,'m/s']
  ]);
  sh.getRange('A6:C7').setValues([['Mise à jour',new Date(),''],['Classe de vitesses (m/s)','Effectif','']]);
  // Effacer uniquement l'ancien histogramme dérivé, jamais les mesures.
  if(sh.getLastRow()>7)sh.getRange(8,1,sh.getLastRow()-7,2).clearContent();
  if(data.bins.length+7>sh.getMaxRows())sh.insertRowsAfter(sh.getMaxRows(),data.bins.length+7-sh.getMaxRows());
  sh.getRange(8,1,data.bins.length,2).setValues(data.bins);
  sh.getRange('B3:B5').setNumberFormat('0.000000');
  sh.getRange('B6').setNumberFormat('dd/mm/yyyy hh:mm:ss');
  const chart=sh.newChart().setChartType(Charts.ChartType.COLUMN).setNumHeaders(1).addRange(sh.getRange(7,1,data.bins.length+1,2))
    .setPosition(8,4,0,0).setOption('title','Répartition des célérités — '+label)
    .setOption('width',620).setOption('height',350).setOption('legend',{position:'none'})
    .setOption('hAxis',{title:'Célérité v (m/s) — classes de largeur 10 m/s'})
    .setOption('vAxis',{title:'Effectif',minValue:0,format:'0',ticks:Array.from({length:Math.max(1,...data.bins.map(b=>b[1]))+1},(_,i)=>i)}).build();
  sh.getCharts().forEach(c=>sh.removeChart(c));sh.insertChart(chart);
}

function refreshMeasureSummaries_() {
  const ss=SpreadsheetApp.openById(CH12_MEASURES_ID),sh=ss.getSheetByName('Mesures');
  const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
  const valid=rows.filter(r=>Number(r[2])>0&&Number(r[3])>0&&Number.isFinite(Number(r[4]))&&Number(r[4])>0);
  const all=valid.map(r=>Number(r[4]));
  writeMeasureSummary_(ss.getSheetByName('Synthèse PROF'),all,'toutes les classes');
  const publicSs=SpreadsheetApp.openById(CH12_PUBLIC_STATS_ID);
  writeMeasureSummary_(publicSs.getSheetByName('Synthèse élèves'),all,'toutes les classes');
  Array.from({length:10},(_,i)=>'2nde '+(i+1)).forEach(classe=>{
    const title='Synthèse '+classe,tab=publicSs.getSheetByName(title);
    if(!tab)throw new Error('Onglet collectif introuvable : '+title);
    writeMeasureSummary_(tab,valid.filter(r=>String(r[5])===classe).map(r=>Number(r[4])),classe);
  });
  SpreadsheetApp.flush();
}

// Lecture du reçu uniquement : aucun nom, aucune réponse brute ne sont publiés.
function doGet(e) {
  const p=e&&e.parameter||{},cb=String(p.callback||''),kind=String(p.kind||'measure');
  if(!/^ch12MeasureReceipt_[a-zA-Z0-9_]+$/.test(cb))return ContentService.createTextOutput('Requête non prise en charge.');
  const attemptId=String(p.attemptId||'');
  let payload={type:kind==='measure'?'son-measure-receipt':'son-result',kind,ok:false,attemptId};
  if(/^[a-zA-Z0-9-]{10,100}$/.test(attemptId)&&['measure','numeric','presentation'].includes(kind)){
    try {
      const ss=SpreadsheetApp.openById(kind==='measure'?CH12_MEASURES_ID:CH12_SHEET_ID);
      const sh=ss.getSheetByName(kind==='measure'?'Mesures':kind==='numeric'?CH12_NUMERICAL:CH12_PRESENTATION);
      if(!sh)throw new Error('Onglet introuvable');
      const idColumn=kind==='measure'?7:4;
      const ids=sh.getLastRow()>1?sh.getRange(2,idColumn,sh.getLastRow()-1,1).getValues():[];
      const index=ids.findIndex(row=>String(row[0])===attemptId);
      if(index>=0){
        const row=index+2;
        const receipt=String(sh.getRange(row,kind==='measure'?8:kind==='numeric'?13:15).getValue());
        if(/^[A-F0-9]{8}$/.test(receipt)){
          if(kind==='measure')payload={...payload,ok:true,receipt};
          else {
            const score=Number(sh.getRange(row,kind==='numeric'?10:13).getValue());
            if(Number.isInteger(score)&&score>=0&&score<=5)payload={...payload,ok:true,receipt,score,total:5};
          }
        }
      }
    } catch(error){payload.error='Confirmation momentanément indisponible.';}
  }
  return ContentService.createTextOutput(cb+'('+JSON.stringify(payload).replace(/</g,'\\u003c')+');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function actualiserSyntheses(){refreshMeasureSummaries_();}
