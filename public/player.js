if (typeof localStorage === 'undefined' || localStorage === null) {
  const { LocalStorage } = require('node-localstorage');
  localStorage = new LocalStorage('./scratch');
}
window.onload = async () => {
  let first = true;
  const seek = document.getElementById('vid');
  const seekTime = seek.getAttribute('data-id').toString();
  document.getElementById('vid').currentTime = localStorage.getItem(seekTime);
  document.getElementById('vid').addEventListener('click', (e) => {
    if (first) {
      e.target.play();
    }
    first = false;
    const vid = document.getElementById('vid').currentTime;
    localStorage.setItem(seekTime, vid);
  });
};
window.onunload = async () => {
  const seek = document.getElementById('vid');
  const seekTime = seek.getAttribute('data-id').toString();
  const vid = document.getElementById('vid').currentTime;
  localStorage.setItem(seekTime, vid);
};
