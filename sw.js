if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const o=e=>n(e,t),l={module:{uri:t},exports:c,require:o};i[t]=Promise.all(s.map((e=>l[e]||o(e)))).then((e=>(r(...e),c)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CahByCnL.css",revision:null},{url:"assets/index-CmDDtNjJ.js",revision:null},{url:"index.html",revision:"dba68ebba9c6bb5803dbc005a5677727"},{url:"registerSW.js",revision:"2d85ca9852ddbad6c6976160e19c137b"},{url:"apple-touch-icon.png",revision:"b8585c72e0bc5cc3699a0edb2016c01c"},{url:"manifest.webmanifest",revision:"53c18ce09ba16b3fcec76a6181c5b2ed"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
