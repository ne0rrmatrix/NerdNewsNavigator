window.onload = async () => {
  const data = document.querySelectorAll('#image');
  data.forEach((element) => {
    $(element).click(() => {
      // console.log(element.dataset.test)
      $.post('http://localhost:8080/', {
        podcast: element.dataset.test,
      }, (data) => {
        if (data === 'yes') {
          console.log('sucess!');
          window.location.href = '/pages/show';
        }
      });
    });
  });
};
