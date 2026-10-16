(()=>{
'use strict';
if(document.body.dataset.page!=='catalog')return;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {models,categories}=window.WIREFRAME,params=new URLSearchParams(location.search);
let category=params.get('category')||'gates',query=params.get('q')||'',quick='all',sort='default';
if(query){const mapped=[['забор','fences'],['перил','rails'],['лестниц','rails'],['козыр','awnings'],['навес','awnings'],['решётк','grilles'],['решетк','grilles'],['мангал','grills'],['мебел','furniture']].find(([word])=>query.toLowerCase().includes(word));if(mapped)category=mapped[1]}
if(!categories.some(c=>c[0]===category))category='gates';
const base=models.filter(m=>m.category===category),cards=$$('.catalog-design .product-card'),grid=$('.catalog-design .product-grid');
const money=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
const optionMatches=(m,group,value)=>group==='wicket'?(value==='with'?m.withWicket:value==='without'?!m.withWicket&&m.type!=='wicket':m.wicketKind===value):group==='options'?Boolean(m[value]):m[group]===value;
const quickMatches=(m,key)=>key==='all'||(['swing','sliding','wicket'].includes(key)?m.type===key:key==='with-wicket'?m.withWicket:key==='profile'?m.infill==='profile':m.style==='modern');
function savedFavorites(){try{const saved=JSON.parse(localStorage.getItem('vk-wireframe-favorites')||'[]');return Array.isArray(saved)?saved:[]}catch{return[]}}
function refresh(){
 const filters={};$$('#catalog-filters input[name]:checked').forEach(input=>(filters[input.name]??=[]).push(input.value));
 const min=$('#min-price').value===''?0:Math.max(0,Number($('#min-price').value)),max=$('#max-price').value===''?Infinity:Math.max(0,Number($('#max-price').value));
 $('#catalog-price-error').hidden=min<=max;
 const favorites=savedFavorites(),q=query.toLowerCase(),genericQuery=/ворот|калит|забор|перил|лестниц|козыр|навес|реш.тк|мангал|мебел/i.test(q);
 const visible=base.filter(m=>(!q||genericQuery||`${m.name} ${m.id} ${m.desc}`.toLowerCase().includes(q))&&quickMatches(m,quick)&&m.price>=min&&m.price<=max&&(!$('#favorites-only').checked||favorites.includes(m.id))&&Object.entries(filters).every(([group,values])=>group==='options'?values.every(value=>optionMatches(m,group,value)):values.some(value=>optionMatches(m,group,value))));
 visible.sort((a,b)=>sort==='price-asc'?a.price-b.price:sort==='price-desc'?b.price-a.price:sort==='newest'?b.addedOrder-a.addedOrder:base.indexOf(a)-base.indexOf(b));
 const visibleIds=new Set(visible.map(m=>m.id));cards.forEach(card=>card.hidden=!visibleIds.has(card.dataset.model));
 const cardById=new Map(cards.map(card=>[card.dataset.model,card]));visible.forEach(m=>grid.append(cardById.get(m.id)));
 const sketch=$('[data-catalog-promo="sketch"]'),measure=$('[data-catalog-promo="measure"]');
 if(visible.length>7)cardById.get(visible[6].id).after(sketch);else grid.append(sketch);grid.append(measure);
 sketch.hidden=measure.hidden=visible.length===0;$('#empty-products').hidden=visible.length>0;
 $('#found-count').textContent=visible.length;$('#catalog-result-status').textContent=`Найдено вариантов: ${visible.length}`;
 $$('[data-quick]').forEach(b=>{const active=b.dataset.quick===quick;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $$('[data-sort]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sort===sort)));
}
const c=categories.find(c=>c[0]===category),isGates=category==='gates';
$('h1').textContent=isGates?'Кованые ворота и калитки на заказ':c[1]+' на заказ';
$('#catalog-crumb').textContent=isGates?'Кованые ворота и калитки':c[1];
if(!isGates)$('#catalog-description').textContent=c[2]+'. Изготовление по вашим размерам в Подольске, покраска, доставка и установка.';
$('#catalog-start-price').textContent='от '+money(Math.min(...base.map(m=>m.price)));
const unit=base[0].unit;$('#catalog-price-caption').textContent='за '+unit+' с покраской';$('#filter-price-unit').textContent=unit;
$('[data-type-tabs]').hidden=!isGates;$$('[data-gates-only]').forEach(el=>el.hidden=!isGates);
$('#price .section-head h2').textContent=isGates?'Из чего складывается стоимость ворот':'Из чего складывается стоимость изделия';
$$('[data-quick-count]').forEach(el=>el.textContent=base.filter(m=>quickMatches(m,el.dataset.quickCount)).length);
$$('[data-filter-count]').forEach(el=>{const [group,value]=el.dataset.filterCount.split(':'),count=base.filter(m=>optionMatches(m,group,value)).length;el.textContent=count;el.closest('label').querySelector('input').disabled=count===0});
$$('[data-quick]').forEach(b=>b.addEventListener('click',()=>{quick=b.dataset.quick;refresh()}));
$$('[data-sort]').forEach(b=>b.addEventListener('click',()=>{sort=b.dataset.sort;refresh()}));
$$('#catalog-filters input').forEach(input=>input.addEventListener('input',refresh));
$$('[data-reset]').forEach(b=>b.addEventListener('click',()=>{quick='all';sort='default';query='';$$('#catalog-filters input').forEach(input=>{if(input.type==='checkbox')input.checked=false;else input.value=''});const url=new URL(location.href);url.searchParams.delete('q');history.replaceState(null,'',url);refresh()}));
$('[data-toggle-catalog-filters]').addEventListener('click',event=>{const expanded=$('#catalog-filters').classList.toggle('is-open');event.currentTarget.setAttribute('aria-expanded',String(expanded));event.currentTarget.textContent=expanded?'Скрыть фильтр':'Фильтр'});
window.refreshCatalog=refresh;
refresh();
})();
