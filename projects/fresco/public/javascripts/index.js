console.log('js/index.js linked');

var modalOpened = false; // used to prevent mainNav from sliding down
var currentState = null; // saves the current view/state @param ['#*-view']

/**

 * Checks window size and initializes the page

 */
var initialize = {
	windowCheck: function() {
		// forces user to top of page
		$(window).on('beforeunload', function() {
			console.log('scrolled top 0')
	    $(window).scrollTop(0);
		});

		// starts slick on #about if small window width
		// also moves footer-c
		if ($(window).width() < 550) {
			slick.stepsStart();
		}
	},
	
	/** 	
	
	* AJAX CALL TO GRAB HIGHLIGHTS
	
	*/
	getHighlights: function() {
		$.ajax({
			url: "http://staging.fresconews.com/v1/gallery/highlights",
			dataType: "JSON",
			type: "GET",
			cache: false,
			success: function(results) {
				/* 
				* Put gallery into HTML 
				*/
				var count = 0;	// this is to make sure all articles have been output to the DOM before starting slick

				results.data.forEach(function(highlight, index) {
					$('.articles').append(initGallery(highlight, index));
					count++;
					
					// when all articles have been appended, start slick on #highlights
					if (count >= results.data.length) {
						slick.articlesStart();
						slick.enableCopyLink();
					}
				});
			},
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}
		}); // end ajax
	},

	
	/**
	
	* Smooth Scroll
	
	*/
	smoothScroll: function() {
		// $('[href^=#]:not([href=#])').click(function(e) {
		$('.SS').click(function(e) {
			e.preventDefault(); // prevent url hash appending
			var $target = $( $(this).attr('href') );
			if ($target.length > 0) {  // check to make sure a target is found

				var navHeight = $('#main-nav').height();

				$target.velocity("scroll", {
					duration: 400, 
					// easing: "spring", 
					offset: -(navHeight + 40)
				});
			}
		});
	},


	/**
	 
	 * Changes the select field color to Black when a valid option is selected while default option is grayed out
	 
	 */
	selectOptionColor: function() {
		// default color for select tags is "color: rgba(0,0,0,0.26);"
		// it will change to black once a valid option is selected
		$('.fresco-select-field').change(function() { 
			$(this).css('color','black')
		})
		
	},

	/**
	 
	 * Click events for #login-view
	 
	 */
	loginViewEventsInitialized: false,
	loginViewEvents: function() {
		if (this.loginViewEventsInitialized) { return false; }
		this.loginViewEventsInitialized = true;

		var loginTab = $('.login-tab');
		var loginForm = $('.login-form');
		var forgotPassIcon = $('.forgot-password-icon');
		var tryoutTab = $('.tryout-tab');
		var tryoutFormFull = $('.tryout-form-full');
		var loginGraphic = $('.login-graphic');

		// clicking 'tryout fresco news' makes its form drop down
		// close the other tab
		// remove the unselected tab
		// append the uppercase class to the closed tab
		tryoutTab.click(function() { 
			// add conditional to make sure nothing happens when you keep clicking the tab
			if (tryoutTab.hasClass('tab-unselected')) {
				
				tryoutTab.removeClass('tab-unselected');
				loginTab.addClass('tab-unselected');

				loginForm.velocity('slideUp', 200);
				tryoutFormFull.velocity('slideDown', 200);
				
				// hide the forgot password icon
				forgotPassIcon.hide();

				// conditional statement for window size > 550 && <= 800
				// for hiding image when tryout card is open
				var windowWidth = $(window).width();

				if ( windowWidth > 550 && windowWidth <= 800) {
					loginGraphic.velocity('fadeOut', 200);
				}
			}
		});

		// clicking 'login' makes its form drop down
		// append the uppercase class to the closed tab
		loginTab.click(function() {
			if (loginTab.hasClass('tab-unselected')) {

				loginTab.removeClass('tab-unselected');
				tryoutTab.addClass('tab-unselected');

				tryoutFormFull.velocity('slideUp', 200);
				loginForm.velocity('slideDown');

				// show the forgot password icon
				forgotPassIcon.show();

				// conditional statement for window size > 550 && <= 800
				// for SHOWING image when login card is open
				var windowWidth = $(window).width();

				if ( windowWidth > 550 && windowWidth <= 800) {
					// make sure to display table-cell so it doesn't default to block via fadeIn
					loginGraphic.velocity('fadeIn', {duration: 200, display: 'table-cell'} );
				}
			}
		});

		/*
		When Scrolling the Cards at the right, remove z-index from nav-modal when card isn't covering the nav links
		 */
		$('.login-forms').scroll(function() {
			var offsetTop = $('.cell-clear').offset().top;
			
			var navModal = $('.nav-modal');
			var navZIndex = navModal.css('z-index');

			var navContent = $('.nav-content');
			var navContentHeight = navContent.height();
			var navTopPadding = parseInt(navContent.css('padding-top').replace('px',''));

			var threshold = navContentHeight + navTopPadding; // for removing z-index from nav

			if (offsetTop < threshold && navZIndex == 50) { // cards are covering nav
				navModal.css('z-index', 10);
			}
			else if (offsetTop >= threshold && navZIndex == 10) {
				navModal.css('z-index', 50);
			}


		});

	
	}, // end loginViewEvents


	careersViewEventsInitialized: false,
	careersViewEvents: function() {
		if (this.careersViewEventsInitialized) { return false; }
		this.careersViewEventsInitialized = true;

		var tabs = $('.careers-tabs > div');

		// clicking a tab should show its respective job list
		tabs.click(function() {
			clickedTab = $(this);

			if (!clickedTab.hasClass('selected-jobtab')) {
				var jobLists = $('.job-lists > div');
				var targetJobList = $( $(this).data('job-type') );
				
				// changes the tab text to a darker color
				tabs.removeClass('selected-jobtab');
				clickedTab.addClass('selected-jobtab');

				// hide other tab contents
				jobLists.removeClass('selected-jobtype');
				// show this tab contents
				targetJobList.addClass('selected-jobtype');

			}

		});
	},


	/**
	 * Contact View Events
	 */
	contactViewEventsInitialized: false,
	contactViewEvents: function() {
		if (this.contactViewEventsInitialized) { return false; }
		this.contactViewEventsInitialized = true;

		/*
		Click event for [SEND MY MESSAGE] / sending Email to Fresco
		 */
		$('#contact-send-email').click(function(e) {
			
			// if you want to change the receiver, directly edit the html "data-contact-email"
			// located in #contact-view > #contact-send-email
			var mailTo = $('#contact-send-email').data().contactEmail;
			
			var name = $('#contact-form-name').val().trim();
			var email = $('#contact-form-email').val().trim();
			var subject = $('#contact-form-inquiry').val();
			var body = $('#contact-form-message').val().trim();

			// if (!name || !email || !subject || !body) {
			// 	e.preventDefault();
			// 	// give an error
			
			// else {
				this.href = "mailto:" + mailTo +
									"?subject=Landing Page: "+ subject +
									"&body=" + encodeURIComponent(body) +
									"%0A%0A" + email;
			// }

		});
	},

	/**
	 * TOS View Events
	 */
	tosViewEventsInitialized: false,
	tosViewEvents: function() {
		if (this.tosViewEventsInitialized) { return false; }
		this.tosViewEventsInitialized = true;
		/*
		Change tabs
		 */
		var tabs = $('.tos-tabs > div');

		tabs.click(function() {
			var clickedTab = $(this);

			var tabTarget = $( clickedTab.data('tab-target') );
			var allDetails = $('.tos-body > div');

			tabs.removeClass('selected-tab');
			clickedTab.addClass('selected-tab');

			allDetails.removeClass('selected-details');
			tabTarget.addClass('selected-details');
		});

	},

	/**
	 * Reset Password View Events
	 */
	resetPassEvents: function() {
		$('.reset-pass-button').click(function() {
			var email = $('#reset-password-email').val().trim();

			if (!email) {
				// send error message
			}
			else {
				console.log("trying to find: "+email);
				// ajax call to server
				// error message if not-found
				// success message if found
				// redirect user back to index?
			}
		});
	},

	/**
	 
	 * Start SPA history
	 
	 */
	spaHistory: function() {
		/*
		Natural navigation via links
		 */
		$('.openModal').click(function(e) {
			e.preventDefault(); // need this to prevent double history per click

			var href = this.href; // get href via js
			var hash = href.split('/').pop(); // take out the hash and append '-view'
			var viewHash = hash + "-view";
			var currentHash = history.state;
			
			if (currentHash == viewHash) { return false; } // prevent anything from happening if transitioning to same view
			//var view = $(viewHash); // grabs the view
			
			// transition and show the new view
			transitions.modalHandler(currentHash, viewHash);

			// push new state
			history.pushState(viewHash, null, null); // store the actual view ID in state for quick targeting
			currentState = viewHash;
		});

		/*
		Navigation via Browser Keys
		 */
		$(window).on('popstate', function(e) {
			var nextState = history.state;
			// console.log(currentState, nextState)
			if (nextState == currentState) { return false; } // do nothing if next/prev state is the same | use case should only be when user refreshes page then clicks [browser] back/next
			
			transitions.modalHandler(currentState, nextState);
			currentState = nextState;

		});
	}
 
}; // END INITIALIZE


