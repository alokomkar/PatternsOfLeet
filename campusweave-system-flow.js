(function () {
  const model=window.CW_SYSTEM_ARCHITECTURE;
  const flowId=document.body.dataset.flow;
  const flow=model.flows[flowId];
  const $=id=>document.getElementById(id);
  const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  if(!flow){document.body.innerHTML='<main class="shell"><h1>Architecture flow not found</h1><a href="campusweave-high-level-master.html">Return to master</a></main>';return}
  const techById=Object.fromEntries(model.technologies.map(tech=>[tech.id,tech]));
  const chips=ids=>`<div class="tech-chips">${ids.map(id=>{const tech=techById[id];return `<span class="tech-chip" style="--tech:${tech.color}" title="${escapeHtml(tech.name)}"><span class="tech-number">${tech.id}</span>${escapeHtml(tech.group)}</span>`}).join("")}</div>`;
  $("flow-eyebrow").textContent=`FLOW ARCHITECTURE · ${flowId.toUpperCase()}`;
  $("flow-title").textContent=flow.title;
  $("flow-summary").textContent=flow.summary;
  $("flow-actors").textContent=flow.actors;
  $("flow-version").textContent=`Architecture ${model.version} · ${model.selectedAt}`;
  document.querySelector(".flow-hero").insertAdjacentHTML("afterend",`<figure class="architecture-visual flow-visual"><img src="${escapeHtml(flow.image)}" width="1672" height="941" alt="${escapeHtml(flow.title)} visual overview showing its actors, six ordered stages and supporting technology stack." decoding="async"><figcaption><strong>${escapeHtml(flow.short)} overview</strong><span>The ordered HTML sequence below remains the canonical detailed flow.</span></figcaption></figure>`);
  $("flow-diagram").innerHTML=flow.stages.map((stage,index)=>`<article class="stage"><span class="stage-lane">${escapeHtml(stage.lane)}</span><span class="stage-index">${index+1}</span><h2>${escapeHtml(stage.title)}</h2><p>${escapeHtml(stage.text)}</p>${chips(stage.tech)}</article>`).join("");
  $("flow-decisions").innerHTML=flow.decisions.map(item=>`<li>${escapeHtml(item)}</li>`).join("");
  $("flow-tech").innerHTML=flow.tech.map(id=>{const tech=techById[id];return `<article class="legend-item" style="--tech:${tech.color}"><span class="legend-number">${tech.id}</span><div><strong>${escapeHtml(tech.name)}</strong><span>${escapeHtml(tech.purpose)}</span></div></article>`}).join("");
  const savedTheme=localStorage.getItem("cw-architecture-theme")||"maroon";document.documentElement.dataset.theme=savedTheme;$("theme-select").value=savedTheme;$("theme-select").addEventListener("change",event=>{document.documentElement.dataset.theme=event.target.value;localStorage.setItem("cw-architecture-theme",event.target.value)});
}());
