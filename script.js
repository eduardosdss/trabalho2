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
            Nota: <span id="nota-${filme.id}">${filme.nota}</span> <br>
            Status: ${filme.status}
          </p>
          <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-danger btn-sm" onclick="excluirFilme(${filme.id})">Excluir</button>
            <button class="btn btn-secondary btn-sm" onclick="editarNota(${filme.id})">Editar Nota</button>
          </div>
        </div>
      </div>
    `;
    lista.appendChild(card);
  }

  AOS.refresh(); // Reinicia as animações AOS
}

function toggleFavorito(id) {
  const index = filmes.findIndex(f => f.id === id);
  if (index !== -1) {
    filmes[index].favorito = !filmes[index].favorito;
    salvar();
  }
}

function excluirFilme(id) {
  if (confirm('Tem certeza que deseja excluir este item?')) {
    filmes = filmes.filter(f => f.id !== id);
    salvar();
  }
}

function editarNota(id) {
  const novaNota = prompt('Digite a nova nota (0-10):');
  const notaNum = parseFloat(novaNota);

  if (!isNaN(notaNum) && notaNum >= 0 && notaNum <= 10) {
    const filme = filmes.find(f => f.id === id);
    if (filme) {
      filme.nota = notaNum;
      salvar();
    }
  } else {
    alert('Por favor, insira uma nota válida entre 0 e 10.');
  }
}

// Filtros
filtroGenero.addEventListener('change', render);
filtroNota.addEventListener('input', render);

// Inicializa
render();
