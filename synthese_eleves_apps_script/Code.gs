/** Menu professeur lié au tableur public de synthèse. Les élèves sont lecteurs. */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧹 Effacer les résultats')
    .addItem('Effacer les mesures de Seconde 1', 'effacerSeconde1')
    .addItem('Effacer les mesures de Seconde 5', 'effacerSeconde5')
    .addSeparator()
    .addItem('Effacer les mesures des deux classes', 'effacerToutesLesMesures')
    .addToUi();
}
function effacerSeconde1(){effacerMesures_('2nde 1');}
function effacerSeconde5(){effacerMesures_('2nde 5');}
function effacerToutesLesMesures(){effacerMesures_(null);}
function lignesAEffacer_(rows,classe){
  return rows.flatMap((row,index)=>
    (classe === null ? row.some(value=>value !== '') : String(row[5]) === classe)
      ? ['A'+(index+2)+':H'+(index+2)] : []);
}
function effacerMesures_(classe) {
  const ui=SpreadsheetApp.getUi();
  const cible=classe || 'les deux classes';
  if(ui.alert('🧹 Effacer les résultats',
    'Effacer les mesures de '+cible+' dans le tableur professeur et remettre à jour les synthèses et histogrammes ?\n\nLes en-têtes et les notes individuelles seront conservés.\n\nConfirmer ?',
    ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  const lock=LockService.getScriptLock();
  lock.waitLock(20000);
  let count=0;
  try {
    const ss=SpreadsheetApp.openById(CH12_MEASURES_ID);
    const sh=ss.getSheetByName('Mesures');
    if(!sh)throw new Error('Onglet Mesures introuvable.');
    const rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
    const ranges=lignesAEffacer_(rows,classe);
    count=ranges.length;
    if(count)sh.getRangeList(ranges).clearContent();
    SpreadsheetApp.flush();
    refreshMeasureSummaries_();
  } finally {lock.releaseLock();}
  ui.alert('Nettoyage terminé : '+count+' relevé(s) effacé(s). Les synthèses et histogrammes sont à jour.');
}
const CH12_MEASURES_ID = '1fB9X_uX010M6tvFrcvLlqXMUyzVT2wZcXTxR7ZxLKvA';
const CH12_PUBLIC_STATS_ID = '1DXAthBSkv-H89I0oG4DaIU2e1HdOpwyxnP2ftK3VbnQ';

function measureStatistics_(speeds) {
  const n=speeds.length,mean=n?speeds.reduce((a,b)=>a+b,0)/n:null;
  const sigma=n>1?Math.sqrt(speeds.reduce((a,v)=>a+(v-mean)**2,0)/(n-1)):null;
  const u=n>1?sigma/Math.sqrt(n):null;
  const start=n?Math.min(300,Math.floor(Math.min(...speeds)/25)*25):300;
  const end=n?Math.max(450,(Math.floor(Math.max(...speeds)/25)+1)*25):450;
  const bins=[];
  for(let low=start;low<end;low+=25)bins.push([low+' ≤ v < '+(low+25),speeds.filter(v=>v>=low&&v<low+25).length]);
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
    .setOption('hAxis',{title:'Célérité v (m/s) — classes de largeur 25 m/s'})
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
  ['2nde 1','2nde 5'].forEach(classe=>{
    const title='Synthèse '+classe,tab=publicSs.getSheetByName(title);
    if(!tab)throw new Error('Onglet collectif introuvable : '+title);
    writeMeasureSummary_(tab,valid.filter(r=>String(r[5])===classe).map(r=>Number(r[4])),classe);
  });
  SpreadsheetApp.flush();
}

