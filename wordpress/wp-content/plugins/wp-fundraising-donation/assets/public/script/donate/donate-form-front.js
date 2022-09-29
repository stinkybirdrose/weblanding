"use strict";

jQuery( function( $ ) {
    $('.xs_donate_switch_button').on('change',function(){
        const isChecked = ($(this).is(':checked'));
        const submitButton = $(this).closest('.wfp-donate-form-footer').find('.submit-btn');
        if(isChecked) {
            submitButton.attr('disabled',false);
        }else{
            submitButton.attr('disabled',true);
        }
        
    });



});

function handle_add_to_cart_for_woocommerce_payment(form_id, amount, type, params, nonce, resturl, error_callback) {

    resturl = resturl || window.xs_donate_url.resturl;
    nonce = nonce || window.xs_donate_url.nonce;

    let values = {
        'id': form_id,
        'price': amount,
        'quantity': 1,
        'type': type
    };

    if(type === 'reward') {

        values.pledge_id = params.pledge_id;
        values.pledge_uid = params.pledge_uid;
    }

    jQuery.ajax({
        data: values,
        type: 'post',
        url: resturl + 'woc-redirect/add-to-cart/',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-WP-Nonce', nonce);
        },
        success: function (result) {

            let elm = "#add_cart_"+ form_id;

            document.querySelector(elm).submit();
        }
    });
}

function handle_wfp_payment_gateway_redirect(url) {

    setTimeout(function () {
        window.location.href = url;
    }, 1000);
}

function is_woocommerce_payment() {

    return true;
}

function handle_disable_prop(elm, val) {

    elm.disabled = (val && true);
}

function get_payment_type(j_elm) {

    let type = j_elm.data('wfp-payment_type');

    return type || 'default';
}

//---------------------------------------------------------


/*
 * Set amount of donate
 */
function xs_donate_amount_set(dat, forId, $decimal_point) {

    console.log(' trace -- 3');

    var formId = document.querySelector("#wfdp-donationForm-" + forId);

    if(formId) {
        var amountDiv = formId.querySelector('#xs_donate_amount');

        if(amountDiv) {
            var setAmount = Number(dat);

            if(setAmount != 0) {
                amountDiv.value = setAmount.toFixed($decimal_point); // this should be dynamic
            } else {
                amountDiv.value = '';
                amountDiv.focus();
            }

            var querySelectLi = formId.querySelectorAll("ul.xs-boxed-style li, .wfp-bdage-list li");

            for(var sel = 0; sel < querySelectLi.length; sel++) {
                querySelectLi[sel].classList.remove('donate-active');
                var dataValue = querySelectLi[sel].getAttribute('data-value');
                if(dataValue == dat) {
                    querySelectLi[sel].classList.add('donate-active');
                }
            }
        }
    }
}


