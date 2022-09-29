var l10n = wp.media.view.l10n;
wp.media.view.MediaFrame.Select.prototype.browseRouter = function( routerView ) {
    routerView.set({
        upload: {
            text:     l10n.uploadFilesTitle,
            priority: 20
        },
        browse: {
            text:     l10n.mediaLibraryTitle,
            priority: 40
        },
        my_tab: {
            text:     "My tab",
            priority: 60
        }
    });
};

jQuery(document).ready(function($){
    if ( wp.media ) {
        wp.media.view.Modal.prototype.on( "open", function() {
            if($('body').find('.media-modal-content .media-router a.media-menu-item.active')[0].innerText == "My tab")
                doMyTabContent();
        });
        $(wp.media).on('click', '.media-router a.media-menu-item', function(e){
            if(e.target.innerText == "My tab")
                doMyTabContent();
        });
    }
});


function doMyTabContent() {
    var html = '<div class="myTabContent">';
    html += 'Golap Hazi';
    html += '</div>';
    $('body .media-modal-content .media-frame-content')[0].innerHTML = html;
}