/**
 
 * ANIMATED TRANSITIONS
 
 */
var transitions = {
	/*
	Handle transitions when navigating to different views via links in SPA
	 */
	modalHandler: function(currentHash, nextHash) {
		if (!nextHash) { nextHash = '#landing-view'; }
		if (!currentHash) { currentHash = '#landing-view'; }

		var nextView = $(nextHash); // view node
		// var currentHash = history.state; // ie #team-view
		var currentView = $(currentHash);
		var currentViewHeight = currentView.css('height'); // can be % or px
		var navModal = $('.nav-modal');
		var navModalHeight = navModal.height();
		var modalView = $('#modal-view');
		var mainNav = $('#main-nav');
		var mainNavHeight = mainNav.height();
		var modalView = $('#modal-view');
		var headerContent = $('#header-content');

		var windowHeight = $(window).height();


		// console.log(currentHash + " to " + nextHash)


		/*
		From Modal to Modal [#login]
		 */
		// if current node hasClass modal and new node hasClass modal:
		// #modal view is already open
		// ease down currentView and hide it on complete
		// show and ease up nextView on complete
		if ( currentView.hasClass('modal') && nextView.hasClass('modal') ) {
			reposition.modalContent();

			currentView.velocity('fadeOut', 200)
									.velocity( {top: currentViewHeight}, { // i hope it actually changes the value
										duration: 0,
										complete: function() {
											nextView.velocity('fadeIn', {
												duration: 0,
												complete: function() {
													// initialize the next view's measurements
													reposition.viewMeasurements(nextHash);
													}
												}).velocity( { top: 0 }, 200);
										}
			});
		}
		/*
		From Landing to Modal
		 */
		else if ( (currentHash == '#landing-view') && nextHash && !modalOpened ) { // if there's no hash then it's the landing page
			modalOpened = true; // prevents mainNav bar from sliding down
			
			// WHEN OPENING A MODAL, SET THE HEIGHT AND MARGIN-TOP TO *-SECTION / .modal-content
			reposition.modalContent();


			// fade out currentView, 200
			// slide up #main-nav, instant
			// ease down #sections, instant
			// show #modal-view, instant
			// ease down .nav-modal, 200
			// ease up nextView, 200
			currentView = $('#landing-view');

			mainNav.velocity( { top: -(mainNavHeight + 30) }, 200);

			currentView.velocity('fadeOut', {
				duration: 200,
				complete: function() {
					// currentView.velocity({'top': currentViewHeight}, 0); // ease down #landing-page so it can be eased up later
					
					headerContent.velocity({'top': '0'}, 0); // reset parallax item position in case user returns to #landing-view
					// there is also something else that's making the height and margin-top change when switching views
					
					modalView.velocity('fadeIn', {
						duration: 0,
						complete: function() {
							navModal.velocity( { top: '0px' }, 200);
							nextView.velocity('fadeIn', {
								duration: 0, 
								complete: function() {
									// initialize the next view's measurements
									// must be done after fadeIn
									reposition.viewMeasurements(nextHash);
								}
							}).velocity( { top: 0 }, {duration: 200});

						}
					});
				}
			});
		}
		// From Modal to Landing
		else if (currentHash && modalOpened && (nextHash == '#landing-view') ) {
			// fade out #modal-view, 200
			// ease up .nav-modal, instant
			// ease down and fadeOut currentView, instant
			// show and ease up nextView, 200
			

			modalView.velocity('fadeOut', {
				duration: 200,
				complete: function() {
					navModal.velocity( { 'top': -navModalHeight }, 0 );
					currentView.velocity( 'fadeOut', 0)
											.velocity( { 'top': currentViewHeight }, 0);
					nextView.velocity('fadeIn', {
						duration: 0, 
						complete: function() {
							// scroll to top when loading landing page
							// this is a quick-fix for chrome when using back button to return to #landing-view
							// it prevents #header-content from screwing up
							$('#section1').velocity('scroll', 0);
						}
					}).velocity( { top: '0%' } , {
							duration: 200,
							complete: function() {
								modalOpened = false;
							}
						});


				}
			});
		}

		
		

	}, // end modalHandler


};


