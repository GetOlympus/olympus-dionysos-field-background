/*!
 * background.js v0.0.1
 * https://github.com/GetOlympus/olympus-dionysos-field-background
 *
 * This plugin updates background canvas preview.
 *
 * Example of JS:
 *      $('.background').dionysosBackground({
 *          attachment: '.input-attachment',        // node element which contains attachment input
 *          color: '.input-color',                  // node element which contains color input
 *          image: '.input-image',                  // node element which contains image input
 *          position: '.input-position',            // node element which contains position input
 *          repeat: '.input-repeat',                // node element which contains repeat input
 *          size: '.input-size',                    // node element which contains size input
 *
 *          canvas: '.canvas',                      // node element which contains preview canvas
 *          editbutton: '.edit-button',             // node element which contains edit button
 *          settings: {
 *              color: {},                          // options to build wpColor object
 *              upload: {}                          // options to build wpMedia object
 *          }
 *      });
 *
 * Example of HTML:
 *      <div class="background">
 *          <input type="hidden" name="ctm" value="" />
 *
 *          <fieldset data-u="123456">
 *              <input type="hidden" name="ctm[123456][id]" value="123456" />
 *              <input type="hidden" name="ctm[123456][background-image]" value="https://www.domain.ext/statics/upload/my-file.jpg" data-style="background-image" />
 *
 *              <a href="https://www.domain.ext/statics/upload/my-file.jpg" class="upload-url" target="_blank">
 *                  <img src="https://www.domain.ext/statics/upload/my-file.jpg" alt="" class="image" />
 *              </a>
 *
 *              <a href="#" class="edit-button">Edit</a>
 *          </fieldset>
 *
 *          <select name="ctm[background-attachment]" class="input-attachment" data-style="background-attachment"></select>
 *          <input type="text" name="ctm[background-position]" value="" class="input-position" data-style="background-position" />
 *          <select name="ctm[background-repeat]" class="input-repeat" data-style="background-repeat"></select>
 *          <select name="ctm[background-size]" class="input-size" data-style="background-size"></select>
 *          <input type="text" name="ctm[background-color]" value="" class="input-color" data-style="background-color" />
 *
 *          <div class="canvas">
 *              <label>Preview:</label>
 *          </div>
 *      </div>
 *
 * Copyright 2016 Achraf Chouk
 * Achraf Chouk (https://github.com/crewstyle)
 */

