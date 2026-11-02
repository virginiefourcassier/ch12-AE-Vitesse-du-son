/* Améliore les consignes sans modifier les questions ni les correcteurs. */
function aideEleve(titre,contenu){return '<details class="aide-eleve"><summary>'+titre+'</summary>'+contenu+'</details>';}
function calculatriceEleve(index){
  return '<details class="aide-eleve calculatrice-simple"><summary>Ouvrir la calculatrice</summary><label for="calcul_'+index+'">Ton calcul</label><input id="calcul_'+index+'" class="calculatrice-saisie" type="text" inputmode="text" autocomplete="off" placeholder="Exemple : 0,68 / 0,002"><div class="calculatrice-touches">'+['7','8','9','÷','4','5','6','×','1','2','3','−','0',',','(',')'].map(v=>'<button type="button" data-calcul-touche="'+v+'" aria-label="'+({'÷':'Diviser','×':'Multiplier','−':'Soustraire',',':'Virgule'}[v]||v)+'">'+v+'</button>').join('')+'</div><div class="calculatrice-outils"><button type="button" data-calcul-touche="+">+</button><button type="button" data-calcul-action="effacer">Tout effacer</button><button type="button" data-calcul-action="retirer">⌫</button><button type="button" class="primary" data-calcul-action="calculer">Calculer =</button></div><output class="calculatrice-resultat" aria-live="polite"></output><p class="small">Tu peux écrire × ou *, et ÷ ou /.<br>Utilise une virgule ou un point pour les décimales.</p></details>';
}
// Analyse arithmétique limitée aux nombres et aux quatre opérations : aucun eval.
function calculSimple(expression){
  const s=expression.replace(/\s/g,'').replace(/,/g,'.').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
  if(!s||s.length>200)throw Error('Écris un calcul court.');
  const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|[()+*/-]/g);
  if(!tokens||tokens.join('')!==s)throw Error('Utilise des nombres et les signes +, −, × ou ÷.');
  let p=0;
  function facteur(){let t=tokens[p++];if(t==='+')return facteur();if(t==='-')return -facteur();if(t==='('){let n=somme();if(tokens[p++]!==')')throw Error('Vérifie les parenthèses.');return n;}if(t===undefined||!/^\d|^\./.test(t))throw Error('Il manque un nombre.');return Number(t);}
  function produit(){let n=facteur();while(tokens[p]==='*'||tokens[p]==='/'){let op=tokens[p++],b=facteur();if(op==='/'&&b===0)throw Error('On ne peut pas diviser par zéro.');n=op==='*'?n*b:n/b;}return n;}
  function somme(){let n=produit();while(tokens[p]==='+'||tokens[p]==='-'){let op=tokens[p++],b=produit();n=op==='+'?n+b:n-b;}return n;}
  const n=somme();if(p!==tokens.length||!Number.isFinite(n))throw Error('Vérifie ton calcul.');return n;
}
function activerCalculatrices(){document.querySelectorAll('.calculatrice-simple').forEach(box=>{
  const input=box.querySelector('input'),out=box.querySelector('output');
  function calculer(){try{out.textContent='Résultat : '+String(calculSimple(input.value)).replace('.',',');}catch(e){out.textContent=e.message;}}
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();calculer();}});
  input.addEventListener('input',()=>out.textContent='');
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.calculTouche!==undefined){const pos=input.selectionStart??input.value.length,end=input.selectionEnd??pos;input.value=input.value.slice(0,pos)+b.dataset.calculTouche+input.value.slice(end);input.focus();input.setSelectionRange(pos+1,pos+1);out.textContent='';}else if(b.dataset.calculAction==='effacer'){input.value='';out.textContent='';input.focus();}else if(b.dataset.calculAction==='retirer'){input.value=input.value.slice(0,-1);out.textContent='';input.focus();}else calculer();}));
});}