/**

 * Slick functions

 */

var slick = {
	/**
	 
	 * Starts and stops Slick on #about card depending on widow width
	 
	 */
	stepsStart: function() {
		if ( $(window).width() <= 550 && $('.steps.slick-initialized').length < 1 ) {
			$('.prev-article').appendTo($('.mobile-switch'));
			$('.next-article').appendTo($('.mobile-switch'));
			$('.steps').slick({	
				dots:false,
				arrows: false,
				swipe: true,
				// autoplay: true
			});
		}
	},
	stepsStop: function() {
		if ($(window).width() > 550 && $('.steps.slick-initialized').length > 0 ) {
			reposition.articleArrowsToLarge();
			if ($('.steps.slick-initialized').length > 0) {
				$('.prev-article').show();
			$('.next-article').show();
				$('.steps').slick("unslick");
			} else { return false; }
		}
	},

	/**
	 * Start Slick on large screens
	 * Large version uses swipe: false on .articles
	 * and autoplay: true on .media
	 */
	articlesStart: function() {
		$('.articles').slick({	// outter carousel (articles)
			arrows: false,
			// autoplay: true,
			swipe: false,
		});

		$('.media').slick({	// inner carousel (images)
			arrows: false,
			autoplay: true,
			dots: true
		});

		// NEXT ARTICLE BUTTON
		$('.next-article').click(function(e) {
			$('.articles').slick('slickNext');
		});
		// PREV ARTICLE BUTTON
		$('.prev-article').click(function(e) {
			$('.articles').slick('slickPrev');
		});

		$('.carousel').hover(function() {
			$('.meta-data').velocity('fadeOut', { duration: 200 });
		}, function() {
			$('.meta-data').velocity('fadeIn', { duration: 200 });
		});
	},

	/**
	* Copy/Share Link
	*	Hides button when clicked and shows link inside input tag
	*/
	enableCopyLink: function() {
		$('.copy-link button').click(function(e) {
			$(this).hide();
			// debugger
			var $index = $(this).attr('data-index');
			var $linkField = $('input[data-index='+ $index +']').show();
			// can't append .focus() since it'll show button again
			// add click event to highlight text in field
			$linkField.click(function(e) {
				$(this).select();
			});
		});
	}

}; // end slick functions


