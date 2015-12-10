$(function() {
	

	/**
	 
	 * Nav Smooth Scroll
	 
	 */
	
	 $('[href^=#]').click(function(e) {
	 	e.preventDefault();
	 	var href = this.href.split('/').pop();
	 	var targetSection = $(href);

	 	targetSection.velocity('scroll', 400);
	 });

	/**

	 * Flip Card for Profile Pic on click

	*/
	$('.card-flip').click(function() {
		var card = $(this);
		var cardFront = $('.card-front');
		var cardBack = $('.card-back');

		if (card.hasClass('flipped')) {
			card.removeClass('flipped');
		}
		else {
			card.addClass('flipped');			
		}
	});

	/**
	 
	 * Accordian for Projects Section
	 
	 */
	
	// $('.project-name').click(function() {
	// 	var targetProjectDetails = $( $(this).data('target') );
	// 	var allProjectDetails = $('.project-details');
		
	// 	if (targetProjectDetails.css('display') === "none") {
	// 		allProjectDetails.velocity('slideUp', 200);
	// 		targetProjectDetails.velocity('slideDown', 200);
	// 	}
	// 	else {
	// 		targetProjectDetails.velocity('slideUp', 200);
	// 	}
	// });
	
	/**
	 * Slick for Projects
	 */
	$('.projects-carousel').slick({
		dots: false,
		autoplay: true,
		prevArrow: $('.prev-project'),
		nextArrow: $('.next-project')
	});

	// $('.next-article').click(function(e) {
	// 	$('.articles').slick('slickNext');
	// });


	/**
	 
	 * Open #contact-card on click
	 
	 */
	
	$('#contact-me').click(function(e) {
		e.preventDefault();

		var contactCard = $('#contact-card');
		contactCard.velocity({ 
			top: '-90px', 
			opacity: 1 
		}, { 
			duration: 200,
			display: 'block'
		});
	});

		
	/**
	 
	 * Contact Email Builder
	 
	 */
	
	$('#send-email').click(function() {
		var mailto = "philipchoicodes@gmail.com";
		var subject = $('#contact-purpose').val();

		this.href = "mailto:" + mailto + "?subject=GH::Purpose: " + subject;
	});

	


});


/**
 
 * Closing modals
 * @param  {string} targetHash Target node hash to close
 
 */

function closeModal(targetHash) {
	$(targetHash).velocity({
		top: '0',
		opacity: 0
	}, {
		duration: 200,
		display: 'none'
	});
}