(function(global, ImageFinder) {
    'use strict';
    
    var api_info = {
        url : 'https://api.gettyimages.com/v3/search/images',
        api_key : '32a6uu5rmr37aqrzyeq335wv'
    }
    var document = global.document;
    var content_wrap, search_form, text_field, card_list_wrap, modal_wrap, modal_close, content_wrap;
    var select_wrap, condition_list, form_paragraph, message_box;
    var state = {
        request_count : 0,
        option : {}
    };

    var showMessage = function(msg, is_error) {
        message_box.innerHTML = msg;
        message_box.classList.add('is-active');
        global.setTimeout(function() {
            message_box.classList.remove('is-active');
            message_box.innerHTML = '';
        }, 2000);
        if(is_error) {
            throw msg;
        }
    }
    var inputValidation = function(input) {
        if(input.phrase.trim() === '') {
            showMessage('검색어를 입력해주세요', true);   
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

    var fitImage = function(image) {
        var width = image.max_dimensions.width;
        var height = image.max_dimensions.height;
        var class_name = "fit-width";
        if((width * 9 / 16) > height) {
            class_name = "fit-height";
        }
        return class_name;
    }
    var renderImageList = function(images, orientations) {
        var template = '<ul class="card-list is-clearfix">';
        images.forEach(function(image) {
            var img_class = fitImage(image);
            var figure_class = '';
            if(orientations && orientations[0].indexOf('Vertical') !== -1) {
                // console.log('vertical');
                var figure_class = 'vertical';
                img_class = "fit-width" ? "fit-height" : "fit-width";
            }
            template +=
                '<li>' +
                    '<a role="tab">' +
                        '<figure class="image is-2by1 ' + figure_class + '">' +
                            '<img class="' + img_class + '" data-id="' + image.id + '" src="'
                             + image.display_sizes[2].uri + '" alt="' + image.title + '">' +
                        '</figure>' +
                    '</a>' +
                '</li>';
        });
        template += '</ul>'
            + '<button class="button is-small btn-more">more</button>';
        card_list_wrap.innerHTML = template;
        card_list_wrap.classList.add('card');
    }
    var getSearchOption = function() {
        var checked_box = select_wrap.querySelectorAll('input[type="checkbox"]:checked');
        var obj = {};
        ImageFinder.each(checked_box, function(checkbox) {
            var arr = obj[checkbox.name];
            if(arr === undefined) {
                obj[checkbox.name] = [checkbox.value];
            }else {
                arr.push(arr.pop() + ',' + checkbox.value);
            }
        });

        return obj;
    }
    var searchImages = function(e) {
        e.preventDefault();
        state.request_count = 0;
        var phrase = text_field.value;
        select_wrap.classList.remove('is-active');
        var input = {
            phrase : phrase
        };
        text_field.value = '';
        inputValidation(input);
        var data = {
            phrase : phrase,
            fields : "detail_set",
            sort_order : "best_match",
            // orientations : "Vertical",
            page : ++state.request_count,
            page_size: 15
            // number_of_people : "one,two,group"
        };

        var option = getSearchOption();
        ImageFinder.mixin(data, option);
        state.option = data;

        form_paragraph.classList.add('is-loading');
        ImageFinder().getImageData(data, function(images, result_count) {
            form_paragraph.classList.remove('is-loading');
            showMessage(result_count + '건이 검색되었습니다.');
            // console.log('images:', images);
            // ImageFinder(images).renderImageList();
            renderImageList(images, option.orientations);
        });
    }
    var renderMoreImageList = function(images, orientations) {
        var template = '';
        images.forEach(function(image) {
            var img_class = fitImage(image);
            var figure_class = '';
            if(orientations && orientations[0].indexOf('Vertical') !== -1) {
                // console.log('vertical');
                var figure_class = 'vertical';
                img_class = "fit-width" ? "fit-height" : "fit-width";
            }
            template +=
                '<li>' +
                    '<a role="tab">' +
                        '<figure class="image is-2by1 ' + figure_class + '">' +
                            '<img class="' + img_class + '" data-id="' + image.id + '" src="'
                             + image.display_sizes[2].uri + '" alt="' + image.title + '">' +
                        '</figure>' +
                    '</a>' +
                '</li>';
        });

        var card_list = card_list_wrap.querySelector('.card-list');
        var temp = document.createElement('div');
        card_list.appendChild(temp);
        card_list.lastChild.outerHTML = template;
    }
    var searchMoreImages = function(button) {
        var option = state.option;
        option.page++;
        button.classList.add('is-loading');
        ImageFinder().getImageData(option, function(images, result_count) {
            button.classList.remove('is-loading');
            showMessage(result_count + '건이 검색되었습니다.');
            // console.log('images:', images);
            renderMoreImageList(images, option.orientations);
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
        if(nodeName === 'button') {
            searchMoreImages(e.target);
        }
    }
    var closeModal = function() {
        modal_wrap.classList.remove('is-active');
    }
    var filterFold = function(e) {
        var target = e.target;
        target.classList.contains('button') &&
            select_wrap.classList.toggle('is-active');
    }
    var setListener = function() {
        search_form.querySelector('button');
        search_form.addEventListener('submit', searchImages);
        card_list_wrap.addEventListener('click', renderMainImage);
        modal_close.addEventListener('click', closeModal);
        select_wrap.addEventListener('click', filterFold)
    }
    var init = function() {
        content_wrap = document.querySelector('.content-wrap');
        search_form = content_wrap.querySelector('.search-form');
        text_field = search_form.querySelector('#searchName');
        card_list_wrap = content_wrap.querySelector('.card-list-wrap');
        modal_wrap = content_wrap.querySelector('.modal');
        modal_close = modal_wrap.querySelector('button');
        select_wrap = content_wrap.querySelector('.select-wrap');
        condition_list = select_wrap.querySelector('.condition-list');
        form_paragraph = search_form.querySelector('p.control');
        message_box = search_form.querySelector('.message-box');

        ImageFinder(api_info);

        setListener();
    }
    init();
})(window, window.ImageFinder);