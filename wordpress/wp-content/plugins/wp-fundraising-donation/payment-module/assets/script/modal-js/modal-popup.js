"use strict";
! function(a) {
    a.fn.tab = function(t) {
        var e = a.extend({}, a.fn.tab.defaults, t);
        return this.each(function() {
            var t = a(this);
            a(t).find(".tabHeader > .tab__list > .tab__list__item").on(e.trigger_event_type, function() {
                a(t).find(".tabHeader > .tab__list > .tab__list__item").removeClass("active"), a(this).addClass("active"), a(".tabContent > .tabItem").removeClass("active"), a(t).find(".tabContent > .tabItem").eq(a(this).index()).addClass("active"), a(t).find(".tabContent > .tabItem").hide(), a(t).find(".tabContent > .tabItem").eq(a(this).index()).show()
            })
        })
    }, a.fn.tab.defaults = {
        trigger_event_type: "click"
    }
}(jQuery), jQuery, jQuery(document).ready(function(a) {
    a(".post__tab").tab(), a('[data-type="modal-trigger"]').on("click", function(t) {
        t.preventDefault();
        var e = a(this).attr("data-target");

        if(Number(a("#" + e).find('.wfp-modal-content,.login-register-pup-up-inner').outerHeight()) >= a(window).outerHeight()){
            a("#" + e).addClass('wfdp-single-bigger');
        }
        a(document.body).addClass('wfdp-single-modal-opened');

        0 < (e = a("#" + e)).length && (e.addClass("is-open"), a(".xs-backdrop").addClass("is-open"))
        
    }), a('[data-modal-dismiss="modal"]').on("click", function(t) {
        t.preventDefault();
        a(this).removeClass("is-open");
        a(document.body).removeClass('wfdp-single-modal-opened');
        a(".xs-modal-dialog").removeClass("is-open").removeClass('wfdp-single-bigger');
        a(".xs-backdrop").removeClass("is-open");
    })
});