function update_donation_status(elm, donation_id) {


	var donateForm = 'id=' + donation_id + '&status=' + elm.value;

	var values = {
		'id': donation_id,
		'status': elm.value
	};

	jQuery.ajax({
		data: values,
		type: 'get',
		url: window.wfp_conf.resturl + 'xs-donate-form/update_status/' + donation_id,
		beforeSend: function(xhr) {
			xhr.setRequestHeader('X-WP-Nonce', wfp_conf.nonce);
		},
		success: function(response) {

			if(response.success) {

				elm.setAttribute('class', response.success);

			} else {

				let parentDIv = elm.parentElement;
				let messageData = parentDIv.querySelector('.message-donate-status');

				if(!messageData) {
					var createMessageDoc = document.createElement('span');
					createMessageDoc.setAttribute('class', 'message-donate-status');
					parentDIv.insertBefore(createMessageDoc, parentDIv.childNodes[0]);
					messageData = parentDIv.querySelector('.message-donate-status');
				}

				messageData.innerHTML = response.error;
			}
		}
	});
}
