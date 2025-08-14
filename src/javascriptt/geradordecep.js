 document.addEventListener("DOMContentLoaded", function () {
  const cepInput = document.getElementById("orcamento-cep");
  if (cepInput) {
    cepInput.addEventListener("blur", function () {
      const cep = cepInput.value.replace(/\D/g, "");
      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((res) => res.json())
          .then((data) => {
            if (!data.erro) {
              document.getElementById("orcamento-rua").value = data.logradouro || "";
              document.getElementById("orcamento-bairro").value = data.bairro || "";
              document.getElementById("orcamento-cidade").value = data.localidade || "";
              document.getElementById("orcamento-estado").value = data.uf || "";
            }
          });
      }
    });
  }
});