(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const {stock,stockCategories,models,categories}=window.WIREFRAME;
const params=new URLSearchParams(location.search),page=document.body.dataset.page;
const money=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
const safeQty=v=>Math.max(1,Math.min(9999,Math.floor(Number(v)||1)));
const known=id=>stock.find(s=>s[0]===id);
let cart={};
try{const saved=JSON.parse(localStorage.getItem('vk-wireframe-cart')||'{}');for(const [id,q] of Object.entries(saved||{})){if(known(id)&&Number(q)>0)cart[id]=safeQty(q)}}catch{}
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function saveCart(){try{localStorage.setItem('vk-wireframe-cart',JSON.stringify(cart))}catch{}$$('[data-cart-count]').forEach(n=>n.textContent=count())}
let toastTimer;
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500)}
saveCart();
$('#page-switch')?.addEventListener('change',e=>location.href=e.target.value);
$$('[data-menu]').forEach(b=>b.addEventListener('click',()=>$('#menu-dialog').showModal()));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
$$('[data-notes]').forEach(b=>b.addEventListener('click',()=>$('#notes-dialog').showModal()));
$$('[data-show-reviews]').forEach(b=>b.addEventListener('click',()=>$('#design-reviews-dialog').showModal()));
$$('[data-design-info]').forEach(b=>b.addEventListener('click',()=>{const isPolicy=b.dataset.designInfo==='privacy';$('#design-info-title').textContent=isPolicy?'Политика обработки персональных данных':'Договор оферты для интернет-магазина';$('#design-info-text').textContent='Текст документа не включён в дизайн-макет. Для рабочего сайта будет добавлена актуальная редакция.';$('#design-info-dialog').showModal()}));
const reviewTrack=$('#review-track');
if(reviewTrack){const updateReviewArrows=()=>{$('[data-review-step="-1"]').disabled=reviewTrack.scrollLeft<=1;$('[data-review-step="1"]').disabled=reviewTrack.scrollLeft+reviewTrack.clientWidth>=reviewTrack.scrollWidth-2};$$('[data-review-step]').forEach(b=>b.addEventListener('click',()=>reviewTrack.scrollBy({left:Number(b.dataset.reviewStep)*(reviewTrack.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(reviewTrack).columnGap)),behavior:'smooth'})));reviewTrack.addEventListener('scroll',updateReviewArrows,{passive:true});window.addEventListener('resize',updateReviewArrows);updateReviewArrows()}
$$('[data-design-request] [name=channel]').forEach(select=>select.addEventListener('change',()=>{const form=select.form,email=select.value==='На почту',input=$('[name=contact]',form);$('[data-quote-contact-label]',form).textContent=email?'Электронная почта':'Телефон';input.type=email?'email':'tel';input.placeholder=email?'mail@example.ru':'+7 (___) ___-__-__';input.value=''}));
$$('[data-ask]').forEach(b=>b.addEventListener('click',()=>{const dialog=$('#quote-dialog');$('h3',dialog).textContent=b.dataset.ask;const f=$('form',dialog);f.reset();$('.form-result',f).textContent='';$('.form-error',f).hidden=true;const names=$('[data-file-names]',f);if(names)names.textContent='Файл не выбран';if(/замер/i.test(b.dataset.ask))$('select[name=subject]',f).value='Замер на объекте';if(/элемент/i.test(b.dataset.ask))$('select[name=subject]',f).value='Элементы со склада';if(/AV-|RA-|FE-|AW-|GR-|FU-/i.test(b.dataset.ask))$('[name=message]',f).value=b.dataset.ask;dialog.showModal()}));
$$('[data-search]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const q=$('[name=q]',f).value.trim();if(!q)return;const isStock=/баляс|пик[аиу]|элемент|лист|цвет|наклад|орнамент|вензел|поруч|шар|сфер|краск|патин|5379|5818|4813|11\.002/i.test(q);location.href=(isStock?'elements.html':'catalog.html')+'?q='+encodeURIComponent(q)}));
$$('input[type=file]').forEach(input=>input.addEventListener('change',()=>{const names=$('[data-file-names]',input.closest('label'));const files=[...input.files];if(files.some(f=>f.size>20*1024*1024)){input.value='';if(names)names.textContent='Выберите файлы размером до 20 МБ каждый';toast('Файл слишком большой: максимум 20 МБ');return}if(names)names.textContent=files.length?files.map(f=>f.name).join(', '):'Файл не выбран'}));
$$('[data-request]').forEach(f=>f.addEventListener('submit',e=>{
 e.preventDefault();const contact=$('[name=contact]',f).value.trim(),digits=contact.replace(/\D/g,'');const isMeasure=f.hasAttribute('data-measure-request'),phoneValid=/^[+\d\s()\-]+$/.test(contact)&&digits.length>=10&&digits.length<=15,valid=phoneValid||(!isMeasure&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact));const error=$('.form-error',f);
 if(f.hasAttribute('data-partner-request')&&!$('[name=partnerName]',f).value.trim()){error.textContent='Укажите, как к вам обращаться.';error.hidden=false;$('[name=partnerName]',f).focus();return}
 if(!valid){error.textContent=isMeasure?'Укажите полный номер телефона.':'Укажите полный номер телефона или корректную электронную почту.';error.hidden=false;$('[name=contact]',f).focus();return}error.hidden=true;
 if(f.hasAttribute('data-design-request')){const email=$('[name=channel]',f).value==='На почту';if(email?!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact):!(/^[+\d\s()\-]+$/.test(contact)&&digits.length>=10&&digits.length<=15)){error.textContent=email?'Укажите корректную электронную почту.':'Укажите полный номер телефона.';error.hidden=false;$('[name=contact]',f).focus();return}}
 const message=$('[name=message]',f)?.value.trim(),subject=$('[name=subject]',f)?.value||'Элементы из корзины';const attachments=[...($('input[type=file]',f)?.files||[])].map(f=>f.name);
 const quoteDetails=f.hasAttribute('data-design-request')?($('[name=dimensions]',f).value.trim()?'\nРазмеры: '+$('[name=dimensions]',f).value.trim():'')+'\nКуда прислать: '+$('[name=channel]',f).value:'';
 const partnerDetails=f.hasAttribute('data-partner-request')?'\nИмя: '+$('[name=partnerName]',f).value.trim()+'\nРоль: '+$('[name=partnerRole]',f).value+($('[name=partnerCompany]',f).value.trim()?'\nСтудия / компания: '+$('[name=partnerCompany]',f).value.trim():''):'';
 const measureDetails=isMeasure?($('[name=address]',f).value.trim()?'\nАдрес: '+$('[name=address]',f).value.trim():'')+($('[name=preferredTime]',f).value.trim()?'\nУдобное время: '+$('[name=preferredTime]',f).value.trim():''):'';
 $('.form-result',f).textContent='Пример заявки готов. Ничего не отправлено.\n'+subject+partnerDetails+quoteDetails+measureDetails+(message?'\n'+message:'')+'\nКонтакт: '+contact+(attachments.length?'\nФайлы: '+attachments.join(', '):'')+(page==='cart'?'\nЭлементов: '+count()+' · '+money(Object.entries(cart).reduce((sum,[id,q])=>sum+known(id)[3]*q,0)):'' );
}));
document.addEventListener('click',e=>{
 const qty=e.target.closest('[data-qty]');if(qty){const input=$('input',qty.parentElement);input.value=safeQty(Number(input.value)+Number(qty.dataset.qty));const row=qty.closest('[data-cart-id]');if(row){cart[row.dataset.cartId]=safeQty(input.value);renderCart(false)}return}
 const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add;if(!known(id))return;const input=$('.qty input',add.closest('.stock-card'));cart[id]=safeQty((cart[id]||0)+safeQty(input?.value));saveCart();toast('Добавлено в корзину · '+known(id)[1]);return}
 const remove=e.target.closest('[data-remove]');if(remove){delete cart[remove.dataset.remove];renderCart();return}
});
document.addEventListener('change',e=>{if(e.target.matches('.qty input')){e.target.value=safeQty(e.target.value);const row=e.target.closest('[data-cart-id]');if(row){cart[row.dataset.cartId]=safeQty(e.target.value);renderCart(false)}}});
let favorites=[];try{favorites=JSON.parse(localStorage.getItem('vk-wireframe-favorites')||'[]');if(!Array.isArray(favorites))favorites=[]}catch{}
$$('[data-favorite]').forEach(b=>{b.setAttribute('aria-pressed',favorites.includes(b.dataset.favorite));b.addEventListener('click',()=>{const id=b.dataset.favorite;favorites=favorites.includes(id)?favorites.filter(v=>v!==id):[...favorites,id];b.setAttribute('aria-pressed',favorites.includes(id));try{localStorage.setItem('vk-wireframe-favorites',JSON.stringify(favorites))}catch{}if($('#favorites-only')?.checked)window.refreshCatalog?.()})});
let category=params.get('category')||'gates';
if(page==='product'){
 const m=models.find(m=>m.id===params.get('id'))||models[0];$('h1').textContent=m.name;$('#product-id').textContent='Эскиз '+m.id;$('#product-name').textContent=m.name;$('#product-description').textContent=m.desc;$('#main-product-image').src='../assets/img/'+m.image;$('#main-product-image').alt=m.name;$('#product-unit-price').textContent='от '+money(m.price)+' за '+m.unit;$('#configurator').dataset.price=m.price;$('#configurator').dataset.unit=m.unit;
 if(m.category!=='gates'){$$('#configurator label').forEach(l=>{if($('select',l))l.hidden=true});$$('[data-gallery]').forEach(b=>{b.dataset.gallery=m.image;$('img',b).src='../assets/img/'+m.image})}
 if(m.type==='wicket')$('#width').value=1;
 $('#configurator').addEventListener('input',calculate);$('#configurator').addEventListener('submit',e=>e.preventDefault());calculate();
 $$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>$('#main-product-image').src='../assets/img/'+b.dataset.gallery));
 $$('[role=tab]').forEach(b=>b.addEventListener('click',()=>{$$('[role=tab]').forEach(t=>t.setAttribute('aria-selected',t===b));$$('.tab-panel').forEach(p=>p.hidden=p.id!==b.dataset.panel)}));
}
function calculate(){const f=$('#configurator'),w=Number($('#width').value),h=Number($('#height').value);if(!f.checkValidity()||w<=0||h<=0){$('#product-total').textContent='Уточните размеры';$('.config-error').hidden=false;return}$('.config-error').hidden=true;const area=f.dataset.unit==='м²'?w*h:f.dataset.unit==='пог. м'?w:1,base=Number(f.dataset.price);const extras=category==='gates'||!params.get('id')||params.get('id').startsWith('AV-')?Number($('#infill').value)+Number($('#coating').value)*area:0;$('#product-total').textContent='от '+money(base*area+extras)}
if(page==='elements'){
 let stockType=stockCategories.some(c=>c[0]===params.get('type'))?params.get('type'):'all';$('#stock-search').value=params.get('q')||'';
 function applyStock(){const selected=stockCategories.find(c=>c[0]===stockType);$('h1').textContent=selected?selected[1]+' ('+selected[2]+')':'Элементы холодной ковки';const q=$('#stock-search').value.trim().toLowerCase();let shown=0;$$('.stock-card[data-stock-id]').forEach(card=>{const s=known(card.dataset.stockId);card.hidden=(stockType!=='all'&&s[5]!==stockType)||(q&&!`${s[0]} ${s[1]}`.toLowerCase().includes(q));if(!card.hidden)shown++});$$('[data-stock-filters] button').forEach(b=>{b.classList.toggle('active',b.dataset.stockType===stockType);b.setAttribute('aria-pressed',String(b.dataset.stockType===stockType))});$('#empty-stock').hidden=shown>0}
 $$('[data-stock-filters] button').forEach(b=>b.addEventListener('click',()=>{stockType=b.dataset.stockType;const url=new URL(location.href);if(stockType==='all')url.searchParams.delete('type');else url.searchParams.set('type',stockType);history.replaceState(null,'',url);applyStock()}));$('#stock-search').addEventListener('input',applyStock);applyStock();
}
if(page==='element'){
 const s=known(params.get('id'))||stock[0];$('h1').textContent=s[1];$('#element-name').textContent=s[1];$('#element-sku').textContent='Артикул '+s[0];$('#element-size').textContent=s[4];$('#element-image').src='../assets/img/'+s[2];$('#element-image').alt=s[1];$('#element-price').textContent=money(s[3]);$('#element-add').dataset.add=s[0];
}
if(page==='portfolio')$$('[data-work]').forEach(b=>b.addEventListener('click',()=>{$$('[data-work]').forEach(x=>x.classList.toggle('active',x===b));$$('[data-work-type]').forEach(card=>card.hidden=b.dataset.work!=='all'&&card.dataset.workType!==b.dataset.work)}));
if(page==='project'){
 const w=window.WIREFRAME.works[Number(params.get('id'))]||window.WIREFRAME.works[0];$('h1').textContent=w[1];$('.project-photo img').src='../assets/img/'+w[2];$('.project-photo img').alt=w[1];const panel=$('.split .panel');$('h2',panel).textContent=w[1];$('.eyebrow',panel).textContent=w[3];const rows=$$('.specs dd',panel);rows[0].textContent=w[1];rows[1].textContent='По согласованному эскизу';
}
function renderCart(rebuild=true){
 if(page!=='cart')return;saveCart();const entries=Object.entries(cart);$('#cart-empty').hidden=entries.length>0;$('#cart-summary').hidden=entries.length===0;$('#checkout-content').hidden=entries.length===0;
 if(rebuild){const root=$('#cart-items');root.replaceChildren();entries.forEach(([id,q])=>{const s=known(id),row=document.createElement('article');row.className='cart-item';row.dataset.cartId=id;
 const image=document.createElement('img');image.src='../assets/img/'+s[2];image.alt=s[1];row.append(image);const desc=document.createElement('div'),a=document.createElement('a');a.href='element.html?id='+encodeURIComponent(id);const title=document.createElement('h3');title.textContent=s[1];a.append(title);desc.append(a);const p=document.createElement('p');p.textContent='Артикул '+id+' · '+money(s[3])+' / шт.';desc.append(p);const remove=document.createElement('button');remove.className='text-btn';remove.dataset.remove=id;remove.textContent='Удалить';remove.setAttribute('aria-label','Удалить '+s[1]);desc.append(remove);row.append(desc);const qty=document.createElement('div');qty.className='qty';qty.innerHTML='<button data-qty="-1" aria-label="Уменьшить количество">−</button><input type="number" min="1" max="9999" aria-label="Количество"><button data-qty="1" aria-label="Увеличить количество">+</button>';$('input',qty).value=q;row.append(qty);const sum=document.createElement('strong');sum.dataset.rowSum='';sum.textContent=money(s[3]*q);row.append(sum);root.append(row)});}
 else entries.forEach(([id,q])=>{const row=$$('[data-cart-id]').find(r=>r.dataset.cartId===id);$('[data-row-sum]',row).textContent=money(known(id)[3]*q)});
 $('#cart-total').textContent=money(entries.reduce((sum,[id,q])=>sum+known(id)[3]*q,0));
}
if(page==='cart')renderCart();
$('[data-account]')?.addEventListener('submit',e=>{e.preventDefault();$('#account-demo').hidden=false;$('[data-account] button').textContent='Пример кабинета открыт'});
})();
