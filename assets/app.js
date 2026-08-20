const DATA={products:[],blogs:[]};
const WHATSAPP_NUMBER="917626999369"; // Replace with your business WhatsApp number, country code included, no + or spaces
async function loadData(){if(DATA.products.length)return;[DATA.products,DATA.blogs]=await Promise.all([fetch("data/products.json").then(r=>r.json()),fetch("data/blogs.json").then(r=>r.json())]);}
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function cart(){return JSON.parse(localStorage.getItem("crystalCart")||"[]")}
function saveCart(c){localStorage.setItem("crystalCart",JSON.stringify(c));updateCartCount()}
function updateCartCount(){let n=cart().reduce((a,x)=>a+x.qty,0);document.querySelectorAll("#cartCount").forEach(x=>x.textContent=n)}
function addItem(id,option="",price=null){let c=cart(),x=c.find(i=>i.id===id&&i.option===option);if(x)x.qty++;else c.push({id,option,price,qty:1});saveCart(c);showToast("Added to cart")}
function removeItem(i){let c=cart();c.splice(i,1);saveCart(c);renderCheckout()}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN")}
function productCard(p){return `<article class="product-card"><a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`:`<div class="placeholder-stone">✦</div>`}</div></a><div class="product-info"><div class="meta">${esc(p.crystal)} · ${esc(p.type)}</div><h3>${esc(p.name)}</h3><div class="price">From ${money(p.options?.length?p.options[0].price:p.price)}</div><a class="add-btn" href="product.html?id=${encodeURIComponent(p.id)}">View product →</a></div></article>`}
function score(p,q){let terms=q.toLowerCase().split(/\s+/).filter(Boolean),s=0,text=[p.name,p.crystal,p.type,p.shortDescription,p.description,(p.tags||[]).join(" ")].join(" ").toLowerCase();for(const t of terms){if(p.name.toLowerCase().includes(t))s+=50;if(p.crystal.toLowerCase().includes(t))s+=35;if(p.type.toLowerCase().includes(t))s+=25;if(text.includes(t))s+=8}return s}
async function renderBestSellers(){await loadData();let g=document.getElementById("bestGrid");if(g)g.innerHTML=DATA.products.filter(p=>p.bestSeller).slice(0,8).map(productCard).join("");updateCartCount()}
async function initCatalog(){await loadData();let c=document.getElementById("crystalFilter"),t=document.getElementById("typeFilter");[...new Set(DATA.products.map(p=>p.crystal))].sort().forEach(v=>c.add(new Option(v,v)));[...new Set(DATA.products.map(p=>p.type))].sort().forEach(v=>t.add(new Option(v,v)));["catalogSearch","crystalFilter","typeFilter","sortBy"].forEach(id=>document.getElementById(id).addEventListener(id==="catalogSearch"?"input":"change",renderCatalog));renderCatalog();updateCartCount()}
function renderCatalog(){let q=document.getElementById("catalogSearch").value.trim().toLowerCase(),cv=document.getElementById("crystalFilter").value,tv=document.getElementById("typeFilter").value,sv=document.getElementById("sortBy").value,a=DATA.products.filter(p=>(!cv||p.crystal===cv)&&(!tv||p.type===tv)&&(!q||score(p,q)>0));if(q)a.sort((x,y)=>score(y,q)-score(x,q));else if(sv==="name")a.sort((x,y)=>x.name.localeCompare(y.name));else if(sv==="crystal")a.sort((x,y)=>x.crystal.localeCompare(y.crystal));else if(sv==="type")a.sort((x,y)=>x.type.localeCompare(y.type));else if(sv==="priceLow")a.sort((x,y)=>(x.options?.[0]?.price||x.price)-(y.options?.[0]?.price||y.price));else if(sv==="priceHigh")a.sort((x,y)=>(y.options?.[0]?.price||y.price)-(x.options?.[0]?.price||x.price));document.getElementById("resultsCount").textContent=`${a.length} products`;document.getElementById("productGrid").innerHTML=a.map(productCard).join("");document.getElementById("emptyState").classList.toggle("hidden",a.length>0)}
async function initProduct(){await loadData();let id=new URLSearchParams(location.search).get("id"),p=DATA.products.find(x=>x.id===id),box=document.getElementById("productPage");if(!p){box.innerHTML="<h2>Product not found</h2>";return}document.title=p.name+" | Kaveri Crystal Products";let opt=p.options?.length?p.options[0]:null;box.innerHTML=`<div class="product-detail"><div class="detail-image">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}">`:`<div class="big-placeholder">✦</div>`}</div><div class="detail-copy"><div class="meta">${esc(p.crystal)} · ${esc(p.type)}</div><h1>${esc(p.name)}</h1><p class="detail-description">${esc(p.description)}</p>${p.options?.length?`<label class="option-label">Select weight</label><div class="option-grid">${p.options.map((o,i)=>`<button class="option-btn ${i===0?"selected":""}" data-option="${esc(o.label)}" data-price="${o.price}">${esc(o.label)}<strong>${money(o.price)}</strong></button>`).join("")}</div>`:""}<div class="buy-row"><div class="qty"><button id="minus">−</button><span id="qty">1</span><button id="plus">+</button></div><button id="addProduct" class="primary-btn">Add to cart</button><a href="checkout.html" class="secondary-btn">Go to cart</a></div><div class="details-box"><h3>Product details</h3>${Object.entries(p.details||{}).map(([k,v])=>`<div><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")}</div></div></div><section class="related"><h2>You may also like</h2><div class="product-grid">${DATA.products.filter(x=>x.crystal===p.crystal&&x.id!==p.id).slice(0,4).map(productCard).join("")}</div></section>`;
let selected=opt?.label||"",price=opt?.price??p.price,qty=1;document.querySelectorAll(".option-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".option-btn").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selected=b.dataset.option;price=Number(b.dataset.price)});document.getElementById("minus").onclick=()=>{qty=Math.max(1,qty-1);document.getElementById("qty").textContent=qty};document.getElementById("plus").onclick=()=>{qty++;document.getElementById("qty").textContent=qty};document.getElementById("addProduct").onclick=()=>{for(let i=0;i<qty;i++)addItem(p.id,selected,price)};updateCartCount()}
async function initBlogs(){await loadData();renderBlogs();document.getElementById("blogSearch").addEventListener("input",renderBlogs);updateCartCount()}
function renderBlogs(){let q=(document.getElementById("blogSearch").value||"").toLowerCase();document.getElementById("blogGrid").innerHTML=DATA.blogs.filter(b=>!q||[b.title,b.category,b.excerpt].join(" ").toLowerCase().includes(q)).map(b=>`<article class="blog-card"><div class="tag">${esc(b.category)} · ${esc(b.readTime)}</div><h3>${esc(b.title)}</h3><p>${esc(b.excerpt)}</p><button class="text-btn" onclick="alert(${JSON.stringify(b.content.join("\n\n"))})">Read article →</button></article>`).join("")}
async function initCheckout(){await loadData();renderCheckout();document.getElementById("checkoutForm").addEventListener("submit",placeWhatsAppOrder);updateCartCount()}
function renderCheckout(){let c=cart(),wrap=document.getElementById("cartItems"),sum=document.getElementById("summary");if(!c.length){wrap.innerHTML="";document.getElementById("cartEmpty").classList.remove("hidden");sum.innerHTML="";return}document.getElementById("cartEmpty").classList.add("hidden");let total=0;wrap.innerHTML=c.map((i,n)=>{let p=DATA.products.find(x=>x.id===i.id),price=Number(i.price??p.price),line=price*i.qty;total+=line;return `<div class="cart-row"><div class="cart-thumb">✦</div><div class="cart-name"><strong>${esc(p.name)}</strong><small>${esc(i.option||"Standard")} · ${esc(p.crystal)}</small></div><div class="qty"><button onclick="changeCartQty(${n},-1)">−</button>${i.qty}<button onclick="changeCartQty(${n},1)">+</button></div><strong>${money(line)}</strong><button class="remove" onclick="removeItem(${n})">×</button></div>`}).join("");sum.innerHTML=`<div class="summary-line"><span>Items</span><span>${c.reduce((a,x)=>a+x.qty,0)}</span></div><div class="summary-line total"><span>Total</span><strong>${money(total)}</strong></div>`}
function changeCartQty(n,d){let c=cart();c[n].qty+=d;if(c[n].qty<1)c.splice(n,1);saveCart(c);renderCheckout()}
function placeWhatsAppOrder(e){
  e.preventDefault();
  const c=cart();
  if(!c.length)return alert("Cart is empty.");
  const f=Object.fromEntries(new FormData(e.target));
  let total=0;
  const lines=c.map((i,n)=>{
    const p=DATA.products.find(x=>x.id===i.id);
    const price=Number(i.price??p.price);
    const line=price*i.qty;
    total+=line;
    return `${n+1}. ${p.name}\n   ${i.option||"Standard"} × ${i.qty} = ${money(line)}`;
  });
  const orderId="CB-"+Date.now().toString().slice(-6);
  const msg=`🛍️ NEW ORDER

Order ID: ${orderId}

CUSTOMER
Name: ${f.name}
WhatsApp: ${f.phone}
Email: ${f.email||"Not provided"}

DELIVERY ADDRESS
${f.address1}
${f.address2||""}
${f.city}, ${f.state} - ${f.pincode}
${f.notes?`Notes: ${f.notes}`:""}

ORDER
${lines.join("\n\n")}

TOTAL: ${money(total)}

Please share payment QR and shipping/tracking details here.`;
  localStorage.setItem("lastOrder",JSON.stringify({orderId,customer:f,items:c,total}));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}

function showToast(t){let x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1600)}
document.addEventListener("DOMContentLoaded",updateCartCount);
