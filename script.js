const pages = ["home","methodology","browse","detail","trad-age","trad-state","guide","about","kidposhan"];
const labels = {
  home:"Home", methodology:"Methodology", browse:"Browse",
  detail:"Product", "trad-age":"Traditional · Age", "trad-state":"Traditional · State",
  guide:"Nutrition Guide", about:"About", kidposhan:"Our Products"
};
const crumbBar = document.getElementById('crumbs');
pages.forEach(p=>{
  if(p==='detail') return; // detail reached only via product click
  const b = document.createElement('button');
  b.textContent = labels[p];
  b.dataset.goto = p;
  crumbBar.appendChild(b);
});

function go(page){
  document.querySelectorAll('.page').forEach(s=>s.classList.toggle('active', s.dataset.page===page));
  document.querySelectorAll('#crumbs button').forEach(b=>b.classList.toggle('active', b.dataset.goto===page));
  window.scrollTo({top:0, behavior:'smooth'});
}
document.addEventListener('click', e=>{
  const t = e.target.closest('[data-goto]');
  if(t){ go(t.dataset.goto); }
});

function scoreColor(s){ return s>=70 ? '#4B7A46' : s>=45 ? '#E2A02C' : '#B14B2E'; }

function renderGrid(el, list, onOpen){
  el.innerHTML = '';
  list.forEach((p)=>{
    const card = document.createElement('button');
    card.className = 'pcard';
    card.innerHTML = `
      <div class="top-row">
        <div><div class="pname">${p.name}</div><div class="ptag">${p.cat}</div></div>
        <div class="score-chip" style="background:${scoreColor(p.score)}22;color:${scoreColor(p.score)}">${p.score}</div>
      </div>
      <div class="fill-track"><div class="fill" style="width:${p.score}%;background:${scoreColor(p.score)}"></div></div>
      <div class="flag-row">${p.flags.map(f=>`<span class="flag ${f.includes('Clean')?'ok':''}">${f}</span>`).join('')}</div>
    `;
    card.addEventListener('click', ()=> onOpen(p));
    el.appendChild(card);
  });
}

function openDetail(p){
  document.getElementById('detCat').textContent = p.cat;
  document.getElementById('detName').textContent = p.name;
  const chip = document.getElementById('detScore');
  chip.textContent = p.score;
  chip.style.background = scoreColor(p.score)+'22';
  chip.style.color = scoreColor(p.score);

  const metrics = [['Sugar',p.sugar],['Additives',p.add],['Preservatives',p.pres],['Hydrog. fats',p.fat],['Sodium',p.sod],['Base integrity',p.base]];
  document.getElementById('detMetrics').innerHTML = metrics.map(([label,val])=>`
    <div class="metric-row">
      <span>${label}</span>
      <div class="fill-track"><div class="fill" style="width:${val}%;background:${scoreColor(val)}"></div></div>
      <span class="mono">${val}</span>
    </div>`).join('');

  document.getElementById('detIngredients').innerHTML = p.ingredients.map(ing=>{
    const isFlagged = p.flags.some(f=>f.toLowerCase().includes('colour')||f.toLowerCase().includes('sugar')) && (ing.toLowerCase().includes('colour')||ing.toLowerCase().includes('sugar')||ing.toLowerCase().includes('msg')||ing.toLowerCase().includes('preservative'));
    return `<span class="ing ${isFlagged?'flag':''}">${ing}</span>`;
  }).join('');

  go('detail');
}

const ageTabs = document.getElementById('ageTabs');
const ageList = document.getElementById('ageList');
const stateTabs = document.getElementById('stateTabs');
const stateList = document.getElementById('stateList');

function renderAge(ageBands, id){
  ageTabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.id===id));
  const band = ageBands.find(b=>b.id===id);
  ageList.innerHTML = band.items.map(it=>`
    <div class="food-item">
      <h3>${it.n}</h3>
      <p>${it.d}</p>
      <span class="region">${it.r}</span>
    </div>`).join('');
}

function renderState(states, id){
  stateTabs.querySelectorAll('button').forEach(b=>b.classList.toggle('active', b.dataset.id===id));
  const st = states.find(s=>s.id===id);
  stateList.innerHTML = st.items.map(it=>`
    <div class="food-item">
      <h3>${it.n}</h3>
      <p>${it.d}</p>
    </div>`).join('');
}

// ---------- load data.json and wire everything up ----------
fetch('data.json')
  .then(r => r.json())
  .then(data => {
    const { products, kpProducts, ageBands, states } = data;

    renderGrid(document.getElementById('productGrid'), products, openDetail);
    renderGrid(document.getElementById('kpGrid'), kpProducts, openDetail);

    ageBands.forEach(b=>{
      const btn = document.createElement('button');
      btn.textContent = b.label; btn.dataset.id = b.id;
      btn.addEventListener('click', ()=>renderAge(ageBands, b.id));
      ageTabs.appendChild(btn);
    });
    renderAge(ageBands, ageBands[0].id);

    states.forEach(s=>{
      const btn = document.createElement('button');
      btn.textContent = s.label; btn.dataset.id = s.id;
      btn.addEventListener('click', ()=>renderState(states, s.id));
      stateTabs.appendChild(btn);
    });
    renderState(states, states[0].id);
  })
  .catch(err => {
    console.error('Failed to load data.json', err);
    document.getElementById('productGrid').innerHTML = '<p style="opacity:.6;font-size:13px;">Could not load product data.</p>';
  });
