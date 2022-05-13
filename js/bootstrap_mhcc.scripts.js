(function($, Drupal) {
  /**
   * Toolbar Spacing
   */
  Drupal.behaviors.toolbarSpace = {
    attach: function(context, settings) {
      function toolbarSpace() {
        toolbarHeight = $('#toolbar-bar').height();
        trayHeight = ($('.toolbar-tray-horizontal.is-active').length) ? $('.toolbar-tray-horizontal.is-active').height() : 0;
        topPadding = toolbarHeight + trayHeight;

        $('body').css({
          paddingTop: topPadding,
        });
      }

      $(window).resize(toolbarSpace);
    }
  }; 

  /**
   * jquery UI dialog box close button fix
   */
  Drupal.behaviors.dialogCloseButtonFix = {
    attach: function(context, settings) {
      $.fn.bootstrapBtn = $.fn.button.noConflict();
    }
  };

})(jQuery, Drupal);
