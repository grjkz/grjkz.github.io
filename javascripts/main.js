$(function() {
	$('.project-details').hide()

	$('.project-name').click(function() {
		if ($(this).next('.project-details').css('display') === "none") {
			$('.project-details').slideUp()
			$(this).next('.project-details').slideDown()
		}
		else {
			$(this).next('.project-details').slideUp()	
		}
	})

	// $('li a').click(function(e) {
	// 	var target = this.hash
	// 	var $target = $("a[name="+target+"]")
	// 	console.log($target)
	// })



})