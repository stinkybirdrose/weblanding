"use strict";
jQuery(document).ready(function () {
	// open fancybox
	jQuery(".xs_popup_gallery").click(function(event){
		event.preventDefault();
		Fancybox.show(
			[
			  {
				src: `${jQuery(this).attr('href')}`,
				type: "image"
			  },
			],
		);
	});

});


/*Ratting script*/
jQuery(document).ready(function(){
  
  jQuery('#xs_review_stars li').on('mouseover', function(){
    var onStar = parseInt(jQuery(this).data('value'), 10); // The star currently mouse on
   jQuery(this).parent().children('li.star-li').each(function(e){
      if (e < onStar) {
        jQuery(this).addClass('hover');
      }
      else {
        jQuery(this).removeClass('hover');
      }
    });
    
  }).on('mouseout', function(){
    jQuery(this).parent().children('li.star-li').each(function(e){
      jQuery(this).removeClass('hover');
    });
  });
  
  
  jQuery('#xs_review_stars li').on('click', function(){
    var onStar = parseInt(jQuery(this).data('value'), 6); // The star currently selected
	var stars = jQuery(this).parent().children('li.star-li');
    
    for (let i = 0; i < stars.length; i++) {
      jQuery(stars[i]).removeClass('selected');
    }
    
    for (let i = 0; i < onStar; i++) {
      jQuery(stars[i]).addClass('selected');
    }
    
	var displayId = jQuery(this).parents().find('input#ratting_review_hidden');
	displayId.val(onStar);
	
	var msg = "";
    if (onStar > 1) {
        msg = "<strong>" + onStar + "</strong>";
    }
    else {
        msg = "<strong>" + onStar + " </strong>";
    }
    
  });
  
});


/* review post */

jQuery(document).ready(function (event) {
	jQuery('.wfp-user-review').submit(ajaxReviewSubmit);

	function ajaxReviewSubmit(e) {
		e.preventDefault();
		
		var reviewForm = jQuery(this).serialize();
		document.getElementsByTagName('body')[0].classList.add('wfp-disabled');
		
		var idfo = this.id;
		var idData = idfo.split('-');
		var idForm = idData[idData.length - 1];
		
		let form_id = document.querySelector('#'+idfo);
		
		jQuery.ajax({
			data: reviewForm,
			type: 'post',
			url: window.xs_donate_url.resturl+'xs-review-form/user-review/'+idForm,
			beforeSend : function( xhr ) {
			   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
			},
			success: function (response) {
				document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
				var messageData = jQuery('.message-review-status');		
				
				if (response.error.length > 0) {
					messageData.removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error);
					return;
				}
				
				form_id.reset();
				
				var nextB = form_id.querySelector(".wfp-form-button");
				if(nextB){
					nextB.disabled = true;
				}
						
				if (messageData) {
					messageData.removeClass('xs-alert-danger').addClass('xs-alert xs-alert-success').html(response.success);
					
					window.location.reload();
					return;
				}
				
			}
		});

	}
});

/* review post */

jQuery(document).ready(function (event) {
	jQuery('.wfp-user-update').submit(ajaxUpdateSubmit);

	function ajaxUpdateSubmit(e) {
		e.preventDefault();
		
		var reviewForm = jQuery(this).serialize();
		document.getElementsByTagName('body')[0].classList.add('wfp-disabled');
		
		var idfo = this.id;
		var idData = idfo.split('-');
		var idForm = idData[idData.length - 1];
		
		let form_id = document.querySelector('#'+idfo);
		
		jQuery.ajax({
			data: reviewForm,
			type: 'post',
			url: window.xs_donate_url.resturl+'xs-update-form/user-update/'+idForm,
			beforeSend : function( xhr ) {
			   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
			},
			success: function (response) {
				document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
				var messageData = jQuery('.message-update-status');		
				
				if (response.error.length > 0) {
					messageData.removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error).hide().fadeIn();
					return;
				}
				
				form_id.reset();
				
				var nextB = form_id.querySelector(".wfp-form-button");
				if(nextB){
					nextB.disabled = true;
				}
						
				if (messageData) {
					messageData.removeClass('xs-alert-danger').addClass('xs-alert xs-alert-success').html(response.success).hide().fadeIn();
					window.location.reload();
					return;
				}
				
			}
		});

	}
});


