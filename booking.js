(function () {
"use strict";
const section=document.createElement("section");
section.className="section";
section.id="booking";
section.innerHTML = `
<div class="wrap">
  <div class="eyebrow">Your home. Your time.</div>
  <h2>Book your Northie.</h2>
  <p>Three quick steps to a fresher home. Get an estimate, then send your request on WhatsApp.</p>
  <form class="card" id="booking-form" novalidate>
    <ol class="booking-progress" aria-label="Booking progress">
      <li aria-current="step">1 · Pick your clean</li>
      <li>2 · Build your clean</li>
      <li>3 · Pick a date & send</li>
    </ol>
    <div class="booking-milestone">
      <p id="booking-milestone" role="status"></p>
      <span id="booking-sparkles" aria-hidden="true">✦ ✧ ✦</span>
    </div>
    <div id="booking-step-1">
      <h3 tabindex="-1">What needs a little love?</h3>
      <label for="booking-service">Choose a service</label>
      <select id="booking-service" required><option value="">Choose a service</option></select>
      <p id="service-preview" class="small"></p>
    </div>
    <div id="booking-step-2" hidden>
      <h3 tabindex="-1">Make it yours</h3>
      <fieldset id="room-fields" hidden>
        <legend>Which spaces are we cleaning?</legend>
        <p class="small">Count only the rooms you want cleaned. Leave the others at zero. Standard, safely reachable windows are included in every room you select for a Deep Clean.</p>
        <div id="room-counts" class="room-counts"></div>
        <label id="outdoor-option"><input type="checkbox" id="add-outdoor"> Sweep the patio, balcony or stoep and wipe down the outdoor furniture <span id="outdoor-rate"></span></label>
        <div id="outdoor-count" hidden></div>
      </fieldset>
      <label for="booking-size" hidden>Tell us what needs cleaning</label>
      <input id="booking-size" maxlength="150" hidden>
      <fieldset id="fabric-addons" hidden><legend>Optional carpet & mattress washing</legend><label><input type="checkbox" id="add-carpet"> Add carpet washing — from R250</label><label><input type="checkbox" id="add-mattress"> Add mattress washing — from R250</label></fieldset><div id="booking-carpet-fields" hidden><label for="carpet-width">Carpet width (metres)</label><input id="carpet-width" type="number" min="0.01" step="0.01" placeholder="e.g. 2"><label for="carpet-length">Carpet length (metres)</label><input id="carpet-length" type="number" min="0.01" step="0.01" placeholder="e.g. 3"><p class="small">One carpet per request. Estimate uses width × length, rounded up to the next listed area bracket. Above 12.25 m² is quoted separately. Final price depends on material and condition.</p></div><div id="booking-mattress-fields" hidden><label for="mattress-size">Mattress size</label><select id="mattress-size"><option value="">Choose a mattress size</option></select><p class="small">Price per mattress. Mention additional items in “Anything else?”.</p></div><div id="booking-bedroom-field" hidden><label for="booking-bedrooms">Bedrooms for linen change</label><select id="booking-bedrooms"><option value="">Choose your property size</option></select></div><fieldset id="booking-extras"><legend>Optional extras</legend><div id="booking-extras-list"></div></fieldset>
      <label for="booking-notes">Anything else? (optional)</label>
      <textarea id="booking-notes" maxlength="1000" rows="2"></textarea>
    </div>
    <div id="booking-step-3" hidden>
      <h3 tabindex="-1">When should we come?</h3>
      <div class="booking-layout">
        <div class="card"><h3>Choose a date</h3><p class="small">Highlighted dates are open for requests. A date is reserved only once we confirm.</p><div class="calendar-nav"><button type="button" id="previous-month" aria-label="Previous month">←</button><strong id="calendar-month"></strong><button type="button" id="next-month" aria-label="Next month">→</button></div><div id="booking-calendar" class="booking-calendar" role="group" aria-label="Available dates"></div><p id="availability-status" role="status">Loading availability…</p></div>
        <div>
          <label for="booking-date">Selected date</label>
          <input id="booking-date" type="text" readonly placeholder="Choose a highlighted date">
          <label for="booking-time">Preferred start time</label><select id="booking-time" required><option value="">Choose a time</option><option>08:00</option><option>09:00</option><option>10:00</option><option>11:00</option><option>12:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option><option>17:00</option></select><label for="booking-name">Your name</label><input id="booking-name" autocomplete="name" maxlength="100" required><label for="booking-area">Suburb</label><input id="booking-area" maxlength="100" required>
          <p class="small">Monday–Saturday · 08:00–20:00. All work must finish by 20:00. Start times and dates are subject to confirmation.</p>
        </div>
      </div>
      <p class="small">Please leave out access codes and sensitive details. We’ll prepare your message. Tap Send in WhatsApp to complete your request.</p>
    </div>
    <div class="booking-estimate" id="estimate-panel" role="status" hidden>
      <strong id="booking-estimate"></strong>
      <p class="small">Your estimate includes priced extras. We’ll confirm the final quote and availability on WhatsApp.</p>
    </div>
    <p id="booking-ready" role="status" hidden>🎉 Winner winner, chicken dinner! Your request is ready for WhatsApp.</p>
    <p id="booking-feedback" role="status"></p>
    <div class="booking-actions">
      <button class="btn secondary" type="button" id="booking-back" hidden>Back</button>
      <button class="btn primary" type="button" id="booking-next">Build my clean</button>
      <button class="btn primary" id="booking-submit" type="submit" hidden disabled>Open WhatsApp</button>
    </div>
  </form>
</div>`;
const footer=document.querySelector("footer");
if(!footer)return;
footer.before(section);
const style=document.createElement("style");
style.textContent=`.booking-layout{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-top:2rem}#booking{scroll-margin-top:100px}#booking [hidden]{display:none!important}#booking label{display:block;font-weight:bold;margin:1rem 0 .3rem}#booking input,#booking select,#booking textarea{width:100%;padding:.8rem;border:1px solid #999;border-radius:10px;background:#fffdf7;color:#17223a;font:inherit}#booking button{font:inherit;cursor:pointer}#booking button:disabled{cursor:default;opacity:.45}.calendar-nav{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin:1.5rem 0}.calendar-nav button{padding:.6rem 1rem;border:1px solid #999;border-radius:10px;background:transparent}.booking-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}.booking-calendar>span{text-align:center;font-size:.8rem;padding:.4rem 0}.booking-calendar button{border:1px solid #d7d1c0;border-radius:8px;min-height:42px;background:#e7eadf;color:#17223a}.booking-calendar button:disabled{background:transparent}.booking-calendar button[aria-pressed="true"]{background:#d7a63b;outline:2px solid #17223a}.booking-estimate{margin:1.25rem 0;padding:1rem;border-radius:14px;background:#e8dfc8}.booking-estimate .small{margin-bottom:0}#booking-extras{border:1px solid #b8ad94;border-radius:14px;margin:1.25rem 0;padding:1rem}#booking-extras legend{font-weight:bold}#booking-extras .small{margin-top:.25rem}#booking input[type="checkbox"]{width:auto;margin-right:.5rem}#booking-submit{border:0}#booking :focus-visible{outline:3px solid #b34b2a;outline-offset:3px}@media(max-width:820px){.booking-layout{grid-template-columns:1fr}}`;
style.textContent+=`
#booking-form{max-width:860px;margin-top:2rem}
.booking-progress{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;list-style:none;padding:0;margin:0 0 1.5rem}
.booking-progress li{border-radius:.75rem;background:var(--cream);padding:.65rem;font-size:.85rem}
.booking-progress li[aria-current="step"]{background:var(--teal);color:var(--white);font-weight:800}
.booking-progress .done{background:var(--mint)}
.booking-progress .done::after{content:" ✓"}
.booking-milestone{position:relative;margin-top:-.8rem;color:var(--teal);font-weight:800}
#booking-milestone{margin:0 0 .85rem;padding-right:4rem}
#booking-milestone:empty{margin:0}
#booking-sparkles{position:absolute;right:0;top:0;opacity:0;color:#a54530;pointer-events:none}
@keyframes booking-ready-pop{from{transform:scale(.97);opacity:.65}to{transform:scale(1);opacity:1}}
@media(prefers-reduced-motion:no-preference){#booking-ready:not([hidden]){animation:booking-ready-pop .32s ease-out}}
.booking-actions{display:flex;flex-wrap:wrap;gap:.6rem}
#booking .booking-actions button{font-weight:800}
#booking-ready{border-radius:.85rem;background:var(--yellow);padding:.8rem 1rem;font-weight:800}
#room-fields,#fabric-addons{margin:1rem 0;border:1px solid var(--line);border-radius:1rem;padding:1rem;min-width:0}
#room-fields legend,#fabric-addons legend{font-weight:800}
.room-counts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem 1rem}
#booking #outdoor-option{margin-top:1.25rem}
.booking-layout>.card{min-width:0}
@media(max-width:430px){.booking-progress li{padding:.45rem;font-size:.72rem}.booking-calendar{gap:3px}.booking-layout>.card{padding:.75rem}}
`;
document.head.append(style);
document.querySelectorAll(".nav .btn,.hero .btn.primary,.mobile-book").forEach(a=>a.href="#booking");
const el=id=>document.getElementById(id);
const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Africa/Johannesburg",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const parts=today.split("-").map(Number);
let year=parts[0],month=parts[1]-1,selected="",dates=new Set(),settings=null;
let priceData=null,submitting=false,extraInputs=[],roomInputs=[],step=1;
const serviceName=()=>el("booking-service").value;
const isDeep=()=>serviceName()==="Deep Clean";
const hasLinenExtras=()=>["Deep Clean","Home Reset"].includes(serviceName());
const sizePrompts={
 "Home Reset":["How many bedrooms are we refreshing?","e.g. 2 bedrooms"],
 "Event & Ceremony Cleanup":["What kind of event are we cleaning up after?","e.g. Birthday, 25 guests, kitchen and yard"],
 "Couch Cleaning":["What size is your couch?","e.g. 2-seater"],
 "Window Washing":["Which windows would you like washed?","e.g. 4 standard windows, ground floor"]
};
const money=amount=>"R"+amount.toLocaleString("en-ZA");
const bedroomCount=()=>isDeep()?roomCount("bedrooms"):Number(el("booking-bedrooms").value);
function roomCount(id){
 return Number(roomInputs.find(({room})=>room.id===id)?.input.value)||0;
}
function activeRooms(){
 return roomInputs.filter(({room})=>room.id!=="outdoor"||el("add-outdoor").checked);
}
function roomsComplete(){
 return activeRooms().every(({input})=>input.value!==""&&input.checkValidity())&&
  activeRooms().some(({input})=>Number(input.value)>0);
}
function roomEstimate(){
 return activeRooms().reduce((sum,{room,input})=>sum+Number(input.value)*room.price,0);
}
function renderRooms(){
 for(const room of priceData.deepCleanRooms||[]){
  const row=document.createElement("div"),label=document.createElement("label"),input=document.createElement("input");
  input.id="room-"+room.id;
  input.type="number";
  input.min=room.id==="outdoor"?"1":"0";
  input.max="99";
  input.step="1";
  input.value=input.min;
  input.inputMode="numeric";
  label.htmlFor=input.id;
  label.textContent=room.label+" · "+money(room.price)+" each";
  row.append(label,input);
  el(room.id==="outdoor"?"outdoor-count":"room-counts").append(row);
  if(room.id==="outdoor")el("outdoor-rate").textContent="("+money(room.price)+" per space)";
  roomInputs.push({room,input});
 }
}
function detailFields(){
 const fields=[];
 if(sizePrompts[serviceName()])fields.push("booking-size");
 if(isCarpet())fields.push("carpet-width","carpet-length");
 if(isMattress())fields.push("mattress-size");
 if(needsBedrooms())fields.push("booking-bedrooms");
 return fields;
}
function fieldsComplete(ids){
 return ids.every(id=>String(el(id).value).trim()&&el(id).checkValidity());
}
function detailsComplete(){
 return fieldsComplete(detailFields())&&(!isDeep()||roomsComplete());
}
function updateSubmit(){
 const ready=step===3&&!submitting&&settings?.enabled&&selected&&allowed(selected)&&
  fieldsComplete(["booking-service","booking-time","booking-name","booking-area"])&&detailsComplete();
 el("booking-submit").disabled=!ready;
 el("booking-ready").hidden=!ready;
 return !!ready;
}
function showStep(next){
 step=next;
 for(let number=1;number<=3;number++)el("booking-step-"+number).hidden=number!==step;
 section.querySelectorAll(".booking-progress li").forEach((item,index)=>{
  if(index===step-1)item.setAttribute("aria-current","step");
  else item.removeAttribute("aria-current");
  item.classList.toggle("done",index<step-1);
 });
 el("estimate-panel").hidden=step===1;
 el("booking-back").hidden=step===1;
 el("booking-next").hidden=step===3;
 el("booking-next").textContent=step===1?"Build my clean":"Pick a date";
 el("booking-submit").hidden=step!==3;
 el("booking-feedback").textContent="";
 el("booking-step-"+step).querySelector("h3").focus();
 updateSubmit();
}
el("booking-next").onclick=()=>{
 if(step===1&&!el("booking-service").value){
  el("booking-service").reportValidity();
  return;
 }
 if(step===2&&!detailsComplete()){
  el("booking-feedback").textContent=isDeep()&&!roomsComplete()
   ?"Choose at least one space and check your room counts."
   :"Please fill in the details for your chosen clean.";
  return;
 }
 const message=step===1?"Nice pick! Let’s make it yours.":"Clean plan complete! Pick your day.";
 showStep(step+1);
 el("booking-milestone").textContent=message;
 if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  const sparkles=el("booking-sparkles");
  sparkles.getAnimations().forEach(animation=>animation.cancel());
  sparkles.animate([
   {opacity:0,transform:"translateY(.4rem) scale(.7)"},
   {opacity:1,transform:"translateY(0) scale(1.1)",offset:.35},
   {opacity:0,transform:"translateY(-.7rem) scale(1)"}
  ],{duration:650,easing:"ease-out"});
 }
};
el("booking-back").onclick=()=>{
 el("booking-milestone").textContent="";
 el("booking-sparkles").getAnimations().forEach(animation=>animation.cancel());
 showStep(step-1);
};
el("booking-form").oninput=()=>{
 el("booking-feedback").textContent="";
 updateEstimate();
};
el("booking-form").onchange=updateEstimate;
function isCarpet(){return el("booking-service").value==="Carpet Washing"||(el("booking-service").value==="Deep Clean"&&el("add-carpet").checked);}
function isMattress(){return el("booking-service").value==="Mattress Washing"||(el("booking-service").value==="Deep Clean"&&el("add-mattress").checked);}
function carpetQuote(){
 const w=Number(el("carpet-width").value),l=Number(el("carpet-length").value);
 if(!Number.isFinite(w)||!Number.isFinite(l)||w<=0||l<=0)return null;
 const area=w*l;
 const tier=priceData?.carpetPrices?.find(t=>area<=t.width*t.length+1e-9);
 return {area,price:tier?.price??null};
}
function fabricSummary(){
 const lines=[];
 if(isCarpet()){const q=carpetQuote();lines.push("Carpet washing: "+el("carpet-width").value+" m wide × "+el("carpet-length").value+" m long; area "+(q?q.area.toFixed(2):"")+" m²; "+(q?.price!=null?"R"+q.price:"personalised quote required")+".");}
 if(isMattress()){const tier=priceData?.mattressPrices?.find(t=>t.label===el("mattress-size").value);lines.push("Mattress washing: "+el("mattress-size").value+(tier?"; R"+tier.price:"")+".");}
 return lines.join("\n");
}
function needsBedrooms(){
 return hasLinenExtras()&&!isDeep()&&extraInputs.some(({extra,input})=>input.checked&&extra.pricing==="bedrooms");
}
function selectedExtras(){
 return extraInputs.filter(({input})=>hasLinenExtras()&&input.checked).map(({extra})=>{
 let fee=null;
 if(extra.pricing==="fixed")fee=Number(extra.price);
 if(extra.pricing==="bedrooms"){
 const bedrooms=bedroomCount();
 if(isDeep()||bedrooms>0)fee=Number(bedrooms<=3?extra.smallHomePrice:extra.largeHomePrice);
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
function priceEstimate(){
 const service=priceData?.services?.find(s=>s.name===el("booking-service").value);
 if(!service)return "Choose a service to see an estimate.";
 if(needsBedrooms()&&!el("booking-bedrooms").value)return "Choose your property size to calculate the estimate.";
 let price=service.price,fabricAddition=0,fabricQuote=false;
 if(isCarpet()){
 const q=carpetQuote();
 if(!q)return "Enter a valid width and length in metres to see an estimate.";
 if(q.price===null){
 if(service.name!=="Deep Clean")return "Area: "+q.area.toFixed(2)+" m² — personalised quote required. Send measurements and photos on WhatsApp.";
 fabricQuote=true;
 }else if(service.name==="Deep Clean")fabricAddition+=q.price;
 else price="R"+q.price;
 }
 if(isMattress()){
 const tier=priceData?.mattressPrices?.find(t=>t.label===el("mattress-size").value);
 if(!tier)return "Choose your mattress size to see an estimate.";
 if(service.name==="Deep Clean")fabricAddition+=tier.price;else price="R"+tier.price;
 }
 if(isDeep()){
  if(!roomsComplete())return "Add at least one space to see your estimate.";
  price="R"+roomEstimate();
 }
 const extras=selectedExtras();
 const addition=fabricAddition+extras.reduce((sum,item)=>sum+(item.fee??0),0);
 const match=String(price||"").match(/R\s*([\d,]+(?:\.\d+)?)/i);
 const quoteExtras=extras.filter(item=>item.fee===null);
 const carpetNote=fabricQuote?" Carpet washing quoted separately; excluded from this total.":"";
 const quoteNote=carpetNote+(quoteExtras.length?" "+quoteExtras.map(item=>item.name).join(", ")+" quoted separately.":"");
 if(!match)return "Personalised service quote"+(addition?"; selected priced extras +R"+addition.toLocaleString("en-ZA"):"")+" — send us your requirements and photos on WhatsApp."+quoteNote;
 const total=Number(match[1].replace(/,/g,""))+addition;
 return "Estimated price: "+(/from/i.test(price)?"From ":"around ")+"R"+total.toLocaleString("en-ZA")+quoteNote;
}
function updateEstimate(){
 el("fabric-addons").hidden=el("booking-service").value!=="Deep Clean";
 el("booking-carpet-fields").hidden=!isCarpet();
 el("booking-mattress-fields").hidden=!isMattress();
 ["carpet-width","carpet-length"].forEach(id=>{el(id).required=isCarpet();el(id).disabled=!isCarpet();if(!isCarpet())el(id).setCustomValidity("");});
 el("mattress-size").required=isMattress();el("mattress-size").disabled=!isMattress();
 if(!isMattress())el("mattress-size").setCustomValidity("");
 const prompt=sizePrompts[serviceName()];
 const sizeLabel=section.querySelector('label[for="booking-size"]');
 el("booking-size").hidden=!prompt;
 el("booking-size").required=!!prompt;
 sizeLabel.hidden=!prompt;
 sizeLabel.textContent=prompt?.[0]||"";
 el("booking-size").placeholder=prompt?.[1]||"";
 el("room-fields").hidden=!isDeep();
 el("outdoor-count").hidden=!el("add-outdoor").checked;
 el("booking-extras").hidden=!hasLinenExtras()||!extraInputs.length;
 const bedroomsRequired=needsBedrooms();
 el("booking-bedroom-field").hidden=!bedroomsRequired;
 el("booking-bedrooms").required=bedroomsRequired;
 el("booking-estimate").textContent=priceEstimate();
 updateSubmit();
}
el("booking-service").onchange=()=>{
 el("booking-size").value="";
 el("booking-bedrooms").value="";
 for(const id of ["add-carpet","add-mattress","add-outdoor"])el(id).checked=false;
 for(const {input} of extraInputs)input.checked=false;
 el("service-preview").textContent=priceData?.services.find(service=>service.name===serviceName())?.summary||"";
 updateEstimate();
};
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
 renderRooms();
 for(const [value,label] of [[1,"Studio / 1 bedroom"],[2,"2 bedrooms"],[3,"3 bedrooms"],[4,"4+ bedrooms"]]){
  const option=document.createElement("option");
  option.value=value;
  option.textContent=label;
  el("booking-bedrooms").append(option);
 }
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
 if(!updateSubmit()){
 el("booking-feedback").textContent="Please complete all required fields before sending your request.";
 return;
 }
 const requestedDate=selected;
 const rooms=isDeep()?activeRooms().map(({room,input})=>room.label+": "+input.value).join(", "):"";
 const message=[
  "Hi Northbound! I’d like to request a clean.",
  "Name: "+el("booking-name").value.trim(),
  "Service: "+serviceName(),
  "Preferred date: "+requestedDate,
  "Preferred start: "+el("booking-time").value,
  "Suburb: "+el("booking-area").value.trim(),
  rooms&&"Deep Clean spaces: "+rooms,
  isDeep()&&"Outdoor sweep and furniture wipe-down: "+(el("add-outdoor").checked?"Yes":"No"),
  sizePrompts[serviceName()]&&"Scope: "+el("booking-size").value.trim(),
  needsBedrooms()&&"Bedrooms for linen change: "+el("booking-bedrooms").selectedOptions[0].textContent,
  fabricSummary(),
  isDeep()&&"Window washing: included for standard, safely reachable windows in selected rooms.",
  ...selectedExtras().map(item=>item.name+": "+(item.fee===null?"quote requested":"+"+money(item.fee))),
  "Website estimate: "+priceEstimate(),
  el("booking-notes").value.trim()&&"Notes: "+el("booking-notes").value.trim(),
  "Please confirm the team, timing and final quote. I understand work must finish by 20:00."
 ].filter(Boolean).join("\n");
 submitting=true;
 updateSubmit();
 el("booking-feedback").textContent="Checking availability…";
 try{
  settings=await json("content/availability.json");
  dates=new Set(settings.availableDates||[]);
  if(!settings.enabled||!allowed(requestedDate))throw Error("That date is no longer open. Please choose another date.");
  const number=String(settings.whatsapp||"").replace(/\D/g,"");
  if(!/^\d{9,15}$/.test(number))throw Error("Please contact us using the WhatsApp link below.");
  el("booking-feedback").textContent="Tap Send in WhatsApp to request your clean.";
 window.location.assign("https://wa.me/"+number+"?text="+encodeURIComponent(message));
 }catch(error){el("booking-feedback").textContent=error.message;render();}
 finally{submitting=false;updateSubmit();}
};
render();
})();