const materias = [
  {
    nombre: "Inglés Elemental I",
    cr: 6,
    semestre: 1,
    prerrequisitos: []
  },
  {
    nombre: "Inglés Elemental II",
    cr: 6,
    semestre: 2,
    prerrequisitos: ["Inglés Elemental I"]
  },
  {
    nombre: "Inglés Intermedio I",
    cr: 6,
    semestre: 3,
    prerrequisitos: ["Inglés Elemental I", "Inglés Elemental II"]
  },
  {
    nombre: "Lengua Española Básica I",
    cr: 3,
    semestre: 1,
    prerrequisitos: []
  },
  {
    nombre: "Lengua Española Básica II",
    cr: 3,
    semestre: 2,
    prerrequisitos: ["Lengua Española Básica I"]
  },
  {
    nombre: "Lengua Española III",
    cr: 3,
    semestre: 3,
    prerrequisitos: ["Lengua Española Básica II"]
  },
  // Puedes seguir agregando materias aquí...
];

const estados = JSON.parse(localStorage.getItem("estados")) || {};

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  const semestres = [...new Set(materias.map(m => m.semestre))];
  const total = materias.length;
  let completadas = 0;

  document.getElementById("total-count").textContent = total;

  semestres.forEach(n => {
    const div = document.createElement("div");
    div.className = "semestre";
    div.innerHTML = `<h2>Semestre ${n}</h2>`;
    materias.filter(m => m.semestre === n).forEach(m => {
      const estado = estados[m.nombre] || "por-dar";
      if (estado === "completada") completadas++;
      const bloqueada = m.prerrequisitos.length > 0 && !m.prerrequisitos.every(p => estados[p] === "completada");
      const card = document.createElement("div");
      card.className = `materia ${estado} ${bloqueada ? "bloqueada" : ""}`;
      card.textContent = `${m.nombre} (${m.cr} CR)`;
      card.onclick = () => {
        if (bloqueada) return;
        const next = estado === "por-dar" ? "en-curso" : estado === "en-curso" ? "completada" : "por-dar";
        estados[m.nombre] = next;
        localStorage.setItem("estados", JSON.stringify(estados));
        renderMalla();
      };
      if (bloqueada) {
        const tip = document.createElement("div");
        tip.className = "tooltip";
        tip.textContent = `Requiere: ${m.prerrequisitos.join(", ")}`;
        card.appendChild(tip);
      }
      div.appendChild(card);
    });
    container.appendChild(div);
  });

  document.getElementById("completed-count").textContent = completadas;
  document.getElementById("pga-value").textContent = (4.0 * (completadas / total)).toFixed(2);
}

document.getElementById("searchBox").addEventListener("input", function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll(".materia").forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? "block" : "none";
  });
});

renderMalla();
