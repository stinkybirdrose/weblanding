function xs_show_hide_login_multiple(dat, target) {

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

function toggle_class_in_target(target, container, $hideCls, $showCls) {

    $hideCls = $hideCls || 'xs-donate-hidden';
    $showCls = $showCls || 'xs-donate-visible';

    var targetByClass = document.querySelectorAll(container + ' .' + $showCls);

    if(targetByClass){
        for(var m = 0; m < targetByClass.length; m++){
            targetByClass[m].classList.remove($showCls);
            targetByClass[m].classList.add($hideCls);
        }
    }

    var targetElm = document.querySelector(target);

    if(targetElm) {
        targetElm.classList.remove($hideCls);
        targetElm.classList.add($showCls);
    }
}


function ajax_xs_login_submit(e, container) {
    e.preventDefault();

    var loginForm = jQuery(container).closest('form#wfp_auth_form_login').serialize();

    document.getElementsByTagName('body')[0].classList.add('wfp-disabled');

    console.log('Sending request..', window.wfp_xs_url.xs_rest_login);

    jQuery.ajax({
        data: loginForm,
        type: 'post',
        url: window.wfp_xs_url.xs_rest_login,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', wfp_xs_url.nonce );
        },
        success: function (response) {
            document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');

            if (response.error) {
                jQuery('.wfp-login-message').html('<div class="xs-alert xs-alert-danger error">' + response.error + '</div>');

                return;
            }

            if (response.success) {
                setTimeout(function () {
                    window.location.reload();
                }, 100);
            }
        }
    });
}


function ajax_xs_register_submit(e, container) {
    e.preventDefault();

    var registerForm = jQuery(container).closest('form#wfp_auth_form_register').serialize();

    document.getElementsByTagName('body')[0].classList.add('wfp-disabled');

    jQuery.ajax({
        data: registerForm,
        type: 'post',
        url: window.wfp_xs_url.xs_rest_register,
        beforeSend : function( xhr ) {
            xhr.setRequestHeader( 'X-WP-Nonce', wfp_xs_url.nonce );
        },
        success: function (response) {
            document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');

            if (response.error) {
                jQuery('.wfp-login-message').html('<div class="xs-alert xs-alert-danger error">' + response.error + '</div>');

                return;
            }

            if (response.success) {
                setTimeout(function () {
                    window.location.reload();
                }, 100);
            }
        }
    });
}


(function($){

    $(function(){

        $(document).on('click', '.wfp-form-login__submit', function (ev) {
            ev.preventDefault();

            ajax_xs_login_submit(ev, this);
        });

        $(document).on('click', '.wfp-form-register__submit', function (ev) {
            ev.preventDefault();

            ajax_xs_register_submit(ev, this);
        });


        // show password in input
        $('i.wfp-from-group--password__icon').on('click', function(){

            var passInput = $(this).closest('div').find('.wfp-password'),
                currentInputType = passInput.attr('type');
            if(currentInputType === 'password'){
                passInput.attr('type', 'text').end().end().addClass('viewed');
            } else {
                passInput.attr('type', 'password').end().end().removeClass('viewed');
            }
        });

        // auth toggle active button
        $('.wfp-reg-login-navs').on('click', '.wfp-button', function(){
            $(this).addClass('wfp-button-active')
                .siblings().removeClass('wfp-button-active');
        });


        if($('a[data-target=".bd-login-modal"]').length> 0) {
            $('a[data-target=".bd-login-modal"]').on('click', function (event) {
                $('.xs-header-login-shortcode .wfp-auth-btn[data-type="modal-trigger"]').trigger('click');
                return false;
            });
        }

        // auth modal close
        $(document).on('click', '.xs-auth-modal--close', function (e) {
            e.preventDefault();
            $(this).closest('div.xs-modal-popup').removeClass('xs-show').removeClass('is-open');
        });

        $('.login-register-pup-up-wrapper').on('click', function (e) {

            if(e.target == this) {
                $('.login-register-pup-up-wrapper').removeClass('xs-show');
            }
        });

        $(document).on('click', '.xs_reset_switch' , function () {
            $('#wp_fundraising_reset_form').fadeIn();
            $('#wp_fundraising_login_form').hide();
            $('.xs_login_switch').fadeIn();
            $(this).hide();
        });

        $(document).on('click', '.xs_login_switch' , function () {
            $('#wp_fundraising_reset_form').hide();
            $('#wp_fundraising_login_form').fadeIn();
            $('.xs_reset_switch').fadeIn();
            $(this).hide();
        });
    });
}(jQuery));