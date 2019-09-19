$(document).ready(function() {
  $('.form--signup').on('submit', function(e) {
    e.preventDefault();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const username = $('#username').val();
    const mobile = $('#mobile').val();
    const password = $('#password').val();
    const passwordConfirm = $('#passwordConfirm').val();
    const gender = $('input[type="radio"]:checked').val();

    axios({
      method: 'POST',
      url: 'http://localhost:4000/api/users/signup',
      data: {
        firstName,
        lastName,
        username,
        mobile,
        password,
        passwordConfirm,
        gender
      }
    })
      .then(function(response) {
        if (response.data.status === 'success') {
          showAlert(
            'success',
            'Your account created successfully, Please login to continue!'
          );
          window.setTimeout(() => {
            location.assign('/login');
          }, 1500);
        }
      })
      .catch(err => {
        if (
          err.response.data.message.errmsg && err.response.data.message.errmsg.includes("username_1 dup key")) {
          showAlert('error', 'This username is already exist!');
        } else if (
          err.response.data.message.errmsg && err.response.data.message.errmsg.includes("mobile_1 dup key")
        ) {
          showAlert('error', 'This Mobile is already exist!');
        }

        else if (err.response.data.message.name === 'ValidationError') {
          showAlert('error', err.response.data.message.message.split(":")[2]);
        }
      });
  });
});
