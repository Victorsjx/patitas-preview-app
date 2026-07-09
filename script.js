// ===== DATOS DE EJEMPLO (basados en main.dart) =====
const reportes = {
  gatito:  { titulo:"Gatito atrapado en árbol", comuna:"Providencia", estado:"Urgente", foto:"🐱", desc:"Gato joven no puede bajar desde hace 24 horas. Esquina Condell con Marín, frente a la plaza." },
  colonia: { titulo:"Colonia de gatos sin esterilizar", comuna:"Ñuñoa", estado:"Atención", foto:"🐈", desc:"Colonia de 9 gatos en plaza Ñuñoa. Voluntaria los alimenta pero urge campaña de esterilización." },
  perrita: { titulo:"Perrita atropellada Alameda", comuna:"Santiago Centro", estado:"Urgente", foto:"🐕", desc:"Perrita mediana atropellada frente al Metro Baquedano. Necesita traslado urgente." },
  senior:  { titulo:"Perro senior en la calle", comuna:"Las Condes", estado:"Atención", foto:"🐕‍🦺", desc:"Perro de raza grande, viejo y desdentado, deambula por Av. Apoquindo." },
  luna:    { titulo:"Luna busca familia", comuna:"Ñuñoa", estado:"adopcion", foto:"🐶", desc:"Perrita mestiza de 7 meses, esterilizada, vacunas al día, muy dócil y juguetona." },
  simon:   { titulo:"Simón — labrador 3 años", comuna:"Providencia", estado:"adopcion", foto:"🐕", desc:"Labrador amarillo castrado, sociable con personas y otros perros." },
  mishi:   { titulo:"Mishi — gata adulta esterilizada", comuna:"Santiago Centro", estado:"adopcion", foto:"🐱", desc:"Gata blanca con manchas negras, 4 años, esterilizada e independiente." },
  conejos: { titulo:"Dos conejitos mini lop", comuna:"La Florida", estado:"adopcion", foto:"🐰", desc:"Pareja de conejos mini lop, 6 meses. Se entregan con jaula y accesorios." },
};

const coloresEstado = { Urgente:"#e53e3e", "Atención":"#d69e2e", adopcion:"#2d5a3d" };
const textosEstado  = { Urgente:"Urgente", "Atención":"Atención", adopcion:"adopcion" };

const backdrop   = document.getElementById('backdrop');
const sheetFicha = document.getElementById('sheetFicha');
const sheetForm  = document.getElementById('sheetForm');
const toast      = document.getElementById('toastMini');

// ===== NAVEGACIÓN INFERIOR =====
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> irAVista(btn.dataset.nav));
});
document.querySelectorAll('[data-goto]').forEach(el=>{
  el.addEventListener('click', ()=> irAVista(el.dataset.goto));
});
function irAVista(destino){
  document.querySelectorAll('.vista').forEach(v=>v.classList.toggle('activa', v.dataset.vista===destino));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('activo', b.dataset.nav===destino));
}

// ===== TOAST =====
function mostrarToast(msg){
  toast.textContent = msg;
  toast.classList.add('activo');
  setTimeout(()=> toast.classList.remove('activo'), 2200);
}

// ===== BACKDROP =====
function abrirSheet(sheet){
  backdrop.classList.add('activo');
  sheet.classList.add('abierto');
}
function cerrarSheets(){
  backdrop.classList.remove('activo');
  sheetFicha.classList.remove('abierto');
  sheetForm.classList.remove('abierto');
}
backdrop.addEventListener('click', cerrarSheets);

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
  abrirSheet(sheetFicha);
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
  el.addEventListener('click', ()=> abrirSheet(sheetForm));
});
document.getElementById('btnPublicar').addEventListener('click', ()=>{
  cerrarSheets();
  mostrarToast('🎉 Reporte publicado (simulado)');
});

// ===== FILTROS DEL MAPA =====
document.querySelectorAll('.filtro-pill').forEach(pill=>{
  pill.addEventListener('click', ()=>{
    document.querySelectorAll('.filtro-pill').forEach(p=>p.classList.remove('on'));
    pill.classList.add('on');
    const filtro = pill.dataset.filtro;

    document.querySelectorAll('.pin-mapa').forEach(pin=>{
      pin.style.display = (filtro==='todo' || pin.dataset.estado===filtro) ? 'flex' : 'none';
    });
    document.querySelectorAll('[data-estado-item]').forEach(item=>{
      item.style.display = (filtro==='todo' || item.dataset.estadoItem===filtro) ? 'flex' : 'none';
    });
  });
});

// ===== CERRAR SESIÓN =====
document.getElementById('btnSalir').addEventListener('click', ()=>{
  mostrarToast('👋 Sesión cerrada (simulado)');
});