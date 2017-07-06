
var ImageFinder = (function(global, $) {
    'use strict';

    // 의존성 체크
    if(!$) {
        throw 'jquery.ajax.min.js 모듈을 먼저 로드해야 합니다.';
    }

    // Key: 32a6uu5rmr37aqrzyeq335wv
    // Secret: GxNEghbysMB3xa9bCd8vUAgBAeQmDqjN6fpyhZpXs4P8W
    // Status: active
    var toString = Object.prototype.toString;
    var slice = Array.prototype.slice;
    // var url = 'https://api.gettyimages.com/v3/search/images';
    // var api_key = '32a6uu5rmr37aqrzyeq335wv';
    var api_info = {};
    var images = [];

    var type = function(data) {
        return toString.call(data).slice(8, -1).toLowerCase();
    }
    var validate = function(data, compare_data_type, throw_message) {
        if( type(data) === compare_data_type ) {
            return true;
        } else {
            throw throw_message;
        }
    }
    var isType = function(data, data_type) {
        validate(data_type, 'string', 'data_type 전달 인자는 문자열이 전달되어야 합니다');
        return type(data) === data_type;
    }
    var makeArray = function(o) {
        return slice.call(o);
    }
    var mixin = function() {
        var args = makeArray(arguments);
        for (var i=0, l=args.length; i<l; i++) {
            if ( !isType(args[i], 'object') && !isType(args[i], 'function') ) {
                throw '전달인자로 객체만 허용합니다.';
            }
        }
        var mixin_obj = args.shift();
        var next = args.shift();
        do {
            for ( var prop in next ) {
                if ( next.hasOwnProperty(prop) ) {
                    mixin_obj[prop] = next[prop];
                }
            }
            next = args.shift();
        } while ( next );

        return mixin_obj;
    };
    var each = function(o, callback) {
        validate(callback, 'function');
        if ( !isType(o, 'object') && o.length ) {
            o = makeArray(o);
        }
        isType(o, 'array') && o.forEach(callback);
        if ( isType(o, 'object') ) {
            for ( var prop in o ) {
                o.hasOwnProperty(prop) && callback(prop, o[prop], o);
            }
        }
        if ( o.nodeType === 1 ) {
            for ( var prop in o ) {
                callback(prop, o[prop], o);
            }
        }
    }
    var init = function(info) {
        mixin(api_info, info);
    }
    var getImageData = function(data, callback) {
        $.ajax({
            type : 'GET',
            url : api_info.url,
            headers : {
                "Api-Key" : api_info.api_key
            },
            data : data
            // data : {
            //     phrase : "run",
            //     fields : "detail_set",
            //     number_of_people : ['two'],
            //     page : 1,
            //     page_size: 5
            // }
        }).done(function(data) {
            images = data.images;
            callback(data.images);
        });
    }
    var id = function(id) {
        var selected_item;
        images.forEach(function(item) {
            (id === item.collection_id) && (selected_item = item);
        });

        return selected_item;
    }

    var renderImage = function() {

    }

    function ImageFinder(arg) {
        if(!(this instanceof ImageFinder)) {
            return new ImageFinder(arg);
        }

        if(!arg) {
            return this;
        }

        if(isType(arg, 'object')) {
            init(arg);
            return this;
        }
    }
    ImageFinder.prototype = {
        constructor : ImageFinder,
        getImageData : getImageData,
        id : id
    }
    ImageFinder.include = function(obj) {
        mixin(ImageFinder, obj);
    }
    ImageFinder.include({
        mixin : mixin
    });

    return ImageFinder;

})(window, window.jQuery);