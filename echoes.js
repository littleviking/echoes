(function($) {
  window.echoes = window.echoes || {};
  window.echoes.hover = null;
  window.echoes.seen = {};

  $(function() {

    // Find divs we can echo
    var echoes_id = 1;
    $('div').each(function() {
      $this = $(this);
      if ($this.height() > 100 && $this.height() < 800 && $this.width() > 100 && $this.width() < 800) {
        $this.addClass('echoes-item').attr('data-echoes-id', echoes_id++);
      }
    });

    // Store hovered div to be used during interval ajax call
    $('.echoes-item')
      .hover(function() {
        window.echoes.hover = $(this).attr('data-echoes-id');
      })
      .blur(function() {
        window.echoes.hover = null;
      });

    // Push hovered div to the server, if any
    setInterval(function() {
      $.ajax({
        url: 'echoes/get',
        data: {
          'euid': '1',
          'path': document.location.pathname,
        },
        success: function(data, textStatus, jqXHR) {
          for (var i in data.data) {
            var item = data.data[i];
            if (window.echoes.seen[item.selector]) continue;
            $(item.selector).mouseenter(function() {
              window.echoes.seen[item.selector] = true;
              $(this).pulse();
            });
          }
        }
      });

      if (!window.echoes.hover) return;
      $.ajax({
        url: 'echoes/push',
        data: {
          'euid': '1',
          'path': document.location.pathname,
          'selector': '[data-echoes-id='+ window.echoes.hover +']',
          'created': Date.now()
        }
      });
    }, 10000);
  });

  $.fn.extend({
    pulse: function() {
      return this.each(function() {
        $(this)
          .css({outline: '0px pink solid'})
          .animate({outlineWidth: '8px'}, 400)
          .animate({outlineWidth: '4px'}, 400)
          .animate({outlineWidth: '8px'}, 400)
          .animate({outlineWidth: '4px'}, 400)
          .animate({outlineWidth: '8px'}, 400)
          .animate({outlineWidth: '0px'}, 400);
      });
    }
  });
})(jQuery);
