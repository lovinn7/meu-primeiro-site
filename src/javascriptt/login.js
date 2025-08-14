document.addEventListener("DOMContentLoaded", function () {
  // Toast no topo do modal
  function showToast(msg) {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;
    toast.textContent = msg;
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

  // Avatar menu
  function mostrarUsuario(nome) {
    let navMenu = document.querySelector("nav .menu");
    let loginLi = navMenu.querySelector("li .auth-btn")?.parentElement;
    if (loginLi) loginLi.style.display = "none";
    let avatarLi = document.getElementById("user-avatar");
    if (!avatarLi) {
      avatarLi = document.createElement("li");
      avatarLi.id = "user-avatar";
      avatarLi.style.position = "relative";
      avatarLi.style.display = "flex";
      avatarLi.style.alignItems = "center";
      avatarLi.style.gap = "8px";
      avatarLi.style.cursor = "pointer";
      avatarLi.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
          nome
        )}&background=009688&color=fff&rounded=true&size=32" alt="Avatar" style="border-radius:50%;width:32px;height:32px;">
        <span style="font-weight:bold;">${nome.split(" ")[0]}</span>
        <div id="avatar-menu" style="display:none;position:absolute;top:40px;right:0;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);min-width:180px;z-index:999;">
          <ul style="list-style:none;padding:8px 0;margin:0;">
            <li style="padding:8px 20px; cursor:pointer;" id="menu-historico">Histórico de Compras</li>
            <li style="padding:8px 20px;cursor:pointer;" id="menu-config">Configurações do Usuário</li>
            <li style="padding:8px 20px;cursor:pointer;color:#e53935;" id="menu-logout">Sair</li>
          </ul>
        </div>
      `;
      navMenu.appendChild(avatarLi);

      avatarLi.addEventListener("click", function (e) {
        e.stopPropagation();
        let menu = document.getElementById("avatar-menu");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      });
      document.addEventListener("click", function () {
        let menu = document.getElementById("avatar-menu");
        if (menu) menu.style.display = "none";
      });
      document.getElementById("menu-logout").onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("userLogado", "false");
        localStorage.removeItem("carrinho"); // <- zera o carrinho ao sair
        atualizarContadorCarrinho(); // <- atualiza o ícone do carrinho
        avatarLi.remove();
        if (loginLi) loginLi.style.display = "";
        showToast("Você saiu da conta.");
      };
      const menuHistorico = document.getElementById("menu-historico");
      if (menuHistorico) {
        menuHistorico.onclick = function (e) {
          e.stopPropagation();
          window.location.href = "historico.html";
        };
      }
      const menuConfig = document.getElementById("menu-config");
      if (menuConfig) {
        menuConfig.onclick = function (e) {
          e.stopPropagation();
          window.location.href = "dados.html";
        };
      }
    } else {
      avatarLi.querySelector("span").textContent = nome.split(" ")[0];
      avatarLi.querySelector(
        "img"
      ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nome
      )}&background=009688&color=fff&rounded=true&size=32`;
    }
  }

  // Limpa todos os campos de um form
  function limparCampos(form) {
    if (!form) return;
    form.querySelectorAll("input").forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });
  }

  // Preenche campos de login se lembrar senha estiver ativo
  function preencherLoginSeLembrado() {
    const loginForm = document.querySelector(".auth-form[action-login]");
    if (!loginForm) return;
    const lembrar = localStorage.getItem("lembrarSenha") === "true";
    const email = localStorage.getItem("userEmail") || "";
    const senha = localStorage.getItem("userSenha") || "";
    loginForm.querySelector('input[type="email"]').value = lembrar ? email : "";
    loginForm.querySelector('input[type="password"]').value = lembrar
      ? senha
      : "";
    const checkbox = document.getElementById("lembrar-senha");
    if (checkbox) checkbox.checked = lembrar;
  }

  // Troca de abas: limpa campos do cadastro e login
  function setupTabLimpeza() {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginForm = document.querySelector(".auth-form[action-login]");
    const registerForm = document.querySelector(".auth-form[action-register]");

    if (loginTab && registerTab && loginForm && registerForm) {
      loginTab.addEventListener("change", function () {
        limparCampos(registerForm);
        preencherLoginSeLembrado();
      });
      registerTab.addEventListener("change", function () {
        limparCampos(registerForm);
        limparCampos(loginForm);
      });
    }
  }

  // CPF
  const cpfInput = document.querySelector('input[placeholder="CPF"]');
  if (cpfInput) {
    cpfInput.addEventListener("input", function () {
      let v = cpfInput.value.replace(/\D/g, "");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      cpfInput.value = v;
    });
  }

  // Telefone
  const telInput = document.querySelector('input[placeholder="Telefone/Fixo"]');
  if (telInput) {
    telInput.addEventListener("input", function () {
      let v = telInput.value.replace(/\D/g, "");
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{5})(\d)/, "$1-$2");
      telInput.value = v;
    });
  }

  // Função para verificar login
  function isUserLoggedIn() {
    return (
      localStorage.getItem("userNome") &&
      localStorage.getItem("userEmail") &&
      localStorage.getItem("userSenha")
    );
  }

  // Lógica do botão COMPRAR
  document.querySelectorAll(".btn-comprar").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (isUserLoggedIn()) {
        showToast("Produto adicionado ao carrinho!");
        // Aqui você pode adicionar lógica real de adicionar ao carrinho, se quiser
      } else {
        document.getElementById("auth-modal-toggle").checked = true;
        showToast("Faça login para comprar!");
      }
    });
  });

  // REGISTRO
  const registerForm = document.querySelector(".auth-form[action-register]");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nome = registerForm
        .querySelector('input[placeholder="Nome inteiro"]')
        .value.trim();
      const nomeMaterno = registerForm
        .querySelector('input[placeholder="Nome Materno"]')
        .value.trim();
      const email = registerForm
        .querySelector('input[type="email"]')
        .value.trim();
      const telefone = registerForm
        .querySelector('input[placeholder="Telefone/Fixo"]')
        .value.trim();
      const cpf = registerForm
        .querySelector('input[placeholder="CPF"]')
        .value.trim();
      const senha = registerForm.querySelector(
        'input[placeholder="Senha"]'
      ).value;
      const senha2 = registerForm.querySelector(
        'input[placeholder="Confirmar Senha"]'
      ).value;
      // Endereço
      const cep = registerForm.querySelector("#cep").value.trim();
      const rua = registerForm.querySelector("#rua").value.trim();
      const numero = registerForm.querySelector("#numero").value.trim();
      const bairro = registerForm.querySelector("#bairro").value.trim();
      const cidade = registerForm.querySelector("#cidade").value.trim();
      const estado = registerForm.querySelector("#estado").value.trim();

      if (
        !nome ||
        !nomeMaterno ||
        !email ||
        !telefone ||
        !cpf ||
        !senha ||
        !senha2 ||
        !cep ||
        !rua ||
        !numero ||
        !bairro ||
        !cidade ||
        !estado
      ) {
        showToast("Preencha todos os campos obrigatórios.");
        return;
      }
      if (senha !== senha2) {
        showToast("As senhas não coincidem.");
        return;
      }
      localStorage.setItem("userNome", nome);
      localStorage.setItem("userNomeMaterno", nomeMaterno);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userTelefone", telefone);
      localStorage.setItem("userCPF", cpf);
      localStorage.setItem("userSenha", senha);
      localStorage.setItem(
        "userEndereco",
        JSON.stringify({ cep, rua, numero, bairro, cidade, estado })
      );
      document.getElementById("auth-modal-toggle").checked = true;
      document.getElementById("login-tab").checked = true;
      limparCampos(registerForm);
      showToast("Cadastro realizado com sucesso!");
    });
  }

  // Salvar lembrar senha ao marcar/desmarcar o checkbox
  const lembrarSenhaCheckbox = document.getElementById("lembrar-senha");
  if (lembrarSenhaCheckbox) {
    lembrarSenhaCheckbox.addEventListener("change", function () {
      localStorage.setItem("lembrarSenha", this.checked ? "true" : "false");
    });
  }

  // LOGIN
  const loginForm = document.querySelector(".auth-form[action-login]");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const senha = loginForm.querySelector('input[type="password"]').value;
      const savedEmail = localStorage.getItem("userEmail");
      const savedSenha = localStorage.getItem("userSenha");
      const savedNome = localStorage.getItem("userNome");
      const lembrar = document.getElementById("lembrar-senha").checked;

      // Salva email/senha se lembrar senha estiver marcado
      if (lembrar) {
        localStorage.setItem("lembrarSenha", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userSenha", senha);
      } else {
        localStorage.setItem("lembrarSenha", "false");
      }

      if (email === savedEmail && senha === savedSenha && savedNome) {
        localStorage.setItem("userLogado", "true");
        mostrarUsuario(savedNome);
        document.getElementById("auth-modal-toggle").checked = false;
        limparCampos(loginForm);
        showToast("Login realizado com sucesso!");
      } else {
        showToast("Usuário ou senha inválidos. Cadastre-se primeiro.");
      }
    });
  }

  // Limpa campos ao abrir modal e preenche login se lembrar senha
  document
    .getElementById("auth-modal-toggle")
    ?.addEventListener("change", function (e) {
      if (this.checked) {
        limparCampos(document.querySelector(".auth-form[action-register]"));
        limparCampos(document.querySelector(".auth-form[action-login]"));
        preencherLoginSeLembrado();
      }
    });

  // Troca de abas limpa campos
  setupTabLimpeza();

  // Exibir avatar se usuário já estiver logado
  const savedNome = localStorage.getItem("userNome");
  const savedEmail = localStorage.getItem("userEmail");
  const savedSenha = localStorage.getItem("userSenha");
  const userLogado = localStorage.getItem("userLogado") === "true";
  if (savedNome && savedEmail && savedSenha && userLogado) {
    mostrarUsuario(savedNome);
  }

  // Preenchimento automático de endereço pelo CEP
  const cepInput = document.getElementById("cep");
  if (cepInput) {
    cepInput.addEventListener("blur", function () {
      const cep = cepInput.value.replace(/\D/g, "");
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.erro) {
              document.getElementById("rua").value = data.logradouro || "";
              document.getElementById("bairro").value = data.bairro || "";
              document.getElementById("cidade").value = data.localidade || "";
              document.getElementById("estado").value = data.uf || "";
            }
          });
      }
    });
  }

  // Atualiza o contador do carrinho
  function atualizarContadorCarrinho() {
    const contador = document.getElementById("contador-carrinho");
    let carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    let total = carrinho.reduce((sum, item) => sum + (item.qtd || 1), 0);
    if (contador) {
      contador.textContent = total;
      contador.style.display = total > 0 ? "inline-block" : "none";
    }
  }

  // Chama ao carregar a página
  atualizarContadorCarrinho();
});
