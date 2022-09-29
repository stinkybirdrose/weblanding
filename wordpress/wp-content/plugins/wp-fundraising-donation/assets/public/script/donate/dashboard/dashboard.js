"use strict";
/*Nav Menu*/
jQuery(document).ready(function(){
	jQuery('.wfp-main-menu > .wfp-menu-item').on('click', function(e){
		//e.preventDefault();
		jQuery(".wfp-menu-item").removeClass('opend');
		jQuery(this).addClass('opend');
	});
	
});

/*
* show hide button
*/
function xs_show_hide_dashboard_multiple(dat, target){
	var showHide = document.querySelectorAll(dat);
	if(showHide){
		for(var m = 0; m < showHide.length; m++){
			showHide[m].classList.remove('xs-donate-visible');
		}
	}
	var targetShow = document.querySelectorAll(target);
	if(targetShow){
		for(var n = 0; n < targetShow.length; n++){
			targetShow[n].classList.add('xs-donate-visible');
		}
	}
}

function wfp_show_hide(target){
	var targetShow = document.querySelectorAll(target);
	if(targetShow){
		for(var n = 0; n < targetShow.length; n++){
			targetShow[n].classList.toggle('xs-donate-visible');
		}
	}
}

function xs_show_hide_parents_elements_dash(evn){
	if(evn){
		jQuery(evn).find('span.toggle-indicator').toggleClass('active');
		var hiddenDiv = jQuery(evn).parents('.xs-pledge-row').find('.xs-row-body');
		if(hiddenDiv){
			hiddenDiv.toggleClass('xs-donate-visible');
		}
	}
}

/*
* Modify label name
*/

function xs_modify_lebel_name_dash(evn) {
	var idData = jQuery("#" + evn.id);
	if (idData) {
		var parentAppend = jQuery(evn).parents('.xs-repeater-field-wrap').find('.level_donate_multi');
		if(parentAppend){
			parentAppend.html(jQuery(evn).val());
		}
	}
}


function wfp_choose_image(e){
   
   if(!e){
	  return ; 
   }
   var list = document.querySelector('#wfp-file_list');
   if(!list){
	 return;  
   }
   list.innerHTML = '';
   var filesLength = e.files.length;
   for(var i = 0; i < filesLength; i++){
	   var imageLink = '';
	   var f = e.files[i];
	   var name = f.name;
	   var size = wfP_format_file_size(f.size, 2);
	   var tmppath = URL.createObjectURL(f);
	   
	   var path = name.replace(/ /g, "_");
	   
	   if(!f.type.match("image.*")) {
			return;
		}
	   if(path.length > 4){
		   imageLink = '<span class="wfpf wfpf-close-outline remove-icon" onclick="wfp_reviwe_image(this.parentElement)"></span><img class="imageThumb" src="' + tmppath + '" title="' + name + '"/><input type="hidden" value="'+path+'" name="wfp_uploaded[]" id="image-set-'+i+'"/><span class="sizefiles">'+size+'</span>';
		   var li = document.createElement('li');
		   li.setAttribute('id', 'wfp-upload-set-id__'+i);
		   li.setAttribute('class', 'preview_image');
		   //li.setAttribute('onclick', 'wfp_reviwe_image(this)');
		   li.innerHTML =  imageLink;
		   list.append(li);
	   }
   }
   
}

function wfP_format_file_size(bytes,decimalPoint) {
   if(bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimalPoint || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function wfp_reviwe_image(ele){
	if(ele){
		ele.remove(ele);
	}
}




/*Profile Submit*/
/*
 * Ajax Submit Donation form
 */
 
jQuery(document).ready(function (event) {
	jQuery('#wfp_regForm_profile_content').submit(ajaxDonateSubmit);

	function ajaxDonateSubmit(e) {
		e.preventDefault();
		
		var donateForm = jQuery(this).serialize();
		document.getElementsByTagName('body')[0].classList.add('wfp-disabled');
		
		jQuery.ajax({
			data: donateForm,
			type: 'post',
			url: window.xs_donate_url.resturl+'xs-profile-form/billing-submit/12',
			beforeSend : function( xhr ) {
			   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
			},
			success: function (response) {
				document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
				var messageData = jQuery('.message-campaign-status');				
				if (messageData) {
					messageData.addClass('xs-alert xs-alert-success').html(response.success).hide().fadeIn();
					return;
				}
				
			}
		});

	}
});
/*
 * Ajax Submitfor password modify
 */
jQuery(document).ready(function (event) {
	jQuery('#wfp_regForm_password_content').submit(ajaxDonateSubmit);

	function ajaxDonateSubmit(e) {
		e.preventDefault();
		
		var donateForm = jQuery(this).serialize();
		document.getElementsByTagName('body')[0].classList.add('wfp-disabled');
		
		jQuery.ajax({
			data: donateForm,
			type: 'post',
			url: window.xs_donate_url.resturl+'xs-password-form/password-submit/11',
			beforeSend : function( xhr ) {
			   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
			},
			success: function (response) {
				document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
				var messageData = jQuery('.message-password-status');				
				if (messageData) {
					if (response.error.length > 0) {
						messageData.removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error).hide().fadeIn();
						return;
					}
					if (response.success.length > 0) {
						messageData.removeClass('xs-alert-danger').addClass('xs-alert xs-alert-success').html(response.success).hide().fadeIn();
						return;
					}
				}
				
			}
		});

	}
});

// mobile menu
(function($){
	$(function(){
		$('.wfp-mobile-nav--icon').on('click', function(){
			var self = $(this),
				parentDiv = self.closest('.wfp-dashboard'),
				sidebar 	= parentDiv.find('.dashboard-left-section');
	
			sidebar.toggleClass('opened');
		});
		
		// closing menubar
		$('.wfp-mobile-close-btn').on('click','.wfp-mobile-close-btn--icon', function(){
			$('.wfp-mobile-nav--icon').trigger('click');
		})
	});
}(jQuery));