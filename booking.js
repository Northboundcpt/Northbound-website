(function () {
"use strict";
const section=document.createElement("section");
section.className="section";
section.id="booking";
section.innerHTML=`<div class="wrap"><div class="eyebrow">Your home. Your time.</div><h2>Book your Northie.</h2><p>Choose your care and a date. Send us your request on WhatsApp and we’ll confirm the team, price and timing.</p><p>Monday–Saturday · 08:00–20:00. All work must finish by 20:00. Up to four cleans per day, subject to team availability.</p><div class="booking-layout"><div class="card"><h3>Choose a date</h3><p class="small">Highlighted dates are open for requests. A date is reserved only once we confirm.</p><div class="calendar-nav"><button type="button" id="previous-month" aria-label="Previous month">←</button><strong id="calendar-month"></strong><button type="button" id="next-month" aria-label="Next month">→</button></div><div id="booking-calendar" class="booking-calendar" role="group" aria-label="Available dates"></div><p id="availability-status" role="status">Loading availability…</p></div><form class="card" id="booking-form"><h3>A little about your clean</h3><p class="small">All fields are required except optional extras and “Anything else?”. Choose a date to enable your request.</p><label for="booking-service">Service</label><select id="booking-service" required><option value="">Choose a service</option></select><label for="booking-date">Selected date</label><input id="booking-date" type="text" readonly required placeholder="Choose a highlighted date"><label for="booking-time">Preferred start time</label><select id="booking-time" required><option value="">Choose a time</option><option>08:00</option><option>09:00</option><option>10:00</option><option>11:00</option><option>12:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option><option>17:00</option></select><p class="small">Start times depend on the service duration and travel. Larger jobs need an earlier start.</p><label for="booking-name">Your name</label><input id="booking-name" autocomplete="name" maxlength="100" required><label for="booking-area">Suburb</label><input id="booking-area" maxlength="100" required><label for="booking-size">Property or item size</label><input id="booking-size" maxlength="150" placeholder="e.g. 2 bedrooms or a 2-seater couch" required><div id="booking-carpet-fields" hidden><label for="carpet-width">Carpet width (metres)</label><input id="carpet-width" type="number" min="0.01" step="0.01" placeholder="e.g. 2"><label for="carpet-length">Carpet length (metres)</label><input id="carpet-length" type="number" min="0.01" step="0.01" placeholder="e.g. 3"><p class="small">One carpet per request. Estimate uses width × length, rounded up to the next listed area bracket. Above 12.25 m² is quoted separately. Final price depends on material and condition.</p></div><div id="booking-mattress-fields" hidden><label for="mattress-size">Mattress size</label><select id="mattress-size"><option value="">Choose a mattress size</option></select><p class="small">Price per mattress. Mention additional items in “Anything else?”.</p></div><div id="booking-bedroom-field" hidden><label for="booking-bedrooms">Property size for your estimate</label><select id="booking-bedrooms"><option value="">Choose your property size</option></select></div><div id="booking-window-field" hidden><p id="booking-window-info"></p><label id="booking-window-option"><input id="booking-windows" type="checkbox"> <span id="booking-window-label"></span></label><p class="small" id="booking-window-scope"></p></div><fieldset id="booking-extras"><legend>Optional extras</legend><div id="booking-extras-list"></div></fieldset><div class="booking-estimate" role="status" aria-live="polite"><strong id="booking-estimate">Choose a service to see an estimate.</strong><p class="small">This is a guide, not an official quote. Selected priced extras are included in the estimate. Laundry and any other quote-only extras are quoted separately. We’ll review your requirements and send an official quote before you confirm.</p></div><label for="booking-notes">Anything else? (optional)</label><textarea id="booking-notes" maxlength="1000" rows="3"></textarea><p class="small">Please leave out access codes and sensitive details. This form isn’t saved on our website. Continuing opens WhatsApp; you must send the message there.</p><button class="btn primary" id="booking-submit" type="submit" disabled>Request on WhatsApp</button><p id="booking-feedback" role="status"></p><noscript>Please use the WhatsApp link below to request a clean.</noscript></form></div></div>`;
const footer=document.querySelector("footer");
if(!footer)return;
footer.before(section);
const style=document.createElement("style");
style.textContent=`.booking-layout{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-top:2rem}#booking{scroll-margin-top:100px}#booking [hidden]{display:none!important}#booking label{display:block;font-weight:bold;margin:1rem 0 .3rem}#booking input,#booking select,#booking textarea{width:100%;padding:.8rem;border:1px solid #999;border-radius:10px;background:#fffdf7;color:#17223a;font:inherit}#booking button{font:inherit;cursor:pointer}#booking button:disabled{cursor:default;opacity:.45}.calendar-nav{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin:1.5rem 0}.calendar-nav button{padding:.6rem 1rem;border:1px solid #999;border-radius:10px;background:transparent}.booking-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.booking-calendar>span{text-align:center;font-size:.8rem;padding:.4rem 0}.booking-calendar button{border:1px solid #d7d1c0;border-radius:8px;min-height:42px;background:#e7eadf;color:#17223a}.booking-calendar button:disabled{background:transparent}.booking-calendar button[aria-pressed="true"]{background:#d7a63b;outline:2px solid #17223a}.booking-estimate{margin:1.25rem 0;padding:1rem;border-radius:14px;background:#e8dfc8}.booking-estimate .small{margin-bottom:0}#booking-extras{border:1px solid #b8ad94;border-radius:14px;margin:1.25rem 0;padding:1rem}#booking-extras legend{font-weight:bold}#booking-extras .small{margin-top:.25rem}#booking input[type="checkbox"]{width:auto;margin-right:.5rem}#booking-submit{border:0}#booking :focus-visible{outline:3px solid #b34b2a;outline-offset:3px}@media(max-width:820px){.booking-layout{grid-template-columns:1fr}}`;
document.head.append(style);
document.querySelectorAll(".nav .btn,.hero .btn.primary,.mobile-book").forEach(a=>a.href="#booking");
const el=id=>document.getElementById(id);
const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Johannesburg",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const parts=today.split("-").map(Number);
let year=parts[0],month=parts[1]-1,selected="",dates=new Set(),settings=null;
let priceData=null,submitting=false,extraInputs=[];
function updateSubmit(){
 const required=["booking-service","booking-time","booking-name","booking-area","booking-size"];
 if(isCarpet())required.push("carpet-width","carpet-length");
 if(isMattress())required.push("mattress-size");
 if(needsBedrooms())required.push("booking-bedrooms");
 let complete=true;
 required.forEach(id=>{
 const input=el(id),filled=String(input.value||"").trim().length>0;
 input.setCustomValidity(filled?"":"Please fill in this field.");
 if(!filled||!input.checkValidity())complete=false;
 });
 const ready=!!settings?.enabled&&!!selected&&allowed(selected)&&complete&&!submitting;
 el("booking-submit").disabled=!ready;
 return ready;
}
el("booking-form").oninput=updateSubmit;
el("booking-form").onchange=updateSubmit;
function isCarpet(){return el("booking-service").value==="Carpet Washing";}
function isMattress(){return el("booking-service").value==="Mattress Washing";}
function carpetQuote(){
 const w=Number(el("carpet-width").value),l=Number(el("carpet-length").value);
 if(!Number.isFinite(w)||!Number.isFinite(l)||w<=0||l<=0)return null;
 const area=w*l;
 const tier=priceData?.carpetPrices?.find(t=>area<=t.width*t.length+1e-9);
 return {area,price:tier?.price??null};
}
function fabricSummary(){
 if(isCarpet()){const q=carpetQuote();return "Carpet: "+el("carpet-width").value+" m wide × "+el("carpet-length").value+" m long; area "+(q?q.area.toFixed(2):"")+" m².";}
 if(isMattress())return "Mattress size: "+el("mattress-size").value;
 return "";
}
function needsBedrooms(){
 return el("booking-service").value==="Deep Clean"||extraInputs.some(({extra,input})=>input.checked&&extra.pricing==="bedrooms");
}
function selectedExtras(){
 return extraInputs.filter(({input})=>input.checked).map(({extra})=>{
 let fee=null;
 if(extra.pricing==="fixed")fee=Number(extra.price);
 if(extra.pricing==="bedrooms"){
 const bedrooms=Number(el("booking-bedrooms").value.match(/\d+/)?.[0]);
 if(bedrooms>0)fee=Number(bedrooms<=3?extra.smallHomePrice:extra.largeHomePrice);
 }
 return {name:extra.name,fee:Number.isFinite(fee)&&fee>=0?fee:null};
 });
}
function extraPriceLabel(extra){
 if(extra.pricing==="fixed")return "+R"+extra.price;
 if(extra.pricing==="bedrooms")return "1–3 bedrooms +R"+extra.smallHomePrice+" · 4+ bedrooms +R"+extra.largeHomePrice;
 return "Quote on request";
}
function renderExtras(){
 const list=el("booking-extras-list");list.replaceChildren();extraInputs=[];
 (priceData?.bookingExtras||[]).forEach((extra,index)=>{
 const box=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input"),text=document.createElement("span"),description=document.createElement("p");
 input.type="checkbox";input.id="booking-extra-"+index;input.onchange=updateEstimate;
 label.htmlFor=input.id;text.textContent=extra.name+" — "+extraPriceLabel(extra);
 description.className="small";description.textContent=extra.description;
 label.append(input);label.append(text);box.append(label);box.append(description);list.append(box);
 extraInputs.push({extra,input});
 });
 el("booking-extras").hidden=!extraInputs.length;
}
function windowChoice(){
 if(el("booking-service").value!=="Deep Clean")return null;
 const label=el("booking-bedrooms").value;
 const tier=priceData?.deepCleanPrices?.find(p=>p.label===label);
 if(!tier)return null;
 const bedrooms=Number(label.match(/\d+/)?.[0]);
 if(!Number.isFinite(bedrooms)||bedrooms<1)return null;
 const amount=Number(priceData?.extras?.windowWashing?.largeHomeAddon);
 return {included:bedrooms<=2,fee:Number.isFinite(amount)&&amount>=0?amount:null};
}
function windowSummary(){
 const choice=windowChoice();
 if(!choice)return "";
 if(choice.included)return "Window washing: included (standard, safely reachable windows).";
 return el("booking-windows").checked&&choice.fee!==null?"Window washing: requested (+R"+choice.fee+").":"Window washing: not selected.";
}
function priceEstimate(){
 const service=priceData?.services?.find(s=>s.name===el("booking-service").value);
 if(!service)return "Choose a service to see an estimate.";
 if(needsBedrooms()&&!el("booking-bedrooms").value)return "Choose your property size to calculate the estimate.";
 let price=service.price;
 if(isCarpet()){
 const q=carpetQuote();
 if(!q)return "Enter a valid width and length in metres to see an estimate.";
 if(q.price===null)return "Area: "+q.area.toFixed(2)+" m² — personalised quote required. Send measurements and photos on WhatsApp.";
 price="R"+q.price;
 }
 if(isMattress()){
 const tier=priceData?.mattressPrices?.find(t=>t.label===el("mattress-size").value);
 if(!tier)return "Choose your mattress size to see an estimate.";
 price="R"+tier.price;
 }
 if(service.name==="Deep Clean"){
 const tier=priceData.deepCleanPrices?.find(p=>p.label===el("booking-bedrooms").value);
 if(!tier)return "Choose your property size to calculate the estimate.";
 price=tier.price;
 }
 const extras=selectedExtras(),windows=windowChoice();
 let addition=extras.reduce((sum,item)=>sum+(item.fee??0),0);
 if(windows&&!windows.included&&el("booking-windows").checked&&windows.fee!==null)addition+=windows.fee;
 const match=String(price||"").match(/R\s*([\d,]+(?:\.\d+)?)/i);
 const quoteExtras=extras.filter(item=>item.fee===null);
 const quoteNote=quoteExtras.length?" "+quoteExtras.map(item=>item.name).join(", ")+" quoted separately.":"";
 if(!match)return "Personalised service quote"+(addition?"; selected priced extras +R"+addition.toLocaleString("en-ZA"):"")+" — send us your requirements and photos on WhatsApp."+quoteNote;
 const total=Number(match[1].replace(/,/g,""))+addition;
 return "Estimated price: "+(/from/i.test(price)?"From ":"around ")+"R"+total.toLocaleString("en-ZA")+quoteNote;
}
function updateEstimate(){
 el("booking-carpet-fields").hidden=!isCarpet();
 el("booking-mattress-fields").hidden=!isMattress();
 ["carpet-width","carpet-length"].forEach(id=>{el(id).required=isCarpet();el(id).disabled=!isCarpet();if(!isCarpet())el(id).setCustomValidity("");});
 el("mattress-size").required=isMattress();el("mattress-size").disabled=!isMattress();
 if(!isMattress())el("mattress-size").setCustomValidity("");
 const fabric=isCarpet()||isMattress();
 el("booking-size").hidden=fabric;el("booking-size").required=!fabric;
 document.querySelector('label[for="booking-size"]').hidden=fabric;
 if(fabric)el("booking-size").value=isCarpet()?"Carpet":"Mattress";
 else if(["Carpet","Mattress"].includes(el("booking-size").value))el("booking-size").value="";
 const bedroomsRequired=needsBedrooms();
 el("booking-bedroom-field").hidden=!bedroomsRequired;
 el("booking-bedrooms").required=bedroomsRequired;
 if(!bedroomsRequired)el("booking-bedrooms").setCustomValidity("");
 const windows=windowChoice();
 el("booking-window-field").hidden=!windows;
 el("booking-window-option").hidden=!windows||windows.included||windows.fee===null;
 el("booking-window-info").textContent=windows?.included?"Standard window washing is included in your Deep Clean.":"Add standard window washing to your Deep Clean (optional).";
 el("booking-window-label").textContent="Yes, wash my windows (+R"+(windows?.fee??"")+")";
 el("booking-window-scope").textContent=priceData?.extras?.windowWashing?.scope||"";
 el("booking-estimate").textContent=priceEstimate();
 updateSubmit();
}
el("booking-service").onchange=()=>{el("booking-windows").checked=false;updateEstimate();};
["carpet-width","carpet-length","mattress-size"].forEach(id=>el(id).addEventListener("input",updateEstimate));
el("booking-windows").onchange=updateEstimate;
el("booking-bedrooms").onchange=updateEstimate;
const key=(y,m,d)=>y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
const allowed=date=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=today&&new Date(date+"T12:00:00Z").getUTCDay()!==0&&dates.has(date);
function render(){
 el("calendar-month").textContent=new Intl.DateTimeFormat("en-ZA",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(year,month,1)));
 const grid=el("booking-calendar");grid.replaceChildren();
 ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach(day=>{const s=document.createElement("span");s.textContent=day;grid.append(s);});
 const offset=(new Date(Date.UTC(year,month,1)).getUTCDay()+6)%7;
 for(let i=0;i<offset;i++)grid.append(document.createElement("span"));
 const count=new Date(Date.UTC(year,month+1,0)).getUTCDate();
 for(let day=1;day<=count;day++){
 const date=key(year,month,day),b=document.createElement("button");b.type="button";b.textContent=day;b.disabled=!settings||!settings.enabled||!allowed(date);b.setAttribute("aria-label",date+(b.disabled?" — unavailable":" — request this date"));b.setAttribute("aria-pressed",String(selected===date));
 b.onclick=()=>{selected=date;el("booking-date").value=date;el("booking-feedback").textContent="Selected "+date;render();};grid.append(b);
 }
 el("previous-month").disabled=year===parts[0]&&month===parts[1]-1;
 updateSubmit();
}
el("previous-month").onclick=()=>{if(--month<0){month=11;year--;}render();};
el("next-month").onclick=()=>{if(++month>11){month=0;year++;}render();};
async function json(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw Error("Availability could not be loaded");return r.json();}
Promise.all([json("content/availability.json"),json("content/site.json")]).then(([availability,site])=>{
 priceData=site;
 (site.mattressPrices||[]).forEach(t=>{const o=document.createElement("option");o.value=t.label;o.textContent=t.label+" — R"+t.price;el("mattress-size").append(o);});
 renderExtras();
 (site.deepCleanPrices||[]).forEach(tier=>{const o=document.createElement("option");o.value=tier.label;o.textContent=tier.label;el("booking-bedrooms").append(o);});
 settings=availability;dates=new Set((availability.availableDates||[]).filter(v=>typeof v==="string"));
 (site.services||[]).forEach(s=>{const o=document.createElement("option");o.value=s.name;o.textContent=s.name;el("booking-service").append(o);});
 updateEstimate();
 const number=String(settings.whatsapp||"").replace(/\D/g,"");
 if(!/^\d{9,15}$/.test(number))throw Error("Booking contact needs updating");
 updateSubmit();
 const open=[...dates].filter(allowed).sort();
 el("availability-status").textContent=!settings.enabled?"Online requests are paused. Contact us on WhatsApp below.":open.length?"Choose a highlighted date. Availability is confirmed after we review your request.":"No dates are currently listed. Please contact us on WhatsApp below to check availability.";
 if(open.length){const p=open[0].split("-").map(Number);year=p[0];month=p[1]-1;}render();
}).catch(()=>{settings=null;el("booking-submit").disabled=true;el("availability-status").textContent="We couldn’t load availability. Please use the WhatsApp link below.";render();});
el("booking-form").onsubmit=async event=>{
 event.preventDefault();
 if(!selected){el("booking-feedback").textContent="Please choose an available date first.";return;}
 if(!updateSubmit()||!el("booking-form").reportValidity()){
 el("booking-feedback").textContent="Please complete all required fields before sending your request.";
 return;
 }
 const button=el("booking-submit");submitting=true;button.disabled=true;
 try{
 const latest=await json("content/availability.json");dates=new Set(latest.availableDates||[]);
 if(!latest.enabled||!allowed(selected))throw Error("That date is no longer open. Please choose another date.");
 const number=String(latest.whatsapp||"").replace(/\D/g,"");if(!/^\d{9,15}$/.test(number))throw Error("Please contact us using the WhatsApp link below.");
 const text=["Hi Northbound! I’d like to request a clean.","Name: "+el("booking-name").value.trim(),"Service: "+el("booking-service").value,"Preferred date: "+selected,"Preferred start: "+el("booking-time").value,"Suburb: "+el("booking-area").value.trim(),"Property / item size: "+el("booking-size").value.trim(),...(fabricSummary()?[fabricSummary()]:[]),...(needsBedrooms()?["Property size category: "+el("booking-bedrooms").value]:[]),...(windowSummary()?[windowSummary()]:[]),...selectedExtras().map(item=>item.name+": "+(item.fee===null?"quote requested":"+R"+item.fee)),"Website estimate (selected priced extras included): "+priceEstimate(),"Please send me an official quote for confirmation.","Notes: "+el("booking-notes").value.trim(),"I understand the team, timing and final price need confirmation, and work must finish by 20:00."].join("\n");
 window.location.assign("https://wa.me/"+number+"?text="+encodeURIComponent(text));
 el("booking-feedback").textContent="Send the message in WhatsApp to complete your request. Your clean is not confirmed yet.";
 }catch(error){el("booking-feedback").textContent=error.message;render();}
 finally{submitting=false;updateSubmit();}
};
render();
})();