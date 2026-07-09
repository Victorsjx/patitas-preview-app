// ===== DATOS DE EJEMPLO (basados en main.dart) =====
const reportes = {
  gatito:  { titulo:"Gatito atrapado en árbol", comuna:"Providencia", estado:"Urgente", foto:"🐱", desc:"Gato joven no puede bajar desde hace 24 horas. Esquina Condell con Marín, frente a la plaza.", lat:-33.4270, lng:-70.6083 },
  colonia: { titulo:"Colonia de gatos sin esterilizar", comuna:"Ñuñoa", estado:"Atención", foto:"🐈", desc:"Colonia de 9 gatos en plaza Ñuñoa. Voluntaria los alimenta pero urge campaña de esterilización.", lat:-33.4593, lng:-70.5979 },
  perrita: { titulo:"Perrita atropellada Alameda", comuna:"Santiago Centro", estado:"Urgente", foto:"🐕", desc:"Perrita mediana atropellada frente al Metro Baquedano. Necesita traslado urgente.", lat:-33.4372, lng:-70.6338 },
  senior:  { titulo:"Perro senior en la calle", comuna:"Las Condes", estado:"Atención", foto:"🐕‍🦺", desc:"Perro de raza grande, viejo y desdentado, deambula por Av. Apoquindo.", lat:-33.4095, lng:-70.5677 },
  luna:    { titulo:"Luna busca familia", comuna:"Ñuñoa", estado:"adopcion", foto:"🐶", desc:"Perrita mestiza de 7 meses, esterilizada, vacunas al día, muy dócil y juguetona.", lat:-33.4560, lng:-70.6010 },
  simon:   { titulo:"Simón — labrador 3 años", comuna:"Providencia", estado:"adopcion", foto:"🐕", desc:"Labrador amarillo castrado, sociable con personas y otros perros.", lat:-33.4260, lng:-70.6100 },
  mishi:   { titulo:"Mishi — gata adulta esterilizada", comuna:"Santiago Centro", estado:"adopcion", foto:"🐱", desc:"Gata blanca con manchas negras, 4 años, esterilizada e independiente.", lat:-33.4450, lng:-70.6550 },
  conejos: { titulo:"Dos conejitos mini lop", comuna:"La Florida", estado:"adopcion", foto:"🐰", desc:"Pareja de conejos mini lop, 6 meses. Se entregan con jaula y accesorios.", lat:-33.5225, lng:-70.5991 },
};

const coloresEstado = { Urgente:"#e53e3e", "Atención":"#d69e2e", adopcion:"#2d5a3d" };
const textosEstado  = { Urgente:"Urgente", "Atención":"Atención", adopcion:"adopcion" };
const emojiEstado   = { Urgente:"⚠️", "Atención":"ℹ️", adopcion:"❤️" };

const backdrop   = document.getElementById('backdrop');
const sheetFicha = document.getElementById('sheetFicha');
const sheetForm  = document.getElementById('sheetForm');
const toast      = document.getElementById('toastMini');

let vistaActual = 'inicio';
let sheetActual = null; // null | 'ficha' | 'form'

// ===== NAVEGACIÓN INFERIOR (con historial) =====
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> navegarA(btn.dataset.nav));
});
document.querySelectorAll('[data-goto]').forEach(el=>{
  el.addEventListener('click', ()=> navegarA(el.dataset.goto));
});

function navegarA(destino){
  if (destino === vistaActual && !sheetActual) return;
  history.pushState({view: destino, sheet: null}, '');
  aplicarEstado(destino, null);
}

function aplicarEstado(destino, sheet){
  vistaActual = destino;
  sheetActual = sheet;
  document.querySelectorAll('.vista').forEach(v=>v.classList.toggle('activa', v.dataset.vista===destino));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('activo', b.dataset.nav===destino));

  const abrirF = sheet === 'ficha';
  const abrirO = sheet === 'form';
  backdrop.classList.toggle('activo', !!sheet);
  sheetFicha.classList.toggle('abierto', abrirF);
  sheetForm.classList.toggle('abierto', abrirO);

  if (destino === 'mapa' && mapaLeaflet) {
    setTimeout(()=> mapaLeaflet.invalidateSize(), 200);
  }
}

// estado inicial en el historial
history.replaceState({view:'inicio', sheet:null}, '');

// el botón/gesto "atrás" del celular dispara esto en vez de salir de la página
window.addEventListener('popstate', (e)=>{
  const st = e.state || {view:'inicio', sheet:null};
  aplicarEstado(st.view, st.sheet);
});

// ===== TOAST =====
function mostrarToast(msg){
  toast.textContent = msg;
  toast.classList.add('activo');
  setTimeout(()=> toast.classList.remove('activo'), 2200);
}

// ===== ABRIR / CERRAR SHEETS (empujan y sacan del historial) =====
function abrirSheetNav(nombre){
  history.pushState({view: vistaActual, sheet: nombre}, '');
  aplicarEstado(vistaActual, nombre);
}
function cerrarSheets(){
  if (sheetActual) history.back(); // dispara popstate -> aplicarEstado cierra la hoja
}
backdrop.addEventListener('click', cerrarSheets);
document.querySelectorAll('[data-cerrar]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); cerrarSheets(); });
});