// Remplace uniquement l'interface de pointage, avec la même formule de mesure.
setupQuestionRulers=function(){document.querySelectorAll('#quizArea .test-question').forEach((block,index)=>{
  const img=block.querySelector('img'),answer=document.getElementById('answer_'+index);
  if(!img){answer.disabled=true;return;}
  if(img.dataset.crop==='yes'){const original=new Image();original.onload=()=>{const amount=Math.round(original.naturalHeight*.13);if(amount>=original.naturalHeight-30)return;const canvas=document.createElement('canvas');canvas.width=original.naturalWidth;canvas.height=original.naturalHeight-amount;canvas.getContext('2d').drawImage(original,0,amount,original.naturalWidth,canvas.height,0,0,canvas.width,canvas.height);img.src=canvas.toDataURL('image/png');img.alt='Représentations temporelles des deux signaux avec axe des dates';};original.src=img.src;}
  const frame=document.createElement('div');frame.className='question-ruler-frame';img.before(frame);frame.append(img);
  const overlay=document.createElement('div');overlay.className='question-ruler-overlay';overlay.setAttribute('aria-label','Zone de pointage sur les représentations temporelles');frame.append(overlay);
  const tools=document.createElement('div');tools.className='card ruler-tools';frame.before(tools);
  tools.innerHTML='<section class="etape-mesure calibration-stage"><h4>Étape 1 — Préparer l’échelle de l’image</h4><p>Clique sur une graduation de l’axe horizontal.</p><p>Clique sur une autre graduation dont tu connais la date.</p><p>Indique la durée entre ces deux graduations, puis valide l’étalonnage.</p>'+aideEleve('Pourquoi faut-il étalonner ?', '<p>L’ordinateur voit une image.</p><p>Il ne sait pas quelle durée correspond à un centimètre sur cette image.</p><p>Tu lui indiques cette échelle avec deux graduations.</p><p>Cette préparation s’appelle l’étalonnage.</p><p>Ce n’est pas encore la mesure du retard entre les signaux.</p>')+aideEleve('Comment trouver la durée entre les graduations ?', '<p>Lis la date de chacune des deux graduations choisies sur l’axe horizontal.</p><p>Soustrais la plus petite date à la plus grande.</p><p><strong>Exemple d’aide, sans lien avec les valeurs de cet exercice :</strong><br>Pour des graduations à 1 ms et 4 ms, la durée entre elles est 4 − 1 = 3 ms.</p><p>Attention : ne saisis pas simplement la date de la deuxième graduation.</p><p>Si l’axe est en µs, divise la durée en µs par 1 000 pour l’obtenir en ms.</p>')+'<div class="mesure-action"><label>Durée entre les graduations, en ms<input class="ruler-gap" type="text" inputmode="decimal" placeholder="Exemple : 3" autocomplete="off"></label><button type="button" class="primary ruler-calibrate">Valider l’étalonnage</button></div></section><section class="etape-mesure measurement-stage" hidden><h4>Étape 2 — Mesurer le retard entre les signaux</h4><p>Clique sur une variation identifiable du signal 1.</p><p>Clique sur la variation correspondante du signal 2.</p>'+aideEleve('Sur quelles parties des signaux cliquer ?', '<p>Choisis une même variation sur les deux signaux.</p><p>Tu peux, par exemple, choisir le premier pic vers le bas de chaque signal.</p><p>Il n’est pas nécessaire de choisir le début des signaux.</p><p>Les deux pics peuvent avoir des hauteurs différentes.</p>')+'<button type="button" class="ruler-measure-again">Recommencer seulement la mesure</button></section><p class="calibration-summary" hidden></p><button type="button" class="ruler-restart">↻ Refaire l’étalonnage et la mesure</button>';
  const output=document.createElement('p');output.className='ruler-output';output.setAttribute('aria-live','polite');frame.after(output);
  const gapInput=tools.querySelector('.ruler-gap'),stage1=tools.querySelector('.calibration-stage'),stage2=tools.querySelector('.measurement-stage'),summary=tools.querySelector('.calibration-summary'),status=block.querySelector('.ruler-lock-status');
  let xs=[],marks=[],calibrated=false,gap=0;
  function lock(){answer.disabled=true;answer.value='';evaluationItems[index].measuredDt=null;delete tools.dataset.measured;if(status)status.textContent='Tu pourras répondre après l’étalonnage et la mesure du retard.';}
  function reset(){xs=[];marks.forEach(m=>m.remove());marks=[];calibrated=false;gap=0;stage1.hidden=false;stage2.hidden=true;summary.hidden=true;lock();output.textContent='Étape 1 : clique sur la première graduation de l’axe horizontal.';}
  function restartMeasure(){xs=xs.slice(0,2);marks.splice(2).forEach(m=>m.remove());lock();output.textContent='Étape 2 : clique sur une variation identifiable du signal 1.';}
  tools.querySelector('.ruler-calibrate').onclick=()=>{const n=Number(gapInput.value.trim().replace(',','.'));if(xs.length<2){output.textContent='Clique d’abord sur deux graduations de l’axe horizontal.';return;}if(!(n>0)||!Number.isFinite(n)||Math.abs(xs[1]-xs[0])<.002){output.textContent='Vérifie tes deux graduations et indique une durée supérieure à zéro, en ms.';return;}gap=n;calibrated=true;stage1.hidden=true;stage2.hidden=false;summary.hidden=false;summary.textContent='Étape 1 terminée : les graduations G1 et G2 sont séparées de '+String(gap).replace('.',',')+' ms.';output.textContent='Étape 2 : clique maintenant sur une variation identifiable du signal 1.';};
  tools.querySelector('.ruler-restart').onclick=reset;tools.querySelector('.ruler-measure-again').onclick=restartMeasure;
  gapInput.addEventListener('input',()=>{if(calibrated)reset();});
  overlay.addEventListener('pointerdown',event=>{
    if(!calibrated&&xs.length===2){output.textContent='Indique la durée entre G1 et G2, puis clique sur « Valider l’étalonnage ».';return;}
    if(calibrated&&xs.length===4){output.textContent='Pour changer les points, clique sur « Recommencer seulement la mesure ».';return;}
    const rect=overlay.getBoundingClientRect();if(!rect.width)return;const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));xs.push(x);
    const marker=document.createElement('span');marker.className='question-ruler-marker';marker.style.left=(x*100)+'%';marker.style.borderColor=xs.length<3?'#1764a1':'#a32966';marker.dataset.label=['G1','G2','S1','S2'][xs.length-1];overlay.append(marker);marks.push(marker);
    if(xs.length===1)output.textContent='Étape 1 : clique sur la deuxième graduation de l’axe horizontal.';
    else if(xs.length===2)output.textContent='Étape 1 : indique la durée entre G1 et G2, puis valide l’étalonnage.';
    else if(xs.length===3)output.textContent='Étape 2 : clique sur la variation correspondante du signal 2.';
    else{const dt=Math.abs((xs[3]-xs[2])*gap/(xs[1]-xs[0]));if(!(dt>0)||!Number.isFinite(dt)){restartMeasure();output.textContent='Les deux points donnent un retard nul. Recommence la mesure des signaux.';return;}evaluationItems[index].measuredDt=dt;tools.dataset.measured='yes';answer.disabled=false;answer.placeholder=evaluationItems[index].kind==='v'?'Exemple : 346':evaluationItems[index].kind==='D'?'Exemple : 0,55':'Exemple : 1,60';output.textContent='Retard mesuré Δt ≈ '+dt.toFixed(3).replace('.',',')+' ms.';if(status)status.textContent='Étape 3 : tu peux maintenant saisir ta réponse dans l’unité demandée.';}
  });reset();
});};

