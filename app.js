(function () {
  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  const whatsappURL = (number, prompt = "I'd like to book a Northie.") =>
    `https://wa.me/${String(number).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Northbound! ${prompt}`)}`;

  fetch("content/site.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Website content could not be loaded");
      return response.json();
    })
    .then((data) => {
      const { business, hero, services, deepCleanPrices, extras, propertyServices, about, faqs } = data;

      document.querySelector(".hero .eyebrow").textContent = hero.eyebrow;
      document.querySelector(".hero h1").textContent = hero.heading;
      document.querySelector(".hero h1 + p").textContent = hero.description;
      document.querySelector(".hero .small").textContent = hero.serviceLine;

      document.querySelector("#services .grid").innerHTML = services.map((service) => `
        <article class="card">
          <h3>${escapeHTML(service.name)}</h3>
          <div class="price">${escapeHTML(service.price)}</div>
          <p>${escapeHTML(service.description)}</p>
          <p><strong>Best for:</strong> ${escapeHTML(service.bestFor)}</p>
        </article>`).join("");

      const carePrices=document.createElement("section");
      carePrices.className="section";carePrices.id="fabric-pricing";
      carePrices.innerHTML=`<div class="wrap"><div class="eyebrow">A little extra care</div><h2>Fresh fabrics. Clear prices.</h2><div class="grid"><div class="card"><h3>Carpet washing</h3><p>From R250 · Price quoted by size</p>${data.carpetPrices.map(t=>`<div class="row"><span>${t.width} m × ${t.length} m</span><strong>R${t.price.toLocaleString("en-ZA")}</strong></div>`).join("")}</div><div class="card"><h3>Mattress washing</h3>${data.mattressPrices.map(t=>`<div class="row"><span>${escapeHTML(t.label)}</span><strong>R${t.price}</strong></div>`).join("")}</div></div><p>Carpet estimates use your width × length in metres, rounded up to the next listed area bracket. Above 12.25 m², request a personalised quote. Prices are per item. Final pricing depends on size, material and condition and is confirmed after reviewing your requirements and photos.</p></div>`;
      document.querySelector("#services").after(carePrices);

      document.querySelector("#pricing .price-list").innerHTML = deepCleanPrices.map((item) => `
        <div class="row"><span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.price)}</strong></div>`).join("");
      const extrasCard = document.querySelector("#pricing .card");
      extrasCard.innerHTML = `<h3>${escapeHTML(extras.heading || "Add a little extra care")}</h3><p><strong>Window washing</strong><br>R200 · Standard, safely reachable windows. Included in studio–2-bedroom Deep Cleans; optional +R200 for larger Deep Cleans.</p>
        <p><strong>${escapeHTML(extras.linenChangeHeading || "Linen change")}</strong><br>${escapeHTML(extras.linenChange)}</p>
        ${extras.linenIroning ? `<p><strong>${escapeHTML(extras.linenIroningHeading || "Linen ironing")}</strong><br>${escapeHTML(extras.linenIroning)}</p>` : ""}
        <p><strong>${escapeHTML(extras.linenLaundryHeading || "Laundry drop-off")}</strong><br>${escapeHTML(extras.linenLaundry)}</p>
        <p class="small" style="color:#d7dbea">${escapeHTML(extras.note)}</p>`;

      document.querySelector("#properties .grid").innerHTML = propertyServices.map((service) => `
        <div class="card"><h3>${escapeHTML(service.name)}</h3><p>${escapeHTML(service.description)}</p>
          <a class="btn primary" href="${whatsappURL(business.whatsapp, service.whatsappPrompt)}">${escapeHTML(service.button)}</a>
        </div>`).join("");

      const aboutSection = document.querySelector("#about");
      aboutSection.querySelector("h2").textContent = about.heading;
      aboutSection.querySelector(".grid .card").innerHTML = about.paragraphs.map((paragraph, index) =>
        `<p>${index === about.paragraphs.length - 1 ? `<strong>${escapeHTML(paragraph)}</strong>` : escapeHTML(paragraph)}</p>`
      ).join("") + `<p>— ${escapeHTML(business.founder)}, Founder of Northbound</p>`;

      const faqWrap = document.querySelector(".faq .wrap");
      faqWrap.querySelectorAll("details").forEach((detail) => detail.remove());
      faqWrap.insertAdjacentHTML("beforeend", faqs.map((faq) =>
        `<details><summary>${escapeHTML(faq.question)}</summary><p>${escapeHTML(faq.answer)}</p></details>`
      ).join(""));

      const bookingURL = whatsappURL(business.whatsapp);
      document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
        if (!link.closest("#properties")) link.href = bookingURL;
      });
      document.querySelector(".footer p:not(.small)").textContent = `${business.instagram} · ${business.website}`;
      document.querySelector(".footer .small").textContent = hero.serviceLine;
    })
    .catch((error) => console.warn(error.message));
})();
