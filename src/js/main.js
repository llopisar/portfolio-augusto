const toggles = document.querySelectorAll('.project-card__toggle');

toggles.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation(); // evita que se propague el click a otros elementos
    const card = button.closest('.project-card');
    card.classList.toggle('is-open');
  });
});