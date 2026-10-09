/* LendaPet Store · Interfaz de catálogo. Sin cobros ni recopilación de pedidos. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const state = { category:'todos', query:'', sort:'recomendados', cart:loadCart(), openDialog:null, lastFocus:null };
  let toastTimeout;
  const fmt = new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const esc = (str) => String(str).replace(/[&<>"']/g,(ch)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const colorStyle = (p) => `--tone:${p.color};--pack:${p.pack};--pack-ink:${p.ink};--accent:${p.accent}`;
  function loadCart(){ try { const parsed = JSON.parse(localStorage.getItem('lendapet-cart-v1') || '{}'); if(!parsed || typeof parsed!=='object' || Array.isArray(parsed)) return {}; return Object.fromEntries(Object.entries(parsed).filter(([k,v])=>PRODUCTS.some(p=>p.id===k)&&Number.isInteger(v)&&v>0&&v<=20)); } catch {return {}} }
  function persist(){ try {localStorage.setItem('lendapet-cart-v1',JSON.stringify(state.cart))}catch{/* La tienda sigue operativa sin almacenamiento */} }
  const count = () => Object.values(state.cart).reduce((a,b)=>a+b,0);
  function getTotal(){ return Object.entries(state.cart).reduce((total,[id,n])=>total+(byId(id)?.priceFrom || 0)*n,0) }
  function packHtml(p){return `<div class="pack-wrap"><div class="pack"><span class="pack-top">NATURAL PET FOOD</span><span class="pack-brand">lenda<span style="color:${p.accent}">.</span></span><span class="pack-rule"></span><span class="pack-art" aria-hidden="true">${p.motif}</span><span class="pack-family">${esc(p.family)}</span><span class="pack-protein">${esc(p.protein)}</span><span class="pack-bottom"></span></div></div>`}
  function renderFilters(){ $('#filters').innerHTML=CATEGORIES.map(c=>`<button type="button" class="filter-chip ${state.category===c.id?'active':''}" data-filter="${c.id}" aria-pressed="${state.category===c.id}">${esc(c.label)}</button>`).join('') }
  function filtered(){const q=state.query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let items=PRODUCTS.filter(p=>(state.category==='todos'||p.category.includes(state.category))&&(!q||`${p.name} ${p.protein} ${p.family} ${p.tags.join(' ')}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q)));if(state.sort==='price-asc') items.sort((a,b)=>a.priceFrom-b.priceFrom);if(state.sort==='price-desc') items.sort((a,b)=>b.priceFrom-a.priceFrom);if(state.sort==='name') items.sort((a,b)=>a.name.localeCompare(b.name,'es'));return items}
  function renderProducts(){const items=filtered();$('#productGrid').innerHTML=items.map(p=>`<article class="product-card" style="${colorStyle(p)}"><div class="product-image"><span class="product-badge">${esc(p.badge)}</span>${packHtml(p)}<button type="button" data-details="${p.id}" class="card-quick" aria-label="Ver detalles de ${esc(p.name)}">↗</button></div><div class="product-meta"><span class="product-family">${esc(p.family)}</span><h3 class="product-name">${esc(p.name)}</h3><p class="product-subtitle">${esc(p.subtitle)}</p><div class="product-bottom"><span class="product-price"><small>desde </small>${fmt.format(p.priceFrom)}</span><button type="button" class="add-button" data-add="${p.id}" aria-label="Añadir ${esc(p.name)} a mi selección" title="Añadir a mi selección">+</button></div></div></article>`).join('');$('#resultCount').textContent=`${items.length} ${items.length===1?'producto':'productos'}`;$('#noResults').hidden=items.length>0;renderFilters()}
  function chooseCategory(category){if(!CATEGORIES.some(c=>c.id===category))category='todos';state.category=category;renderProducts()}
  function addItem(id){if(!byId(id))return;state.cart[id]=Math.min(20,(state.cart[id]||0)+1);persist();renderCart();notify('Añadido a tu selección')}
  function changeQty(id,delta){if(!byId(id))return;const next=(state.cart[id]||0)+delta;if(next<=0)delete state.cart[id];else state.cart[id]=Math.min(20,next);persist();renderCart()}
  function renderCart(){const n=count();$('#cartCount').textContent=n;$('#drawerCount').textContent=`(${n})`;$('#cartSubtotal').textContent=fmt.format(getTotal());$('#copyCart').disabled=n===0;$('#cartItems').innerHTML=n===0?`<div class="drawer-empty"><span aria-hidden="true">♡</span><h3>Aún no hay favoritos.</h3><p>Explora el catálogo y guarda los piensos que te interesen.</p><button type="button" data-close-dialog class="btn btn-primary">Explorar el catálogo</button></div>`:Object.entries(state.cart).map(([id,qty])=>{const p=byId(id);if(!p)return '';return `<div class="cart-item" style="${colorStyle(p)}"><div class="cart-thumb"><span aria-hidden="true">${p.motif}</span></div><div><div class="cart-product-name">${esc(p.name)}</div><div class="cart-product-meta">Precio de referencia desde ${fmt.format(p.priceFrom)}</div><div class="cart-item-bottom"><div class="qty-wrap"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Quitar una unidad de ${esc(p.name)}">−</button><span>${qty}</span><button type="button" data-qty="${id}" data-delta="1" aria-label="Añadir una unidad de ${esc(p.name)}">+</button></div><strong class="cart-item-price">${fmt.format(qty*p.priceFrom)}</strong></div><button class="remove-item" type="button" data-remove="${id}">Eliminar</button></div></div>`}).join('')}
  function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2500)}
  function dialogElements(){return {cart:$('#cartDrawer'),product:$('#productModal')}}
  function openDialog(which){if(state.openDialog)closeDialog(false);state.lastFocus=document.activeElement;state.openDialog=which;$('#overlay').hidden=false;document.body.classList.add('lock-scroll');const el=dialogElements()[which];el.classList.add('open');el.setAttribute('aria-hidden','false');requestAnimationFrame(()=>{(which==='cart'?$('#cartClose'):$('#modalClose')).focus()})}
  function closeDialog(restoreFocus=true){if(!state.openDialog)return;const el=dialogElements()[state.openDialog];el.classList.remove('open');el.setAttribute('aria-hidden','true');$('#overlay').hidden=true;document.body.classList.remove('lock-scroll');state.openDialog=null;if(restoreFocus&&state.lastFocus?.focus)state.lastFocus.focus()}
  function showProduct(id){const p=byId(id);if(!p)return;$('#modalContent').innerHTML=`<div class="modal-layout" style="${colorStyle(p)}"><div class="modal-art">${packHtml(p)}</div><div class="modal-info"><span class="product-family">${esc(p.family)}</span><h2 id="modalTitle">${esc(p.name)}</h2><p>${esc(p.description)}</p><div class="tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><strong class="product-price"><small>precio de referencia desde </small>${fmt.format(p.priceFrom)}</strong><button type="button" data-modal-add="${p.id}" class="btn btn-primary">Añadir a mi selección <span aria-hidden="true">+</span></button><a class="modal-official" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Consultar formato y precio en Lenda ↗</a><p class="modal-note">Este proyecto es un catálogo independiente en fase de demostración. No procesa pedidos.</p></div></div>`;openDialog('product')}
  function getCartText(){return ['MI SELECCIÓN DE PIENSOS · LENDAPET','',...Object.entries(state.cart).map(([id,qty])=>{const p=byId(id);return `${qty} × ${p.name} — desde ${fmt.format(p.priceFrom)} por unidad\n${p.url}`}),'',`Suma orientativa desde: ${fmt.format(getTotal())}`,'Los precios varían según formato y región. Confirmar en Lenda.',`https://shop.lenda.net/`].join('\n')}
  async function copyCart(){if(count()===0)return;const contents=getCartText();try{if(!navigator.clipboard?.writeText)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(contents);notify('Lista copiada al portapapeles')}catch{const textarea=document.createElement('textarea');textarea.value=contents;textarea.style.position='fixed';textarea.style.opacity='0';document.body.append(textarea);textarea.select();const ok=document.execCommand?.('copy');textarea.remove();if(ok)notify('Lista copiada al portapapeles');else window.prompt('Copia tu selección:',contents)}}
  document.addEventListener('click',e=>{const t=e.target.closest('button,a');if(!t)return;
    if(t.matches('[data-add]')){addItem(t.dataset.add);return}
    if(t.matches('[data-details]')){showProduct(t.dataset.details);return}
    if(t.matches('[data-modal-add]')){addItem(t.dataset.modalAdd);closeDialog();return}
    if(t.matches('[data-qty]')){changeQty(t.dataset.qty,Number(t.dataset.delta));return}
    if(t.matches('[data-remove]')){delete state.cart[t.dataset.remove];persist();renderCart();return}
    if(t.matches('[data-close-dialog]')){closeDialog();return}
    if(t.matches('[data-filter]')){chooseCategory(t.dataset.filter);return}
    if(t.matches('[data-nav-category]')){chooseCategory(t.dataset.navCategory);$('#mainNav').classList.remove('open');$('#mobileMenu').setAttribute('aria-expanded','false');return}
    if(t.matches('[data-category-link]')){chooseCategory(t.dataset.categoryLink);return}
    if(t.closest('#mainNav')){$('#mainNav').classList.remove('open');$('#mobileMenu').setAttribute('aria-expanded','false')}
  });
  $('#cartOpen').addEventListener('click',()=>openDialog('cart'));
  $('#cartClose').addEventListener('click',()=>closeDialog());
  $('#modalClose').addEventListener('click',()=>closeDialog());
  $('#overlay').addEventListener('click',()=>closeDialog());
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDialog();return}if(e.key==='Tab'&&state.openDialog){const dialog=dialogElements()[state.openDialog];const focusables=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')].filter(x=>x.getClientRects().length);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  $('#searchInput').addEventListener('input',e=>{state.query=e.target.value;renderProducts()});
  $('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;renderProducts()});
  $('#resetFilters').addEventListener('click',()=>{state.query='';$('#searchInput').value='';chooseCategory('todos')});
  $('#headerSearch').addEventListener('click',()=>{document.getElementById('catalogo').scrollIntoView({behavior:'smooth'});$('#searchInput').focus({preventScroll:true})});
  $('#mobileMenu').addEventListener('click',()=>{const open=$('#mainNav').classList.toggle('open');$('#mobileMenu').setAttribute('aria-expanded',String(open))});
  $('#copyCart').addEventListener('click',copyCart);
  $('#year').textContent=new Date().getFullYear();
  renderProducts();renderCart();
})();
