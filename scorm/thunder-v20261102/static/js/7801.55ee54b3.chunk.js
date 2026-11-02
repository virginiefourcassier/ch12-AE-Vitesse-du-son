"use strict";(globalThis.webpackChunk_genially_view_client=globalThis.webpackChunk_genially_view_client||[]).push([[7801],{47801(e,t,i){i.d(t,{geniallyFindThePairViewScript:()=>M});var n=i(45992),r=i(10285),o=i(84054),a=i(60708),s=i(41381),l=i(43495),d=i(17588),u=i(37577),c=i(56393);const m=1e3,p=294.11764705882354,g=u.Ay.div({display:"flex",justifyContent:"center",alignItems:"center",flexShrink:0,position:"absolute",paddingLeft:"12px",paddingRight:"12px",bottom:0,left:0,userSelect:"none",minHeight:"25%",top:"75%",width:"100%",backgroundColor:"rgba(18,18,18,0.5)"}),f=u.Ay.p({color:"white",fontSize:12,textAlign:"center",fontStyle:"normal",fontWeight:400,lineHeight:"16px",overflow:"hidden",textOverflow:"ellipsis",wordWrap:"break-word",whiteSpace:"nowrap",pointerEvents:"none"}),h=u.Ay.div`
  @keyframes rotate-out {
    0% {
      transform: rotateY(0deg);
    }
    33% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes rotate-in {
    0% {
      transform: rotateY(0deg);
    }
    33% {
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    12% {
      transform: scale(1.05, 1.05);
    }
    40% {
      transform: scale(1.05, 1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  container-type: size;

  cursor: ${e=>{let{$flipped:t,$burned:i}=e;return t||i?"default":"pointer"}};

  animation-name: ${e=>{let{$flipped:t}=e;return t?"rotate-out":"rotate-in"}}
    ${e=>{let{$burned:t}=e;return t?",pulse":""}};
  animation-duration: ${m}ms;
  animation-delay: 0ms, ${m}ms;
  animation-iteration-count: 1;
  animation-timing-function: ease-out, ease-in-out;
  perspective: 1500px;

  border-radius: 9%;
  @supports (container-type: size) {
    border-radius: 6cqmin;
  }

  /* HACK: We need to set border as important because .genially-embed is reseting our borders in the View */
  border: 1px solid
    ${e=>{let{theme:t,$flipped:i}=e;return i?t.color.border.primary.disabled():t.color.border.primary.default()}} !important;
  outline: 1px white solid;

  filter: ${e=>{let{$flipped:t}=e;return t?"":"drop-shadow(0px 1px 4px rgba(0, 15, 51, 0.2))"}};

  &:hover {
    filter: ${e=>{let{$flipped:t}=e;return t?"":"drop-shadow(rgba(0, 15, 51, 0.3) 0px 1px 8px)"}};
    border-color: ${e=>{let{theme:t,$flipped:i}=e;return i?t.color.border.primary.disabled():t.color.border.primary.hover()}} !important;
  }

  ${g} {
    visibility: ${e=>{let{$flipped:t}=e;return t?"initial":"hidden"}};
    transition: visibility ${p}ms steps(1);
    z-index: 1;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    opacity: ${e=>{let{$burned:t}=e;return t?"0.4":"0"}};
    transition: opacity ${m}ms steps(1);
    transition-delay: ${m}ms;
    background-color: white;
    pointer-events: none;
  }
`,b=e=>{let{title:t,frontImageSrc:i,coverImageSrc:r,fitImages:o,flipped:a,burned:s,onClick:l}=e;const d=Boolean(s),u=Boolean(a);return(0,n.jsxs)(h,{role:"button",$burned:d,$flipped:u,onClick:e=>{e.stopPropagation(),l&&l()},"aria-label":`Card showing ${u?"front":"back"} side with title: ${t}`,"aria-disabled":d,tabIndex:d?-1:0,children:[(0,n.jsx)("img",{style:{opacity:u?1:0,position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:o?"contain":"cover",transition:"opacity 294.11764705882354ms steps(1)"},src:i,alt:"front"}),(0,n.jsx)("img",{style:{opacity:u?0:1,position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:o?"contain":"cover",transition:"opacity 294.11764705882354ms steps(1)"},src:r,alt:"cover"}),t&&(0,n.jsx)(g,{hidden:!u,children:(0,n.jsx)(c.A,{text:t,placement:c.A.Position.TOP,fallbackPlacements:[c.A.Position.TOP],renderReferencePortalNode:document.querySelector("body"),children:(0,n.jsx)(f,{"data-testid":"card-title",children:t})})})]})};var v=i(40671),y=i(99049);const w=e=>{if("auto"===e)return;const t=Number(e);if(!Number.isNaN(t))return t;console.warn("Cannot parse row distribution. Setting to auto",e)},x=(e,t)=>t?((e,t)=>e<t?{numColumns:1,numRows:e}:{numColumns:Math.ceil(e/t),numRows:t})(e,t):(e=>{if(e<4)return{numColumns:1,numRows:e};let t=4;for(;e%t!==0&&t<7;)t+=1;return{numColumns:t,numRows:Math.ceil(e/t)}})(e),S=u.Ay.div`
  container-type: size;
  height: 100%;
  padding: 8px;
`,I=u.Ay.div`
  --contained-gap: 16px;

  display: grid;
  grid-template-columns: repeat(${e=>e.numColumns}, minmax(0, 1fr));
  grid-template-rows: repeat(${e=>e.numRows}, 1fr);
  grid-auto-flow: column;
  height: 100%;
  gap: var(--contained-gap);

  @supports (container-type: size) {
    --contained-gap: 4cqmin;
  }
`,C=(u.Ay.canvas({width:"100%",height:"100%",pointerEvents:"none",position:"absolute",top:0,left:0,zIndex:3}),e=>{let{items:t,renderItem:i,keyExtractor:r,getComputedStyles:o,forcedRows:a}=e;const s=x(t.length,a);return(0,n.jsx)(S,{children:(0,n.jsx)(I,{numColumns:s.numColumns,numRows:s.numRows,children:(0,n.jsx)(v.N,{children:t.map(((e,t)=>(0,n.jsx)(y.P.div,{layout:!0,style:o?o(e,t):void 0,initial:{opacity:0,scale:.7},animate:{opacity:1,scale:1},transition:{type:"spring",ease:"easeInOut",stiffness:30,damping:10},"data-testid":`grid-item-${r(e)}`,children:i(e)},r(e))))})})})}),E=e=>{let{theme:t,pairedImages:i,fitImages:r,forwardSetFlipped:o,coverImageSrc:a,rowsDitributionFromConfig:s}=e;const[l,c]=(0,d.useState)(!1);return(0,d.useEffect)((()=>{o(c)}),[o]),(0,n.jsx)(u.NP,{theme:t,children:(0,n.jsx)(C,{items:i,forcedRows:s,renderItem:e=>(0,n.jsx)(b,{title:e.title,frontImageSrc:e.src,coverImageSrc:a,fitImages:r,flipped:l}),keyExtractor:e=>e.id,getComputedStyles:()=>({pointerEvents:"none"})})})},j=e=>{let{pairedImages:t,coverImageSrc:i,fitImages:r,rowsDitributionFromConfig:o}=e;return(0,n.jsx)(E,{theme:l.A.themes.newPrimary,pairedImages:t,coverImageSrc:i,fitImages:r,forwardSetFlipped:()=>{},rowsDitributionFromConfig:o})};var A=i(50414);var F;!function(e){e.FACEDOWN="faceDown",e.FACEUP="faceUp",e.BURNED="burned"}(F||(F={}));const $=e=>e.replace("-original","-pair"),O=(e,t)=>{const i=e%2===1,n=t%2===1;return i&&!n?1:!i&&n?-1:e-t},N=e=>{let{theme:t,images:i,coverImageSrc:r,fitImages:o,rowsDitributionFromConfig:a,onSuccess:s,onFailure:l,onGameWon:c,onFaceUp:p}=e;const{shuffledCards:g,isFaceUp:f,isBurned:h,onPick:v}=((e,t,i,n,r)=>{const o=(0,d.useMemo)((()=>{const t=e.map((e=>{return Object.assign(Object.assign({},e),{id:e.id,pairId:e.id.includes("-pair")?(t=e.id,t.replace("-pair","-original")):$(e.id)});var t}));return(0,A.U)(t)}),[e]),[a,s]=(0,d.useState)((()=>{const e=new Map;return o.forEach((t=>{e.set(t.id,{id:t.id,status:F.FACEDOWN,pairId:t.pairId})})),e})),l=(0,d.useCallback)((e=>{var t;return(null===(t=a.get(e))||void 0===t?void 0:t.status)===F.FACEUP}),[a]),u=(0,d.useCallback)((e=>{var t;return(null===(t=a.get(e))||void 0===t?void 0:t.status)===F.BURNED}),[a]);return{shuffledCards:o,isFaceUp:l,isBurned:u,onPick:e=>{const o=a.get(e);if(o.status!==F.FACEDOWN)return;const l=[...a.values()].filter((e=>e.status===F.FACEUP));if(0===l.length)a.set(o.id,Object.assign(Object.assign({},o),{status:F.FACEUP}));else if(1===l.length){const e=l[0];e.pairId===o.id?(a.set(e.id,Object.assign(Object.assign({},e),{status:F.BURNED})),a.set(o.id,Object.assign(Object.assign({},o),{status:F.BURNED})),t()):(a.set(o.id,Object.assign(Object.assign({},o),{status:F.FACEUP})),i())}else 2===l.length&&(l.forEach((e=>{a.set(e.id,Object.assign(Object.assign({},e),{status:F.FACEDOWN}))})),a.set(o.id,Object.assign(Object.assign({},o),{status:F.FACEUP})));r(o.id),s(new Map(a)),[...a.values()].every((e=>e.status===F.BURNED))&&n()}}})(i,(()=>{setTimeout((()=>{s()}),m)}),(()=>{setTimeout((()=>{l()}),m)}),(()=>{setTimeout((()=>{c()}),m)}),(e=>{p(e)})),[y,w]=(0,d.useState)((()=>Array.from({length:g.length},((e,t)=>t))));return(0,d.useEffect)((()=>{w((e=>[...e].sort(O).reverse()))}),[]),(0,n.jsx)(u.NP,{theme:t,children:(0,n.jsx)(C,{items:g,forcedRows:a,renderItem:e=>(0,n.jsx)(b,{title:e.title,frontImageSrc:e.src,coverImageSrc:r,fitImages:o,flipped:f(e.id)||h(e.id),burned:h(e.id),onClick:()=>v(e.id)}),keyExtractor:e=>e.id,getComputedStyles:(e,t)=>({order:y[t]})})})};var T=i(54072);const k=e=>null!==e,P=e=>{if(e&&"action"in e){const{action:t}=e;return t&&"source"in t&&t.source?t.source:""}if(e&&"data"in e){const{data:t}=e;return t&&"source"in t&&t.source?t.source:""}return""},R=(e,t)=>{var i;const n=null===(i=e.image)||void 0===i?void 0:i.source,r=P(e.audio);return n?{id:t,src:n,title:e.title,altText:e.image.altText||"",audioSource:r}:null},U=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return e.flatMap((e=>{const i=(0,T.Ak)(),n=R(e,`${i}-original`),r=t?R(e,`${i}-pair`):((e,t)=>{var i,n;const r=null===(i=e.imagePair)||void 0===i?void 0:i.source;if(!r)return null;const o=P(e.audioPair);return{id:t,src:r,title:e.titlePair||e.title,altText:(null===(n=e.imagePair)||void 0===n?void 0:n.altText)||"",audioSource:o}})(e,`${i}-pair`);return[n,r]})).filter(k)},D="https://audios.genial.ly/59e059d30b9c21060cb4c2ec/de8b3efe-c4df-48ff-8bbb-2b3e940663d3.wav",B="https://audios.genial.ly/59e059d30b9c21060cb4c2ec/23fe908b-44e2-4972-981f-d857c429b126.wav",M=(e,t)=>{e.slide.audioRequirement=o.w.ShowMute;const i=e.config.itemList,l=U(i,e.config.identicalImages);(0,s.p)({getTargetNodeItem:()=>e.item,initialState:{hasSlideEntered:!1},renderApp:i=>{let{setState:o}=i;var s;const{coverImage:d,fitImages:u,numRows:c,onEndAction:m}=e.config,p=e.item;t.preloadAudio(D),t.preloadAudio(B),l.forEach((e=>{t.preloadAudio(e.audioSource)}));const g=()=>{t.playAudio({source:D})},f=()=>{t.playAudio({source:B})},h=()=>{null===m||void 0===m||m.run()};return null===(s=null===p||void 0===p?void 0:p.parentSlide)||void 0===s||s.on(a.m.Entered,(()=>{o({hasSlideEntered:!0})})),e=>{let{hasSlideEntered:i=!1}=e;if(!i)return(0,n.jsx)(n.Fragment,{});const o=[];return(0,n.jsx)(N,{theme:t.theme,images:l,coverImageSrc:String(d.source),fitImages:u,rowsDitributionFromConfig:w(c),onSuccess:g,onFailure:f,onGameWon:h,onFaceUp:e=>{const i=l.find((t=>t.id===e));if(!i||!i.audioSource)return;o.forEach((e=>{t.playAudio(Object.assign(Object.assign({},e),{playMode:r.F.Stop}))})),o.length=0;const n={source:i.audioSource,playMode:r.F.PlayRestart},a=t.playAudio(n);o.push(Object.assign(Object.assign({},n),{refId:a.refId}))}})}},renderThumbnailApp:()=>{const{coverImage:t,fitImages:i,numRows:r}=e.config;return(0,n.jsx)(j,{pairedImages:l,coverImageSrc:String(t.source),fitImages:i,rowsDitributionFromConfig:w(r)})}})(e,t)}},41381(e,t,i){i.d(t,{p:()=>a});var n=i(70377),r=i(66264),o=i(60708);function a(e){let{getTargetNodeItem:t,renderApp:i,renderThumbnailApp:a,initialState:s}=e,l=!1;const d=[],u=e=>{d.push(e)};return e=>{const c=t(e.config),m=null===c||void 0===c?void 0:c.parentSlide;function p(){l=!1,d.forEach((e=>{e()})),d.length=0}function g(){if(!c)return;let e=null;if("idOfFreeNode"in c)e=document.getElementById(c.idOfFreeNode);else{const t=document.createElement("div");t.innerHTML=c.source;let i=t.getElementsByClassName("genially-widget-app");i.length||(i=t.getElementsByClassName("genially-widget-gallery"));const{id:n}=i[0];if(!n)return;e=document.getElementById(n)}if(e){let t;const r=i=>{l&&t?n.render(t(i),e):console.warn('"rerender" was called when the widget was already unmounted. This is a no-op. Did you forget to dispose of an event handler with "onUnmount"?')};t=i({setState:r,onUnmount:u,unmountNow:p}),l=!0,r(s),d.push((()=>{n.unmountComponentAtNode(e)}))}}function f(){if(!c||!("idOfThumbnailFreeNode"in c))return[];const e=document.getElementsByClassName(c.idOfThumbnailFreeNode);return Array.from(e).filter((e=>e instanceof HTMLElement))}const h=c&&"isTransversal"in c&&c.isTransversal,b=()=>{null===c||void 0===c||c.on(r.q.Mount,(()=>{g()})),null===c||void 0===c||c.on(r.q.Unmount,(()=>{p()}))};h?b():(null===m||void 0===m||m.on(o.m.Entering,(()=>{l||(g(),l||b())})),null===m||void 0===m||m.on(o.m.Exited,(()=>{l&&p()}))),null===m||void 0===m||m.on(o.m.ThumbnailMount,(()=>{!function(){if(!a||!c||!("idOfThumbnailFreeNode"in c))return;f().forEach((e=>{n.unmountComponentAtNode(e)}))}(),function(){if(!a||!c||!("idOfThumbnailFreeNode"in c))return;f().forEach((e=>{const{renderingSlideId:t}=e.dataset;n.render(a({renderingSlideId:t}),e)}))}()}))}}}}]);
//# sourceMappingURL=https://s3-static-genially.genially.com/view/static/js/7801.55ee54b3.chunk.js.map