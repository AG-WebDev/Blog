$(document).ready(function() {
  // Update Information without Password
  $('.form-user-data').on('submit', async function(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('firstName', document.getElementById('firstName').value);
    form.append('lastName', document.getElementById('lastName').value);
    form.append('username', document.getElementById('username').value);
    form.append('mobile', document.getElementById('mobile').value);
    form.append('photo', document.getElementById('photo').files[0]);
    axios({
      method: 'PATCH',
      url: 'http://localhost:4000/api/users/updateMe',
      data: form
    })
      .then(function(response) {
        if (response.data.status === 'success') {
          showAlert('success', 'Data Updated Successfully!');
          window.setTimeout(() => {
            location.reload(true);
          }, 1500);
        }
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.status === 400) {
          showAlert('error', err.response.data.message);
        } else if (err.response.data.message.name === 'ValidationError') {
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

  // Update Password
  $('#savePassword').click(function(e) {
    e.preventDefault();
    const passwordCurrent = $('#password-current').val();
    const password = $('#new-password').val();
    const passwordConfirm = $('#password-confirm').val();

    $.ajax({
      type: 'PATCH',
      url: 'http://localhost:4000/api/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      },
      dataType: 'json',
      success: function(response) {
        showAlert(
          'success',
          'Password Changed successfully! Please Login again'
        );
        window.setTimeout(() => {
          location.assign('/login');
        }, 1500);
      },
      error: function(err) {
        // console.log(err.responseJSON);
        if (err.responseJSON.message === 'Your current password is wrong') {
          showAlert('error', 'Your current password is wrong');
        } else if (
          err.responseJSON.message.message ===
          'User validation failed: passwordConfirm: Passwords are not the same!'
        ) {
          showAlert('error', 'password and confirm password are not the same!');
        } else {
          showAlert('error', 'Password length must be 8 character or more');
        }
      }
    });
  });
});
