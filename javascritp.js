const taskForm = document.getElementById("taskForm");
const tituloInput = document.getElementById("titulo");
const descripcionInput = document.getElementById("descripcion");
const categoriaInput = document.getElementById("categoria");
const prioridadInput = document.getElementById("prioridad");
const fechaInput = document.getElementById("fecha");
const taskList = document.getElementById("taskList");

const totalTareas = document.getElementById("totalTareas");
const tareasPendientes = document.getElementById("tareasPendientes");
const tareasCompletadas = document.getElementById("tareasCompletadas");

const totalTareasHero = document.getElementById("totalTareasHero");
const pendientesHero = document.getElementById("pendientesHero");
const completadasHero = document.getElementById("completadasHero");
const taskCountBadge = document.getElementById("taskCountBadge");

let tareas = JSON.parse(localStorage.getItem("tareasTaskPlanner")) || [];

function guardarTareas() {
    localStorage.setItem("tareasTaskPlanner", JSON.stringify(tareas));
}

function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha";
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function actualizarResumen() {
    const total = tareas.length;
    const completadas = tareas.filter(tarea => tarea.completada).length;
    const pendientes = total - completadas;

    totalTareas.textContent = total;
    tareasPendientes.textContent = pendientes;
    tareasCompletadas.textContent = completadas;

    totalTareasHero.textContent = total;
    pendientesHero.textContent = pendientes;
    completadasHero.textContent = completadas;

    taskCountBadge.textContent = `${total} tarea(s)`;
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
      <button class="action-btn btn-delete" onclick="eliminarTarea(${index})">
        🗑️ Eliminar
      </button>
    </div>
  `;

    return article;
}

function renderizarTareas() {
    taskList.innerHTML = "";

    if (tareas.length === 0) {
        taskList.innerHTML = `
      <div class="empty-state">
        <h3>No hay tareas registradas todavía</h3>
        <p>Agrega una nueva tarea desde el formulario para comenzar a organizar tus actividades.</p>
      </div>
    `;
        actualizarResumen();
        return;
    }

    tareas.forEach((tarea, index) => {
        const tarjeta = crearTarjetaTarea(tarea, index);
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

    tareas.unshift(nuevaTarea);
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

renderizarTareas();
