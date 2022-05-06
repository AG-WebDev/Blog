$(document).ready(function() {
  $('.addReview').on('submit', async function(e) {
    e.preventDefault();
    const commentText = $('.comment-text').val();
    const id = $('textarea').attr('id');

    $.ajax({
      type: 'POST',
      url: `/api/articles/${id}/comments`,
      dataType: 'json',
      data: {
        commentText
      },
      success: function(response) {
        showAlert('success', 'Comment Posted Successfully!');
        window.setTimeout(() => {
          location.reload(true);
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
      url: '/api/users/logout',
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

  $('.btn--red').click(function(e) {
    e.preventDefault();
    const id = $(this).attr('id');
    $.ajax({
      type: 'DELETE',
      url: `/api/comments/${id}`,
      success: function(response) {
        if (response === undefined) {
          showAlert('success', 'Comment deleted successfully.');
          window.setTimeout(() => {
            location.reload(true);
          }, 1000);
        }
      },
      error: function(err) {
        showAlert('error', 'Error logging out! Try again.');
      }
    });
  });
});
