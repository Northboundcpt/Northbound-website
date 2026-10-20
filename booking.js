(function () {
"use strict";
const section=document.createElement("section");
section.className="section";
section.id="booking";
section.innerHTML=`<div class="wrap"><div class="eyebrow">Your home. Your time.</div><h2>Book your Northie.</h2><p>Choose your care and a date. Send us your request on WhatsApp and we’ll confirm the team, price and timing.</p><p>Monday–Saturday · 08:00–20:00. All work must finish by 20:00. Up to four cleans per day, subject to team availability.</p><div class="booking-layout"><div class="card"><h3>Choose a date</h3><p class="small">Highlighted dates are open for requests. A date is reserved only once we confirm.</p><div class="calendar-nav"><button type="button" id="previous-month" aria-label="Previous month">←</button><strong id="calendar-month"></strong><button type="button" id="next-month" aria-label="Next month">→</button></div><div id="booking-calendar" class="booking-calendar" role="group" aria-label="Available dates"></div><p id="availability-status" role="status">Loading availability…</p></div><form class="card" id="booking-form"><h3>A little about your clean</h3><p class="small">All fields are required except “Anything else?”. Choose a date to enable your request.</p><label for="booking-service">Service</label><select id="booking-service" required><option value="">Choose a service</option></select><label for="booking-date">Selected date</label><input id="booking-date" type="text" readonly required placeholder="Choose a highlighted date"><label for="booking-time">Preferred start time</label><select id="booking-time" required><option value="">Choose a time</option><option>08:00</option><option>09:00</option><option>10:00</option><option>11:00</option><option>12:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option><option>17:00</option></select><p class="small">Start times depend on the service duration and travel. Larger jobs need an earlier start.</p><label for="booking-name">Your name</label><input id="booking-name" autocomplete="name" maxlength="100" required><label for="booking-area">Suburb</label><input id="booking-area" maxlength="100" required><label for="booking-size">Property or item size</label><input id="booking-size" maxlength="150" placeholder="e.g. 2 bedrooms or a 2-seater couch" required><div id="booking-bedroom-field" hidden><label for="booking-bedrooms">Property size for your estimate</label><select id="booking-bedrooms"><option value="">Choose your property size</option></select></div><div class="booking-estimate" role="status" aria-live="polite"><strong id="booking-estimate">Choose a service to see an estimate.</strong><p class="small">This is a guide, not an official quote. Extras are excluded. We’ll review your requirements and send an official quote before you confirm.</p></div><label for="booking-notes">Anything else? (optional)</label><textarea id="booking-notes" maxlength="1000" rows="3"></textarea><p class="small">Please leave out access codes and sensitive details. This form isn’t saved on our website. Continuing opens WhatsApp; you must send the message there.</p><button class="btn primary" id="booking-submit" type="submit" disabled>Request on WhatsApp</button><p id="booking-feedback" role="status"></p><noscript>Please use the WhatsApp link below to request a clean.</noscript></form></div></div>`;
const footer=document.querySelector("footer");
if(!footer)return;
footer.before(section);
const style=document.createElement("style");
style.textContent=`.booking-layout{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-top:2rem}#booking{scroll-margin-top:100px}#booking label{display:block;font-weight:bold;margin:1rem 0 .3rem}#booking input,#booking select,#booking textarea{width:100%;padding:.8rem;border:1px solid #999;border-radius:10px;background:#fffdf7;color:#17223a;font:inherit}#booking button{font:inherit;cursor:pointer}#booking button:disabled{cursor:default;opacity:.45}.calendar-nav{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin:1.5rem 0}.calendar-nav button{padding:.6rem 1rem;border:1px solid #999;border-radius:10px;background:transparent}.booking-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.booking-calendar>span{text-align:center;font-size:.8rem;padding:.4rem 0}.booking-calendar button{border:1px solid #d7d1c0;border-radius:8px;min-height:42px;background:#e7eadf;color:#17223a}.booking-calendar button:disabled{background:transparent}.booking-calendar button[aria-pressed="true"]{background:#d7a63b;outline:2px solid #17223a}.booking-estimate{margin:1.25rem 0;padding:1rem;border-radius:14px;background:#e8dfc8}.booking-estimate .small{margin-bottom:0}#booking-submit{border:0}#booking :focus-visible{outline:3px solid #b34b2a;outline-offset:3px}@media(max-width:820px){.booking-layout{grid-template-columns:1fr}}`;
document.head.append(style);
document.querySelectorAll(".nav .btn,.hero .btn.primary,.mobile-book").forEach(a=>a.href="#booking");
const el=id=>document.getElementById(id);
const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Johannesburg",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const parts=today.split("-").map(Number);
let year=parts[0],month=parts[1]-1,selected="",dates=new Set(),settings=null;
let priceData=null,submitting=false;
function updateSubmit(){
 const required=["booking-service","booking-time","booking-name","booking-area","booking-size"];
 if(el("booking-service").value==="Deep Clean")required.push("booking-bedrooms");
 let complete=true;
 required.forEach(id=>{
 const input=el(id),filled=String(input.value||"").trim().length>0;
 input.setCustomValidity(filled?"":"Please fill in this field.");
 if(!filled)complete=false;
 });
 const ready=!!settings?.enabled&&!!selected&&allowed(selected)&&complete&&!submitting;
 el("booking-submit").disabled=!ready;
 return ready;
}
el("booking-form").oninput=updateSubmit;
el("booking-form").onchange=updateSubmit;
function priceEstimate(){
 const service=priceData?.services?.find(s=>s.name===el("booking-service").value);
 if(!service)return "Choose a service to see an estimate.";
 let price=service.price;
 if(service.name==="Deep Clean"){
 const size=el("booking-bedrooms").value;
 const tier=priceData.deepCleanPrices?.find(p=>p.label===size);
 if(!tier)return "Deep Clean "+service.price+" — choose a property size for your estimate.";
 price=tier.price;
 }
 if(!/R\s*[\d,]+/i.test(price||""))return "Personalised quote — send us your requirements and photos on WhatsApp.";
 return /from/i.test(price)?"Estimated price: "+price:"Estimated price: around "+price;
}
function updateEstimate(){
 const deep=el("booking-service").value==="Deep Clean";
 el("booking-bedroom-field").hidden=!deep;
 el("booking-bedrooms").required=deep;
 if(!deep)el("booking-bedrooms").setCustomValidity("");
 el("booking-estimate").textContent=priceEstimate();
 updateSubmit();
}
el("booking-service").onchange=updateEstimate;
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
 const text=["Hi Northbound! I’d like to request a clean.","Name: "+el("booking-name").value.trim(),"Service: "+el("booking-service").value,"Preferred date: "+selected,"Preferred start: "+el("booking-time").value,"Suburb: "+el("booking-area").value.trim(),"Property / item size: "+el("booking-size").value.trim(),...(el("booking-service").value==="Deep Clean"?["Deep-clean price category: "+el("booking-bedrooms").value]:[]),"Website estimate (extras excluded): "+priceEstimate(),"Please send me an official quote for confirmation.","Notes: "+el("booking-notes").value.trim(),"I understand the team, timing and final price need confirmation, and work must finish by 20:00."].join("\n");
 window.location.assign("https://wa.me/"+number+"?text="+encodeURIComponent(text));
 el("booking-feedback").textContent="Send the message in WhatsApp to complete your request. Your clean is not confirmed yet.";
 }catch(error){el("booking-feedback").textContent=error.message;render();}
 finally{submitting=false;updateSubmit();}
};
render();
})();