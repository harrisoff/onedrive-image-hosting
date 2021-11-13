var T=Object.defineProperty,B=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var C=(i,t,r)=>t in i?T(i,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[t]=r,u=(i,t)=>{for(var r in t||(t={}))j.call(t,r)&&C(i,r,t[r]);if(N)for(var r of N(t))F.call(t,r)&&C(i,r,t[r]);return i},I=(i,t)=>B(i,M(t));import{j as d,I as H,a as e,b as _,T as L,c as v,C as U,d as G,e as V,f as W,s as $,g as q,S as z,B as g,h as K,D as k,L as Y,G as J,P as Q,i as X,k as Z,l as ee,m as te,n as R,o as ie}from"./vendor.e164df4f.js";const ae=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))m(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&m(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerpolicy&&(n.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?n.credentials="include":a.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(a){if(a.ep)return;a.ep=!0;const n=r(a);fetch(a.href,n)}};ae();const x="a8e98bd0-7d39-4b69-84aa-0798b94b0f5d",O="https://harrisoff.github.io/onedrive-image-hosting";function re(i){return i&&i.startsWith("#")?(i=i.slice(1),Object.fromEntries(i.split("&").map(t=>t.split("=")).filter(t=>t.length===2))):{}}var ne=i=>{const{fileName:t,isUploading:r,shareUrl:m,error:a,onClickUpload:n}=i;let s,p;return a?(s=e("div",{className:"imageListItemContent",children:e("p",{className:"errorMessage",children:a})}),p=e(L,{title:"upload again",children:e(v,{sx:{color:"white"},onClick:()=>n(t),children:e(U,{})})})):r?(s=e("div",{className:"imageListItemContent"}),p=e(v,{sx:{color:"white"},children:e(U,{className:"flicker"})})):(s=e("img",{src:m,alt:t}),p=e(L,{title:"copy url",children:e(v,{sx:{color:"white"},onClick:()=>{m&&G(m)},children:e(V,{})})})),d(H,{className:"imageListItem",children:[s,e(_,{className:"imageListItemBar",title:e("div",{title:t,children:t}),position:"bottom",actionIcon:p,actionPosition:"left"})]})},le=({itemList:i,onClickUpload:t})=>e(W,{cols:5,rowHeight:164,className:"imageList",children:i.map(r=>React.createElement(ne,I(u({},r),{key:r.fileName,onClickUpload:t})))});const oe=$("input")({display:"none"});var se=({accessToken:i})=>{const[t]=React.useState(new q({accessToken:i})),[r,m]=React.useState("OneDriveImageHosting"),[a,n]=React.useState([]),s=(o,c)=>{n(f=>f.map(l=>l.fileName===o.fileName?u(u({},l),c):l))},p=o=>{s(o,{isUploading:!0,error:""}),t.upload(o.data,o.filePath).then(({id:c})=>(s(o,{isUploaded:!0,uploadId:c}),new Promise((f,l)=>{t.share(c).then(({shareId:h})=>{s(o,{isUploading:!1,shareId:h,shareUrl:ie(h)})}).catch(l)}))).catch(c=>{s(o,{isUploading:!1,error:c.message})})},w=o=>{const f=Array.from(o.target.files||[]).map(l=>({fileName:l.name,data:l,filePath:`${r}/${l.name}`,isUploading:!1,isUploaded:!1,uploadId:"",shareId:"",shareUrl:"",error:""})).filter(l=>!l.isUploading&&!l.isUploaded).filter(l=>!a.map(h=>h.fileName).includes(l.fileName));n([...a,...f.map(l=>I(u({},l),{isUploading:!0}))]),f.forEach(p)},S=o=>{const c=a.find(f=>f.fileName===o);c&&p(c)},[P,y]=React.useState(!1),E=()=>{y(!0)},A=()=>{location.href=R(x,O)},b=()=>{y(!1)};return d("div",{className:"main",children:[d(z,{direction:"row",alignItems:"center",spacing:2,className:"toolbox",children:[d("label",{children:[e(oe,{accept:"image/*",id:"contained-button-file",multiple:!0,type:"file",onChange:w}),e(g,{variant:"contained",component:"span",children:"Select Files"})]}),e(K,{size:"small",label:"folder name",value:r,onChange:o=>m(o.target.value)}),e(k,{orientation:"vertical",flexItem:!0}),e("span",{children:"If access_token is expired:"}),e(g,{variant:"contained",component:"span",onClick:E,children:"Open Auth Url"}),e(k,{orientation:"vertical",flexItem:!0}),e(Y,{href:"https://github.com/harrisoff/onedrive-image-hosting",target:"_blank",children:e(J,{})})]}),e(Q,{elevation:2,className:"imageListWrapper",children:a.length>0?e(le,{itemList:a,onClickUpload:S}):"Selected files will be displayed here"}),d(X,{open:P,onClose:b,children:[e(Z,{children:e(ee,{children:"You are leaving this page."})}),d(te,{children:[e(g,{color:"primary",onClick:A,children:"Go ahead"}),e(g,{color:"primary",onClick:b,children:"Cancel"})]})]})]})};const D=({label:i,message:t})=>d("p",{children:[d("span",{style:{color:"red",marginRight:"10px"},children:[i,":"]}),t]});function ce(){const{access_token:i,error:t,error_description:r}=re(location.hash);return i?e(se,{accessToken:i}):t?d("div",{style:{margin:"20px"},children:[e(D,{label:"ERROR",message:t}),e(D,{label:"ERROR DESCRIPTION",message:r.replace(/\+/g," ")})]}):(location.href=R(x,O),e("div",{style:{margin:"20px"},children:"Redirecting to OneDrive authentication page, please wait..."}))}ReactDOM.render(e(React.StrictMode,{children:e(ce,{})}),document.getElementById("root"));
