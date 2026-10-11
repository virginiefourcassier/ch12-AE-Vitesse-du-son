/* Lecteur SCORM 1.2 local : le paquet Genially cherche window.API. */
const runId = new URLSearchParams(location.search).get('attempt') || '';
const scormValues = {'cmi.core.lesson_status':'not attempted','cmi.core.score.raw':'','cmi.core.score.min':'0','cmi.core.score.max':'100','cmi.suspend_data':'','cmi.core.lesson_location':'','cmi.interactions._count':'0','cmi.objectives._count':'0'};
let initialized = false;
function reportScorm(){
  if(!initialized || scormValues['cmi.core.score.raw']==='') return;
  const score=Number(scormValues['cmi.core.score.raw']);
  const status=scormValues['cmi.core.lesson_status'];
  if(Number.isFinite(score)) parent.postMessage({type:'ch12-genially-score',attemptId:runId,rawScore:score,maxScore:Number(scormValues['cmi.core.score.max']),status},location.origin);
}
window.API = {
  LMSInitialize(){initialized=true;return 'true'},
  LMSGetValue(k){return scormValues[k] || ''},
  LMSSetValue(k,v){scormValues[k]=String(v);if(/^cmi\.(interactions|objectives)\.[0-9]+\.id$/.test(k)){const family=k.split('.')[1],i=Number(k.split('.')[2]);scormValues['cmi.'+family+'._count']=String(Math.max(Number(scormValues['cmi.'+family+'._count']),i+1))}return 'true'},
  LMSCommit(){reportScorm();return 'true'},
  LMSFinish(){reportScorm();initialized=false;return 'true'},
  LMSGetLastError(){return '0'},LMSGetErrorString(){return ''},LMSGetDiagnostic(){return ''}
};
