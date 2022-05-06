$(document).ready(function() {
  $('.btn--red').click(function(e) {
    e.preventDefault();
    const attributeId = $(this).attr('id');
    const userId = attributeId.split('-')[1];
    alertify.confirm(
      'If you delete this blogger, all his comments and articles will also be deleted. Are you sure you want to delete this Blogger?',
      function(e) {
        if (e) {
          $.ajax({
            type: 'DELETE',
            url: `/api/users/${userId}`,
            data: 'data',
            success: function(response) {
              showAlert('success', 'Blogger deleted successfully!');
              window.setTimeout(() => {
                location.reload(true);
              }, 1000);
            }
          });
        }
      }
    );
  });

  $('.btn--blue').click(function(e) {
    e.preventDefault();
    const attributeId = $(this).attr('id');
    const userMobile = attributeId.split('-')[0];
    const userId = attributeId.split('-')[1];
    alertify.confirm(
      'Are you sure, you want to recover password of this Blogger?',
      function(e) {
        if (e) {
          $.ajax({
            type: 'PATCH',
            url: `/api/users/passwordRecoveryByAdmin`,
            data: {
              id: userId,
              password: userMobile,
              passwordConfirm: userMobile
            },
            success: function(response) {
              showAlert('success', 'Password Recovered successfully!');
            }
          });
        }
      }
    );
  });
});