const commencerExercicesOriginal=startTest;
startTest=function(){commencerExercicesOriginal();document.querySelectorAll('#quizArea .test-question').forEach((block,index)=>{
  const paragraphs=block.querySelectorAll(':scope > p');
  if(paragraphs[0]){paragraphs[0].classList.add('question-demande');paragraphs[0].innerHTML=paragraphs[0].innerHTML.replace(/\. (?=[A-ZÀÉ])/g,'.<br>');}
  if(paragraphs[1])paragraphs[1].textContent='Commence par l’étape 1 ci-dessous, puis passe à l’étape 2.';
  const calculConsigne=block.querySelector(':scope > p.small:not(.ruler-lock-status)');
  if(calculConsigne)calculConsigne.innerHTML='Étape 3 — Répondre à la question.<br>Utilise le retard que tu viens de mesurer.<br>Écris seulement le nombre, dans l’unité indiquée à côté de la case.';
  const calcLink=block.querySelector('a[href*="numworks"]');if(calcLink)calcLink.parentElement.insertAdjacentHTML('beforeend',calculatriceEleve(index));
  const kind=evaluationItems[index].kind;
  const mathHelp=kind==='v'?'<p>Tu cherches la célérité v.</p><p>Utilise v = D ÷ Δt.</p><p>Prends D en mètres et Δt en secondes pour obtenir v en m·s⁻¹.</p>':kind==='D'?'<p>Tu cherches la distance D.</p><p>Utilise D = v × Δt.</p><p>Prends v en m·s⁻¹ et Δt en secondes pour obtenir D en mètres.</p>':'<p>La durée affichée après le pointage est le retard Δt mesuré en millisecondes.</p><p>Reporte ce nombre dans la case de réponse en ms.</p>';
  const answer=block.querySelector('label:has(input[id^="answer_"])');if(answer)answer.insertAdjacentHTML('beforebegin',aideEleve('Une aide pour les unités et le calcul',mathHelp+'<p>Pour passer des millisecondes aux secondes, divise par 1 000.</p><p>Exemple d’aide : 3 ms = 0,003 s.</p>'));
});activerCalculatrices();};

function initAccessibilite(){
  document.querySelectorAll('nav button').forEach((b,i)=>{if(i===4)b.title='Notre expérience — saisie des mesures';if(i===5||i===6)b.title='Exploitation des résultats de la classe';});
  const showOriginal=show;show=function(i){showOriginal(i);document.querySelectorAll('nav button').forEach((b,j)=>{if(i===j)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});};
  document.querySelector('nav button.active')?.setAttribute('aria-current','page');
  // Retours à la ligne dans les consignes, sans toucher aux banques de questions.
  document.querySelectorAll('main > .page > p,main > .page > .note').forEach(p=>{
    const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);let nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const parts=n.textContent.split(/([.!?])\s+(?=[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜ])/);if(parts.length<3)return;const frag=document.createDocumentFragment();for(let i=0;i<parts.length;i+=2){frag.append(document.createTextNode(parts[i]+(parts[i+1]||'')));if(i+2<parts.length)frag.append(document.createElement('br'));}n.replaceWith(frag);});
  });
}
window.addEventListener('DOMContentLoaded',initAccessibilite);
