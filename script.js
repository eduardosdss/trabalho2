const form = document.getElementById('form-filme');
const lista = document.getElementById('lista-filmes');
const filtroGenero = document.getElementById('filtro-genero');
const filtroNota = document.getElementById('filtro-nota');

let filmes = JSON.parse(localStorage.getItem('filmes')) || [];

form.addEventListener('submit', e => {
  e.preventDefault();

  const novoFilme = {
    id: Date.now(),
    nome: document.getElementById('nome').value,
    genero: document.getElementById('genero').value,
    nota: parseFloat(document.getElementById('nota').value),
    status: document.getElementById('status').value,
    favorito: false
  };

  filmes.push(novoFilme);
  salvar();
  form.reset();
});

function salvar() {
  localStorage.setItem('filmes', JSON.stringify(filmes));
  render();
}

function render() {
  lista.innerHTML = '';

  let filtroG = filtroGenero.value;
  let filtroN = parseFloat(filtroNota.value) || 0;

  let filtrados = filmes.filter(f =>
    (!filtroG || f.genero === filtroG) &&
    (f.nota >= filtroN)
  );

  for (let filme of filtrados) {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title ${filme.favorito ? 'favorito' : ''}">
            ${filme.nome}
            <button class="btn btn-sm btn-warning float-end" onclick="toggleFavorito(${filme.id})">
              ⭐
            </button>
          </h5>
          <p class="card-text">
            Gênero: ${filme.genero} <br>
            Nota: ${filme.nota} <br>
            Status: ${filme.status}
          </p>
        </div>
      </div>
    `;
    lista.appendChild(card);
  }
}

function toggleFavorito(id) {
  const index = filmes.findIndex(f => f.id === id);
  if (index !== -1) {
    filmes[index].favorito = !filmes[index].favorito;
    salvar();
  }
}

// Filtros
filtroGenero.addEventListener('change', render);
filtroNota.addEventListener('input', render);

// Inicializa
render();
function render() {
  lista.innerHTML = '';

  let filtroG = filtroGenero.value;
  let filtroN = parseFloat(filtroNota.value) || 0;

  let filtrados = filmes.filter(f =>
    (!filtroG || f.genero === filtroG) &&
    (f.nota >= filtroN)
  );

  for (let filme of filtrados) {
    const card = document.createElement('div');
    card.className = 'col-md-4';

    const isNovo = filmes.indexOf(filme) === filmes.length - 1;
    const favoritoClass = filme.favorito ? 'favorito animate__animated animate__heartBeat' : '';

    card.innerHTML = `
      <div class="card" data-aos="fade-up" data-aos-duration="600">
        <div class="card-body">
          <h5 class="card-title ${favoritoClass}">
            ${filme.nome}
            <button class="btn btn-sm btn-warning float-end" onclick="toggleFavorito(${filme.id})">
              ⭐
            </button>
          </h5>
          <p class="card-text">
            Gênero: ${filme.genero} <br>
            Nota: ${filme.nota} <br>
            Status: ${filme.status}
          </p>
        </div>
      </div>
    `;
    lista.appendChild(card);
  }

  // Reinicializa animações do AOS após render
  AOS.refresh();
}
