$(function() {

///////////////////////////////////////////////////////////////// SLICK
	// CHECK SCREEN SIZE TO DETERMINE IF #ABOUT SHOULD CAROUSEL


	$('.articles').slick({	// outter carousel
		arrows: false,
		// autoplay: true,
		swipe: false,
	})

	$('.media').slick({	// inner carousel (images)
		arrows: false,
		autoplay: true,
		dots: true,
	})

	// NEXT ARTICLE BUTTON
	$('.next-article').click(function(e) {
		$('.articles').slick('slickNext')
	})
	// PREV ARTICLE BUTTON
	$('.prev-article').click(function(e) {
		$('.articles').slick('slickPrev')
	})

/////////////////////////////////////////////////////////////////////////////////


	// ADJUST IMAGE SIZE BASED ON PARENT DIV
	// SET WIDTH/HEIGHT FOR PORTRAIT OR LANDSCAPE (UNKNOWN)
	// this gave me so much unnecessary trouble
	// i think loading the images too slowly (internet) will cause margin shift to not work
		$('.image').each(function() {
		// p* = parent height/width | i* = img height/width
		var pw = $(this).width()
		var ph = $(this).height()
		var img = $(this).children('img')
		var iw = img.width();
		var ih = img.height();

		if (ih >= iw) {	// if portrait
			img.css({
				width:'100%', height:'initial',
				// OFFSET IMAGE VERTICALLY
			})
		}
		else {	// landscape
			img.css({
				width:'initial', height:'100%',
				// OFFSET IMAGE HORIZONTALLY
			})
		}
		ih = img.height();
		iw = img.width();
		if (ih >= iw) {
			img.css('margin-top', -(ih - ph)/2 +'px')
		}
		else {
			img.css('margin-left', -(iw - pw)/2 +'px');
		}
		console.log(img.css('margin-top'))
	})

	// HIDE BUTTON TO SHOW LINK TO COPY
	$('.copy-link button').click(function(e) {
		$(this).hide()
		// debugger
		var $index = $(this).attr('data-index')
		var $linkField = $('input[data-index='+ $index +']').show();
		// can't append .focus() since it'll show button again
		// add click event to highlight text in field
		$linkField.click(function(e) {
			$(this).select();
		})
	})

	// NAV BAR APPEARANCE
	$(window).scroll(function() {
		if ( $(window).scrollTop() > $('.top').height()/2 ) {
			$('nav').show()
		}
		else {
			$('nav').hide()
		}
	})

	// SMOOTH SCROLLLLLLL
	// parallax (100vh in css) breaks this
	$('[href^=#]:not([href=#])').click(function(e) {
		var $target = $('[name='+this.hash+']');
		if ($target.length) {  // check to make sure array isn't empty
			// check size of div compared to window size
			// debugger
			if ($target.parent().height() < $(window).height()) {
				var extraspace = ($(window).height() - $target.parent().height()) / 2;
				$('body').animate({
					scrollTop: $target.offset().top - extraspace
				}, 500)
			}
			else {
				$('body').animate({
					// debugger
					scrollTop: $target.offset().top
				}, 500)
			}
		}
	})

	// // PARALLAXXXXX
	// // switched over to use pure css
	// $('#section').each(function(section) {

 //    $(window).scroll(function() {
 //    	debugger
 //    	// var yPos = $(window).scrollTop() / $section.data('speed')
 //    	// ar yPos = -($window.scrollTop() / $bgobj.data('speed'));
 //    })
 //  });


})