//Sticky Header
function headerStyle() {
    if ($('.main-header').length) {
        var windowpos = $(window).scrollTop();
        var siteHeader = $('.main-header');
        var scrollLink = $('.scroll-to-top');
        var sticky_header = $('.main-header .sticky-header');
        if (windowpos > 100) {
            siteHeader.addClass('fixed-header');
            sticky_header.addClass("animated slideInDown");
            scrollLink.fadeIn(300);
        } else {
            siteHeader.removeClass('fixed-header');
            sticky_header.removeClass("animated slideInDown");
            scrollLink.fadeOut(300);
        }
    }
}

headerStyle(); // Initial call

jQuery(window).on('scroll', function() {
    headerStyle();
});


//Back to top
var offset = 220;
var duration = 500;
jQuery(window).on('scroll', function() {
    if (jQuery(this).scrollTop() > offset) {
        jQuery('.back-to-top').fadeIn(duration);
    } else {
        jQuery('.back-to-top').fadeOut(duration);
    }
});

jQuery('.back-to-top').on("click", function(event){
    event.preventDefault();
    jQuery('html, body').animate({scrollTop: 0}, duration);
    return false;
});

 


