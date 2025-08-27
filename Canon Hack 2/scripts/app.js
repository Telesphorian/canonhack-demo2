const contentEl = document.getElementById('content');
const filterFields = document.getElementById('filterFields');
const resetBtn = document.getElementById('resetBtn');
const state = { original:'', configs:{} };

document.addEventListener('DOMContentLoaded', async () => {
  state.original = await fetch('book/pnp.txt').then(r=>r.text());
  await Promise.all(['daddy-darcy','pride-and-profanity'].map(loadConfig));
  apply();
});

filterFields.addEventListener('change', apply);
resetBtn.addEventListener('click', ()=>{
  [...document.querySelectorAll('#filterFields input[type=checkbox]')].forEach(cb=> cb.checked = (cb.value==='daddy-darcy'));
  apply();
});

async function loadConfig(id){
  if (state.configs[id]) return;
  state.configs[id] = await fetch(`filters/${id}.json`).then(r=>r.json());
}
function getSelected(){ return [...document.querySelectorAll('#filterFields input:checked')].map(cb=>cb.value); }
function apply(){
  let txt = state.original;
  const sel = getSelected();
  for (const id of sel){
    const rules = state.configs[id].rules || [];
    for (const r of rules){
      const rx = new RegExp(r.pattern, r.flags||'g');
      let rep = r.replace || '';
      if (r.replacements) rep = r.replacements[0];
      txt = txt.replace(rx, rep);
    }
  }
  contentEl.textContent = txt;
}
