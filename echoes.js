(function($) {
  window.echoes = window.echoes || {};
  window.echoes.hover = null;

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
      if (!window.echoes.hover) return;
      $.ajax('echoes/push', {
        'data': {
          'euid': '1',
          'path': document.location.pathname,
          'selector': '[data-echoes-id='+ window.echoes.hover +']',
          'created': Date.now()
        }
      });
    }, 10000);
  });
})(jQuery);
