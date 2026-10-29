'use strict';
(() => {
 const $=s=>document.querySelector(s),data=window.MIASMA_DATA,main=$('#main');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const categories=[...new Set(data.entries.map(e=>e.category))];
 const link=e=>'#artigo/'+encodeURIComponent(e.id);
 const card=e=>`<a class="card" href="${link(e)}">${e.image?`<img class="card-img" src="${esc(e.image)}" alt="" loading="lazy">`:''}<div class="card-body"><div class="eyebrow">${esc(e.category)}</div><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p></div><div class="card-bottom"><span>Abrir registro</span><span>↗</span></div></a>`;
 function render(){
  let route;try{route=decodeURIComponent(location.hash.slice(1));}catch{route='inicio';}
  $('#nav').innerHTML='<a href="#inicio">⌂ Visão geral</a>'+categories.map(c=>`<a href="#categoria/${encodeURIComponent(c)}">${esc(c)}</a>`).join('');
  document.title='Miasma Wiki · Arquivo da Guilda';
  if(route.startsWith('artigo/')){
   const e=data.entries.find(e=>e.id===route.slice(7));
   if(e){document.title=e.title+' · Miasma Wiki';main.innerHTML=`<div class="breadcrumb"><a href="#inicio">Início</a> / ${esc(e.category)}</div><article class="article"><h1>${esc(e.title)}</h1><p class="lead">${esc(e.summary)}</p>${e.image?`<figure><img src="${esc(e.image)}" alt="${esc(e.title)}"><figcaption>Imagem do protótipo em desenvolvimento.</figcaption></figure>`:''}${e.body.split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}</article>`;}
   else main.innerHTML='<div class="empty">Registro não encontrado. <a href="#inicio">Voltar ao início</a></div>';
  }else if(route.startsWith('categoria/')||route==='buscar'){
   const category=route.startsWith('categoria/')?route.slice(10):null;
   const tokens=norm($('#search').value).split(/\s+/).filter(Boolean);
   const entries=data.entries.filter(e=>(!category||e.category===category)&&tokens.every(t=>norm(e.title+' '+e.summary+' '+e.body).includes(t)));
   main.innerHTML=`<div class="page-heading"><h1>${esc(category||'Pesquisar na wiki')}</h1></div><p>${entries.length} registros</p><div class="grid">${entries.map(card).join('')}</div>${entries.length?'':'<div class="empty">Nenhum registro encontrado.</div>'}`;
  }else main.innerHTML=`<section class="hero"><img class="hero-image" src="assets/manual/cabine.jpg" alt="Interior da cápsula-andarilha"><div class="eyebrow">REGISTROS DA SUPERFÍCIE · 600 D.N.</div><h1>O que resta<br>além da <em>névoa.</em></h1><p>Conheça a máquina, os refúgios e os cuidados para atravessar o mundo de Miasma.</p><a class="button" href="#artigo/primeira-viagem">Antes de partir ↗</a><a class="button secondary" href="#artigo/universo">Conheça o universo</a></section><div class="meta-row"><span>EDIÇÃO PÚBLICA · v${esc(data.meta.version)}</span><span>PROTÓTIPO EM DESENVOLVIMENTO</span></div><div class="section-title"><h2>Prepare a travessia</h2></div><div class="grid">${['primeira-viagem','capsula','exploracao'].map(id=>card(data.entries.find(e=>e.id===id))).join('')}</div><div class="section-title"><h2>Explore o arquivo</h2></div><div class="grid">${data.entries.filter(e=>!['primeira-viagem','capsula','exploracao','sobre'].includes(e.id)).map(card).join('')}</div>`;
  $('#sidebar').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');
 }
 $('#edition').textContent='Edição pública · v'+data.meta.version;
 $('#updated').textContent='Atualizado em '+new Date(data.meta.generated).toLocaleDateString('pt-BR');
 $('#menu-toggle').onclick=()=>{$('#menu-toggle').setAttribute('aria-expanded',String($('#sidebar').classList.toggle('open')));};
 $('#search').addEventListener('input',()=>{if(location.hash!=='#buscar')location.hash='buscar';else render();});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#search').focus();}});
 window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});render();
})();
