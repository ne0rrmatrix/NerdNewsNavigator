window.onload = async () => {
  const data = document.querySelectorAll('#image');
  const show = document.querySelectorAll('#images');
  show.forEach((element) => {
    $(element).click(() => {
      // console.log(element.dataset.test)
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
  data.forEach((element) => {
    $(element).click(() => {
      // console.log(element.dataset.test)
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
