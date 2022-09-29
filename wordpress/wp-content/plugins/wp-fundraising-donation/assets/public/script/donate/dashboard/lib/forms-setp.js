"use strict";
/**
* Javascript Form Validation form
* Package: valid form
* Author: ataurr
* Version: 1.6.0
*/
function wfp_tab_control(contrl){
	var stepIndex = '0-0', currentIform = '0';
	
	var formsid = document.querySelectorAll(contrl);
	if(formsid){
		for(var m = 0; m < formsid.length; m++){
			if(formsid[m]){
				formsid[m].setAttribute('wfp-forms-index', m);
				__step_control(formsid[m]);
				__tabs_control(formsid[m]);
				
				// preview button control
				var preview = formsid[m].querySelector(".wfp-preview");
				if(preview){
					preview.addEventListener("click", __wfp_button_control);
					preview.setAttribute('wfp-button-type', 'pre');
					preview.setAttribute('wfp-button-index', m);
				}
				// next button control
				var nextBut = formsid[m].querySelector(".wfp-next");
				if(nextBut){
					nextBut.addEventListener("click", __wfp_button_control);
					nextBut.setAttribute('wfp-button-type', 'next');
					nextBut.setAttribute('wfp-button-index', m);
				}
			}
		}
	}
	
	// setp control section
	function __step_control(formsid_get){
		var getControl = formsid_get.querySelector('.wfp-tab-step-control');
		
		var formIndex = formsid_get.getAttribute('wfp-forms-index');
		if(!formIndex){
			formIndex = 0;
		}
		
		if(getControl){
			var enableStep =  getControl.getAttribute('wfp-control');
			if(!enableStep){
				enableStep = 'yes';
			}
			var getStep = getControl.querySelectorAll('.wfp-step');
			if(getStep){
				for(var step = 0; step < getStep.length; step++){
					if(getStep[step]){
						if(enableStep == 'yes'){
							getStep[step].addEventListener('click', __wfp_show_tab);
						}
						getStep[step].setAttribute("wfp-step-index", Number(formIndex)+'-'+Number(step));
						
					}
						
				}
			}
		}
	}
	
	// tabs control
	function __tabs_control(formsid_get){
		var getTabs = formsid_get.querySelector('.wfp-tabs-control');
		
		var formIndex = formsid_get.getAttribute('wfp-forms-index');
		if(!formIndex){
			formIndex = 0;
		}
		
		if(getTabs){
			var getTab = getTabs.querySelectorAll('.wfp-tab');
			if(getTab){
				for(var tab = 0; tab < getTab.length; tab++){
					if(getTab[tab]){
						getTab[tab].setAttribute("wfp-tab-index", Number(formIndex)+'-'+Number(tab));
					}
						
				}
			}
		}
	}
	
	// show tab section
	function __wfp_show_tab(event){
		event.preventDefault();
		
		var stepIndex = (this).getAttribute("wfp-step-index");
		if(!stepIndex){
			stepIndex = '0-0';
		}
		//check current tab
		var exp = stepIndex.split('-');
		var currentIform = Number(exp[0]);
		var currentIndex = Number(exp[1]);
		var forms_dat = document.querySelector("[wfp-forms-index='"+currentIform+"']");
		if(!forms_dat){
			return false;
		}
		var stepData = forms_dat.querySelector(".wfp-step.active");
		if(!stepData){
			return false;
		}
		var tabIndex = stepData.getAttribute("wfp-step-index");
		if(!tabIndex){
			tabIndex = '0-0';
		}
		var returndata = __wfp_validateForm(forms_dat, tabIndex);
		if(!returndata){
			return false;
		}
		
		// open next tab
		__wfp_open_tab(stepIndex);
	}
	
	// open tab function
	function __wfp_open_tab(step){
		
		var exp = step.split('-');
		var currentIform = Number(exp[0]);
		var currentIndex = Number(exp[1]);
		
		var forms_dat = document.querySelector("[wfp-forms-index='"+currentIform+"']");
		if(forms_dat){
			// for step
			
			__wfp_active_step(forms_dat, currentIndex);
			var stepData = forms_dat.querySelector("[wfp-step-index='"+step+"']");
			stepData.classList.add('active');
			
			// for tab
			__wfp_active_tab(forms_dat, currentIndex);
			var tabData = forms_dat.querySelector("[wfp-tab-index='"+step+"']");
			tabData.classList.add('active');
			
			// button control
			var preview = forms_dat.querySelector(".wfp-preview");
			if(preview){
				if(currentIndex == 0){
					preview.classList.remove('open');
				}else{
					preview.classList.add('open');
				}
				
			}
			
			var nextB = forms_dat.querySelector(".wfp-next");
			if(nextB){
				var total = 0;
				var getTab = forms_dat.querySelectorAll('.wfp-tabs-control .wfp-tab');
				if(getTab){
					total = getTab.length;
				}
				if( (Number(currentIndex) + 1) == total){
					nextB.classList.add('finish');
					
					// replace submit text
					var submitText = nextB.getAttribute("wfp-finish-button");
					if(submitText){
						var dataFIled = nextB.innerHTML;
						var previusText = nextB.innerText;
						var resData = dataFIled.replace(previusText, submitText);
						nextB.innerHTML = resData;
						
						var previusTextCheck = nextB.getAttribute("wfp-next-button");
						if(!previusTextCheck){
							nextB.setAttribute("wfp-next-button", previusText);
						}
					}
					
				}else{
					nextB.classList.remove('finish');
					var submitText = nextB.getAttribute("wfp-finish-button");
					if(submitText){
						var dataFIled = nextB.innerHTML;
						var previusTextInner = nextB.innerText;
						var previusText = nextB.getAttribute("wfp-next-button");
						if(previusText && previusTextInner != previusText){
							var resData = dataFIled.replace(submitText, previusText);
							nextB.innerHTML = resData;
						}
					}
				}
				
				
			}
		}
		
	}
	
	// active step
	function __wfp_active_step(formID, currentStep){
		var getControl = formID.querySelector('.wfp-tab-step-control');
		if(getControl){
			var getStep = getControl.querySelectorAll('.wfp-step');
			if(getStep){
				for(var step = 0; step < getStep.length; step++){
					if(getStep[step]){
						getStep[step].classList.remove('active');
						getStep[step].classList.remove('finish');						
						if(step < currentStep){
							getStep[step].classList.add('finish');
						}
					}	
				}
			}
		}
	}
	
// active tab
	function __wfp_active_tab(formID, currentTab){
		var getTabs = formID.querySelector('.wfp-tabs-control');
		
		if(getTabs){
			var getTab = getTabs.querySelectorAll('.wfp-tab');
			if(getTab){
				for(var tab = 0; tab < getTab.length; tab++){
					if(getTab[tab]){
						getTab[tab].classList.remove('active');
						getTab[tab].classList.remove('finish');	
						if(tab < currentTab){
							getTab[tab].classList.add('finish');
						}
					}
						
				}
			}
		}
	}


	// button control
	function __wfp_button_control(event){
		event.preventDefault();
		var getIndex = this.getAttribute('wfp-button-index');
		if(!getIndex){
			getIndex = 0;
		}
		
		var getType = this.getAttribute('wfp-button-type');
		if(!getType){
			getType = 'next';
		}
		
		var forms_dat = document.querySelector("[wfp-forms-index='"+getIndex+"']");
		if(forms_dat){
			var tabData = forms_dat.querySelector(".wfp-tab.active");
			if(!tabData){
				return false;
			}
			
			var currStep = tabData.getAttribute('wfp-tab-index');
			if(!currStep){
				return false;
			}
			var returndata = __wfp_validateForm(forms_dat, currStep);
			if(!returndata){
				return false;
			}
			
			if(getType == 'next'){
				jQuery(this).parents('.wfp-tabs-control').find('.switch-html').trigger('click');
				var tagName = tabData.nextElementSibling;
				if(tagName){
					var tabIndex = tagName.getAttribute('wfp-tab-index');
					if(!tabIndex){
						//calback function
						
						// get form ids
						var formIdData = jQuery("#"+forms_dat.id);
						if(formIdData){
							var nextB = forms_dat.querySelector(".wfp-next");
							if(nextB){
								document.getElementsByTagName('body')[0].classList.add('wfp-disabled');
								nextB.classList.add('disabled');
								nextB.disabled = true;
							}
							
							var form  = new FormData( jQuery("#"+forms_dat.id)[0] );
								
							jQuery.ajax({           
								data : form,
								type : 'POST',
								contentType: false,
								processData: false,
								url : window.xs_donate_url.resturl+'xs-fundraising-form/campaign-submit/'+getIndex,
								beforeSend : function( xhr ) {
								   xhr.setRequestHeader( 'X-WP-Nonce', xs_donate_url.nonce );
								},
								success : function( response ) {
									document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
									
									var update = forms_dat.querySelector("#wfp_update_post");
									if(!update){
										forms_dat.reset();
									}
									var messageData = forms_dat.querySelector('.message-campaign-status');
									if (!messageData) {
										var createMessageDoc = document.createElement('div');
										createMessageDoc.setAttribute('class', 'message-campaign-status');
										forms_dat.insertBefore(createMessageDoc, forms_dat.childNodes[0]);
										var messageData = forms_dat.querySelector('.message-campaign-status');
									}
									if (response.error.length > 0) {
										$(messageData).removeClass('xs-alert-success').addClass('xs-alert xs-alert-danger').html(response.error);
										return;
									}
									
									if (response.success.length > 0) {
										jQuery(messageData).removeClass('xs-alert-danger').addClass('xs-alert xs-alert-success').html(response.success);
										return;
									}
								}
							});
							
						}
						
						// end form action
						
						//forms_dat.submit();
						return true;
					}
				}else{
					tabIndex = getIndex+'-0';
				}
			}else{
				var tagName = tabData.previousElementSibling;
				if(tagName){
					var tabIndex = tagName.getAttribute('wfp-tab-index');
					if(!tabIndex){
						return false;
					}
				}else{
					tabIndex = getIndex+'-0';
				}
				
				// button text Replace
				var nextB = forms_dat.querySelector(".wfp-next");
				if(nextB){
					var submitText = nextB.getAttribute("wfp-finish-button");
					if(submitText){
						var dataFIled = nextB.innerHTML;
						var previusTextInner = nextB.innerText;
						var previusText = nextB.getAttribute("wfp-next-button");
						if(previusText && previusTextInner != previusText){
							var resData = dataFIled.replace(submitText, previusText);
							nextB.innerHTML = resData;
						}
					}
				}
			}
			__wfp_open_tab(tabIndex);
		}
	}	
	
	function __wfp_validateForm(formId, currentTab) {
	  var x, y, i, valid = true;
	  var x = formId.querySelector("[wfp-tab-index='"+currentTab+"']");
	  if(!x){
		  return false;
	  }
	  y = x.querySelectorAll(".wfp-require-filed");
	  if(y){
		  for (i = 0; i < y.length; i++) {
			if( y[i].hasAttribute("required") ){
				var reLength = Number(y[i].getAttribute("required"));
				if(!reLength){
					reLength = 1;
				}
				var inputLength = y[i].value.length;
				if (inputLength < reLength) {
				  y[i].classList.add("wfp-invalid");
				  return false;
				}
				
			 }
			 if( y[i].hasAttribute("wfp-pattern") ){
				 var patt = y[i].getAttribute("wfp-pattern");
				 if(patt == 'email'){
					 if(!wfp_email(y[i].value)){
						 y[i].classList.add("wfp-invalid");
						 return false;
					 }
				 }else if(patt == 'website'){
					 if(!wfp_website(y[i].value)){
						 y[i].classList.add("wfp-invalid");
						 return false;
					 }
				 }else if(patt == 'phone'){
					 if(!wfp_phone(y[i].value)){
						 y[i].classList.add("wfp-invalid");
						 return false;
					 }
				 }
			 }
		  }
		}
	 
	  return valid; 
	}

}



function wfp_email(str){
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!str.match(filter)) {
		return false;
	}
	return true;
}

function wfp_website(str){
	var filter = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (!str.match(filter)) {
		return false;
	}
	return true;
}

function wfp_phone(str){
	var filter = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if (!str.match(filter)) {
		return false;
	}
	return true;
}

function wfp_modify_class(ele){
	ele.classList.remove("wfp-invalid");
}



