document.addEventListener("DOMContentLoaded", function () {
  function renderCarrinho() {
    const carrinhoDiv = document.getElementById("carrinho-itens-js");
    const subtotalSpan = document.getElementById("subtotal-carrinho");
    const totalSpan = document.getElementById("total-carrinho");
    const qtdItensSpan = document.getElementById("qtd-itens");
    if (!carrinhoDiv || !subtotalSpan || !totalSpan || !qtdItensSpan) return; // <-- Adicione esta linha

    let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinhoDiv.innerHTML = "";
    let subtotal = 0;
    let totalQtd = 0;

    if (carrinho.length === 0) {
      carrinhoDiv.innerHTML = `
        <div style="text-align:center;color:#888;padding:40px 0;">
          <i class="fa fa-shopping-cart" style="font-size:48px;"></i>
          <div>Seu carrinho está vazio.</div>
        </div>
      `;
      subtotalSpan.textContent = "R$ 0,00";
      totalSpan.textContent = "R$ 0,00";
      qtdItensSpan.textContent = "0";
      return;
    }

    carrinho.forEach((item, idx) => {
      subtotal += item.preco * item.qtd;
      totalQtd += item.qtd;
      carrinhoDiv.innerHTML += `
        <div class="carrinho-item" style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <img src="${item.imagem || "imagem/Logo1.jpeg"}" alt="${
        item.nome
      }" style="width:60px;height:60px;object-fit:contain;">
          <div style="flex:1;">
            <div style="font-weight:bold;">${item.nome}</div>
            <div>Qtd: 
              <button onclick="alterarQtd(${idx}, -1)" style="width:24px;">-</button>
              <span style="margin:0 8px;">${item.qtd}</span>
              <button onclick="alterarQtd(${idx}, 1)" style="width:24px;">+</button>
            </div>
            <div>Preço unitário: R$ ${(item.preco || 0)
              .toFixed(2)
              .replace(".", ",")}</div>
            <div>Total: R$ ${(item.preco * item.qtd)
              .toFixed(2)
              .replace(".", ",")}</div>
            <button onclick="removerItemCarrinho(${idx})" style="color:#e53935;background:none;border:none;cursor:pointer;">Remover</button>
          </div>
        </div>
      `;
    });

    subtotalSpan.textContent = "R$ " + subtotal.toFixed(2).replace(".", ",");
    totalSpan.textContent = "R$ " + subtotal.toFixed(2).replace(".", ",");
    qtdItensSpan.textContent = totalQtd;
  }

  // Funções globais para alterar/remover itens
  window.removerItemCarrinho = function (idx) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    carrinho.splice(idx, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
  };

  window.alterarQtd = function (idx, delta) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    if (!carrinho[idx]) return;
    carrinho[idx].qtd += delta;
    if (carrinho[idx].qtd < 1) carrinho[idx].qtd = 1;
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderCarrinho();
  };

  renderCarrinho();
});

