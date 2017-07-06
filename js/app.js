(function(global, ImageFinder) {
    'use strict';
    
    var api_info = {
        url : 'https://api.gettyimages.com/v3/search/images',
        api_key : '32a6uu5rmr37aqrzyeq335wv'
    }
    var document = global.document;
    var root_wrap, search_form, text_field, card_list_wrap, modal_wrap, modal_close;
    var searchSelect;

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
                            '<img data-id="' + image.id + '" src="'
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
        text_field.value = '';
        inputValidation(input);

        var data = {
            phrase : phrase,
            fields : "detail_set",
            // orientations : "Vertical",
            page : 1,
            page_size: 15
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
            var main_image = modal_wrap.querySelector('img');
            var image = ImageFinder().id(target.dataset.id);
            main_image.src = image.display_sizes[0].uri;
            modal_wrap.classList.add('is-active');
        }
    }
    var closeModal = function() {
        modal_wrap.classList.remove('is-active');
    }
    var setListener = function() {
        search_form.querySelector('button');
        search_form.addEventListener('submit', searchImages);
        card_list_wrap.addEventListener('click', renderMainImage);
        modal_close.addEventListener('click', closeModal);
    }
    var init = function() {
        root_wrap = document.querySelector('.wrap');
        search_form = root_wrap.querySelector('.search-form');
        text_field = search_form.querySelector('#searchName');
        card_list_wrap = root_wrap.querySelector('.card-list-wrap');
        modal_wrap = root_wrap.querySelector('.modal');
        modal_close = modal_wrap.querySelector('button');
        // searchSelect = document.querySelector()

        ImageFinder(api_info);

        setListener();
    }
    init();
})(window, window.ImageFinder);