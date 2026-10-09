const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const src=fs.readFileSync('products.js','utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(`${src}\nthis.items = PRODUCTS; this.cats = CATEGORIES;`,ctx);
const products=ctx.items;
test('catálogo con productos independientes, precios numéricos y enlaces seguros',()=>{
 assert.ok(products.length>=8);
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);
 for(const p of products){assert.ok(p.name.includes('Lenda'));assert.ok(p.priceFrom>0);assert.ok(/^https:\/\/shop\.lenda\.net\//.test(p.url));assert.ok(p.category.length>0);assert.ok(p.tags.length>0)}
});
test('las categorías abarcan el catálogo',()=>{
 for(const p of products){for(const c of p.category)assert.ok(ctx.cats.some(x=>x.id===c),`${p.id}: ${c}`)}
});
test('no aparece pago conectado como si fuera una tienda en producción',()=>{
 const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('No se realizará ningún cobro'));assert.ok(html.includes('independiente'));
});
