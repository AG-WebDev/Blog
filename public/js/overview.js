$(document).ready(function() {
  $('.btn--red').click(function(e) {
    e.preventDefault();
    const attributeId = $(this).attr('id');
    const articleId = attributeId.split('-')[1];
    alertify.confirm('Are you sure, you want to delete this Article?', function(
      e
    ) {
      if (e) {
        $.ajax({
          type: 'DELETE',
          url: `/api/articles/${articleId}`,
          data: 'data',
          success: function(response) {
            window.setTimeout(() => {
              location.reload(true);
            }, 1000);
            showAlert('success', 'Article deleted successfully!');
          }
        });
      } else {
      }
    });
  });
});

