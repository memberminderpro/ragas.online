jQuery(document).ready(function($) {
    var $menuIcon = $('#adminmenu #toplevel_page_mmp_custom_form div.wp-menu-image img');
    var defaultSrc = mmpcf.pluginUrl + 'assets/img/mmp-icon-reverse.svg';
    var hoverSrc = mmpcf.pluginUrl + 'assets/img/mmp-icon-reverse.svg';
    var currentSrc = mmpcf.pluginUrl + 'assets/img/mmp-icon.svg';

    $menuIcon.attr('src', defaultSrc);

    $('#adminmenu #toplevel_page_mmp_custom_form').hover(
        function() {
            if (!$(this).hasClass('current')) {
                $menuIcon.attr('src', hoverSrc);
            }
        },
        function() {
            if (!$(this).hasClass('current')) {
                $menuIcon.attr('src', defaultSrc);
            }
        }
    );

    if ($('#adminmenu #toplevel_page_mmp_custom_form').hasClass('current')) {
        $menuIcon.attr('src', currentSrc);
    }
});
