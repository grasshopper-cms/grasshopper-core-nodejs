// 
//  This file includes the scripts used in the gallery.html for the isotope filtering and the 
//  Zoom-in Zoom-out functionality of the images.
//  It uses the fluidbox code by http://terrymun.com/ 
//  Docs can be located at http://codepen.io/terrymun/full/JKHwp
// 

$(function (){

  // Global variables
  var $fb = $('a[data-fluidbox]'),
      vpRatio;

  // Create fluidbox modal background
  $('body').append('<div id="fluidbox-overlay"></div>');

  // Append click handler
  $('#fluidbox-overlay').click(function (){
    // Trigger the click function on the particular fluidbox that is opened
    $('body').find('a[data-fluidbox].fluidbox-opened').trigger('click');
  });

  // Check if images are loaded first
  $fb.imagesLoaded().done(function (){

    // Create dynamic elements
    $fb
    .wrapInner('<div class="fluidbox-wrap" />')
    .find('img')
      .css({ opacity: 1 })
      .after('<div class="fluidbox-ghost" />');

    // Listen to resize event for calculations
    $(window).resize(function (){

      // Get viewport ratio
      vpRatio = window.innerWidth / window.innerHeight;

      // Get dimensions and aspect ratios
      $fb.each(function (){
        var $img   = $(this).find('img'),
            $ghost = $(this).find('.fluidbox-ghost'),
            $wrap  = $(this).find('.fluidbox-wrap'),
            data   = $img.data();

        // Save image dimensions as jQuery object
        data.imgWidth  = $img.width();
        data.imgHeight = $img.height();
        data.imgRatio  = $img.width() / $img.height();

        // Resize ghost element
        $ghost.css({
          width: $img.width(),
          height: $img.height(),
          top: $img.offset().top - $wrap.offset().top,
          left: $img.offset().left - $wrap.offset().left
        });

        // Calculate scale based on orientation
        if(vpRatio > data.imgRatio) {
          data.imgScale = window.innerHeight*.95 / $img.height();
        } else {
          data.imgScale = window.innerWidth*.95 / $img.width();
        }

      });
    }).resize();

    // Bind click event
    $fb.click(function (e){

      // Variables
      var $img = $(this).find('img'),
          $ghost = $(this).find('.fluidbox-ghost'),
          $wrapped = $img.add($ghost);

      if($(this).data('fluidbox-state') == 0 || !$(this).data('fluidbox-state')) {
        // State: Closed
        // Action: Open fluidbox

        // Switch state
        $(this)
        .data('fluidbox-state', 1)
        .removeClass('fluidbox-closed')
        .addClass('fluidbox-opened');

        // Show overlay
        $('#fluidbox-overlay').fadeIn();

        // Hide original image
        $img.css({ opacity: 0 });

        // Use ghost image
        $ghost.css({
          'background-image': 'url('+$(this).attr('href')+')',
          opacity: 1
        });

        // Calculate offset and scale
        var offsetY = $(window).scrollTop()-$img.offset().top+0.5*($img.data('imgHeight')*($img.data('imgScale')-1))+0.5*(window.innerHeight-$img.data('imgHeight')*$img.data('imgScale')),
            offsetX = 0.5*($img.data('imgWidth')*($img.data('imgScale')-1))+0.5*(window.innerWidth-$img.data('imgWidth')*$img.data('imgScale')) - $img.offset().left,
            scale = $img.data('imgScale');

        // Animate wrapped elements
        // Note: I did not animate the wrapper, .fluidbox-wrap itself, because of rendering issues with iOS Safari
        $wrapped.css({
          'transform': 'translate('+offsetX+'px,'+offsetY+'px) scale('+scale+')'
        });

        // Fix Issue while also using isotope with z-index all over the place
        $ghost.closest('.isotope-item').css('z-index', '9999');

      } else {
        // State: Open
        // Action: Close fluidbox

        // Switch state
        $(this)
        .data('fluidbox-state', 0)
        .removeClass('fluidbox-opened')
        .addClass('fluidbox-closed');

        // Hide overlay
        $('#fluidbox-overlay').fadeOut();

        // Show original image
        $img.css({ opacity: 1 });

        // Hide ghost image
        $ghost.css({ opacity: 0 });

        // Reverse animation on wrapped elements
        // Note: I did not animate the wrapper, .fluidbox-wrap itself, because of rendering issues with iOS Safari
        $wrapped.css({
          'transform': 'translate(0,0) scale(1)'
        });

        // Fix Issue while also using isotope with z-index all over the place
        setTimeout(function () {
          $ghost.closest('.isotope-item').css('z-index', 'initial');
        }, 500);

      }
      e.preventDefault();
    });
  });
});