/**

 * MEDIA QUERY AIDS
 * changes the DOM/divs depending on window size
 
 */

var reposition = {
	/**
	
	 * Initizlizes the measurements of the associated view
	 * @param  {string} nextHash ID of next view
	
	 */
	viewMeasurements: function(nextHash) {
		// If the loaded view is #login-view, give .cell-clear a height so it'll vertically center
		// if (nextHash == '#login-view') {
		// 	reposition.loginModal();
		// }
		switch (nextHash) {
			case '#login-view': 
				reposition.loginModal(); 
				reposition.loginSectionDivs(); 
				break;
			case '#careers-view': reposition.fullTimeText(); break;
			case '#press-view': reposition.fullKitText(); break;
			case '#tos-view': reposition.tosText(); break;
		}

	}, // END viewMeasurements

	/**
	
	 * Gives .header-content its correct height so that it can be properly centered inside #section1
	 * @return {number} Returns #header-content height
	
	 */
	headerContent: function() {

	  var headerContent = $('#header-content');
		var targetHeight = 0;
		var windowHeight = $(window).height();

		// get height of all it's children and add it to 'targetHeight'
		// also get it's margin top
	  headerContent.children().each(function(){
	    var child = $(this);
	    var marginTop = parseInt(child.css('margin-top').substring(0,child.css('margin-top').length-2));
	    targetHeight += child.outerHeight();
	    targetHeight += marginTop;
	  });

	  // set styles and make header visible
	  headerContent.css({
	  	'margin-top': (windowHeight - targetHeight) / 2, // move header down to be vertically centered on screen
	  	'height': targetHeight,
	  	'visibility':'visible'
	  });

	  return targetHeight;
		
	},

	/**
	
	 * Moves gallerys' arrows to/from .mobile-switch <div> depending on window size
	 * #landing-view
	
	 */
	articleArrowsToLarge: function() {
		$('.prev-article').prependTo($('#highlights'));
		$('.next-article').appendTo($('#highlights'));
	},
	articleArrowsToSmall: function() {
		$('.prev-article').appendTo($('.mobile-switch'));
		$('.next-article').appendTo($('.mobile-switch'));
	},

	/**
	 
	 * Shift login divs around to spec between from 551-800px
	 * #login-view
	 
	 */
	loginModal: function() {
		var windowWidth = $(window).width();

		// check to see if the #login-card is still in its original location
		// medium size
		// move to new locations
		if ( windowWidth > 550 && windowWidth < 801 && $('.login-forms > > #login-card').length ) {
			var loginCard = $('#login-card');
			var tryoutCard = $('#tryout-card');
			var loginSection = $('.login-section');

			loginCard.prependTo(loginSection);
			tryoutCard.appendTo(loginSection);

			// hide image if login-tab is unselected
			if ($('.login-tab').hasClass('tab-unselected')) {
				$('.login-graphic').velocity('fadeOut', 0 );
			}

		}
		// check to see if the #login-card is in its offset location
		// large and xs size
		// return to original positions
		else if ( (windowWidth > 800 || windowWidth <= 550) && $('.login-section > #login-card').length ) {
			var loginCard = $('#login-card');
			var tryoutCard = $('#tryout-card');
			var loginArea = $('.login-forms .cell-clear');

			loginCard.prependTo(loginArea);
			tryoutCard.appendTo(loginArea);

		}

		// show image if large size and image is hidden via above mod
		if (windowWidth > 800 && $('.login-graphic').css('display') == 'none') {
			$('.login-graphic').velocity('fadeIn', { duration: 0, display: 'table-cell'});
		}
		
		// keep .login-forms padding-top at correct distance down from nav-modal
		var modalNavHeight = $('.nav-modal').height();
		var loginForms = $('.login-forms');
		var loginFormsHeight = loginForms.height();
		var formsPaddingTop = parseInt(loginForms.css('padding-top').replace('px',''));
		
		if (formsPaddingTop != modalNavHeight) {
			loginForms.css('padding-top', modalNavHeight);
		}

		// keep the height of .cell-clear the same as .login-forms so that it'll always be vertically centered
		// this wont work on page load since it's display none; loginForms doesn't have a height
		$('.cell-clear').css('height', loginFormsHeight);
	}, // END loginModal

	/**
	 
	 * Modification of .login-section's width for the purpose of @media-ing the 
	 * #login-view
	 
	 */
	loginSectionDivs: function() {
		var section = $('.login-section');
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var navHeight = $('.nav-modal').height();

		var loginCards = $('.login-forms');
		var cardsWidth = loginCards.width();
		var cardsMargin = parseInt(loginCards.css('margin-left').replace('px','')); // this is the margin-left of .login-forms [16]

		section.css({
			'width': windowWidth - cardsWidth - cardsMargin,
		// 	'height': windowHeight - navHeight,
		// 	'padding-top': navHeight
		});


	},

	/**
	
	 * Changes the text of .full-time-tab > div depending on screen width
	 * #careers-view
	
	 */
	fullTimeText: function() {
		var windowWidth = $(window).width();
		var fullTimeTab = $('.full-time-tab > div');
		var fullTimeText = fullTimeTab.text();

		if (windowWidth <= 550 && fullTimeText === "FULL-TIME POSITIONS") {
			fullTimeTab.text('FULL-TIME');
		}
		else if (windowWidth > 550 && fullTimeText === "FULL-TIME") {
			fullTimeTab.text('FULL-TIME POSITIONS');
		}
	},

	/**
	 
	 * Change 'Full Press Kit' to 'Full Kit' depending on vw in #press-view
	 * #press-view
	 
	 */
	fullKitText: function() {
		var windowWidth = $(window).width();
		var fullKitDiv = $('.press-kit-google-drive span');
		var fullKitText = fullKitDiv.text();

		if (windowWidth <= 550 && fullKitText === "FULL PRESS KIT") {
			fullKitDiv.text("FULL KIT");
		}
		else if (windowWidth > 550 && fullKitText === "FULL KIT") {
			fullKitDiv.text("FULL PRESS KIT");
		}
	},

	/**
	 
	 * Shorten to 'Terms' and 'Privacy' text on small screens
	 * #tos-view
	 
	 */
	tosText: function() {
		var windowWidth = $(window).width();
		var termsDiv = $('.terms-tab');
		var policyDiv = $('.privacy-tab');

		if (windowWidth <= 550 && termsDiv.text() === "TERMS OF SERVICE") {
			termsDiv.text("TERMS");
			policyDiv.text("PRIVACY");
		}
		else if (windowWidth > 550 && termsDiv.text() === "TERMS") {
			termsDiv.text("TERMS OF SERVICE");
			policyDiv.text("PRIVACY POLICY");
		}

	},

	/**
	 
	 * When opening a modal, set the height and margin-top to .modal-content
	 * This aids vertical alignment
	 
	 */
	modalContent: function() {
		var windowHeight = $(window).height();
		var navModalHeight = $('.nav-modal').height();
		var modalContent = $('.modal-content');

		modalContent.css({
			'height': windowHeight - navModalHeight,
			'margin-top': navModalHeight 
		});
	}
	

}; // END REPOSITION


