const getShow = (show) => {
  show.forEach((element) => {
    $(element).on('click', () => {
      $.post('http://localhost:8080/', {
        show: element.dataset.show,
      }, (result) => {
        if (result === 'yes') {
          window.location.href = '/player';
        }
      });
    });
  });
};
const getPodcast = (data) => {
  data.forEach((element) => {
    $(element).on('click', () => {
      $.post('http://localhost:8080/', {
        podcast: element.dataset.test,
      }, (answer) => {
        if (answer === 'yes') {
          window.location.href = '/show';
        }
      });
    });
  });
};
window.onload = async () => {
  const data = document.querySelectorAll('#image');
  const show = document.querySelectorAll('#images');
  getShow(show);
  getPodcast(data);
};
