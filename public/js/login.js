const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

$(document).ready(function() {
  $('#submit').click(function(e) {
    e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();

    $.ajax({
      type: 'POST',
      url: 'http://localhost:4000/api/users/login',
      dataType: 'json',
      data: {
        username,
        password
      },
      success: function(response) {
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      },
      error: function(err) {
        showAlert('error', err.responseJSON.message);
      }
    });
  });

  $('.nav__el--logout').click(function(e) {
    e.preventDefault();
    $.ajax({
      type: 'GET',
      url: 'http://localhost:4000/api/users/logout',
      success: function(response) {
        if (response.status === 'success') {
          location.assign('/');
        }
      },
      error: function(err) {
        showAlert('error', 'Error logging out! Try again.');
      }
    });
  });
});