/*Review delete*/
function wfp_remove_review(dat){
	let idval = dat.id;
	if(!confirm('Are you sure? Remove this review.')){
		return false;
	}
	let reviewId = 'review'+idval;
	var reviewId_html = jQuery('#'+reviewId);

	let reviewForm = '';
	jQuery.ajax({
		data: reviewForm,
		type: 'get',
		url: window.xs_donate_url.resturl+'xs-review-form/delete-review/12?params='+idval,
		beforeSend : function( xhr ) {
		   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
		},
		success: function (response) {
			var messageData = jQuery('#span-'+reviewId);
				
			if (response.error.length > 0) {
				messageData.removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error).hide().fadeIn();
				return;
			}

			if (messageData) {
				reviewId_html.html('').remove();
				messageData.removeClass('xs-alert-danger').addClass('xs-alert xs-alert-success').html(response.success).hide().fadeIn();
				
				return;
			}
		}
	});
}

/*
Review Edit
*/
function wfp_edit_review(dat){
	let idval = jQuery(dat).attr('data-id');
	//alert(idval);
	let reviewForm = '';
	jQuery.ajax({
		data: reviewForm,
		type: 'get',
		url: window.xs_donate_url.resturl+'xs-review-form/update-review/12?params='+idval,
		beforeSend : function( xhr ) {
		   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
		},
		success: function (response) {
			var messageData = jQuery('#span-reviewwfp-re__'+idval);	
			if (response.error.length > 0) {
				messageData.removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error).hide().fadeIn();
				return;
			}
			jQuery(document).scrollTop(jQuery(document).height());


			// reviwer name
			let reviewer_name = jQuery('#reviewer_name');
			if(reviewer_name && response.success.name){
				reviewer_name.val(response.success.name);
				reviewer_name.addClass('wfp-disabled-input');
			}

			// reviwer email
			let reviewer_email = jQuery('#reviewer_email');
			if(reviewer_email && response.success.email){
				reviewer_email.val(response.success.email);
				reviewer_email.addClass('wfp-disabled-input');
			}

			// reviwer summery
			let reviewer_summery = jQuery('#reviewer_summery');
			if(reviewer_summery && response.success.summery){
				reviewer_summery.val(response.success.summery);
			}

			// reviwer parent
			let reviewer_parent = jQuery('#reviewer_parent');
			if(reviewer_parent && response.success.parent){
				reviewer_parent.val(response.success.parent);
			}
			// reviwer ratting
			let ratting_review_hidden = jQuery('#ratting_review_hidden');
			let rattings = 1;
			if(ratting_review_hidden && response.success.ratting){
				ratting_review_hidden.val(response.success.ratting);
				rattings = response.success.ratting;
			}
			
			jQuery('#wfp-review-button').html('Update');

			// rattings
			var stars = jQuery('#xs_review_stars').children('li.star-li');
			
			for (let i = 0; i < stars.length; i++) {
				jQuery(stars[i]).removeClass('selected');
			}
			
			for (let i = 0; i < rattings; i++) {
				jQuery(stars[i]).addClass('selected');
			}

		}
	});
}

// jQuery(window).on('scroll', function(){
// 	var pageTop = jQuery(window).scrollTop();
// 	var element = jQuery('.wfp-single-pledges');
// 	var pageBottom = pageTop + jQuery(window).height();
// 	var elementTop = element.offset().top;
// 	var elementBottom = elementTop + element.height();
// 	// if (fullyInView === true) {
// 	// 	// return ((pageTop < elementTop) && (pageBottom > elementBottom));

// 	// 	console.log()
// 	// } else {
// 	// 	// return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
// 	// }
// 	element.removeClass('wfp-fixed')

// 	if((pageTop < elementTop) && (pageBottom > elementBottom)){
// 		element.toggleClass('wfp-fixed');
// 	}

// 	console.log(pageTop);
// });	

// pie config
jQuery(function($) {
	$('.xs_donate_chart').easyPieChart({
		barColor: '#ef1e25',
		trackColor: '#f2f2f2',
		scaleColor: false,
		lineWidth: 9,
		lineCap: 'round',
		animate: 2000
	});
});