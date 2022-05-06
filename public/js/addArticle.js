$(document).ready(function() {
  $('.addArticle-form').on('submit', async function(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('title', document.getElementById('title').value);
    form.append('context', document.getElementById('context').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    axios({
      method: 'POST',
      url: '/api/articles',
      data: form
    })
      .then(function(response) {
        if (response.data.status === 'success') {
          showAlert('success', 'Article Created Successfully!');
          window.setTimeout(() => {
            location.assign('/');
          }, 1500);
        }
      })
      .catch(err => {
        if (err.response.data.message.name === 'ValidationError') {
          let errorMsg = err.response.data.message.message.split(': ');
          showAlert('error', errorMsg[2]);
        } else if (err.response.data.message.code === 11000) {
          showAlert(
            'error',
            `This ${
              Object.keys(err.response.data.message.keyValue)[0]
            } already exist! Please choose another one.`
          );
        }
      });
  });
});
