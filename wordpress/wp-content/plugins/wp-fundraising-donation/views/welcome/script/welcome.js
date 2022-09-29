function wfp_welcome_control(className){
	
	var selectControlPre = document.querySelectorAll(className); 
	if(!selectControlPre){
		return '';
	}
	for(var m = 0 ; m < selectControlPre.length; m++){	
		selectControlPre[m].addEventListener("click", wfp_welcome_control_select);
	}
	
	function wfp_welcome_control_select(){
		event.preventDefault();
		var getTotalStep = this.getAttribute('wfp-total-step');
		if(!getTotalStep){
			getTotalStep = 0;
		}
		
		var getStepType = this.getAttribute('wfp-button-type');
		if(!getStepType){
			getStepType = 'next';
		}
		
		var openDiv = document.querySelector('.wfp-welcome-block.wfp-open');
		if(openDiv){
			var getIndex = openDiv.getAttribute('wfp-wel-index');
			if(!getIndex){
				getIndex = 0;
			}
			
			//var idData = openDiv.id;
			
			// pre type
			var getPreSetpType = openDiv.getAttribute('wfp-pre-step-type');
			if(!getPreSetpType){
				getPreSetpType = 'skip';
			}
			
			// next type
			var getNextSetpType = openDiv.getAttribute('wfp-next-step-type');
			if(!getNextSetpType){
				getNextSetpType = 'next';
			}
			
			var getIndex1 = Number(getIndex) + 1;
			if(getIndex1 == getTotalStep){
				getIndex1 = getIndex;
			}
			
			if(getStepType == 'next'){
				// path type
				var getPath = openDiv.getAttribute('wfp-path');
				if(!getPath){
					getPath = '';
				}
				//alert(getPath);
				
				
				var getReturn = openDiv.getAttribute('wfp-return');
				if(!getReturn){
					getReturn = 'next';
				}
				var getReturnLoca = openDiv.getAttribute('wfp-return-location');
				if(!getReturnLoca){
					getReturnLoca = getIndex1;
				}
				
				ajaxWelcomeSubmit(getPath);			
				var typeButton = getNextSetpType;
				
				// redirect or next step
				if(getReturn == 'redirect'){	
					setTimeout(function() {
					  window.location.href = getReturnLoca;
					}, 2000);
				}else{
					if(Number(getReturnLoca) > 0){
						getIndex1 = getReturnLoca;
					}
				}
				if(getNextSetpType == 'finish'){
					document.querySelector('[data-modal-dismiss="modal"]').click();
					return '';
				}
			}else{
				var typeButton = getPreSetpType;
				if(getPreSetpType == 'pre'){
					var getIndex2 = Number(getIndex) - 1;
					if(getIndex2 < 0){
						getIndex1 = 0;
					}else{
						getIndex1 = getIndex2;
					}	
				}else if(getPreSetpType == 'close'){
					document.querySelector('[data-modal-dismiss="modal"]').click();
					return '';
				}
			}
			
			wfp_open_section(getIndex1, typeButton);
			
		}
	}
	
	function wfp_open_section(activeData, typeButton){
		//alert(typeButton);
		var findNextID = document.querySelector('div[wfp-wel-index="'+activeData+'"]');
		if(findNextID){
			// pre step
			
			var allClass = document.querySelectorAll('.wfp-welcome-block');
			if(!allClass){
				return '';
			}
			var findSelectorIDAll = document.querySelectorAll('li[wfp-selector-index]');
			
			for(var tt = 0; tt < allClass.length; tt++){
				allClass[tt].classList.remove('wfp-open');
				if(findSelectorIDAll[tt]){
					findSelectorIDAll[tt].classList.remove('wfp-selected');
				}
			}
			findNextID.classList.add('wfp-open');
			
			// slector setp
			var findSelectorID = document.querySelector('li[wfp-selector-index="'+activeData+'"]');
			if(findSelectorID){
				findSelectorID.classList.add('wfp-selected');
			}
			
			var getPreSetp = findNextID.getAttribute('wfp-pre-step');
			if(!getPreSetp){
				getPreSetp = 'Skip';
			}
					
			// next step
			var getNextSetp = findNextID.getAttribute('wfp-next-step');
			if(!getNextSetp){
				getNextSetp = 'Next';
			}
			
			var previousButton = document.querySelector('button[wfp-button-type="pre"]');
			if(previousButton){
				previousButton.innerHTML = getPreSetp;
			}
			var nextButton = document.querySelector('button[wfp-button-type="next"]');
			if(nextButton){
				nextButton.innerHTML = getNextSetp;
			}
		}
	}
}


/* Submit Setup data*/


function ajaxWelcomeSubmit(getPath) {
	var formId = jQuery("#xs-donate-modal-popup__welcome").find("> form#wfdp-welcomeForm-19");
	var donateForm = formId.serialize();
	jQuery.ajax({           
		data : donateForm,
		type : 'get',
		url : window.xs_donate_url.resturl+'xs-welcome-form/welcome-submit/'+getPath,
		success : function( response ) {
			
		}
			
	 });		
}




