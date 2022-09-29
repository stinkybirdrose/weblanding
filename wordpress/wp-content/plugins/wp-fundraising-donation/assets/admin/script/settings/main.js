(function($){
    $(document).ready(function(){

        // Opening modal
        $('.wfdp-btn').on('click', function(e){
            var target = $(this).data('target');
            $('body').addClass('wfdp-modal-opened');
            $('#' + target).toggleClass('opened');
            
            if(Number($('#' + target).find('.wfdp-modal-inner').outerHeight()) >= $(window).outerHeight()){
                $('#' + target).addClass('wfdp-bigger');
            }else {
                $('#' + target).removeClass('wfdp-bigger');
            }
        });

        // Closing modal
        $('.wfdp-modal').on('click', '.xs-btn-close', function(e){
            $('body').removeClass('wfdp-modal-opened');
            $(this).closest('.wfdp-modal').removeClass('opened');
        });

        // Closing modal when exit key pressed
        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                $('.wfdp-modal').removeClass('opened');
            }
        });

        // disable or enable payment gateway button
        $('.xs_donate_switch_button').on('change', function(){
            var self = $(this),
                btn = self.closest('tr').find('.wfdp-btn');

            if(self.is(':checked')){
                btn.removeAttr('disabled');
            } else  {
                btn.attr('disabled', 'disabled');
            }
        });

        // payment gateway checkbox
        $('.payment-gateway-info').on('click', '.xs_donate_switch_button_label, .payment-gateway-label', function(){
            var self = $(this),
                checkbox = self.closest('.payment-gateway-info').find('.xs_donate_switch_button');
            if(checkbox.is(':checked')){
                checkbox.removeAttr('checked')
            } else {
                checkbox.attr('checked', 'checked')
            }
            
        })

    });
}(jQuery))