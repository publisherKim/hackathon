(function(global, ImageFinder) {
    'use strict';

    var api_info = {
        url : 'https://api.gettyimages.com/v3/search/images',
        api_key : '32a6uu5rmr37aqrzyeq335wv'
    }
    
    var init = function() {
        var data = {
            phrase : "run",
            fields : "detail_set",
            number_of_people : ['two'],
            page : 1,
            page_size: 5
        };
        ImageFinder(api_info).getImageData(data, function(images) {

            console.log('images:', images);
        });

    }
    init();
})(window, window.ImageFinder);