document.addEventListener("DOMContentLoaded", function () {
  // Defina os preços dos produtos
  const precosProdutos = {
    // Acessórios
    Organizador: 24.9,
    "Porta Copos": 12.9,
    Chaveiro: 7.9,
    // Garrafas
    "Garrafa Reutilizavel": 99.9,
    "Garrafa Bio": 49.9,
    "Garrafa PLA": 59.9,
    // Copos
    "Copo PLA": 9.9,
    "Copo de Papel": 7.9,
    "Copo Bio": 8.9,
    // Embalagens
    Bandejas: 99.9,
    Cone: 49.9,
    Potes: 49.9,
    Talheres: 49.9,
    Marmitas: 49.9,
    // Bolsas
    EcoBag: 29.9,
    "Bolsa de Papel": 19.9,
    "Sacola para Lixo": 14.9,
    // Adicione outros produtos conforme necessário
  };

  // Função para atualizar o contador do carrinho
  function atualizarContadorCarrinho() {
    const contador = document.getElementById("contador-carrinho");
    let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    let total = carrinho.reduce((sum, item) => sum + (item.qtd || 1), 0);
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  }

  // Função para tocar som ao adicionar ao carrinho (opcional)
  function tocarSomCarrinho() {
    const audio = new Audio("imagem/som-carrinho.mp3");
    audio.play();
  }

  // Lógica do botão COMPRAR
  document.querySelectorAll(".btn-comprar").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Checa se o usuário está logado
      if (localStorage.getItem("userLogado") !== "true") {
        // Abre o modal de login
        const authToggle = document.getElementById("auth-modal-toggle");
        if (authToggle) {
          authToggle.checked = true;
        }
        // Opcional: mostra um aviso
        const toast = document.getElementById("toast-notification");
        if (toast) {
          toast.textContent = "Faça login para comprar!";
          toast.classList.add("show");
          toast.classList.remove("hide");
          setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => {
              toast.classList.remove("show");
              toast.style.display = "none";
            }, 400);
          }, 2200);
          toast.style.display = "block";
        }
        e.preventDefault();
        return;
      }

      e.preventDefault();

      const card = btn.closest(".cards");
      const nome = card.querySelector("h1").textContent.trim();
      const preco = precosProdutos[nome] || 0;
      const imagem = card.querySelector("img").src;

      // O restante do código permanece igual
      let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      let item = carrinho.find((p) => p.nome === nome);
      if (item) {
        item.qtd = (item.qtd || 1) + 1;
      } else {
        const pagina = window.location.pathname.split("/").pop();
        carrinho.push({
          nome,
          preco,
          qtd: 1,
          imagem,
          pagina,
        });
      }
      localStorage.setItem("carrinho", JSON.stringify(carrinho));

      atualizarContadorCarrinho();
      tocarSomCarrinho();

      const toast = document.getElementById("toast-notification");
      if (toast) {
        toast.textContent = `"${nome}" adicionado ao carrinho!`;
        toast.classList.add("show");
        toast.classList.remove("hide");
        setTimeout(() => {
          toast.classList.add("hide");
          setTimeout(() => {
            toast.classList.remove("show");
            toast.style.display = "none";
          }, 400);
        }, 2200);
        toast.style.display = "block";
      }
    });
  });

  // Atualiza contador ao carregar a página
  atualizarContadorCarrinho();
});
document.addEventListener("DOMContentLoaded", renderResumoPagamento);

function renderResumoPagamento() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  let subtotal = 0;
  let totalQtd = 0;

  carrinho.forEach((item) => {
    subtotal += item.preco * (item.qtd || 1);
    totalQtd += item.qtd || 1;
  });

  // Recupera cupom do localStorage
  const cupom = localStorage.getItem("cupomAplicado");
  let frete = Number(localStorage.getItem("freteCalculado"));
  if (isNaN(frete)) frete = 29.9; // valor padrão

  let freteTexto = `R$ ${frete.toFixed(2).replace(".", ",")}`;

  // Só dá frete grátis se cupom for aplicado E subtotal >= 500
  if (cupom === "FG500" && subtotal >= 500) {
    frete = 0;
    freteTexto = "Grátis";
  }

  let descontos = 0;
  let total = subtotal + frete - descontos;

  const qtdItensPag = document.getElementById("qtd-itens-pag");
  const subtotalPag = document.getElementById("subtotal-pag");
  const fretePag = document.getElementById("frete-pag");
  const descontosPag = document.getElementById("descontos-pag");
  const totalPag = document.getElementById("total-pag");
  if (!qtdItensPag || !subtotalPag || !fretePag || !descontosPag || !totalPag)
    return; // <-- Adicione esta linha

  qtdItensPag.textContent = `Subtotal (${totalQtd} itens)`;
  subtotalPag.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  fretePag.textContent = freteTexto;
  descontosPag.textContent = `R$ ${descontos.toFixed(2).replace(".", ",")}`;
  totalPag.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Função central para calcular o resumo do carrinho
function calcularResumoCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  let subtotal = 0;
  let totalQtd = 0;
  carrinho.forEach((item) => {
    subtotal += item.preco * (item.qtd || 1);
    totalQtd += item.qtd || 1;
  });

  let cupom = localStorage.getItem("cupomAplicado");
  let freteCalculado = localStorage.getItem("freteCalculado");
  let frete = null;

  // Só mostra frete se já foi calculado
  if (freteCalculado !== null && freteCalculado !== undefined) {
    frete = Number(freteCalculado);
    // Só aplica frete grátis se cupom válido E subtotal >= 500
    if (cupom === "FG500" && subtotal >= 500) frete = 0;
  }

  // Remove cupom se subtotal < 500
  if (cupom === "FG500" && subtotal < 500) {
    localStorage.removeItem("cupomAplicado");
    cupom = null;
    // Volta o frete ao valor calculado
    if (freteCalculado !== null && freteCalculado !== undefined) {
      frete = Number(freteCalculado);
    }
  }

  let descontos = 0;
  let total = subtotal + (frete !== null ? frete : 0) - descontos;

  return {
    subtotal,
    totalQtd,
    frete,
    descontos,
    total,
    freteTexto:
      frete === null
        ? "-"
        : frete === 0
        ? "Grátis"
        : `R$ ${frete.toFixed(2).replace(".", ",")}`,
  };
}

// Função para atualizar o resumo do carrinho na página do carrinho
function atualizarResumoCarrinho() {
  const resumo = calcularResumoCarrinho();
  if (document.getElementById("subtotal-carrinho"))
    document.getElementById("subtotal-carrinho").textContent =
      "R$ " + resumo.subtotal.toFixed(2).replace(".", ",");
  if (document.getElementById("total-carrinho"))
    document.getElementById("total-carrinho").textContent =
      "R$ " + resumo.total.toFixed(2).replace(".", ",");
  if (document.getElementById("qtd-itens"))
    document.getElementById("qtd-itens").textContent = resumo.totalQtd;
  if (document.getElementById("frete-carrinho"))
    document.getElementById("frete-carrinho").textContent = resumo.freteTexto;
  if (document.getElementById("desconto-carrinho"))
    document.getElementById("desconto-carrinho").textContent =
      "R$ " + resumo.descontos.toFixed(2).replace(".", ",");

  // Exibe ou esconde o botão remover cupom
  const removerCupomBtn = document.getElementById("remover-cupom");
  if (removerCupomBtn) {
    if (localStorage.getItem("cupomAplicado") === "FG500") {
      removerCupomBtn.style.display = "inline-block";
    } else {
      removerCupomBtn.style.display = "none";
    }
  }
}

function atualizarResumoPagamento() {
  const resumo = calcularResumoCarrinho();
  if (document.getElementById("qtd-itens-pag"))
    document.getElementById(
      "qtd-itens-pag"
    ).textContent = `Subtotal (${resumo.totalQtd} itens)`;
  if (document.getElementById("subtotal-pag"))
    document.getElementById("subtotal-pag").textContent = `R$ ${resumo.subtotal
      .toFixed(2)
      .replace(".", ",")}`;
  if (document.getElementById("frete-pag"))
    document.getElementById("frete-pag").textContent = resumo.freteTexto;
  if (document.getElementById("descontos-pag"))
    document.getElementById(
      "descontos-pag"
    ).textContent = `R$ ${resumo.descontos.toFixed(2).replace(".", ",")}`;
  if (document.getElementById("total-pag"))
    document.getElementById("total-pag").textContent = `R$ ${resumo.total
      .toFixed(2)
      .replace(".", ",")}`;

  // Exibe ou esconde o botão remover cupom (caso também tenha na tela de pagamento)
  const removerCupomBtn = document.getElementById("remover-cupom");
  if (removerCupomBtn) {
    if (localStorage.getItem("cupomAplicado") === "FG500") {
      removerCupomBtn.style.display = "inline-block";
    } else {
      removerCupomBtn.style.display = "none";
    }
  }
}

// Atualiza automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  atualizarResumoCarrinho();
  atualizarResumoPagamento();
});

