document
  .getElementById("edit-manga-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Evita o comportamento padrão de submissão

    const form = e.target;
    const mangaId = this.getAttribute("data-id"); // Pega o ID do mangá
    const formData = new FormData(form); // Cria um FormData com os dados do formulário

    // Converte o FormData para um objeto simples
    const mangaData = Object.fromEntries(formData.entries());

    fetch(`/manga/edit/${mangaId}`, {
      method: "PUT", // Método PUT para atualização
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mangaData), // Converte o objeto para JSON
    })
      .then((response) => {
        if (response.ok) {
          alert("Manga atualizado com sucesso!");
          window.location.href = "/"; // Redireciona para a página inicial
        } else {
          console.error("Erro ao atualizar o manga.");
          alert("Erro ao atualizar o manga.");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição.");
      });
  });