(function ($){
    "use strict";

    /**
     * Constructor
     * @param {nodeElement} $el
     * @param {array}       options
     */
    var Background = function ($el,options){
        // vars
        var _this = this;

        // this plugin works ONLY with WordPress wpTemplate and wpMedia functions
        if (!wp || !wp.template || !wp.media) {
            return;
        }

        _this.$el = $el;
        _this.options = options;

        // update settings
        _this.settings = _this.options.settings;

        // update elements list
        _this.$attachment = _this.$el.find(_this.options.attachment);
        _this.$color = _this.$el.find(_this.options.color);
        _this.$image = _this.$el.find(_this.options.image);
        _this.$position = _this.$el.find(_this.options.position);
        _this.$repeat = _this.$el.find(_this.options.repeat);
        _this.$size = _this.$el.find(_this.options.size);
        _this.$canvas = _this.$el.find(_this.options.canvas);

        // use wpColor
        _this.$color.wpColorPicker($.extend(_this.settings.color, {
            change: function (e,ui){
                _this.update_canvas(_this.$color.attr('data-style'), ui.color.toString());
            },
            clear: function (e){
                _this.update_canvas(_this.$color.attr('data-style'), 'transparent');
            }
        }));

        // bind edit event
        _this.$el.find(_this.options.editbutton).on('click', $.proxy(_this.edit_image, _this));

        // bind other events
        _this.$position.on('keyup', _this.delay($.proxy(_this.input_keyup, _this), 500));
        $([_this.$attachment, _this.$repeat, _this.$size]).each(function (){
            $(this).on('change', $.proxy(_this.select_change, _this));
        });

        // initialize preview
        _this.update_canvas();
    };

    /**
     * @type {nodeElement}
     */
    Background.prototype.$canvas = null;

    /**
     * @type {nodeElement}
     */
    Background.prototype.$attachment = null;
    Background.prototype.$color = null;
    Background.prototype.$image = null;
    Background.prototype.$position = null;
    Background.prototype.$repeat = null;
    Background.prototype.$size = null;

    /**
     * @type {nodeElement}
     */
    Background.prototype.$el = null;

    /**
     * @type {Object}
     */
    Background.prototype.media = null;

    /**
     * @type {array}
     */
    Background.prototype.options = null;

    /**
     * @type {Object}
     */
    Background.prototype.settings = null;

    /**
     * Delay before event
     * @param {callback} func
     * @param {int}      ms
     */
    Background.prototype.delay = function (func,ms){
        var _timer = 0;

        return function (){
            var _context = this,
                _args = arguments;

            clearTimeout(_timer);
            _timer = setTimeout(function (){
                func.apply(_context,_args);
            }, ms || 0);
        };
    };

    /**
     * Delay before event
     * @param {event} e
     */
    Background.prototype.edit_image = function (e){
        e.preventDefault();
        var _this = this;

        // vars
        var $self = $(e.target || e.currentTarget),
            $parent = $self.closest('[data-u]');

        // open medialib modal
        _this._open_medialib({
            library: {
                type: _this.settings.upload.type,
            },
            multiple: false,
            title: _this.settings.upload.title
        }, $parent);
    };

    /**
     * Keyup event on inputs
     * @param {event} e
     */
    Background.prototype.input_keyup = function (e){
        e.preventDefault();
        var _this = this;

        var $input = $(e.target || e.currentTarget),
            _attr = $input.attr('data-style'),
            _val = $input.val();

        // update canvas css
        _this.update_canvas(_attr, _val);
    };

    /**
     * Change event on selects
     * @param {event} e
     */
    Background.prototype.select_change = function (e){
        e.preventDefault();
        var _this = this;

        var $select = $(e.target || e.currentTarget),
            _attr = $select.attr('data-style'),
            _val = $select.children('option:selected').val();

        // update canvas css
        _this.update_canvas(_attr, _val);
    };

    /**
     * Update canvas after keyup / change events
     * @param {string} attribute
     * @param {string} value
     */
    Background.prototype.update_canvas = function (attribute,value){
        var _this = this;

        // check vars
        if (2 === arguments.length && '' !== value) {
            _this.$canvas.css(attribute, value);
        } else {
            // inputs
            $([_this.$image, _this.$position]).each(function (){
                var $self = $(this),
                    _attr = $self.attr('data-style'),
                    _val = 'background-image' == _attr ? 'url('+$self.val()+')' : $self.val();

                _this.$canvas.css(_attr, _val);
            });

            // selects
            $([_this.$attachment, _this.$repeat, _this.$size]).each(function (){
                var $self = $(this),
                    _attr = $self.attr('data-style');

                _this.$canvas.css(_attr, $self.children('option:selected').val());
            });
        }
    };

    /**
     * Attach items to HTML
     * @param {array} items
     */
    Background.prototype._attach_items = function (item){
        var _this = this;

        // check attachments should be only one
        if (1 !== item.length) {
            return;
        }

        // update image field
        _this.$image.val(item[0].url);

        // get parent
        var $parent = _this.$image.closest('[data-u]');
        $parent.attr('data-u', item[0].id);

        // update children
        $parent.find('input[type="hidden"]:first-child').val(item[0].id);
        $parent.find('.upload-url').attr('href', item[0].url);
        $parent.find('.upload-url img').attr('src', item[0].url);

        // update canvas
        _this.update_canvas();
    };

    /**
     * Open medialib modal with options
     * @param {Object}      options
     * @param {nodeElement} $item
     */
    Background.prototype._open_medialib = function (options,$item){
        var _this = this;

        // check if the medialib object has already been created
        if (_this.media) {
            _this._update_selectlist($item);
            _this.media.open();

            return;
        }

        // create and open medialib
        _this.media = wp.media.frames.file_frame = wp.media(options);

        // check selection
        _this._update_selectlist($item);

        // bind event when medias are selected
        _this.media.on('select', function () {
            // get all selected medias
            _this.selections = _this.media.state().get('selection');

            // JSONify and display them
            _this._attach_items(_this.selections.toJSON());

            // restore the main post ID
            wp.media.model.settings.post.id = _this.settings.upload.wpid;
        });

        // open the modal
        _this.media.open();
    };

    /**
     * Attach items to select list
     * @param {nodeElement} $item
     */
    Background.prototype._update_selectlist = function ($item){
        var _this = this;

        //bind event when medialib popin is opened
        _this.media.on('open', function (){
            // get selected items
            _this.selections = _this.media.state().get('selection');

            // get selected media
            var _attach = wp.media.attachment($item.attr('data-u'));
            _attach.fetch();
            _this.selections.add(_attach ? [_attach] : []);
        });
    };

    var methods = {
        init: function (options){
            if (!this.length) {
                return false;
            }

            var settings = {
                attachment: '.input-attachment',
                color: '.input-color',
                image: '.input-image',
                position: '.input-position',
                repeat: '.input-repeat',
                size: '.input-size',

                canvas: '.canvas',
                editbutton: '.edit-button',
                settings: {
                    color: {
                        defaultColor: true,
                        hide: true,
                        palettes: true,
                        width: 255,
                        mode: "hsv",
                        type: "full",
                        slider: "horizontal"
                    },
                    upload: {
                        media: null,
                        size: 'full',
                        title: false,
                        type: 'image',
                        wpid: null
                    }
                }
            };

            return this.each(function (){
                if (options) {
                    $.extend(settings, options);
                }

                new Background($(this), settings);
            });
        }
    };

    $.fn.dionysosBackground = function (method){
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method '+method+' does not exist on dionysosBackground');
            return false;
        }
    };
})(window.jQuery, window.wp);
