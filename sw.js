if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>i(e,r),d={module:{uri:r},exports:o,require:l};s[r]=Promise.all(n.map((e=>d[e]||l(e)))).then((e=>(t(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CahByCnL.css",revision:null},{url:"assets/index-CmDDtNjJ.js",revision:null},{url:"index.html",revision:"dba68ebba9c6bb5803dbc005a5677727"},{url:"registerSW.js",revision:"2d85ca9852ddbad6c6976160e19c137b"},{url:"manifest.webmanifest",revision:"5e53af98f3b8ec3476ee6091e134f28b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
