const getShow = (show) => {
  show.forEach((element) => {
    $(element).click(() => {
      $.post('http://localhost:8080/', {
        show: element.dataset.show,
      }, (result) => {
        if (result === 'yes') {
          console.log('sucess!');
          window.location.href = '/pages/player';
        }
      });
    });
  });
};
const getPodcast = (data) => {
  data.forEach((element) => {
    $(element).click(() => {
      $.post('http://localhost:8080/', {
        podcast: element.dataset.test,
      }, (answer) => {
        if (answer === 'yes') {
          console.log('sucess!');
          window.location.href = '/pages/show';
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
