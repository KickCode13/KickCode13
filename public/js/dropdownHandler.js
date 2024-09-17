document.querySelectorAll(".genre").forEach(function (item) {
  const genre = item.textContent.trim();
  item.href = `/manga/genre/${genre}`;
  return true;
}); 
