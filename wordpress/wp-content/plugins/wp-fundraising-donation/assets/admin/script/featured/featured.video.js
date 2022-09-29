// Featured Video Backend JavaScript

(function(Featured_Video, $, undefined) {
	Featured_Video.openModal = function() {
		var urlData = jQuery('#wfp_featured_video_url').val();
		//alert(urlData);
		var	data = {
				action: 'featured_video_modal',
				url: urlData,
				nonce: Featured_Video_Nonce.nonce
			};
		jQuery.post( ajaxurl, data, function( response ) {

			jQuery('#wfp-featured-video-modal-container').html(response);
			jQuery('#wfp_featured_video_modal').show();
		} );

	};
	Featured_Video.closeModal = function() {
		jQuery('#wfp_featured_video_modal').hide();
		jQuery( '#wfp-featured-video-modal-container' ).html( '' );
	};
	Featured_Video.setVideo = function(element) {
		var url = element.data( 'video' ),
			thumb = element.data( 'thumb' );

		jQuery( '#wfp_featured_video_url' ).val( url );
		jQuery( '#featured_video' ).html( '<span class="dashicons dashicons-video-alt3"></span><img src="'+ thumb +'">' );

		jQuery( '#thumbnail-change-toggle' ).html( '<p class="hide-if-no-js"><a href="#" id="wfp-remove-featured-video">'+ Featured_Video.RemoveVideo +'</a></p>' )

		Featured_Video.closeModal();

	};

	Featured_Video.removeVideo = function(element) {
		
		jQuery('#wfp_featured_video_modal').find( '.video-data' ).html( '' );

		jQuery( '#wfp_featured_video_url' ).val( '' );
		jQuery( '#featured_video' ).html( '' );

		jQuery( '#thumbnail-change-toggle' ).html( '<p class="hide-if-no-js"><a href="#" id="wfp-set-featured-video">'+ Featured_Video.SetVideo +'</a></p>' )

	};

	Featured_Video.getVideoData = function() {
		
		var video_url = jQuery( '#_featured_video' ).val(),
			modal = jQuery('#wfp_featured_video_modal'),
			video_data = modal.find( '.video-data' ),
			data = {
				action: 'featured_video_get_data',
				url: video_url,
				nonce: Featured_Video_Nonce.nonce
			};

		video_data.html('<span class="spinner"></span>');

		jQuery.post( ajaxurl, data, function( response ) {

			video_data.html( response );

		} );

	};

	Featured_Video.bindButtons = function() {
		
		jQuery( '.featured-video-metabox-container' ).on( 'click', '#wfp-set-featured-video', function(e) {

			e.preventDefault();

			Featured_Video.openModal();

		} );
		
		jQuery( '.featured-video-metabox-container #featured_video' ).on( 'click', 'img', function(e) {

			e.preventDefault();

			Featured_Video.openModal();

		} );
		
		jQuery( '.featured-video-metabox-container' ).on( 'click', '#wfp-remove-featured-video', function(e) {

			e.preventDefault();

			Featured_Video.removeVideo();

		} );

	};

	Featured_Video.bindModal = function() {
		
		jQuery( '#wfp-featured-video-modal-container' ).on( 'click', '.featured-video-modal #wfp_get_video_data', function(e) {

			e.preventDefault();

			Featured_Video.getVideoData();

		} );

		jQuery( '#wfp-featured-video-modal-container' ).on( 'click', '#wfp_featured_video_modal .video-data .video-data-item #insert-video', function() {

			Featured_Video.setVideo( jQuery(this).parent().parent() );

		} );
		
		jQuery( '#wfp-featured-video-modal-container' ).on( 'click', '#wfp_featured_video_modal 	.media-modal-close', function(e) {

			e.preventDefault();

			Featured_Video.closeModal();

		} );

	};

	jQuery(function() { //wait for ready

		Featured_Video.bindButtons();
		Featured_Video.bindModal();

	});

}(window.Featured_Video = window.Featured_Video || {}, jQuery));