/**
 
 * DOCUMENT READY
 
 */

$(function()	 {

/*

* Document load

*/
	var headerHeight = 0; // height of #header-content
	$(window).bind("load", function() {
		headerHeight = reposition.headerContent();
	});

	initialize.windowCheck();
	initialize.spaHistory();
	initialize.getHighlights();
	initialize.smoothScroll();
	initialize.loginViewEvents();
	initialize.selectOptionColor();
	initialize.careersViewEvents();
	initialize.contactViewEvents();
	initialize.tosViewEvents();
	initialize.resetPassEvents();
	

/*

* Window Resize Event

*/

	$(window).resize(function() {
		reposition.headerContent();
		reposition.loginModal();
		reposition.loginSectionDivs();
		reposition.fullTimeText();
		reposition.fullKitText();
		reposition.tosText();
		reposition.modalContent();

		/*
		Check Window size and start/stop slick on #About accordingly
		 */
		
		// checks to make sure slick's not already started
		// if ( $(window).width() <= 550 && $('.steps.slick-initialized').length < 1 ) {
			slick.stepsStart();
		// }
		// else if ($(window).width() > 550 && $('.steps.slick-initialized').length > 0 ) {
			slick.stepsStop();
		// }
	}); // end $(window).resize





/**

 * Scroll event

 */

 	var windowHeight = $(window).height();

 	// for nav bar's slideUp and slideDown
	var slideInProgress = false;
	var nav = $('#main-nav');

	// for parallax effect on #header-content
 	var parallaxThresholdPosition = 0;
 	// var parallaxThresholdSaved = false;


 	window.addEventListener('scroll',function() { 
 		/**

	  * PARALLAX

	  */
		var target = $('#header-content');
		var targetOffset = target.offset().top;

		var scrolled = window.pageYOffset;

		var section2 = $('#section2');
		var section2Offset = section2.offset().top;
		
		var targetOffsetFull = targetOffset + headerHeight; // headerHeight is gotten from document.ready
		var targetSectionDiff = section2Offset - targetOffsetFull;
		
		var speedDivider = 0.65;
		var margin = 120;

		// var a = parallaxThresholdPosition
		// space between section2 and bottom of #header-content is greater than margin
		// scrolled distance is less than parallaxThresholdPosition
		if ( (targetSectionDiff > margin || scrolled <= parallaxThresholdPosition) ) {
			parallaxThresholdPosition = targetOffset - margin;
			target.css('top', scrolled * speedDivider);
		}
		// console.log(parallaxThresholdPosition - a)
		$('.info').html("Diff: "+targetSectionDiff+
										"<br>Margin: "+margin+
										"<br>Scrolled: "+scrolled+
										"<br>P ThreshPos: "+parallaxThresholdPosition+
										"<br>Header@: "+targetOffset);

		// jumps really far down if hitting back button while using SPA history
		if (targetSectionDiff < margin) {
			// target.css('top', section2Offset - headerHeight - margin);
		}

		// END PARALLAX
		
		
		/**
		
		* NAV BAR APPEARS AFTER THRESHOLD
		
		*/
	
		var threshold = $('.top').height() - 120;
		var section2 = $('#section2');
		// If the nav bar is hidden, and we are part of the threshold
		if( nav.position().top < 0 && scrolled > threshold && !slideInProgress && !modalOpened) {
			slideInProgress = true;
			
			$(nav).velocity(
				{top: 0}, { 
					duration: 200,
					complete: function() {
						slideInProgress = false;
					}
			});

		}
		else if( nav.position().top >= 0 && scrolled < threshold && !slideInProgress && !modalOpened){ 

			slideInProgress = true;

			var navHeight = nav.height();
			
			$(nav).velocity(
				{top: -navHeight - 20}, // offset it more from the top to hide the box shadow
				{
				duration: 200,
				complete: function() {
					slideInProgress = false;
				}
			});
		}

	}); // end $(window).scroll

	

}); // end document.ready

/**
 * Remove current History.state in case user refreshes page
 * This removes modal transition issues
 * Not a perfect solution for user page refreshes but it's the best we've got atm
 */

if (history.state) {
	history.replaceState(null,null,null);
}

/**
 * 
 * DISABLE RIGHT CLICKS
 * 
 */

// document.addEventListener('contextmenu', function(event) {
// 	if (event.button === 2) { event.preventDefault(); }
// });

/**
 
 * DISABLE DRAGGING

*/

// document.ondragstart = function() { return false; };
