"use strict";
/*
* Start Tab js
*/
jQuery(document).ready(function() {
	function nx_tab_setActive() {
		setTimeout(function() {
			var hash = window.location.hash.substr(1);
			if(hash) {
				jQuery('.xs-donate-metabox-tabs li').removeClass('active');
				jQuery('.xs-donate-metabox-tabs li a[href="#' + hash + '"]').parent().addClass('active');
				jQuery('.xs-donate-metabox-div > div').removeClass('active');
				jQuery('.xs-donate-metabox-div > div#' + hash).addClass('active');
				/*if(document.getElementsByName('_wp_original_http_referer')){
					 document.getElementsByName('_wp_original_http_referer')[0].value = window.location.href;
				}*/
			}
		}, 15);
	}

	nx_tab_setActive(); // On Page Load
	jQuery('.xs-donate-metabox-tabs li a[href*="#"]').click(function() {
		nx_tab_setActive();
	});


});

/*
* End Tab js
*/

function xs_show_hide_parents_elements(evn) {
	if(evn) {
		jQuery(evn).find('span.toggle-indicator').toggleClass('active');
		var hiddenDiv = jQuery(evn).closest('.xs-repeater-field-wrap').find('.xs-row-body'),
			parentDiv = hiddenDiv.closest('.xs-repeater-field-wrap');

		if(hiddenDiv) {
			hiddenDiv.toggleClass('xs-donate-visible');

			if(parentDiv.hasClass('xs-opened')) {
				parentDiv.removeClass('xs-opened').addClass('xs-closed');
			} else {
				parentDiv.removeClass('xs-closed').addClass('xs-opened');
			}
		}
	}
}

/*
* Modify label name
*/
function xs_modify_lebel_name(evn) {
	var idData = jQuery("#" + evn.id);
	if(idData) {
		var parentAppend = jQuery(evn).parents('.xs-repeater-field-wrap').find('.level_donate_multi');
		if(parentAppend) {
			parentAppend.html(jQuery(evn).val());
		}
	}
}

/*
* disable / enable donation type
*/
function xs_donate_donation_type(dat) {

	var fixedData = document.querySelector('.xs-donate-fixed-field-section');
	var repeterData = document.querySelector('.xs-donate-repeatable-field-section');
	var repeterDisplayData = document.querySelector('.xs-donate-repeatable-field-section-display');
	if(fixedData) {
		fixedData.classList.toggle('xs-donate-visible');
	}
	if(repeterData) {
		repeterData.classList.toggle('xs-donate-visible');
	}
	if(repeterDisplayData) {
		repeterDisplayData.classList.toggle('xs-donate-visible');
	}
}

/*
* show hide button
*/
function xs_show_hide_donate(dat) {
	var showHide = document.querySelectorAll(dat);
	if(showHide) {
		for(var m = 0; m < showHide.length; m++) {
			showHide[m].classList.toggle('xs-donate-visible');
		}
	}
}

/*
* show hide button
*/
function xs_show_hide_donate_multiple(dat, target) {
	var showHide = document.querySelectorAll(dat);
	if(showHide) {
		for(var m = 0; m < showHide.length; m++) {
			showHide[m].classList.remove('xs-donate-visible');
		}
	}
	var targetShow = document.querySelectorAll(target);
	if(targetShow) {
		for(var n = 0; n < targetShow.length; n++) {
			targetShow[n].classList.add('xs-donate-visible');
		}
	}
}

/*
* show hide attribute
*/
function xs_show_hide_donate_attr(dat, attr) {
	var showHide = document.querySelectorAll(dat);
	if(showHide) {
		for(var m = 0; m < showHide.length; m++) {
			showHide[m].toggleAttribute(attr);
		}
	}
}

/*
* Set defautlt options
*/
function wdp_set_defult_amount(dat) {
	var setDefault = document.querySelectorAll('.xs_donate_set_default');
	if(setDefault) {
		for(var m = 0; m < setDefault.length; m++) {
			setDefault[m].checked = false;
		}
		dat.checked = true;
	}
}

/*
* Set defautlt options
*/
function wdp_set_defult_amount_pledge(dat) {
	var setDefault = document.querySelectorAll('.xs_pledge_set_default');
	if(setDefault) {
		for(var m = 0; m < setDefault.length; m++) {
			setDefault[m].checked = false;
		}
		dat.checked = true;
	}
}

// this function for copy data of Review Shortcode

function wdp_copyTextData(FIledid) {
	var FIledidData = document.querySelector("#" + FIledid);
	if(FIledidData) {
		FIledidData.select();
		document.execCommand("copy");
	}
}

jQuery(document).ready(function($) {
	jQuery('.wfdp_color_field').each(function() {
		$(this).wpColorPicker();
	});
});


// update status of donate
function wdp_status_modify_report(dat) {
	event.preventDefault();
	var idData = dat.id;
	var valueData = dat.value;

	var donateForm = 'id=' + idData + '&status=' + valueData;
	jQuery.ajax({
		data: donateForm,
		type: 'get',
		url: window.wfp_conf.resturl + 'xs-donate-form/donate-active/' + idData,
		beforeSend: function(xhr) {
			xhr.setRequestHeader('X-WP-Nonce', wfp_conf.nonce);
		},
		success: function(response) {

			if(response.error.length > 0) {
				var parentDIv = dat.parentElement;
				var messageData = parentDIv.querySelector('.message-donate-status');
				if(!messageData) {
					var createMessageDoc = document.createElement('span');
					createMessageDoc.setAttribute('class', 'message-donate-status');
					parentDIv.insertBefore(createMessageDoc, parentDIv.childNodes[0]);
					var messageData = parentDIv.querySelector('.message-donate-status');
				}
				messageData.innerHTML = response.error;
				return;
			}

			if(response.success.length > 0) {
				//messageData.innerHTML = response.success;
				dat.setAttribute('class', response.success);
				return;
			}
		}
	});
}

// update status of donate
function wdp_payment_modify_report(dat) {
	event.preventDefault();
	var idData = dat.querySelector('input[name="paymenttype"]').value;

	var donateForm = 'type=' + idData;
	jQuery.ajax({
		data: donateForm,
		type: 'get',
		url: window.xs_donate_url.resturl + 'xs-donate-form/payment-type-modify/' + idData,
		success: function(response) {

			if(response.error.length > 0) {
				return;
			}
			if(response.success.length > 0) {
				xs_show_hide_donate_multiple('.welcome-default-check', '.' + idData + '-target-welcome');

				xs_show_hide_donate('.wfp-woocommerce-message');

				var paymentDiv = document.querySelectorAll(".wfp-disabled-div");
				if(paymentDiv) {
					for(var m = 0; m < paymentDiv.length; m++) {
						paymentDiv[m].classList.toggle('wfp-disabled');
					}
				}
			}
		}
	});
}


jQuery(document).ready(function($) {
	$(".datepicker-donate").each(function() {
		var parent = $(this).parent('.search-tab'),
			noDate = $(this).parent('.search-tab').hasClass('wfp-no-date-limit'),
			config = {
				appendTo: parent.get(0),
				dateFormat: 'Y-m-d'
			};

		if(!noDate) {
			config.maxDate = "today";
		}

		$(this).flatpickr(config);

	});
});
