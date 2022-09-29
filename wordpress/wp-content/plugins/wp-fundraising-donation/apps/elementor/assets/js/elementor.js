(function($, elementor) {
    "use strict";
  
    var WpFundrising = {
      init: function() {
        var widgets = {
          "wfp-fundraising-listing.default": WpFundrising.Listing
        };
        $.each(widgets, function(widget, callback) {
          elementor.hooks.addAction("frontend/element_ready/" + widget, callback);
        });
      },
      Listing: function($scope) {
        // filter
        let filterNavItem = $scope.find('.wfp-campaign-filter-nav-item');
        filterNavItem.on('click', function(){
          var slug = $(this).data('slug'),
              campaigns = $(this).parents('.list-campaign-body').find('.single-campaign-blog');
          // nav active on click
          $(this).addClass('active').siblings().removeClass('active');
          // filter the campaign
          campaigns.each(function(){
            if($(this).hasClass(slug)){
              $(this).fadeIn();
            } else {
              $(this).hide();
            }
            
          })
        });

        // carousel
        let target = $scope.find('.wfp-campaign-carousel'),
            responsiveData = target.data('responsive-settings');
        if(!responsiveData) { return false; }
        let autoplay = target.data('autoplay'),
            loop = target.data('loop'),
            speed = target.data('speed'),
            spaceBetween = target.data('space-between'),
            desktop = responsiveData.wfp_fundraising_content__column_grid,
            mobile =  responsiveData.wfp_fundraising_content__column_grid_mobile ? responsiveData.wfp_fundraising_content__column_grid_mobile : desktop,
            tablet =  responsiveData.wfp_fundraising_content__column_grid_tablet ? responsiveData.wfp_fundraising_content__column_grid_tablet : desktop;

      
        new Swiper(target, {
            navigation: {
                nextEl: $scope.find('.wfp_fundrising-navigation-next'),
                prevEl: $scope.find('.wfp_fundrising-navigation-prev'),
            },
            pagination: {
                el        : $scope.find('.wfp_fundrising-swiper-pagination'),
                type      : 'bullets',
                clickable : true,
            },
            centeredSlides: true,
            "autoplay"      : autoplay && autoplay,
            "loop"          : loop && Boolean(loop),
            "speed"         : speed && Number(speed),
            "slidesPerView" : Number(mobile),
            "spaceBetween": spaceBetween && Number(spaceBetween),
            breakpointsInverse: true,
            "breakpoints"   : {
                640 : {
                  "slidesPerView" : Number(mobile),
                  "spaceBetween"  : spaceBetween && Number(spaceBetween),
                },
                768 : {
                  "slidesPerView" : Number(tablet),
                  "spaceBetween"  : spaceBetween && Number(spaceBetween),
                },
                1024 : {
                  "slidesPerView" : Number(desktop),
                  "spaceBetween"  : spaceBetween && Number(spaceBetween),
                },
            }
        });
        // end carousel

      }
    };
    $(window).on("elementor/frontend/init", WpFundrising.init);
})(jQuery, window.elementorFrontend);
  