// ===== FICHA DE DETALLE (calcada de _mostrarDetalle) =====
document.querySelectorAll('[data-reporte]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    if (e.target.closest('[data-adoptar]')) return; // el botón adoptar maneja su propio click
    abrirFicha(el.dataset.reporte);
  });
});

function abrirFicha(id){
  const r = reportes[id];
  if (!r) return;
  document.getElementById('fichaFoto').textContent = r.foto;
  document.getElementById('fichaTitulo').textContent = r.titulo;
  document.getElementById('fichaMeta').textContent = `📍 ${r.comuna} · 👤 Anónimo`;
  document.getElementById('fichaDesc').textContent = r.desc;

  const badge = document.getElementById('fichaBadge');
  badge.textContent = textosEstado[r.estado];
  badge.style.background = coloresEstado[r.estado] + '20';
  badge.style.color = coloresEstado[r.estado];

  const botones = document.getElementById('fichaBotones');
  botones.innerHTML = '';
  if (r.estado === 'adopcion') {
    botones.innerHTML = `<div class="btn-sheet" style="background:var(--verde);" onclick="mostrarToast('🤍 Se abriría WhatsApp para coordinar la adopción')">❤️ Quiero adoptarle</div>`;
  } else {
    botones.innerHTML = `
      <div class="btn-sheet" style="background:#25d366;" onclick="mostrarToast('💬 Se abriría WhatsApp del rescatista')">💬 WhatsApp</div>
      <div class="btn-sheet" style="background:#4285f4;" onclick="mostrarToast('🗺️ Se abriría Google Maps')">🧭 Cómo llegar</div>`;
  }
  abrirSheetNav('ficha');
}

// ===== BOTÓN ADOPTAR DIRECTO =====
document.querySelectorAll('[data-adoptar]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    mostrarToast(`🤍 Nos contactaremos contigo para adoptar a ${btn.dataset.adoptar}`);
  });
});

// ===== FORMULARIO REPORTAR (calcado de FormReporte) =====
document.querySelectorAll('[data-accion="reportar"]').forEach(el=>{
  el.addEventListener('click', ()=> abrirSheetNav('form'));
});
document.getElementById('btnPublicar').addEventListener('click', ()=>{
  mostrarToast('🎉 Reporte publicado (simulado)');
  cerrarSheets();
});

// ===== MAPA REAL (Leaflet + OpenStreetMap) =====
let mapaLeaflet = null;
let marcadoresMapa = []; // [{marker, estado}]

function iniciarMapa(){
  const contenedor = document.getElementById('mapaLeaflet');
  if (!contenedor || typeof L === 'undefined') return;

  mapaLeaflet = L.map(contenedor, { zoomControl:false, attributionControl:false })
    .setView([-33.445, -70.630], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(mapaLeaflet);

  L.control.zoom({ position:'bottomright' }).addTo(mapaLeaflet);

  Object.entries(reportes).forEach(([id, r])=>{
    const icono = L.divIcon({
      className:'',
      html:`<div class="pin-leaflet" style="background:${coloresEstado[r.estado]};">${emojiEstado[r.estado]}</div>`,
      iconSize:[26,26],
      iconAnchor:[13,13],
    });
    const marker = L.marker([r.lat, r.lng], { icon: icono }).addTo(mapaLeaflet);
    marker.on('click', ()=> abrirFicha(id));
    marcadoresMapa.push({ marker, estado: r.estado });
  });
}
iniciarMapa();

// ===== FILTROS DEL MAPA =====
function aplicarFiltroMapa(filtro){
  document.querySelectorAll('.filtro-pill').forEach(p=>p.classList.toggle('on', p.dataset.filtro===filtro));

  marcadoresMapa.forEach(({marker, estado})=>{
    const mostrar = (filtro==='todo' || estado===filtro);
    if (mostrar && mapaLeaflet && !mapaLeaflet.hasLayer(marker)) marker.addTo(mapaLeaflet);
    if (!mostrar && mapaLeaflet && mapaLeaflet.hasLayer(marker)) mapaLeaflet.removeLayer(marker);
  });

  document.querySelectorAll('[data-estado-item]').forEach(item=>{
    item.style.display = (filtro==='todo' || item.dataset.estadoItem===filtro) ? 'flex' : 'none';
  });
}
document.querySelectorAll('.filtro-pill').forEach(pill=>{
  pill.addEventListener('click', ()=> aplicarFiltroMapa(pill.dataset.filtro));
});

// ===== CHIPS DE ESTADÍSTICAS (Inicio) → mapa filtrado o lista de adopción =====
document.querySelectorAll('[data-stat-goto]').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    const destino = chip.dataset.statGoto;
    navegarA(destino);
    if (chip.dataset.statFiltro) aplicarFiltroMapa(chip.dataset.statFiltro);
  });
});

// ===== CERRAR SESIÓN =====
document.getElementById('btnSalir').addEventListener('click', ()=>{
  mostrarToast('👋 Sesión cerrada (simulado)');
});