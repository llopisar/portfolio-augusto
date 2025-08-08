const toggles = document.querySelectorAll('.project-card__toggle');

toggles.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    card.classList.toggle('is-open');
  });
});