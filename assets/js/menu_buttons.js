$(document).ready(function(){
      var hamb_closed = $('#h_close');
      var hamb_opened = $('#h_open');
      var dropdown = $('#header_dropd');
      var extended = $('#header_exten');
      var mobile = window.matchMedia("(max-width: 992px)");

      changeMobileView(mobile);
      mobile.addListener(changeMobileView);


      function changeMobileView(x) {
            if (x.matches) {
                  hamb_closed.css('display','block');
                  hamb_opened.css('display','none');
                  dropdown.addClass('hidden');
                  extended.addClass('hidden');

                  hamb_closed.click(function() { 
                        dropdown.removeClass('hidden');
                        $('body').css('padding-top', '262px');
                        $('.navbar').css('background', 'white');
                        $('.navbar').css('padding-bottom', '1em');
                        $('.navbar').css('border-bottom', 'solid 2px black');
                        hamb_closed.css('display', 'none');
                        hamb_opened.css('display', 'block');
                  });

                  hamb_opened.click(function() { 
                        dropdown.addClass('hidden');
                        $('body').css('padding-top', '0px');
                        $('.navbar').css('background', 'none');
                        $('.navbar').css('padding-bottom', '0.5em');
                        $('.navbar').css('border-bottom', 'none');
                        hamb_closed.css('display','block');
                        hamb_opened.css('display','none');
                  });

            } else {
                  $('body').css('padding-top', '0px');
                  $('.navbar').css('background', 'none');
                  $('.navbar').css('padding-bottom', '0.5em');
                  $('.navbar').css('border-bottom', 'none');
                  hamb_closed.css('display','none');
                  hamb_opened.css('display','none');
                  extended.removeClass('hidden');
                  dropdown.addClass('hidden');
            }
      }
});