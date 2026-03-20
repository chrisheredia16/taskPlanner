const taskForm = document.getElementById("taskForm");
const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const categoriaInput = document.getElementById("categoria");
const prioridadInput = document.getElementById("prioridad");
const fechaInput = document.getElementById("fecha");
const editIndexInput = document.getElementById("editIndex");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const formModeBadge = document.getElementById("formModeBadge");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");

const taskList = document.getElementById("taskList");
const totalTareas = document.getElementById("totalTareas");
const tareasPendientes = document.getElementById("tareasPendientes");
const tareasCompletadas = document.getElementById("tareasCompletadas");
const totalTareasHero = document.getElementById("totalTareasHero");
const pendientesHero = document.getElementById("pendientesHero");
const completadasHero = document.getElementById("completadasHero");
const taskCountBadge = document.getElementById("taskCountBadge");

const progressPercentage = document.getElementById("progressPercentage");
const progressBarFill = document.getElementById("progressBarFill");
const progressText = document.getElementById("progressText");
const progressCircle = document.getElementById("progressCircle");
const progressCircleText = document.getElementById("progressCircleText");

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

let tareas = JSON.parse(localStorage.getItem("tareasTaskPlanner")) || [];

function guardarTareas() {
  localStorage.setItem("tareasTaskPlanner", JSON.stringify(tareas));
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

function actualizarFechaHora() {
  const ahora = new Date();

  currentDate.textContent = ahora.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  currentTime.textContent = ahora.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function actualizarResumen() {
  const total = tareas.length;
  const completadas = tareas.filter(tarea => tarea.completada).length;
  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  totalTareas.textContent = total;
  tareasPendientes.textContent = pendientes;
  tareasCompletadas.textContent = completadas;

  totalTareasHero.textContent = total;
  pendientesHero.textContent = pendientes;
  completadasHero.textContent = completadas;

  taskCountBadge.textContent = `${total} tarea(s)`;

  progressPercentage.textContent = `${porcentaje}%`;
  progressCircleText.textContent = `${porcentaje}%`;
  progressBarFill.style.width = `${porcentaje}%`;

  progressCircle.style.background = `conic-gradient(#2e8b57 ${porcentaje * 3.6}deg, #e8eef8 0deg)`;

  if (total === 0) {
    progressText.textContent = "Aún no hay tareas registradas para calcular el avance.";
  } else {
    progressText.textContent = `Has completado ${completadas} de ${total} tarea(s). Tu avance general actual es de ${porcentaje}%.`;
  }
}

function crearTarjetaTarea(tarea, index) {
  const article = document.createElement("article");
  article.className = `task-card ${tarea.completada ? "completed" : ""}`;

  article.innerHTML = `
    <div class="task-top">
      <div>
        <h3>${tarea.titulo}</h3>
      </div>
      <span class="task-status ${tarea.completada ? "status-completed" : "status-pending"}">
        ${tarea.completada ? "Completada" : "Pendiente"}
      </span>
    </div>

    <p class="task-description">${tarea.descripcion}</p>

    <div class="task-meta">
      <div class="meta-box">
        <span>Categoría</span>
        <strong>${tarea.categoria}</strong>
      </div>
      <div class="meta-box">
        <span>Prioridad</span>
        <strong>${tarea.prioridad}</strong>
      </div>
      <div class="meta-box">
        <span>Fecha límite</span>
        <strong>${formatearFecha(tarea.fecha)}</strong>
      </div>
    </div>

    <div class="task-actions">
      <button class="action-btn btn-complete" onclick="completarTarea(${index})">
        ${tarea.completada ? "↩️ Reabrir" : "✅ Completar"}
      </button>
      <button class="action-btn btn-edit" onclick="editarTarea(${index})">
        ✏️ Editar
      </button>
      <button class="action-btn btn-delete" onclick="eliminarTarea(${index})">
        🗑️ Eliminar
      </button>
    </div>
  `;

  return article;
}

function obtenerTareasFiltradas() {
  const texto = searchInput.value.toLowerCase().trim();
  const estado = filterStatus.value;
  const prioridad = filterPriority.value;

  return tareas.filter(tarea => {
    const coincideTexto =
      tarea.titulo.toLowerCase().includes(texto) ||
      tarea.descripcion.toLowerCase().includes(texto);

    const coincideEstado =
      estado === "Todas" ||
      (estado === "Pendiente" && !tarea.completada) ||
      (estado === "Completada" && tarea.completada);

    const coincidePrioridad =
      prioridad === "Todas" || tarea.prioridad === prioridad;

    return coincideTexto && coincideEstado && coincidePrioridad;
  });
}

function renderizarTareas() {
  taskList.innerHTML = "";

  const tareasFiltradas = obtenerTareasFiltradas();

  if (tareasFiltradas.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <h3>No hay tareas para mostrar</h3>
        <p>Prueba agregando tareas nuevas o ajustando los filtros de búsqueda.</p>
      </div>
    `;
    actualizarResumen();
    return;
  }

  tareasFiltradas.forEach(tarea => {
    const indexReal = tareas.indexOf(tarea);
    const tarjeta = crearTarjetaTarea(tarea, indexReal);
    taskList.appendChild(tarjeta);
  });

  actualizarResumen();
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevaTarea = {
    titulo: tituloInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    categoria: categoriaInput.value,
    prioridad: prioridadInput.value,
    fecha: fechaInput.value,
    completada: false
  };

  if (
    nuevaTarea.titulo === "" ||
    nuevaTarea.descripcion === "" ||
    nuevaTarea.categoria === "" ||
    nuevaTarea.prioridad === "" ||
    nuevaTarea.fecha === ""
  ) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const editIndex = editIndexInput.value;

  if (editIndex === "") {
    tareas.unshift(nuevaTarea);
  } else {
    tareas[editIndex] = {
      ...tareas[editIndex],
      ...nuevaTarea,
      completada: tareas[editIndex].completada
    };
    submitBtn.textContent = "+ Agregar tarea";
    formModeBadge.textContent = "Modo creación";
    editIndexInput.value = "";
  }

  guardarTareas();
  renderizarTareas();
  taskForm.reset();
});

function completarTarea(index) {
  tareas[index].completada = !tareas[index].completada;
  guardarTareas();
  renderizarTareas();
}

function eliminarTarea(index) {
  const confirmar = confirm("¿Deseas eliminar esta tarea?");
  if (confirmar) {
    tareas.splice(index, 1);
    guardarTareas();
    renderizarTareas();
  }
}

function editarTarea(index) {
  const tarea = tareas[index];

  tituloInput.value = tarea.titulo;
  descripcionInput.value = tarea.descripcion;
  categoriaInput.value = tarea.categoria;
  prioridadInput.value = tarea.prioridad;
  fechaInput.value = tarea.fecha;
  editIndexInput.value = index;
  submitBtn.textContent = "💾 Guardar cambios";
  formModeBadge.textContent = "Modo edición";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

resetBtn.addEventListener("click", function () {
  editIndexInput.value = "";
  submitBtn.textContent = "+ Agregar tarea";
  formModeBadge.textContent = "Modo creación";
});

searchInput.addEventListener("input", renderizarTareas);
filterStatus.addEventListener("change", renderizarTareas);
filterPriority.addEventListener("change", renderizarTareas);

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);
renderizarTareas();