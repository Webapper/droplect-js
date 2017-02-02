/* ========================================================================
 * Droplect (dropdown-select hybrid) component for Bootstrap 3
 * by Csaba Dobai
 * droplect.js v1.0.0
 * ------------------------------------------------------------------------
 * This code based on:
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/*
 SAMPLE CODE
 ===========

 <div class="dropdown">
     <input type="hidden" id="tricky">
     <button id="dLabel" type="button" class="btn btn-default btn-droplect" data-toggle="droplect" data-map-to="tricky" aria-haspopup="true" aria-expanded="false">
         Droplect trigger
         <span class="caret"></span>
     </button>
     <ul class="droplect dropdown-menu" aria-labelledby="dLabel">
         <li data-value="option-1"><a href="#">Action</a></li>
         <li data-value="option-2"><a href="#">Another action</a></li>
         <li data-value="option-3"><a href="#">Something else here</a></li>
         <li role="separator" class="divider"></li>
         <li data-value="option-4"><a href="#">Separated link</a></li>
     </ul>
 </div>

 */

+function ($) {
    'use strict';

    // DROPLECT CLASS DEFINITION
    // =========================

    var backdrop        = '.dropdown-backdrop';
    var toggle          = '[data-toggle="droplect"]';
    var Droplect        = function (element) {
        this.$dropbtn = $(element);
        if (this.$dropbtn.attr(DATA_MULTIPLE) == null && this.$dropbtn.attr(DATA_MAP_TO) == null) throw "Attribute " + DATA_MAP_TO + " must defined in tag where data-toggle is.";

        this.$dropbtn.on('click.bs.droplect', this.toggle);
        this.$mappedTo          = $('#' + this.$dropbtn.attr(DATA_MAP_TO));
        this._multiple          = this.$dropbtn.attr(DATA_MULTIPLE) != null;
        this.$selected          = getSelected(this.$dropbtn);
        this._defaultTrigger    = this.$dropbtn.html();

        // async wait for DOM and initialisation
        var self = this;
        window.setTimeout(function() {
            if (self.$selected.length > 0) self.renderSelect();
        }, 150);
    };

    var DATA_MAP_TO     = 'data-map-to';    // this argument on toggling parent selects a hidden field by its name
                                            // where value of selected item will be mapped to ONLY IF select is not multiple
    var DATA_MULTIPLE   = 'data-multiple';  // present this argument on toggling parent when you would want multiple select
                                            // multiple selection supported only by custom checkbox list

    var DATA_VALUE      = 'data-value';     // item value related to list items of ul.dropdown-menu
    var DATA_SELECTED   = 'data-selected';  // presented on each list items which are selected (this means ONE item by default)

    var defaultSelectionRender = function($this) {
        var droplect = $this.data('bs.droplect'),
            $valsWrapper,
            $ddWrapper = $('<span class="droplect-selection"></span>'),
            $ddCaret = $('<span class="caret"></span>');

        if (!droplect.isMultiple() && droplect.$selected.length == 0) return; // nothing to do when no items were selected

        if (droplect.isMultiple()) {
            if (droplect.$selected.length > 0) {
                droplect.$selected.each(function () {
                    var $it = $(this);
                    $valsWrapper = $('<span class="droplect-value" data-value=""></span>');
                    $valsWrapper.text($it.text());
                    $valsWrapper.attr('data-value', $it.attr(DATA_VALUE));
                    $ddWrapper.append($valsWrapper);
                });
            } else {
                droplect.triggerToDefault();
                return;
            }
        } else {
            $valsWrapper = $('<span class="droplect-value" data-value=""></span>');
            $valsWrapper.html(droplect.$selected.html());
            $valsWrapper.attr('data-value', droplect.$selected.attr(DATA_VALUE));
            $ddWrapper.append($valsWrapper);
        }

        $this.html('').append($ddWrapper).append($ddCaret);
    };

    Droplect.VERSION = '1.0.0';

    function getSelected($this) {
        return $this.next('ul.dropdown-menu').find('li[' + DATA_SELECTED + ']');
    }

    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent()
    }

    function getToggle($this) {
        if ($this.attr('data-toggle') == 'droplect') {
            return $this;
        } else if ($this.get(0).tagName.toLowerCase() == 'ul' && $this.hasClass('dropdown-menu')) {
            return $this.prev(toggle);
        } else {
            return $this.parents('ul.dropdown-menu').prev(toggle);
        }
    }

    function getMenu($this) {
        return getToggle($this).next('ul.dropdown-menu');
    }

    function clearMenus(e) {
        if (e && e.which === 3) return;
        e = e? e : {target: document};
        var
            $eTarget = $(e.target);
        if ($eTarget.parents('.droplect.dropdown-menu').length > 0 && (/input|textarea|select/i.test(e.target.tagName) || $eTarget.find('input, textarea, select').length > 0)) return;

        $(backdrop).remove();
        $(toggle).each(function () {
            var $this         = $(this);
            var $parent       = getParent($this);
            var relatedTarget = { relatedTarget: this };

            if (!$parent.hasClass('open')) return;

            if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

            $parent.trigger(e = $.Event('hide.bs.droplect', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger($.Event('hidden.bs.droplect', relatedTarget))
        })
    }

    function select($el) {
        var
            $droplect = getToggle($el),
            droplect  = $droplect.data('bs.droplect'),
            $items    = $el.parents('ul.dropdown-menu').find('> li');

        if (!droplect.isMultiple()) {
            // clean all selection before of mark selected
            $items.removeAttr(DATA_SELECTED);
            $el.attr(DATA_SELECTED, 'selected');
            droplect.$mappedTo.val($el.attr(DATA_VALUE)).trigger('change');
        } else {
            // toggling selection
            if ($el.attr(DATA_SELECTED)) {
                $el.removeAttr(DATA_SELECTED);
            } else {
                $el.attr(DATA_SELECTED, 'selected');
            }
        }

        droplect.$selected = getSelected($droplect);
        droplect._lastSelected = $el;
        droplect.renderSelect();
        $droplect.trigger('select.bs.droplect', droplect.$selected);
    }

    Droplect.prototype.$dropbtn         = null;
    Droplect.prototype.$mappedTo        = null;
    Droplect.prototype.$selected        = null;
    Droplect.prototype._multiple        = false;
    Droplect.prototype._value           = false;
    Droplect.prototype._lastSelected    = null;
    Droplect.prototype._keyStack        = '';
    Droplect.prototype._lastKeyPress    = null;
    Droplect.prototype.selectionRender  = defaultSelectionRender;
    Droplect.prototype._defaultTrigger  = '';

    Droplect.prototype.isMultiple = function() {
        return this._multiple;
    };

    Droplect.prototype.renderSelect = function() {
        this.selectionRender(this.$dropbtn);
    };

    Droplect.prototype.triggerToDefault = function() {
        this.$dropbtn.html(this._defaultTrigger);
    };

    Droplect.prototype.select = function(e) {
        var $this    = $(this),
            $toggle  = getToggle($this),
            droplect = $toggle.data('bs.droplect'),
            $eTarget = $(e.target),
            dirty    = true; // indicates whether if need cleaning menus or not

        if (droplect == null) return; // nothing to do when clicked on a general dropdown
        if ($eTarget.find('input, textarea, select').length > 0) return; // prevent event handling in order to postpone it when it's matching exactly

        if ($this.hasClass('dropdown-header') || $this.hasClass('divider')) {
            e.stopPropagation();
            e.preventDefault();
            return false;
            // prevent selecting static headers and dividers
        }
        if (/input|textarea|select/i.test(e.target.tagName)) {
            e.stopPropagation();
            dirty = false;
            // prevent dropdown close on form-control children of items
        }
        if (e.target.tagName.toLowerCase() == 'a') {
            e.preventDefault();
            // prevent navigation on anchor children of items
        }
        select($this);
        if (dirty) clearMenus();
        $toggle.trigger('focus');
    };

    Droplect.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled, :disabled')) return;

        var $parent  = getParent($this);
        var isActive = $parent.hasClass('open');

        clearMenus();

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $(document.createElement('div'))
                    .addClass('dropdown-backdrop')
                    .insertAfter($(this))
                    .on('click', clearMenus)
            }

            var relatedTarget = { relatedTarget: this };
            $parent.trigger(e = $.Event('show.bs.droplect', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this
                .trigger('focus')
                .attr('aria-expanded', 'true');

            $parent
                .toggleClass('open')
                .trigger($.Event('shown.bs.droplect', relatedTarget));

            getMenu($this).width(getToggle($this).outerWidth());

            var droplect = $this.data('bs.droplect');
            if (droplect != null) {
                if (droplect._lastSelected != null) {
                    droplect._lastSelected.find('a').trigger('focus');
                } else {
                    getMenu($this).find('a').eq(0).trigger('focus');
                }
            }
        }

        return false
    };

    Droplect.prototype.keydown = function (e) {
        if (!/(38|40|27|32|36|35)/.test(e.which) || /input|textarea|select/i.test(e.target.tagName)) return;

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent  = getParent($this);
        var isActive = $parent.hasClass('open');

        var desc = ' li:not(.disabled):visible a';
        var $items = $parent.find('.dropdown-menu' + desc);
        var droplect = $parent.find(toggle).data('bs.droplect');

        if (e.which == 27) {
            if (isActive) $this.trigger('click');
            $parent.find(toggle).trigger('focus');
            return;
        }

        var index = $items.index(e.target);

        if (!isActive && !/(27|36|35)/.test(e.which)) {
            // not [ESC], [HOME], [END]
            $this.trigger('click');
            $items = $parent.find('.dropdown-menu' + desc);
            if (droplect._lastSelected == null) {
                $items.eq(0).trigger('focus');
            } else {
                droplect._lastSelected.find('a').eq(0).trigger('focus');
                index = $items.index(droplect._lastSelected.find('a').eq(0));
            }
        }

        if (e.which == 36)                              index = 0;                  // home
        if (e.which == 35)                              index = $items.length - 1;  // end
        if (e.which == 38 && index > 0)                 index--;                    // up
        if (e.which == 40 && index < $items.length - 1) index++;                    // down
        if (!~index)                                    index = 0;

        $items.eq(index).trigger('focus')
    };

    Droplect.prototype.keypress = function(e) {
        if (/input|textarea|select/i.test(e.target.tagName)) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.key == '\\') return;

        var
            $this     = $(this),
            $droplect = getToggle($this),
            droplect  = $droplect.data('bs.droplect'),
            time      = new Date();

        if (!droplect._lastKeyPress) droplect._lastKeyPress = time;
        if (droplect._lastKeyPress.getTime() + 350 < time.getTime()) {
            droplect._keyStack = '';
        }

        droplect._lastKeyPress = time;
        droplect._keyStack += e.key;

        var
            $menu     = getMenu($this),
            $contains = $menu.find("li :icontains('" + droplect._keyStack + "')"),
            $found;

        $contains.each(function() {
            var $this = $(this);
            if ($this.text().trim().toLowerCase().indexOf(droplect._keyStack) == 0) {
                $found = $this;
                return false;
            }
        });

        if ($found) {
            var
                $it   = $menu.find('> li').has($found);

            $it.find('a').eq(0).trigger('focus');
        }
    };


    // DROPLECT PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('bs.droplect');

            if (!data) $this.data('bs.droplect', (data = new Droplect(this)));
            if (typeof option == 'string') data[option].call($this)
        })
    }

    var old = $.fn.droplect;

    $.fn.droplect             = Plugin;
    $.fn.droplect.Constructor = Droplect;


    // DROPLECT NO CONFLICT
    // ====================

    $.fn.droplect.noConflict = function () {
        $.fn.droplect = old;
        return this
    };

    // EXTENDING JQUERY WITH CASE-INSENSITIVE :contains() FILTER
    $.expr[":"].icontains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    // APPLY TO STANDARD DROPLECT ELEMENTS
    // ===================================

    $(function() { $(toggle).droplect() });
    $(document)
        .on('click.bs.droplect.data-api', clearMenus)
        .on('click.bs.droplect.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('click.bs.droplect.data-api', '.droplect.dropdown-menu > li', Droplect.prototype.select)
        .on('click.bs.droplect.data-api', toggle, Droplect.prototype.toggle)
        .on('keydown.bs.droplect.data-api', toggle, Droplect.prototype.keydown)
        .on('keydown.bs.droplect.data-api', '.droplect.dropdown-menu', Droplect.prototype.keydown)
        .on('keypress.bs.droplect.data-api', '.droplect.dropdown-menu', Droplect.prototype.keypress)

}(jQuery);