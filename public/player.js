window.onload = async () => {
  let first = true;
  document.getElementById('vid').addEventListener('click', (e) => {
    if (first) {
      e.target.play();
    }
    first = false;
  });
};
