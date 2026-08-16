const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mainNav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const overlay=document.querySelector('#galiaOverlay');
const open=()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');setTimeout(()=>document.querySelector('#overlaySearch')?.focus(),120)};
const close=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')};
['openGalia','heroGalia','galiaSearchCta','contactGalia'].forEach(id=>document.getElementById(id)?.addEventListener('click',open));
document.querySelector('#closeGalia')?.addEventListener('click',close);
overlay?.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
let searches=0;
const metric=document.querySelector('#metricText');
const examples={
 'antonio palacios':{title:'Antonio Palacios · arquitecto',place:'O Porriño · Galicia',icon:'🏛️',text:'Exemplo de busca cultural: obras, biografía, patrimonio e conexión entre O Porriño e Madrid.'},
 'torre de hércules':{title:'Torre de Hércules',place:'A Coruña · Galicia',icon:'🌊',text:'Patrimonio, historia, visita e información útil para descubrir o faro romano.'},
 'praia das catedrais':{title:'Praia das Catedrais',place:'Ribadeo · Galicia',icon:'🏖️',text:'Natureza, costa e información para planificar a visita.'},
 'camiño de santiago':{title:'Camiño de Santiago',place:'Galicia',icon:'🥾',text:'Etapas, localidades, servizos e ideas útiles para peregrinos.'},
 'o castro de vigo':{title:'O Castro de Vigo',place:'Vigo · Galicia',icon:'🏛️',text:'Patrimonio, vistas da ría e unha idea de descubrimento local para o día.'},
 'restaurantes en vigo':{title:'Restaurantes en Vigo',place:'Vigo · Galicia',icon:'🍽️',text:'Exemplo de busca local para descubrir negocios e servizos.'},
 'eventos en vigo hoxe':{title:'Eventos en Vigo hoxe',place:'Vigo · Galicia',icon:'🎭',text:'Exemplo do módulo “Hoxe”: programación e actividades da localidade.'}
};
function esc(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function find(q){const t=q.toLowerCase();for(const k of Object.keys(examples))if(t.includes(k))return examples[k];if(t.includes('vigo'))return {title:'Vigo',place:'Pontevedra · Galicia',icon:'📍',text:'Busca local de exemplo: eventos, patrimonio, gastronomía, praias e negocios.'};if(t.includes('galicia'))return {title:'Galicia',place:'Galicia',icon:'🌿',text:'Galia pode combinar patrimonio, turismo, festas, negocios e información local.'};return {title:q,place:'Resultados de proba',icon:'🐝',text:'Esta versión é unha demostración sen claves nin servizos externos. O seguinte paso é conectar o backend real.'}}
function renderResult(q,target){const r=find(q);target.classList.remove('hidden');target.innerHTML=`<article class="result-card"><div class="result-icon">${r.icon}</div><div><span class="result-place">${esc(r.place)}</span><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p><div class="result-links"><button data-query="${esc(q)}">Ver máis</button><span>Galia · modo probas</span></div></div></article>`;}
function doSearch(q,target){q=q.trim();if(!q)return;searches++;if(metric)metric.textContent=`${searches} ${searches===1?'busca':'buscas'}`;renderResult(q,target);}
const searchInput=document.querySelector('#searchInput'),searchBtn=document.querySelector('#searchBtn'),searchResult=document.querySelector('#searchResult');
searchBtn?.addEventListener('click',()=>doSearch(searchInput.value,searchResult));searchInput?.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch(searchInput.value,searchResult)});
const overlaySearch=document.querySelector('#overlaySearch'),overlayBtn=document.querySelector('#overlaySearchBtn'),overlayResults=document.querySelector('#overlayResults');
overlayBtn?.addEventListener('click',()=>doSearch(overlaySearch.value,overlayResults));overlaySearch?.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch(overlaySearch.value,overlayResults)});
document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.query;open();document.querySelector('[data-tab="buscar"]')?.click();if(overlaySearch)overlaySearch.value=q;doSearch(q,overlayResults)}));
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));tab.classList.add('active');document.getElementById(tab.dataset.tab)?.classList.add('active')}));
const responses=[['camiño','Podo orientarte sobre etapas, localidades e servizos do Camiño. Nesta demo o contido é ilustrativo.'],['galicia','Galia está pensado como unha porta dixital a Galicia: busca, hoxe, festas, turismo, negocios e chat.'],['vigo','Para Vigo podes buscar eventos, O Castro, restaurantes ou calquera servizo local.'],['antonio palacios','Antonio Palacios é un exemplo perfecto para Galia: patrimonio, O Porriño e a súa conexión con Madrid.'],['contabilidade','LZ79 Essential é a aplicación de xestión e contabilidade de LZ79.'],['comandas','A solución de comandas está en desenvolvemento para hostalaría.'],['empresa','LZ79 crea e comercializa solucións dixitais para profesionais e pequenas empresas.']];
function answer(t){t=t.toLowerCase();for(const [k,m] of responses)if(t.includes(k))return m;return '🐝 Nesta demo podo falarche de Galicia, lugares, Camiño, Galia e solucións LZ79. Proba “Vigo”, “Antonio Palacios” ou “Camiño de Santiago”.'}
const form=document.querySelector('#chatForm'),input=document.querySelector('#chatInput'),messages=document.querySelector('#chatMessages');
form?.addEventListener('submit',e=>{e.preventDefault();const t=input.value.trim();if(!t)return;messages.insertAdjacentHTML('beforeend',`<div class="bubble user">${esc(t)}</div><div class="bubble bot">${esc(answer(t))}</div>`);input.value='';messages.scrollTop=messages.scrollHeight});
