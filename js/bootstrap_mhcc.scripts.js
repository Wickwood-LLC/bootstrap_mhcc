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
            if ($.fn.button.noConflict) {
                $.fn.bootstrapBtn = $.fn.button.noConflict();
            }
        }
    };

    /**
     * Make tables responsive
     */
    Drupal.behaviors.responsiveTables = {
        attach: function(context, settings) {
            $('table', context).not('.fc-content-skeleton > table').each(function() {
                $(this).addClass('table').wrap('<div class="table-responsive"></div>');
            });
        }
    };

    /**
     * Make Post Header adaptive
     */
    Drupal.behaviors.adaptivePostHeader = {
        attach: function(context, settings) {
            $('.post-header').has('.author-picture img').addClass('has-author-picture');
        }
    };

})(jQuery, Drupal);