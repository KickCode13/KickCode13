const delButtons = document.querySelectorAll(".btn-del");
delButtons.forEach((btnDel) => {
  btnDel.addEventListener("click", (e) => {
    const confirmDel = confirm("Deseja mesmo deletar esse manga?");
    if (confirmDel) {
      const mangaId = btnDel.getAttribute("data-id");
      fetch(`/manga/del/${mangaId}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          // Remover o elemento da página
          const card = btnDel.closest(".col-md-4"); //pega o elemnto ancestral mais proximo com a classe especificada
          if (card) {
            card.remove(); //remove em tempo real
          }
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          console.error("Erro ao deletar o manga.");
          alert("Erro ao deletar o manga.");
        }
      });
      console.log("Deleta");
    } else {
      console.log("Noo");
    }
  });
});
