// Função para preencher os campos com dados do localStorage
function preencherCampos() {
  // Dados pessoais
  document.querySelector('input[placeholder="Leandro Ferreira"]').value =
    localStorage.getItem("userNome") || "";
  document.querySelector('input[placeholder="Leandra Garcia"]').value =
    localStorage.getItem("userNomeMaterno") || "";
  document.querySelector('input[placeholder="exemplo@hotmail.com"]').value =
    localStorage.getItem("userEmail") || "";
  document.querySelector('input[placeholder="(21) 99999-9999"]').value =
    localStorage.getItem("userTelefone") || "";
  document.getElementById("cpf-identificacao").value =
    localStorage.getItem("userCPF") || "";

  // Endereço
  const endereco = JSON.parse(localStorage.getItem("userEndereco") || "{}");
  const inputsEndereco = document.querySelectorAll(
    ".config-section:nth-of-type(2) .config-input"
  );
  inputsEndereco[0].value = endereco.rua || "";
  inputsEndereco[1].value = endereco.bairro || "";
  inputsEndereco[2].value = endereco.cidade || "";
  inputsEndereco[3].value = endereco.estado || "";
  inputsEndereco[4].value = endereco.cep || "";
}

// Função para salvar os dados no localStorage
function salvarAlteracoes(e) {
  e.preventDefault();

  // Dados pessoais
  const nome = document.querySelector(
    'input[placeholder="Leandro Ferreira"]'
  ).value;
  const nomeMaterno = document.querySelector(
    'input[placeholder="Leandra Garcia"]'
  ).value;
  const email = document.querySelector(
    'input[placeholder="exemplo@hotmail.com"]'
  ).value;
  const telefone = document.querySelector(
    'input[placeholder="(21) 99999-9999"]'
  ).value;
  const cpf = document.getElementById("cpf-identificacao").value;

  // Endereço
  const inputsEndereco = document.querySelectorAll(
    ".config-section:nth-of-type(2) .config-input"
  );
  const endereco = {
    rua: inputsEndereco[0].value,
    bairro: inputsEndereco[1].value,
    cidade: inputsEndereco[2].value,
    estado: inputsEndereco[3].value,
    cep: inputsEndereco[4].value,
  };

  // Senha
  const senhaAtual = document.getElementById("senha-atual").value;
  const novaSenha = document.getElementById("nova-senha").value;
  const confirmarSenha = document.getElementById("confirmar-senha").value;
  const erroSenha = document.getElementById("erro-senha");

  if (novaSenha !== confirmarSenha) {
    erroSenha.textContent = "A nova senha e a confirmação devem ser iguais.";
    erroSenha.style.display = "block";
    return;
  } else {
    erroSenha.style.display = "none";
  }

  // Substitui os dados no localStorage
  localStorage.setItem("userNome", nome);
  localStorage.setItem("userNomeMaterno", nomeMaterno);
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userTelefone", telefone);
  localStorage.setItem("userCPF", cpf);
  localStorage.setItem("userEndereco", JSON.stringify(endereco));
  if (novaSenha) {
    localStorage.setItem("userSenha", novaSenha);
  }

  alert("Dados atualizados com sucesso!");
}
