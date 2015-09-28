$(function() {
	$('.project-name').click(function() {
		if ($(this).next('.project-details').css('display') === "none") {
			$('.project-details').slideUp()
			$(this).next('.project-details').slideDown()
		}
		else {
			$(this).next('.project-details').slideUp()	
		}
	})
})