function xs_additional_fees(amount, forId) {

    var formId = document.querySelector("#wfdp-donationForm-" + forId);

    console.log('trace -- 2');

    if(formId) {
        var addFeesDiv = formId.querySelector('#xs_donate_additional_fees_view');
        if(addFeesDiv) { //xs_donate_additional_fees

            var amountData = Number(amount);
            var thou_seperator = formId.querySelector('#xs_donate_currency_thou_seperator').value;
            var decimal_seperator = formId.querySelector('#xs_donate_currency_decimal_seperator').value;
            var decimal_number = formId.querySelector('#xs_donate_currency_decimal_number').value;

            var type_fees = formId.querySelector('#xs_donate_additional_fees_type').value;

            var persentange = formId.querySelector('#xs_donate_additional_fees').value;

            if(type_fees == 'percentage') {
                var fees = Number((amountData * Number(persentange)) / 100);
            } else {
                var fees = Number(persentange);
            }
            //alert(fees);
            var fees_convert = fees.toFixed(decimal_number);
            fees_convert = fees_convert.replace(/[#,]/g, '' + thou_seperator + '');
            fees_convert = fees_convert.replace(/[#.]/g, '' + decimal_seperator + '');
            addFeesDiv.innerHTML = '<strong>' + fees_convert + '</strong>';

            var total_fees = Number(amountData + fees);

            var amountDivTotalHidden = formId.querySelector('#xs_donate_amount_total_hidden');
            if(amountDivTotalHidden) {
                amountDivTotalHidden.value = total_fees;
            }
            var amountDivTotal = formId.querySelector('#xs_donate_amount_total');
            if(amountDivTotal) {
                var total_fees_convert = total_fees.toFixed(decimal_number);
                total_fees_convert = total_fees_convert.replace(/[#,]/g, '' + thou_seperator + '');
                total_fees_convert = total_fees_convert.replace(/[#.]/g, '' + decimal_seperator + '');
                amountDivTotal.innerHTML = '<strong>' + total_fees_convert + '</strong>';
            }
        }
    }
}


/*
 * show hide button
 */
function xs_show_hide_donate_font(dat) {

    var showHide = document.querySelectorAll(dat);

    if(showHide) {
        for(var m = 0; m < showHide.length; m++) {
            showHide[m].classList.toggle('xs-donate-visible');
        }
    }
}


function xs_show_hide_multiple_div(dat, showDiv) {
    event.preventDefault();

    var showHide = document.querySelectorAll(dat);
    if(showHide) {
        for(var m = 0; m < showHide.length; m++) {
            showHide[m].classList.remove('xs-donate-visible');
        }
    }

    var showHide1 = document.querySelector(showDiv);
    if(showHide1) {
        showHide1.classList.toggle('xs-donate-visible');
    }
}


/**
 * Checking out donation - crowd/reward
 *
 */
jQuery(document).ready(function (event) {

    jQuery('.wfdp-donationForm').submit(ajaxDonateSubmit);


    /**
     * Processing single donation
     *
     * @param e
     * @returns {boolean}
     */
    function ajaxDonateSubmit(e) {
        e.preventDefault();

        console.log('trace -- 1');

        let $this = jQuery(this);

        var donateForm = $this.serialize();
        var idfo = this.id;
        var idData = idfo.split('-');
        var idForm = idData[idData.length - 1];
        var getID = $this.data('wfp-id');
        let p_type = get_payment_type($this);

        console.log('payment gateway type :: ', p_type);

        var checkCOndition = jQuery('#' + idfo + ' #xs-donate-terms-condition');
        if(checkCOndition) {
            if(checkCOndition.prop("checked") == false) {
                jQuery('#' + idfo + ' .wfdp-donation-message').last().html('<div class="xs-alert xs-alert-danger error"> Please select terms & condition.</div>');
                return;
            }
        }

        document.getElementsByTagName('body')[0].classList.add('wfp-disabled');

        if(p_type === 'woocommerce') {

            var checkurl = (this).getAttribute("wfp-data-url");
            var amountInput = (this).querySelector("#xs_donate_amount");
            var amount = amountInput.value;
            var amountInputAll = (this).querySelector("#xs_donate_amount_total_hidden");

            if(amountInputAll) {
                amount = amountInputAll.value;
            }

            console.log('the culprit -- ', getID);

            handle_add_to_cart_for_woocommerce_payment(
                getID,
                amount,
                'donation'
            );

            return true;
        }

        jQuery.ajax({
            data: donateForm,
            type: 'post',
            url: window.xs_donate_url.resturl + 'xs-donate-form/donate-submit/' + idForm,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-WP-Nonce', xs_donate_url.nonce);
            },
            success: function (response) {

                if(response.error.length > 0) {
                    document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
                    jQuery('#' + idfo + ' .wfdp-donation-message').html('<div class="error xs-alert xs-alert-danger">' + response.error + '</div>');
                    return;
                }

                if(response.success.message.length > 0) {
                    var res = response.success;

                    jQuery('input, textarea, select').each(function () {
                        jQuery(this).val('');
                    });

                    if(res.type == 'online_payment') {
                        document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
                        jQuery('#' + idfo + ' .wfdp-donation-message').html('<div class="success xs-alert xs-alert-success">Please wait... Redirecting paypal payment page.</div>');
                        setTimeout(function () {
                            window.location.href = res.url;
                        }, 1500);
                    } else if(res.type == 'stripe_payment') {
                        document.getElementsByTagName('body')[0].classList.remove('wfp-disabled');
                        jQuery('#' + idfo + ' .wfdp-donation-message').html('<div class="success xs-alert xs-alert-success">Please wait... Open Stripe PopUp Box.</div>');
                        setTimeout(function () {
                            jQuery('#' + idfo + ' .wfdp-donation-message').hide();
                        }, 1500);

                        var handler = StripeCheckout.configure({
                            key: res.keys,
                            image: res.image_url,
                            locale: 'auto',
                            token: function (token) {
                                if(!token.id) {
                                    window.location.href = res.cancel_return;
                                    return;
                                }
                                res.stripe_token = token.id;

                                var data_post = {
                                    action: 'wfp-stripe-payment',
                                    token: token.id,
                                    entry_id: res.entry_id,
                                    form_id: res.form_id,
                                    sandbox: res.sandbox,
                                    nonce: donation_form_ajax.nonce
                                };
                                jQuery.ajax({
                                    data: data_post,
                                    type: 'post',
                                    url: window.xs_donate_url.resturl + 'wfp-stripe-payment/stripe-submit/' + res.entry_id,
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader('X-WP-Nonce', xs_donate_url.nonce);
                                    },
                                    success: function (result) {
                                        if(result.status) {
                                            if(result.status == 'success') {
                                                window.location.href = res.return_url + '&stripe=' + token.id;
                                            } else {
                                                window.location.href = res.cancel_return + '&stripe=' + token.id;
                                            }
                                        } else {
                                            alert(result);
                                        }
                                    }
                                });

                            }
                        });

                        handler.open({
                            name: String(res.name_post),
                            description: ' Campaign No.: ' + String(res.description),
                            amount: (Number(res.amount) * 100),
                            currency: res.currency_code
                        });


                        window.addEventListener('popstate', function () {
                            handler.close();
                        });
                    } else {
                        jQuery('#' + idfo + ' .wfdp-donation-message').html('<div class="success xs-alert xs-alert-success">Please wait... Redirecting Order Page.</div>');

                        setTimeout(function () {
                            window.location.href = res.order_page;
                        }, 500);
                    }
                    return;
                }

            }
        });

    }
});

/*header fixed manu*/
window.onscroll = function () {
    //wfp_fixed_header();
};

function wfp_fixed_header() {
    var header = document.querySelector("#wfp_menu_fixed");
    var sticky = header.offsetTop;

    if(window.pageYOffset > sticky) {
        //header.classList.add("wfp-sticky");
    } else {
        //header.classList.remove("wfp-sticky");
    }
}

/*
 * Start Tab js
 */
jQuery(document).ready(function () {
    var selectTab = jQuery('.wfp-tab > li');
    var selectDiv = jQuery('.wfp-tab-content');
    if(selectTab) {
        selectTab.first().addClass('active');
        if(selectDiv) {
            selectDiv.first().addClass('active');
        }
    }

    function nx_tab_setActive_single() {
        setTimeout(function () {
            var hash = window.location.hash.substr(1);
            if(hash) {
                jQuery('.wfp-tab > li').removeClass('active');
                jQuery('.wfp-tab > li > a[href="#' + hash + '"]').parent().addClass('active');
                jQuery('.wfp-tab-content').removeClass('active');
                jQuery('.wfp-tab-content#' + hash).addClass('active');
            }
        }, 15);
    }

    nx_tab_setActive_single(); // On Page Load
    jQuery('.wfp-tab > li > a[href*="#"]').on('click', function (e) {
        // e.preventDefault();
        nx_tab_setActive_single();
    });

});


/*
 * select reward
 */
function wfp_select_pledge(dat, event) {
    var idDat = jQuery('#' + dat.id);
    if(idDat) {
        idDat.removeClass('hover-effect-enable');
        idDat.addClass('select-reward');
    }
}


function submit_pledge_amount(btn) {

    var $btn = jQuery(btn);

    var form_id = $btn.data('form-id');
    var pledge_id = $btn.data('pledge_id');
    var amount = $btn.data('pledge_amt');
    var gateway = $btn.data('gateway');
    var index = $btn.data('wfp-index');  // todo - do not know why this is necessary

    if(gateway == 'woocommerce') {

        var pledge = form_id + '_' + pledge_id; // todo - why this line is import right now I do not know, later I will check it in api and removed it

        let param = {
            'pledge_id': pledge_id,
            'pledge_uid': pledge
        };

        handle_add_to_cart_for_woocommerce_payment(
            form_id,
            amount,
            'reward',
            param
        );

    } else {

        var checkout = $btn.data('checkout_url');
        var urlData = '&amount=' + amount +
                      '&target=' + form_id +
                      '&pledge=' + amount +
                      '&type=pledge&index=' + index +
                      '&pledge_uid=' + pledge_id;

        setTimeout(function () {
            window.location.href = checkout + urlData;
        }, 1000);
    }
}

/**
 * Processing pledge campaign
 *
 * @param dat
 */
function set_pleadge_amount_data(dat) {

    if(dat) {
        var getIndex = dat.getAttribute("wfp-index");
        var getID = dat.getAttribute("wfp-id");
        var pledgeAmount = dat.getAttribute("wfp-pledge");
        var pledgeId = dat.getAttribute('data-pledge_id');  // dat.dataset.pledge_id in modern browser
        var pledge_sec = document.querySelector("#pledge_section__" + getID);

        if(pledge_sec) {

            var section = pledge_sec.querySelector("#wfp-pledge-block__" + getIndex);

            if(section) {

                var amount = 0;

                if(pledgeAmount) {
                    amount = Number(pledgeAmount);
                }

                if(amount <=0) {
                    return false;
                }

                var country = '';
                var countryData = section.querySelector("#xs_donate_country_pledge");

                if(countryData) {
                    country = countryData.value;
                }

                var quantity = 1;

                var post_form = document.querySelector("#post-" + getID);
                if(post_form) {
                    var checkurl = post_form.getAttribute("wfp-data-url");
                    var checkPaymentType = post_form.getAttribute("wfp-payment-type");
                    if(checkurl) {
                        if(amount > 0) {
                            var urlData = '&amount=' + amount + '&target=' + getID + '&pledge=' + pledgeAmount + '&country=' + country + '&type=pledge&index=' + getIndex + '&pledge_uid=' + pledgeId;
                            var pledge = getID + '_' + pledgeId;
                            var checkout_url = dat.getAttribute('data-checkout_url');

                            console.log(pledge, checkout_url);

                            if(checkPaymentType == 'woocommerce') {

                                let param = {
                                    'pledge_id': pledgeId,
                                    'pledge_uid': pledge
                                };

                                handle_add_to_cart_for_woocommerce_payment(
                                    getID,
                                    amount,
                                    'crowdfunding',
                                    param
                                );

                            } else {
                                setTimeout(function () {
                                    window.location.href = checkurl + urlData;
                                }, 1000);
                            }
                        }
                    }
                }

            }
        }
    } else {
        alert('Invalid Rewards');
    }
}


/**
 * Processing crowd-fund type donation here
 *
 * @param dat
 */
function set_pleadge_amount_data_fixed(dat) {

    if(dat) {

        dat.disabled = true;

        var getID = dat.getAttribute("wfp-id");
        var pledgeAmount = dat.getAttribute("wfp-pledge");

        var post_form = document.querySelector("#post-" + getID);

        if(post_form) {
            var amount = 0;
            var amountData = post_form.querySelector("#xs_donate_amount_pledge_fixed");

            if(amountData) {
                amount = Number(amountData.value);
                amountData.removeAttribute('style');
            }

            var checkurl = post_form.getAttribute("wfp-data-url");
            var min_limit = jQuery(dat).data('min') ? jQuery(dat).data('min') : 0,
                max_limit = jQuery(dat).data('max') ? jQuery(dat).data('max') : 0,
                limit_msg = [];

            if(amount < min_limit || (amount > max_limit && max_limit != 0)) {
                    dat.disabled = false;
                    limit_msg.push((amount < min_limit ) ? 'minimum donate amount: '+ min_limit : false);
                    limit_msg.push( (amount > max_limit && max_limit != 0) ? ' maximum donate amount: '+ max_limit : false );

                    jQuery(amountData).parents('.wfp-additional-data').after('<div class="wfp-error error xs-alert xs-alert-danger">Sorry! '+ limit_msg.filter(Boolean).join(' & ') +'</div>');
                    setTimeout(function(){
                        jQuery(amountData).parents('.wfp-total-backers-count').find('.wfp-error').fadeOut();
                    },1000);

                    return false;
            }

            var checkPaymentType = post_form.getAttribute("wfp-payment-type");

            if(checkurl) {
                if(amount > 0) {

                    var urlData = '&amount=' + amount + '&target=' + getID + '&pledge=' + pledgeAmount + '&country=0&type=fixed&index=';

                    if(checkPaymentType == 'woocommerce') {

                        var values = {
                            'id': getID,
                            'price': amount,
                            'quantity': 1,
                            'type': 'crowdfunding'
                        };

                        jQuery.ajax({
                            data: values,
                            type: 'post',
                            url: window.xs_donate_url.resturl + 'woc-redirect/add-to-cart/',
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('X-WP-Nonce', xs_donate_url.nonce);
                            },
                            success: function (result) {

                                document.querySelector("#add_cart_"+ getID).submit();
                            },
                            error: function (data) {

                                dat.disabled = false;

                                alert('Add to cart failed!');
                            }
                        });

                    } else {
                        setTimeout(function () {
                            window.location.href = checkurl + urlData;
                        }, 1000);
                    }

                } else {
                    dat.disabled = false;
                    amountData.setAttribute('style', 'border-color: red;');
                }
            }
        }
    }
}


jQuery(document).ready(function ($) {

    if(jQuery('.wfp-select2-country').length) {
        jQuery('.wfp-select2-country').select2();
    }


    $(".datepicker-fundrasing").each(function () {
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

