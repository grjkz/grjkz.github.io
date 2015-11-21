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
	
	$('.project-name').click(function() {
		var targetProjectDetails = $( $(this).data('target') );
		var allProjectDetails = $('.project-details');
		
		if (targetProjectDetails.css('display') === "none") {
			allProjectDetails.velocity('slideUp', 200);
			targetProjectDetails.velocity('slideDown', 200);
		}
		else {
			targetProjectDetails.velocity('slideUp', 200);
		}
	});





});