function aplicarCupomFG500() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  let subtotal = 0;
  carrinho.forEach((item) => {
    subtotal += item.preco * (item.qtd || 1);
  });

  if (subtotal >= 500) {
    localStorage.setItem("cupomAplicado", "FG500");
    // Atualize o resumo
    atualizarResumoCarrinho();
    atualizarResumoPagamento();
    return true;
  } else {
    // Remove cupom se não atingir o valor
    localStorage.removeItem("cupomAplicado");
    atualizarResumoCarrinho();
    atualizarResumoPagamento();
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const aplicarCupomBtn = document.getElementById("aplicar-cupom");
  const campoCupom = document.getElementById("campo-cupom");
  const cupomMsg = document.getElementById("cupom-msg");

  if (aplicarCupomBtn) {
    aplicarCupomBtn.addEventListener("click", function () {
      const valor = campoCupom.value.trim();
      const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      let subtotal = 0;
      carrinho.forEach((item) => {
        subtotal += item.preco * (item.qtd || 1);
      });

      if (valor === "FG500" && subtotal >= 500) {
        localStorage.setItem("cupomAplicado", "FG500");
        cupomMsg.textContent = "Cupom aplicado: Frete grátis!";
        cupomMsg.style.color = "#009688";
      } else if (valor === "FG500" && subtotal < 500) {
        localStorage.removeItem("cupomAplicado");
        cupomMsg.textContent =
          "Cupom só pode ser usado em compras acima de R$ 500,00";
        cupomMsg.style.color = "#e53935";
      } else {
        localStorage.removeItem("cupomAplicado");
        cupomMsg.textContent = "Cupom inválido";
        cupomMsg.style.color = "#e53935";
      }
      atualizarResumoCarrinho();
      atualizarResumoPagamento();
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const calcularFreteBtn = document.getElementById("calcular-frete");
  const campoCep = document.getElementById("campo-cep");
  const cepMsg = document.getElementById("cep-msg");

  if (calcularFreteBtn) {
    calcularFreteBtn.addEventListener("click", function () {
      const cep = campoCep.value.replace(/\D/g, "");
      cepMsg.textContent = "";
      if (cep.length !== 8) {
        cepMsg.textContent = "CEP inválido";
        cepMsg.style.color = "#e53935";
        localStorage.removeItem("freteCalculado");
        atualizarResumoCarrinho();
        atualizarResumoPagamento();
        return;
      }

      // Exemplo de cálculo de frete por prefixo de CEP
      let valorFrete = 29.9; // valor padrão
      if (/^0[1-9]/.test(cep)) {
        valorFrete = 15.0; // Norte/Nordeste (exemplo)
      } else if (/^1[0-9]/.test(cep)) {
        valorFrete = 18.0; // Sudeste (exemplo)
      } else if (/^2[0-9]/.test(cep)) {
        valorFrete = 20.0; // Sul (exemplo)
      } else if (/^3[0-9]/.test(cep)) {
        valorFrete = 25.0; // Centro-Oeste (exemplo)
      }
      // Você pode ajustar as faixas e valores conforme sua necessidade

      localStorage.setItem("freteCalculado", valorFrete);
      cepMsg.textContent = `Frete para seu CEP: R$ ${valorFrete
        .toFixed(2)
        .replace(".", ",")}`;
      cepMsg.style.color = "#009688";
      atualizarResumoCarrinho();
      atualizarResumoPagamento();
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const removerCupomBtn = document.getElementById("remover-cupom");
  if (removerCupomBtn) {
    if (localStorage.getItem("cupomAplicado") === "FG500") {
      removerCupomBtn.style.display = "inline-block";
    } else {
      removerCupomBtn.style.display = "none";
    }
    removerCupomBtn.addEventListener("click", function () {
      localStorage.removeItem("cupomAplicado");
      // Atualiza o resumo para voltar o frete ao normal
      atualizarResumoCarrinho();
      atualizarResumoPagamento();
      // Esconde o botão após remover
      removerCupomBtn.style.display = "none";
      // Opcional: mensagem para o usuário
      const cupomMsg = document.getElementById("cupom-msg");
      if (cupomMsg) {
        cupomMsg.textContent = "Cupom removido.";
        cupomMsg.style.color = "#e53935";
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const finalizarBtn = document.getElementById("finalizar-compra");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", function (e) {
      // Verifica se o carrinho existe e tem itens
      const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      if (!carrinho || carrinho.length === 0) {
        const toast = document.getElementById("toast-notification");
        if (toast) {
          toast.textContent =
            "Não é possível finalizar: o carrinho está vazio!";
          toast.classList.add("show");
          toast.classList.remove("hide");
          setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => {
              toast.classList.remove("show");
              toast.style.display = "none";
            }, 400);
          }, 2200);
          toast.style.display = "block";
        }
        e.preventDefault();
        return;
      }

      if (localStorage.getItem("userLogado") !== "true") {
        // Abre o modal de login
        const authToggle = document.getElementById("auth-modal-toggle");
        if (authToggle) {
          authToggle.checked = true;
        }
        // Mostra aviso
        const toast = document.getElementById("toast-notification");
        if (toast) {
          toast.textContent = "Faça login para finalizar a compra!";
          toast.classList.add("show");
          toast.classList.remove("hide");
          setTimeout(() => {
            toast.classList.add("hide");
            setTimeout(() => {
              toast.classList.remove("show");
              toast.style.display = "none";
            }, 400);
          }, 2200);
          toast.style.display = "block";
        }
        e.preventDefault();
        return;
      }
      // Usuário logado e carrinho com itens: segue para próxima página
      window.location.href = "identificacao.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const campoCep = document.getElementById("campo-cep");
  if (!campoCep) return;

  const endereco = localStorage.getItem("userEndereco");
  if (endereco) {
    try {
      const obj = JSON.parse(endereco);
      if (obj && obj.cep) {
        campoCep.value = obj.cep;
      }
    } catch (e) {
      campoCep.value = endereco;
    }
    // Chama o cálculo do frete automaticamente após preencher o CEP
    calcularFreteAutomatico();
  }
});

// Função para calcular o frete automaticamente
function calcularFreteAutomatico() {
  const campoCep = document.getElementById("campo-cep");
  const cepMsg = document.getElementById("cep-msg");
  if (!campoCep) return;
  const cep = campoCep.value.replace(/\D/g, "");
  cepMsg.textContent = "";
  if (cep.length !== 8) {
    cepMsg.textContent = "CEP inválido";
    cepMsg.style.color = "#e53935";
    localStorage.removeItem("freteCalculado");
    atualizarResumoCarrinho();
    atualizarResumoPagamento();
    return;
  }

  let valorFrete = 29.9; // valor padrão
  if (/^0[1-9]/.test(cep)) {
    valorFrete = 15.0;
  } else if (/^1[0-9]/.test(cep)) {
    valorFrete = 18.0;
  } else if (/^2[0-9]/.test(cep)) {
    valorFrete = 20.0;
  } else if (/^3[0-9]/.test(cep)) {
    valorFrete = 25.0;
  }

  localStorage.setItem("freteCalculado", valorFrete);
  cepMsg.textContent = `Frete para seu CEP: R$ ${valorFrete
    .toFixed(2)
    .replace(".", ",")}`;
  cepMsg.style.color = "#009688";
  atualizarResumoCarrinho();
  atualizarResumoPagamento();
}

document.addEventListener("DOMContentLoaded", function () {
  const limparFreteBtn = document.getElementById("limpar-frete");
  const campoCep = document.getElementById("campo-cep");
  const cepMsg = document.getElementById("cep-msg");

  if (limparFreteBtn) {
    limparFreteBtn.addEventListener("click", function () {
      localStorage.removeItem("freteCalculado");
      if (campoCep) campoCep.value = "";
      if (cepMsg) cepMsg.textContent = "";
      atualizarResumoCarrinho();
      atualizarResumoPagamento();
    });
  }
});
