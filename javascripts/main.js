$(function() {
	

	/**
	 
	 * Smooth Scroll
	 
	 */
	 $('[href^=#]').click(function(e) {
	 	e.preventDefault();
	 	var href = this.href.split('/').pop();
	 	console.log(href);
	 });



	/**
	 
	 * Accordian for Projects Section
	 
	 */
	
	$('.project-name').click(function() {
		var targetProjectDetails = $(this).next('.project-details');
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