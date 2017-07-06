(function(global, ImageFinder) {
    'use strict';
    
    var api_info = {
        url : 'https://api.gettyimages.com/v3/search/images',
        api_key : '32a6uu5rmr37aqrzyeq335wv'
    }
    var document = global.document;
    var root_wrap, search_form, text_field, card_list_wrap, main_image_wrap;

    var showError = function(msg) {
        // 에러 보여주기
        throw msg;
    }
    var inputValidation = function(input) {
        if(input.phrase.trim() === '') {
            showError('검색어를 입력해주세요');   
        }
    }
    // <li>
    //     <a role="tab" class="is-active">
    //         <figure class="image is-2by1">
    //             <img src="http://bulma.io/images/placeholders/640x320.png" alt="Image">
    //         </figure>
    //
    //     </a>
    // </li>
    var renderImageList = function(images) {
        var template = '<ul class="card-list is-clearfix">';
        images.forEach(function(image) {
            template +=
                '<li>' +
                    '<a role="tab">' +
                        '<figure class="image is-2by1">' +
                            '<img data-id="' + image.collection_id + '" src="'
                             + image.display_sizes[2].uri + '" alt="' + image.title + '">' +
                        '</figure>' +
                    '</a>' +
                '</li>';
        });
        template += '</ul>';
        card_list_wrap.innerHTML = template;
    }
    var searchImages = function(e) {
        e.preventDefault();
        var phrase = text_field.value;
        var input = {
            phrase : phrase
        };
        inputValidation(input);

        var data = {
            phrase : phrase,
            fields : "detail_set",
            // orientations : "Vertical",
            page : 1,
            page_size: 10
            // number_of_people : ['two'],
        };

        ImageFinder().getImageData(data, function(images) {
            console.log('images:', images);
            // ImageFinder(images).renderImageList();
            renderImageList(images);
        });
    }
    var renderMainImage = function(e) {
        e.stopPropagation();
        var target = e.target;
        var nodeName = target.nodeName.toLowerCase();
        if(nodeName === 'img') {
            var main_image = main_image_wrap.querySelector('img');
            ImageFinder(dataset.id);
            console.log('main_image:', main_image);
        }
    }
    var setListener = function() {
        search_form.querySelector('button');
        search_form.addEventListener('submit', searchImages);
        card_list_wrap.addEventListener('click', renderMainImage);
    }
    var init = function() {
        root_wrap = document.querySelector('.wrap');
        search_form = root_wrap.querySelector('.search-form');
        text_field = search_form.querySelector('input');
        card_list_wrap = root_wrap.querySelector('.card-list-wrap');
        main_image_wrap = root_wrap.querySelector('.main-image-wrap');

        ImageFinder(api_info);

        setListener();
    }
    init();
})(window, window.ImageFinder);