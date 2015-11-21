////Gallery for landing page

// <%= highlights[index].owner ? highlights[index].owner.avatar || 'https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png' :  'https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png' %>

function initGallery(gallery, index){

	// check to make sure location isn't 'null'
	var location = gallery.posts[0].location.address;
	if (location == null || !location) {
		location = 'No Location Submitted';
	}

	// var location = gallery.posts[0].location.address  = 'null' ?

	// checks for owner's avatar
	var avatar = gallery.owner? gallery.owner.avatar || "https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png" : "https://d1dw1p6sgigznj.cloudfront.net/images/user-1.png"

	return "<div class='article'>\
						<div class='carousel'>\
							<!-- left part of the div -->\
							<div class='media'>\
								<div class='gallery-image' style='background-image: url(" + gallery.posts[0].image + ") '>\
									<div class='meta-data'>\
										<table>\
											<tr class='owner'>\
												<td class='icon avatar'><img src=' " + avatar + " '></td>\
												<td id='owner-name'>" + gallery.posts[0].byline + "</td>\
											</tr>\
											<tr class='location'>\
												<td class='icon'><i class='mdi mdi-map-marker'</i></td>\
												<td class='owner-location'>" + location + "</td>\
											</tr>\
											<tr class='time'>\
												<td class='icon'><i class='mdi mdi-clock'></i></td>\
												<td class='owner-time'>" + getTimeAgo(gallery.time_created) + "</td>\
											</tr>\
										</table>\
									</div>\
								</div>\
								<div class='gallery-image' style='background-image: url(" + gallery.posts[0].image + ") '>\
									<div class='meta-data'>\
										<table>\
											<tr class='owner'>\
												<td class='icon avatar'><img src=' " + avatar + " '></td>\
												<td id='owner-name'>" + gallery.posts[0].byline + "</td>\
											</tr>\
											<tr class='location'>\
												<td class='icon'><i class='mdi mdi-map-marker'</i></td>\
												<td class='owner-location'>" + location + "</td>\
											</tr>\
											<tr class='time'>\
												<td class='icon'><i class='mdi mdi-clock'></i></td>\
												<td class='owner-time'>" + getTimeAgo(gallery.time_created) + "</td>\
											</tr>\
										</table>\
									</div>\
								</div>\
							</div>\
						</div>\
							<!-- right part of the div -->\
						<div class='read'>\
							<div class='caption'><p>" + gallery.caption + "</p></div>\
							<div class='share'>\
								<table class='share-buttons'>\
									<tr>\
										<td class='copy-link'>\
											<button data-index='"+index+"'>\
												<i class='mdi mdi-link-variant'></i>\
												<span>Copy Link</span>\
											</button>\
											<input data-index='"+index+"' type='text' value='"+ "copy this" +"'>\
										</td>\
										<td>\
											<a href='#'><i class='mdi mdi-twitter twitter'></i></a>\
										</td>\
										<td class='facebook'>\
											<a href='#'><i class='mdi mdi-facebook-box facebook'></i></a>\
										</td>\
									</tr>\
								</table>\
							</div>\
						</div>\
					</div>";

}

var getTimeAgo = function(timestamp){
	    var intervals = {
		        year: 31556926, month: 2629744, week: 604800, day: 86400, hour: 3600, minute: 60
			};

	    var diff = Date.now() - timestamp;
		diff = Math.floor(diff / 1000);

	    //now we just find the difference
	    if (diff <= 0)
	        return 'Just now';
	    if (diff < 60)
	        return diff == 1 ? diff + ' second ago' : diff + ' seconds ago';
	    if (diff >= 60 && diff < intervals['hour']){
	        diff = Math.floor(diff/intervals['minute']);
	        return diff == 1 ? diff + ' minute ago' : diff + ' minutes ago';
	    }
	    if (diff >= intervals['hour'] && diff < intervals['day']){
	        diff = Math.floor(diff/intervals['hour']);
	        return diff == 1 ? diff + ' hour ago' : diff + ' hours ago';
	    }
		if (diff >= intervals['day'] && diff < intervals['week']){
	        diff = Math.floor(diff/intervals['day']);
	        return diff == 1 ? diff + ' day ago' : diff + ' days ago';
	    }
	    if (diff >= intervals['week'] && diff < intervals['month']){
	        diff = Math.floor(diff/intervals['week']);
	        return diff == 1 ? diff + ' week ago' : diff + ' weeks ago';
	    }
	    if (diff >= intervals['month'] && diff < intervals['year']){
	        diff = Math.floor(diff/intervals['month']);
	        return diff == 1 ? diff + ' month ago' : diff + ' months ago';
	    }
	    if (diff >= intervals['year']){
	        diff = Math.floor(diff/intervals['year']);
	        return diff == 1 ? diff + ' year ago' : diff + ' years ago';
	    }
	}