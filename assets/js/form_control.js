$(function() {
  $(".to_validate").validate({
    rules: {
      name: {
        required: true,
        minlength: 1
      }
    },
    highlight: function(element) {
        if ($(element).hasClass("to_check")) {
            $(element).removeClass('is-valid').addClass('is-invalid');
        }
    },
    unhighlight: function(element) {
        if ($(element).hasClass("to_check")) {
            $(element).removeClass('is-invalid').addClass('is-valid');
        }
    },
  });
})