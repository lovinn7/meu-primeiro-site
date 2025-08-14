// Script para renderizar o histórico de compras a partir do carrinho armazenado no localStorage
// Função para renderizar o histórico de compras a partir do carrinho
function renderizarHistoricoCarrinho() {
  const historicoDiv = document.getElementById("historico-dinamico");
  historicoDiv.innerHTML = "";

  // Pega o carrinho do localStorage
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

  // Filtra para remover copo PLA e garrafa reutilizável
  const carrinhoFiltrado = carrinho; // Mostra todos os itens do carrinho

  if (carrinhoFiltrado.length === 0) {
    historicoDiv.innerHTML =
      '<p style="text-align:center;">Nenhum item no histórico de compras.</p>';
    return;
  }

  carrinhoFiltrado.forEach((item, index) => {
    const total = (item.preco * (item.quantidade || item.qtd || 1))
      .toFixed(2)
      .replace(".", ",");
    // Defina a página de detalhes do produto (modifique conforme necessário)
    // Exemplo: item.pagina = "bolsas.html" ou "garrafas.html" ou "acessorios.html"
    const pagina = item.pagina || "index.html";

    const pedidoHTML = `
      <div class="pedido-card">
        <div class="pedido-header">
          <div>Pedido #${10000 + index}</div>
          <div>Data: ${new Date().toLocaleDateString()}</div>
          <div class="pedido-status entregue">Entregue</div>
        </div>
        <div class="pedido-body">
          <div class="produto-info">
            <img src="${item.imagem || "imagem/Logo1.jpeg"}" alt="${item.nome}">
            <div class="produto-descricao">
              <h4>${item.nome}</h4>
              <p>Preço unitário: R$ ${(item.preco || 0)
                .toFixed(2)
                .replace(".", ",")}</p>
              <p>Quantidade: ${item.quantidade || item.qtd || 1}</p>
              <p>Total: R$ ${total}</p>
            </div>
          </div>
          <div class="acoes">
            <button class="btn-bio btn-detalhes" data-pagina="${pagina}">Ver Detalhes</button>
            <button class="btn-bio btn-comprar-novamente" data-nome="${encodeURIComponent(
              item.nome
            )}">Comprar Novamente</button>
          </div>
        </div>
      </div>
    `;
    historicoDiv.innerHTML += pedidoHTML;
  });

  // Adiciona eventos aos botões após renderizar
  document.querySelectorAll(".btn-comprar-novamente").forEach((btn) => {
    btn.addEventListener("click", function () {
      const nome = decodeURIComponent(this.getAttribute("data-nome"));
      let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      let itemCarrinho = carrinho.find((p) => p.nome === nome);
      if (itemCarrinho) {
        itemCarrinho.quantidade =
          (itemCarrinho.quantidade || itemCarrinho.qtd || 1) + 1;
        // Se usar qtd, mantenha ambos atualizados
        itemCarrinho.qtd = itemCarrinho.quantidade;
      } else {
        // Se não existir, adicione um novo (você pode adaptar para copiar outros campos)
        carrinho.push({ nome, quantidade: 1 });
      }
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      showToast("Mais um item adicionado ao carrinho!");
    });
  });

  document.querySelectorAll(".btn-detalhes").forEach((btn) => {
    btn.addEventListener("click", function () {
      const pagina = this.getAttribute("data-pagina");
      window.location.href = pagina;
    });
  });
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.style.display = "none";
    }, 400);
  }, 1800);
}

document.addEventListener("DOMContentLoaded", renderizarHistoricoCarrinho);
