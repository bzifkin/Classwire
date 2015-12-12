/*!
 * 
 * Angle - Bootstrap Admin App + jQuery
 * 
 * Version: 3.2.0
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */


(function(window, document, $, undefined){

  if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

  $(function(){

    // Restore body classes
    // ----------------------------------- 
    var $body = $('body');
    new StateToggler().restoreState( $body );
    
    // enable settings toggle after restore
    $('#chk-fixed').prop('checked', $body.hasClass('layout-fixed') );
    $('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed') );
    $('#chk-boxed').prop('checked', $body.hasClass('layout-boxed') );
    $('#chk-float').prop('checked', $body.hasClass('aside-float') );
    $('#chk-hover').prop('checked', $body.hasClass('aside-hover') );

    // When ready display the offsidebar
    $('.offsidebar.hide').removeClass('hide');  

  }); // doc ready


})(window, document, window.jQuery);

// Start Bootstrap JS
// ----------------------------------- 

(function(window, document, $, undefined){

  $(function(){

    // POPOVER
    // ----------------------------------- 

    $('[data-toggle="popover"]').popover();

    // TOOLTIP
    // ----------------------------------- 

    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

    // DROPDOWN INPUTS
    // ----------------------------------- 
    $('.dropdown input').on('click focus', function(event){
      event.stopPropagation();
    });

  });

})(window, document, window.jQuery);

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

(function($, window, document){
  'use strict';

  var Selector = '[data-reset-key]';

  $(document).on('click', Selector, function (e) {
      e.preventDefault();
      var key = $(this).data('resetKey');
      
      if(key) {
        $.localStorage.remove(key);
        // reload the page
        window.location.reload();
      }
      else {
        $.error('No storage key specified for reset.');
      }
  });

}(jQuery, window, document));

// GLOBAL CONSTANTS
// ----------------------------------- 


(function(window, document, $, undefined){

  window.APP_COLORS = {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  };
  
  window.APP_MEDIAQUERY = {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  };

})(window, document, window.jQuery);


// TRANSLATION
// ----------------------------------- 

(function(window, document, $, undefined){

  var preferredLang = 'en';
  var pathPrefix    = 'i18n'; // folder of json files
  var packName      = 'site';
  var storageKey    = 'jq-appLang';

  $(function(){

    if ( ! $.fn.localize ) return;

    // detect saved language or use default
    var currLang = $.localStorage.get(storageKey) || preferredLang;
    // set initial options
    var opts = {
        language: currLang,
        pathPrefix: pathPrefix,
        callback: function(data, defaultCallback){
          $.localStorage.set(storageKey, currLang); // save the language
          defaultCallback(data);
        }
      };

    // Set initial language
    setLanguage(opts);

    // Listen for changes
    $('[data-set-lang]').on('click', function(){

      currLang = $(this).data('setLang');

      if ( currLang ) {
        
        opts.language = currLang;

        setLanguage(opts);

        activateDropdown($(this));
      }

    });
    

    function setLanguage(options) {
      $("[data-localize]").localize(packName, options);
    }

    // Set the current clicked text as the active dropdown text
    function activateDropdown(elem) {
      var menu = elem.parents('.dropdown-menu');
      if ( menu.length ) {
        var toggle = menu.prev('button, a');
        toggle.text ( elem.text() );
      }
    }

  });

})(window, document, window.jQuery);

// NAVBAR SEARCH
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){
    
    var navSearch = new navbarSearchInput();
    
    // Open search input 
    var $searchOpen = $('[data-search-open]');

    $searchOpen
      .on('click', function (e) { e.stopPropagation(); })
      .on('click', navSearch.toggle);

    // Close search input
    var $searchDismiss = $('[data-search-dismiss]');
    var inputSelector = '.navbar-form input[type="text"]';

    $(inputSelector)
      .on('click', function (e) { e.stopPropagation(); })
      .on('keyup', function(e) {
        if (e.keyCode == 27) // ESC
          navSearch.dismiss();
      });
      
    // click anywhere closes the search
    $(document).on('click', navSearch.dismiss);
    // dismissable options
    $searchDismiss
      .on('click', function (e) { e.stopPropagation(); })
      .on('click', navSearch.dismiss);

  });

  var navbarSearchInput = function() {
    var navbarFormSelector = 'form.navbar-form';
    return {
      toggle: function() {
        
        var navbarForm = $(navbarFormSelector);

        navbarForm.toggleClass('open');
        
        var isOpen = navbarForm.hasClass('open');
        
        navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

      },

      dismiss: function() {
        $(navbarFormSelector)
          .removeClass('open')      // Close control
          .find('input[type="text"]').blur() // remove focus
          .val('')                    // Empty input
          ;
      }
    };

  }

})(window, document, window.jQuery);
// SIDEBAR
// ----------------------------------- 


(function(window, document, $, undefined){

  var $win;
  var $html;
  var $body;
  var $sidebar;
  var mq;

  $(function(){

    $win     = $(window);
    $html    = $('html');
    $body    = $('body');
    $sidebar = $('.sidebar');
    mq       = APP_MEDIAQUERY;
    
    // AUTOCOLLAPSE ITEMS 
    // ----------------------------------- 

    var sidebarCollapse = $sidebar.find('.collapse');
    sidebarCollapse.on('show.bs.collapse', function(event){

      event.stopPropagation();
      if ( $(this).parents('.collapse').length === 0 )
        sidebarCollapse.filter('.in').collapse('hide');

    });
    
    // SIDEBAR ACTIVE STATE 
    // ----------------------------------- 
    
    // Find current active item
    var currentItem = $('.sidebar .active').parents('li');

    // hover mode don't try to expand active collapse
    if ( ! useAsideHover() )
      currentItem
        .addClass('active')     // activate the parent
        .children('.collapse')  // find the collapse
        .collapse('show');      // and show it

    // remove this if you use only collapsible sidebar items
    $sidebar.find('li > a + ul').on('show.bs.collapse', function (e) {
      if( useAsideHover() ) e.preventDefault();
    });

    // SIDEBAR COLLAPSED ITEM HANDLER
    // ----------------------------------- 


    var eventName = isTouch() ? 'click' : 'mouseenter' ;
    var subNav = $();
    $sidebar.on( eventName, '.nav > li', function() {

      if( isSidebarCollapsed() || useAsideHover() ) {

        subNav.trigger('mouseleave');
        subNav = toggleMenuItem( $(this) );

        // Used to detect click and touch events outside the sidebar          
        sidebarAddBackdrop();
      }

    });

    var sidebarAnyclickClose = $sidebar.data('sidebarAnyclickClose');

    // Allows to close
    if ( typeof sidebarAnyclickClose !== 'undefined' ) {

      $('.wrapper').on('click.sidebar', function(e){
        // don't check if sidebar not visible
        if( ! $body.hasClass('aside-toggled')) return;

        var $target = $(e.target);
        if( ! $target.parents('.aside').length && // if not child of sidebar
            ! $target.is('#user-block-toggle') && // user block toggle anchor
            ! $target.parent().is('#user-block-toggle') // user block toggle icon
          ) {
                $body.removeClass('aside-toggled');          
        }

      });
    }

  });

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
      .siblings('li')
      .removeClass('open')
      .end()
      .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');
    
    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);

    var subNav = ul.clone().appendTo( $aside );
    
    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
      .addClass('nav-floating')
      .css({
        position: isFixed() ? 'fixed' : 'absolute',
        top:      itemTop,
        bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
      });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.sidebar-subnav.nav-floating').remove();
    $('.dropdown-backdrop').remove();
    $('.sidebar li.open').removeClass('open');
  }

  function isTouch() {
    return $html.hasClass('touch');
  }
  function isSidebarCollapsed() {
    return $body.hasClass('aside-collapsed');
  }
  function isSidebarToggled() {
    return $body.hasClass('aside-toggled');
  }
  function isMobile() {
    return $win.width() < mq.tablet;
  }
  function isFixed(){
    return $body.hasClass('layout-fixed');
  }
  function useAsideHover() {
    return $body.hasClass('aside-hover');
  }

})(window, document, window.jQuery);
// TOGGLE STATE
// -----------------------------------

(function(window, document, $, undefined){

  $(function(){

    var $body = $('body');
        toggle = new StateToggler();

    $('[data-toggle-state]')
      .on('click', function (e) {
        // e.preventDefault();
        e.stopPropagation();
        var element = $(this),
            classname = element.data('toggleState'),
            target = element.data('target'),
            noPersist = (element.attr('data-no-persist') !== undefined);

        // Specify a target selector to toggle classname
        // use body by default
        var $target = target ? $(target) : $body;

        if(classname) {
          if( $target.hasClass(classname) ) {
            $target.removeClass(classname);
            if( ! noPersist)
              toggle.removeState(classname);
          }
          else {
            $target.addClass(classname);
            if( ! noPersist)
              toggle.addState(classname);
          }

        }
        // some elements may need this when toggled class change the content size
        // e.g. sidebar collapsed mode and jqGrid
        $(window).resize();

    });

  });

  // Handle states to/from localstorage
  window.StateToggler = function() {

    var storageKeyName  = 'jq-toggleState';

    // Helper object to check for words in a phrase //
    var WordChecker = {
      hasWord: function (phrase, word) {
        return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
      },
      addWord: function (phrase, word) {
        if (!this.hasWord(phrase, word)) {
          return (phrase + (phrase ? ' ' : '') + word);
        }
      },
      removeWord: function (phrase, word) {
        if (this.hasWord(phrase, word)) {
          return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
        }
      }
    };

    // Return service public methods
    return {
      // Add a state to the browser storage to be restored later
      addState: function(classname){
        var data = $.localStorage.get(storageKeyName);

        if(!data)  {
          data = classname;
        }
        else {
          data = WordChecker.addWord(data, classname);
        }

        $.localStorage.set(storageKeyName, data);
      },

      // Remove a state from the browser storage
      removeState: function(classname){
        var data = $.localStorage.get(storageKeyName);
        // nothing to remove
        if(!data) return;

        data = WordChecker.removeWord(data, classname);

        $.localStorage.set(storageKeyName, data);
      },

      // Load the state string and restore the classlist
      restoreState: function($elem) {
        var data = $.localStorage.get(storageKeyName);

        // nothing to restore
        if(!data) return;
        $elem.addClass(data);
      }

    };
  };

})(window, document, window.jQuery);

/**=========================================================
 * Module: utils.js
 * jQuery Utility functions library 
 * adapted from the core of UIKit
 =========================================================*/

(function($, window, doc){
    'use strict';
    
    var $html = $("html"), $win = $(window);

    $.support.transition = (function() {

        var transitionEnd = (function() {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && { end: transitionEnd };
    })();

    $.support.animation = (function() {

        var animationEnd = (function() {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && { end: animationEnd };
    })();

    $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60); };
    $.support.touch                 = (
        ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
        (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
        (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
        false
    );
    $.support.mutationobserver      = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

    $.Utils = {};

    $.Utils.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $.Utils.removeCssRules = function(selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if(!selectorRegEx) return;

        setTimeout(function(){
            try {
              _ref = document.styleSheets;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                stylesheet = _ref[_i];
                idxs = [];
                stylesheet.cssRules = stylesheet.cssRules;
                for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                  if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                    idxs.unshift(idx);
                  }
                }
                for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                  stylesheet.deleteRule(idxs[_k]);
                }
              }
            } catch (_error) {}
        }, 0);
    };

    $.Utils.isInView = function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $win.scrollLeft(),
            window_top  = $win.scrollTop(),
            offset      = $element.offset(),
            left        = offset.left,
            top         = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
    };

    $.Utils.options = function(string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {}
        }

        return options;
    };

    $.Utils.events       = {};
    $.Utils.events.click = $.support.touch ? 'tap' : 'click';

    $.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function(){

        // Check for dom modifications
        if(!$.support.mutationobserver) return;

        // Install an observer for custom needs of dom changes
        var observer = new $.support.mutationobserver($.Utils.debounce(function(mutations) {
            $(doc).trigger("domready");
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, { childList: true, subtree: true });

    });

    // add touch identifier class
    $html.addClass($.support.touch ? "touch" : "no-touch");

}(jQuery, window, document));
// Custom jQuery
// ----------------------------------- 


(function(window, document, $, undefined){

  $(function(){

    // document ready

  });

})(window, document, window.jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5pbml0LmpzIiwiYm9vdHN0cmFwLXN0YXJ0LmpzIiwiY2xlYXItc3RvcmFnZS5qcyIsImNvbnN0YW50cy5qcyIsImxvY2FsaXplLmpzIiwibmF2YmFyLXNlYXJjaC5qcyIsInNpZGViYXIuanMiLCJ0b2dnbGUtc3RhdGUuanMiLCJ1dGlscy5qcyIsImN1c3RvbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBcbiAqIEFuZ2xlIC0gQm9vdHN0cmFwIEFkbWluIEFwcCArIGpRdWVyeVxuICogXG4gKiBWZXJzaW9uOiAzLjIuMFxuICogQXV0aG9yOiBAdGhlbWljb25fY29cbiAqIFdlYnNpdGU6IGh0dHA6Ly90aGVtaWNvbi5jb1xuICogTGljZW5zZTogaHR0cHM6Ly93cmFwYm9vdHN0cmFwLmNvbS9oZWxwL2xpY2Vuc2VzXG4gKiBcbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXG4gIGlmICh0eXBlb2YgJCA9PT0gJ3VuZGVmaW5lZCcpIHsgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGFwcGxpY2F0aW9uXFwncyBKYXZhU2NyaXB0IHJlcXVpcmVzIGpRdWVyeScpOyB9XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgLy8gUmVzdG9yZSBib2R5IGNsYXNzZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgICB2YXIgJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgbmV3IFN0YXRlVG9nZ2xlcigpLnJlc3RvcmVTdGF0ZSggJGJvZHkgKTtcbiAgICBcbiAgICAvLyBlbmFibGUgc2V0dGluZ3MgdG9nZ2xlIGFmdGVyIHJlc3RvcmVcbiAgICAkKCcjY2hrLWZpeGVkJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdsYXlvdXQtZml4ZWQnKSApO1xuICAgICQoJyNjaGstY29sbGFwc2VkJykucHJvcCgnY2hlY2tlZCcsICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1jb2xsYXBzZWQnKSApO1xuICAgICQoJyNjaGstYm94ZWQnKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1ib3hlZCcpICk7XG4gICAgJCgnI2Noay1mbG9hdCcpLnByb3AoJ2NoZWNrZWQnLCAkYm9keS5oYXNDbGFzcygnYXNpZGUtZmxvYXQnKSApO1xuICAgICQoJyNjaGstaG92ZXInKS5wcm9wKCdjaGVja2VkJywgJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLWhvdmVyJykgKTtcblxuICAgIC8vIFdoZW4gcmVhZHkgZGlzcGxheSB0aGUgb2Zmc2lkZWJhclxuICAgICQoJy5vZmZzaWRlYmFyLmhpZGUnKS5yZW1vdmVDbGFzcygnaGlkZScpOyAgXG5cbiAgfSk7IC8vIGRvYyByZWFkeVxuXG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLy8gU3RhcnQgQm9vdHN0cmFwIEpTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgLy8gUE9QT1ZFUlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG4gICAgJCgnW2RhdGEtdG9nZ2xlPVwicG9wb3ZlclwiXScpLnBvcG92ZXIoKTtcblxuICAgIC8vIFRPT0xUSVBcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS50b29sdGlwKHtcbiAgICAgIGNvbnRhaW5lcjogJ2JvZHknXG4gICAgfSk7XG5cbiAgICAvLyBEUk9QRE9XTiBJTlBVVFNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcbiAgICAkKCcuZHJvcGRvd24gaW5wdXQnKS5vbignY2xpY2sgZm9jdXMnLCBmdW5jdGlvbihldmVudCl7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9KTtcblxuICB9KTtcblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7XG4iLCIvKio9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIE1vZHVsZTogY2xlYXItc3RvcmFnZS5qc1xuICogUmVtb3ZlcyBhIGtleSBmcm9tIHRoZSBicm93c2VyIHN0b3JhZ2UgdmlhIGVsZW1lbnQgY2xpY2tcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4oZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgU2VsZWN0b3IgPSAnW2RhdGEtcmVzZXQta2V5XSc7XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgU2VsZWN0b3IsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIga2V5ID0gJCh0aGlzKS5kYXRhKCdyZXNldEtleScpO1xuICAgICAgXG4gICAgICBpZihrZXkpIHtcbiAgICAgICAgJC5sb2NhbFN0b3JhZ2UucmVtb3ZlKGtleSk7XG4gICAgICAgIC8vIHJlbG9hZCB0aGUgcGFnZVxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgJC5lcnJvcignTm8gc3RvcmFnZSBrZXkgc3BlY2lmaWVkIGZvciByZXNldC4nKTtcbiAgICAgIH1cbiAgfSk7XG5cbn0oalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KSk7XG4iLCIvLyBHTE9CQUwgQ09OU1RBTlRTXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICB3aW5kb3cuQVBQX0NPTE9SUyA9IHtcbiAgICAncHJpbWFyeSc6ICAgICAgICAgICAgICAgICcjNWQ5Y2VjJyxcbiAgICAnc3VjY2Vzcyc6ICAgICAgICAgICAgICAgICcjMjdjMjRjJyxcbiAgICAnaW5mbyc6ICAgICAgICAgICAgICAgICAgICcjMjNiN2U1JyxcbiAgICAnd2FybmluZyc6ICAgICAgICAgICAgICAgICcjZmY5MDJiJyxcbiAgICAnZGFuZ2VyJzogICAgICAgICAgICAgICAgICcjZjA1MDUwJyxcbiAgICAnaW52ZXJzZSc6ICAgICAgICAgICAgICAgICcjMTMxZTI2JyxcbiAgICAnZ3JlZW4nOiAgICAgICAgICAgICAgICAgICcjMzdiYzliJyxcbiAgICAncGluayc6ICAgICAgICAgICAgICAgICAgICcjZjUzMmU1JyxcbiAgICAncHVycGxlJzogICAgICAgICAgICAgICAgICcjNzI2NmJhJyxcbiAgICAnZGFyayc6ICAgICAgICAgICAgICAgICAgICcjM2EzZjUxJyxcbiAgICAneWVsbG93JzogICAgICAgICAgICAgICAgICcjZmFkNzMyJyxcbiAgICAnZ3JheS1kYXJrZXInOiAgICAgICAgICAgICcjMjMyNzM1JyxcbiAgICAnZ3JheS1kYXJrJzogICAgICAgICAgICAgICcjM2EzZjUxJyxcbiAgICAnZ3JheSc6ICAgICAgICAgICAgICAgICAgICcjZGRlNmU5JyxcbiAgICAnZ3JheS1saWdodCc6ICAgICAgICAgICAgICcjZTRlYWVjJyxcbiAgICAnZ3JheS1saWdodGVyJzogICAgICAgICAgICcjZWRmMWYyJ1xuICB9O1xuICBcbiAgd2luZG93LkFQUF9NRURJQVFVRVJZID0ge1xuICAgICdkZXNrdG9wTEcnOiAgICAgICAgICAgICAxMjAwLFxuICAgICdkZXNrdG9wJzogICAgICAgICAgICAgICAgOTkyLFxuICAgICd0YWJsZXQnOiAgICAgICAgICAgICAgICAgNzY4LFxuICAgICdtb2JpbGUnOiAgICAgICAgICAgICAgICAgNDgwXG4gIH07XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuXG4iLCIvLyBUUkFOU0xBVElPTlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXG4gIHZhciBwcmVmZXJyZWRMYW5nID0gJ2VuJztcbiAgdmFyIHBhdGhQcmVmaXggICAgPSAnaTE4bic7IC8vIGZvbGRlciBvZiBqc29uIGZpbGVzXG4gIHZhciBwYWNrTmFtZSAgICAgID0gJ3NpdGUnO1xuICB2YXIgc3RvcmFnZUtleSAgICA9ICdqcS1hcHBMYW5nJztcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICBpZiAoICEgJC5mbi5sb2NhbGl6ZSApIHJldHVybjtcblxuICAgIC8vIGRldGVjdCBzYXZlZCBsYW5ndWFnZSBvciB1c2UgZGVmYXVsdFxuICAgIHZhciBjdXJyTGFuZyA9ICQubG9jYWxTdG9yYWdlLmdldChzdG9yYWdlS2V5KSB8fCBwcmVmZXJyZWRMYW5nO1xuICAgIC8vIHNldCBpbml0aWFsIG9wdGlvbnNcbiAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgbGFuZ3VhZ2U6IGN1cnJMYW5nLFxuICAgICAgICBwYXRoUHJlZml4OiBwYXRoUHJlZml4LFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZGF0YSwgZGVmYXVsdENhbGxiYWNrKXtcbiAgICAgICAgICAkLmxvY2FsU3RvcmFnZS5zZXQoc3RvcmFnZUtleSwgY3VyckxhbmcpOyAvLyBzYXZlIHRoZSBsYW5ndWFnZVxuICAgICAgICAgIGRlZmF1bHRDYWxsYmFjayhkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIC8vIFNldCBpbml0aWFsIGxhbmd1YWdlXG4gICAgc2V0TGFuZ3VhZ2Uob3B0cyk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIGNoYW5nZXNcbiAgICAkKCdbZGF0YS1zZXQtbGFuZ10nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXG4gICAgICBjdXJyTGFuZyA9ICQodGhpcykuZGF0YSgnc2V0TGFuZycpO1xuXG4gICAgICBpZiAoIGN1cnJMYW5nICkge1xuICAgICAgICBcbiAgICAgICAgb3B0cy5sYW5ndWFnZSA9IGN1cnJMYW5nO1xuXG4gICAgICAgIHNldExhbmd1YWdlKG9wdHMpO1xuXG4gICAgICAgIGFjdGl2YXRlRHJvcGRvd24oJCh0aGlzKSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICBcblxuICAgIGZ1bmN0aW9uIHNldExhbmd1YWdlKG9wdGlvbnMpIHtcbiAgICAgICQoXCJbZGF0YS1sb2NhbGl6ZV1cIikubG9jYWxpemUocGFja05hbWUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgY3VycmVudCBjbGlja2VkIHRleHQgYXMgdGhlIGFjdGl2ZSBkcm9wZG93biB0ZXh0XG4gICAgZnVuY3Rpb24gYWN0aXZhdGVEcm9wZG93bihlbGVtKSB7XG4gICAgICB2YXIgbWVudSA9IGVsZW0ucGFyZW50cygnLmRyb3Bkb3duLW1lbnUnKTtcbiAgICAgIGlmICggbWVudS5sZW5ndGggKSB7XG4gICAgICAgIHZhciB0b2dnbGUgPSBtZW51LnByZXYoJ2J1dHRvbiwgYScpO1xuICAgICAgICB0b2dnbGUudGV4dCAoIGVsZW0udGV4dCgpICk7XG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTtcbiIsIi8vIE5BVkJBUiBTRUFSQ0hcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG5cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkLCB1bmRlZmluZWQpe1xuXG4gICQoZnVuY3Rpb24oKXtcbiAgICBcbiAgICB2YXIgbmF2U2VhcmNoID0gbmV3IG5hdmJhclNlYXJjaElucHV0KCk7XG4gICAgXG4gICAgLy8gT3BlbiBzZWFyY2ggaW5wdXQgXG4gICAgdmFyICRzZWFyY2hPcGVuID0gJCgnW2RhdGEtc2VhcmNoLW9wZW5dJyk7XG5cbiAgICAkc2VhcmNoT3BlblxuICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pXG4gICAgICAub24oJ2NsaWNrJywgbmF2U2VhcmNoLnRvZ2dsZSk7XG5cbiAgICAvLyBDbG9zZSBzZWFyY2ggaW5wdXRcbiAgICB2YXIgJHNlYXJjaERpc21pc3MgPSAkKCdbZGF0YS1zZWFyY2gtZGlzbWlzc10nKTtcbiAgICB2YXIgaW5wdXRTZWxlY3RvciA9ICcubmF2YmFyLWZvcm0gaW5wdXRbdHlwZT1cInRleHRcIl0nO1xuXG4gICAgJChpbnB1dFNlbGVjdG9yKVxuICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH0pXG4gICAgICAub24oJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSAvLyBFU0NcbiAgICAgICAgICBuYXZTZWFyY2guZGlzbWlzcygpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAvLyBjbGljayBhbnl3aGVyZSBjbG9zZXMgdGhlIHNlYXJjaFxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIG5hdlNlYXJjaC5kaXNtaXNzKTtcbiAgICAvLyBkaXNtaXNzYWJsZSBvcHRpb25zXG4gICAgJHNlYXJjaERpc21pc3NcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KVxuICAgICAgLm9uKCdjbGljaycsIG5hdlNlYXJjaC5kaXNtaXNzKTtcblxuICB9KTtcblxuICB2YXIgbmF2YmFyU2VhcmNoSW5wdXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmF2YmFyRm9ybVNlbGVjdG9yID0gJ2Zvcm0ubmF2YmFyLWZvcm0nO1xuICAgIHJldHVybiB7XG4gICAgICB0b2dnbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIG5hdmJhckZvcm0gPSAkKG5hdmJhckZvcm1TZWxlY3Rvcik7XG5cbiAgICAgICAgbmF2YmFyRm9ybS50b2dnbGVDbGFzcygnb3BlbicpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGlzT3BlbiA9IG5hdmJhckZvcm0uaGFzQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgXG4gICAgICAgIG5hdmJhckZvcm0uZmluZCgnaW5wdXQnKVtpc09wZW4gPyAnZm9jdXMnIDogJ2JsdXInXSgpO1xuXG4gICAgICB9LFxuXG4gICAgICBkaXNtaXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgJChuYXZiYXJGb3JtU2VsZWN0b3IpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJykgICAgICAvLyBDbG9zZSBjb250cm9sXG4gICAgICAgICAgLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJykuYmx1cigpIC8vIHJlbW92ZSBmb2N1c1xuICAgICAgICAgIC52YWwoJycpICAgICAgICAgICAgICAgICAgICAvLyBFbXB0eSBpbnB1dFxuICAgICAgICAgIDtcbiAgICAgIH1cbiAgICB9O1xuXG4gIH1cblxufSkod2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSk7IiwiLy8gU0lERUJBUlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgdmFyICR3aW47XG4gIHZhciAkaHRtbDtcbiAgdmFyICRib2R5O1xuICB2YXIgJHNpZGViYXI7XG4gIHZhciBtcTtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAkd2luICAgICA9ICQod2luZG93KTtcbiAgICAkaHRtbCAgICA9ICQoJ2h0bWwnKTtcbiAgICAkYm9keSAgICA9ICQoJ2JvZHknKTtcbiAgICAkc2lkZWJhciA9ICQoJy5zaWRlYmFyJyk7XG4gICAgbXEgICAgICAgPSBBUFBfTUVESUFRVUVSWTtcbiAgICBcbiAgICAvLyBBVVRPQ09MTEFQU0UgSVRFTVMgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG5cbiAgICB2YXIgc2lkZWJhckNvbGxhcHNlID0gJHNpZGViYXIuZmluZCgnLmNvbGxhcHNlJyk7XG4gICAgc2lkZWJhckNvbGxhcHNlLm9uKCdzaG93LmJzLmNvbGxhcHNlJywgZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmICggJCh0aGlzKS5wYXJlbnRzKCcuY29sbGFwc2UnKS5sZW5ndGggPT09IDAgKVxuICAgICAgICBzaWRlYmFyQ29sbGFwc2UuZmlsdGVyKCcuaW4nKS5jb2xsYXBzZSgnaGlkZScpO1xuXG4gICAgfSk7XG4gICAgXG4gICAgLy8gU0lERUJBUiBBQ1RJVkUgU1RBVEUgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXG4gICAgXG4gICAgLy8gRmluZCBjdXJyZW50IGFjdGl2ZSBpdGVtXG4gICAgdmFyIGN1cnJlbnRJdGVtID0gJCgnLnNpZGViYXIgLmFjdGl2ZScpLnBhcmVudHMoJ2xpJyk7XG5cbiAgICAvLyBob3ZlciBtb2RlIGRvbid0IHRyeSB0byBleHBhbmQgYWN0aXZlIGNvbGxhcHNlXG4gICAgaWYgKCAhIHVzZUFzaWRlSG92ZXIoKSApXG4gICAgICBjdXJyZW50SXRlbVxuICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpICAgICAvLyBhY3RpdmF0ZSB0aGUgcGFyZW50XG4gICAgICAgIC5jaGlsZHJlbignLmNvbGxhcHNlJykgIC8vIGZpbmQgdGhlIGNvbGxhcHNlXG4gICAgICAgIC5jb2xsYXBzZSgnc2hvdycpOyAgICAgIC8vIGFuZCBzaG93IGl0XG5cbiAgICAvLyByZW1vdmUgdGhpcyBpZiB5b3UgdXNlIG9ubHkgY29sbGFwc2libGUgc2lkZWJhciBpdGVtc1xuICAgICRzaWRlYmFyLmZpbmQoJ2xpID4gYSArIHVsJykub24oJ3Nob3cuYnMuY29sbGFwc2UnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYoIHVzZUFzaWRlSG92ZXIoKSApIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIC8vIFNJREVCQVIgQ09MTEFQU0VEIElURU0gSEFORExFUlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuXG5cbiAgICB2YXIgZXZlbnROYW1lID0gaXNUb3VjaCgpID8gJ2NsaWNrJyA6ICdtb3VzZWVudGVyJyA7XG4gICAgdmFyIHN1Yk5hdiA9ICQoKTtcbiAgICAkc2lkZWJhci5vbiggZXZlbnROYW1lLCAnLm5hdiA+IGxpJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmKCBpc1NpZGViYXJDb2xsYXBzZWQoKSB8fCB1c2VBc2lkZUhvdmVyKCkgKSB7XG5cbiAgICAgICAgc3ViTmF2LnRyaWdnZXIoJ21vdXNlbGVhdmUnKTtcbiAgICAgICAgc3ViTmF2ID0gdG9nZ2xlTWVudUl0ZW0oICQodGhpcykgKTtcblxuICAgICAgICAvLyBVc2VkIHRvIGRldGVjdCBjbGljayBhbmQgdG91Y2ggZXZlbnRzIG91dHNpZGUgdGhlIHNpZGViYXIgICAgICAgICAgXG4gICAgICAgIHNpZGViYXJBZGRCYWNrZHJvcCgpO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICB2YXIgc2lkZWJhckFueWNsaWNrQ2xvc2UgPSAkc2lkZWJhci5kYXRhKCdzaWRlYmFyQW55Y2xpY2tDbG9zZScpO1xuXG4gICAgLy8gQWxsb3dzIHRvIGNsb3NlXG4gICAgaWYgKCB0eXBlb2Ygc2lkZWJhckFueWNsaWNrQ2xvc2UgIT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgICAkKCcud3JhcHBlcicpLm9uKCdjbGljay5zaWRlYmFyJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIC8vIGRvbid0IGNoZWNrIGlmIHNpZGViYXIgbm90IHZpc2libGVcbiAgICAgICAgaWYoICEgJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICAgIGlmKCAhICR0YXJnZXQucGFyZW50cygnLmFzaWRlJykubGVuZ3RoICYmIC8vIGlmIG5vdCBjaGlsZCBvZiBzaWRlYmFyXG4gICAgICAgICAgICAhICR0YXJnZXQuaXMoJyN1c2VyLWJsb2NrLXRvZ2dsZScpICYmIC8vIHVzZXIgYmxvY2sgdG9nZ2xlIGFuY2hvclxuICAgICAgICAgICAgISAkdGFyZ2V0LnBhcmVudCgpLmlzKCcjdXNlci1ibG9jay10b2dnbGUnKSAvLyB1c2VyIGJsb2NrIHRvZ2dsZSBpY29uXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgJGJvZHkucmVtb3ZlQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKTsgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfVxuXG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHNpZGViYXJBZGRCYWNrZHJvcCgpIHtcbiAgICB2YXIgJGJhY2tkcm9wID0gJCgnPGRpdi8+JywgeyAnY2xhc3MnOiAnZHJvcGRvd24tYmFja2Ryb3AnfSApO1xuICAgICRiYWNrZHJvcC5pbnNlcnRBZnRlcignLmFzaWRlJykub24oXCJjbGljayBtb3VzZWVudGVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBPcGVuIHRoZSBjb2xsYXBzZSBzaWRlYmFyIHN1Ym1lbnUgaXRlbXMgd2hlbiBvbiB0b3VjaCBkZXZpY2VzIFxuICAvLyAtIGRlc2t0b3Agb25seSBvcGVucyBvbiBob3ZlclxuICBmdW5jdGlvbiB0b2dnbGVUb3VjaEl0ZW0oJGVsZW1lbnQpe1xuICAgICRlbGVtZW50XG4gICAgICAuc2libGluZ3MoJ2xpJylcbiAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpXG4gICAgICAuZW5kKClcbiAgICAgIC50b2dnbGVDbGFzcygnb3BlbicpO1xuICB9XG5cbiAgLy8gSGFuZGxlcyBob3ZlciB0byBvcGVuIGl0ZW1zIHVuZGVyIGNvbGxhcHNlZCBtZW51XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxuICBmdW5jdGlvbiB0b2dnbGVNZW51SXRlbSgkbGlzdEl0ZW0pIHtcblxuICAgIHJlbW92ZUZsb2F0aW5nTmF2KCk7XG5cbiAgICB2YXIgdWwgPSAkbGlzdEl0ZW0uY2hpbGRyZW4oJ3VsJyk7XG4gICAgXG4gICAgaWYoICF1bC5sZW5ndGggKSByZXR1cm4gJCgpO1xuICAgIGlmKCAkbGlzdEl0ZW0uaGFzQ2xhc3MoJ29wZW4nKSApIHtcbiAgICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xuICAgICAgcmV0dXJuICQoKTtcbiAgICB9XG5cbiAgICB2YXIgJGFzaWRlID0gJCgnLmFzaWRlJyk7XG4gICAgdmFyICRhc2lkZUlubmVyID0gJCgnLmFzaWRlLWlubmVyJyk7IC8vIGZvciB0b3Agb2Zmc2V0IGNhbGN1bGF0aW9uXG4gICAgLy8gZmxvYXQgYXNpZGUgdXNlcyBleHRyYSBwYWRkaW5nIG9uIGFzaWRlXG4gICAgdmFyIG1hciA9IHBhcnNlSW50KCAkYXNpZGVJbm5lci5jc3MoJ3BhZGRpbmctdG9wJyksIDApICsgcGFyc2VJbnQoICRhc2lkZS5jc3MoJ3BhZGRpbmctdG9wJyksIDApO1xuXG4gICAgdmFyIHN1Yk5hdiA9IHVsLmNsb25lKCkuYXBwZW5kVG8oICRhc2lkZSApO1xuICAgIFxuICAgIHRvZ2dsZVRvdWNoSXRlbSgkbGlzdEl0ZW0pO1xuXG4gICAgdmFyIGl0ZW1Ub3AgPSAoJGxpc3RJdGVtLnBvc2l0aW9uKCkudG9wICsgbWFyKSAtICRzaWRlYmFyLnNjcm9sbFRvcCgpO1xuICAgIHZhciB2d0hlaWdodCA9ICR3aW4uaGVpZ2h0KCk7XG5cbiAgICBzdWJOYXZcbiAgICAgIC5hZGRDbGFzcygnbmF2LWZsb2F0aW5nJylcbiAgICAgIC5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogaXNGaXhlZCgpID8gJ2ZpeGVkJyA6ICdhYnNvbHV0ZScsXG4gICAgICAgIHRvcDogICAgICBpdGVtVG9wLFxuICAgICAgICBib3R0b206ICAgKHN1Yk5hdi5vdXRlckhlaWdodCh0cnVlKSArIGl0ZW1Ub3AgPiB2d0hlaWdodCkgPyAwIDogJ2F1dG8nXG4gICAgICB9KTtcblxuICAgIHN1Yk5hdi5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgdG9nZ2xlVG91Y2hJdGVtKCRsaXN0SXRlbSk7XG4gICAgICBzdWJOYXYucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3ViTmF2O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlRmxvYXRpbmdOYXYoKSB7XG4gICAgJCgnLnNpZGViYXItc3VibmF2Lm5hdi1mbG9hdGluZycpLnJlbW92ZSgpO1xuICAgICQoJy5kcm9wZG93bi1iYWNrZHJvcCcpLnJlbW92ZSgpO1xuICAgICQoJy5zaWRlYmFyIGxpLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNUb3VjaCgpIHtcbiAgICByZXR1cm4gJGh0bWwuaGFzQ2xhc3MoJ3RvdWNoJyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNTaWRlYmFyQ29sbGFwc2VkKCkge1xuICAgIHJldHVybiAkYm9keS5oYXNDbGFzcygnYXNpZGUtY29sbGFwc2VkJyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNTaWRlYmFyVG9nZ2xlZCgpIHtcbiAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2FzaWRlLXRvZ2dsZWQnKTtcbiAgfVxuICBmdW5jdGlvbiBpc01vYmlsZSgpIHtcbiAgICByZXR1cm4gJHdpbi53aWR0aCgpIDwgbXEudGFibGV0O1xuICB9XG4gIGZ1bmN0aW9uIGlzRml4ZWQoKXtcbiAgICByZXR1cm4gJGJvZHkuaGFzQ2xhc3MoJ2xheW91dC1maXhlZCcpO1xuICB9XG4gIGZ1bmN0aW9uIHVzZUFzaWRlSG92ZXIoKSB7XG4gICAgcmV0dXJuICRib2R5Lmhhc0NsYXNzKCdhc2lkZS1ob3ZlcicpO1xuICB9XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpOyIsIi8vIFRPR0dMRSBTVEFURVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsICQsIHVuZGVmaW5lZCl7XG5cbiAgJChmdW5jdGlvbigpe1xuXG4gICAgdmFyICRib2R5ID0gJCgnYm9keScpO1xuICAgICAgICB0b2dnbGUgPSBuZXcgU3RhdGVUb2dnbGVyKCk7XG5cbiAgICAkKCdbZGF0YS10b2dnbGUtc3RhdGVdJylcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGNsYXNzbmFtZSA9IGVsZW1lbnQuZGF0YSgndG9nZ2xlU3RhdGUnKSxcbiAgICAgICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZGF0YSgndGFyZ2V0JyksXG4gICAgICAgICAgICBub1BlcnNpc3QgPSAoZWxlbWVudC5hdHRyKCdkYXRhLW5vLXBlcnNpc3QnKSAhPT0gdW5kZWZpbmVkKTtcblxuICAgICAgICAvLyBTcGVjaWZ5IGEgdGFyZ2V0IHNlbGVjdG9yIHRvIHRvZ2dsZSBjbGFzc25hbWVcbiAgICAgICAgLy8gdXNlIGJvZHkgYnkgZGVmYXVsdFxuICAgICAgICB2YXIgJHRhcmdldCA9IHRhcmdldCA/ICQodGFyZ2V0KSA6ICRib2R5O1xuXG4gICAgICAgIGlmKGNsYXNzbmFtZSkge1xuICAgICAgICAgIGlmKCAkdGFyZ2V0Lmhhc0NsYXNzKGNsYXNzbmFtZSkgKSB7XG4gICAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKGNsYXNzbmFtZSk7XG4gICAgICAgICAgICBpZiggISBub1BlcnNpc3QpXG4gICAgICAgICAgICAgIHRvZ2dsZS5yZW1vdmVTdGF0ZShjbGFzc25hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoY2xhc3NuYW1lKTtcbiAgICAgICAgICAgIGlmKCAhIG5vUGVyc2lzdClcbiAgICAgICAgICAgICAgdG9nZ2xlLmFkZFN0YXRlKGNsYXNzbmFtZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8gc29tZSBlbGVtZW50cyBtYXkgbmVlZCB0aGlzIHdoZW4gdG9nZ2xlZCBjbGFzcyBjaGFuZ2UgdGhlIGNvbnRlbnQgc2l6ZVxuICAgICAgICAvLyBlLmcuIHNpZGViYXIgY29sbGFwc2VkIG1vZGUgYW5kIGpxR3JpZFxuICAgICAgICAkKHdpbmRvdykucmVzaXplKCk7XG5cbiAgICB9KTtcblxuICB9KTtcblxuICAvLyBIYW5kbGUgc3RhdGVzIHRvL2Zyb20gbG9jYWxzdG9yYWdlXG4gIHdpbmRvdy5TdGF0ZVRvZ2dsZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBzdG9yYWdlS2V5TmFtZSAgPSAnanEtdG9nZ2xlU3RhdGUnO1xuXG4gICAgLy8gSGVscGVyIG9iamVjdCB0byBjaGVjayBmb3Igd29yZHMgaW4gYSBwaHJhc2UgLy9cbiAgICB2YXIgV29yZENoZWNrZXIgPSB7XG4gICAgICBoYXNXb3JkOiBmdW5jdGlvbiAocGhyYXNlLCB3b3JkKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgd29yZCArICcoXFxcXHN8JCknKS50ZXN0KHBocmFzZSk7XG4gICAgICB9LFxuICAgICAgYWRkV29yZDogZnVuY3Rpb24gKHBocmFzZSwgd29yZCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzV29yZChwaHJhc2UsIHdvcmQpKSB7XG4gICAgICAgICAgcmV0dXJuIChwaHJhc2UgKyAocGhyYXNlID8gJyAnIDogJycpICsgd29yZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZW1vdmVXb3JkOiBmdW5jdGlvbiAocGhyYXNlLCB3b3JkKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc1dvcmQocGhyYXNlLCB3b3JkKSkge1xuICAgICAgICAgIHJldHVybiBwaHJhc2UucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxccykqJyArIHdvcmQgKyAnKFxcXFxzfCQpKicsICdnJyksICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBSZXR1cm4gc2VydmljZSBwdWJsaWMgbWV0aG9kc1xuICAgIHJldHVybiB7XG4gICAgICAvLyBBZGQgYSBzdGF0ZSB0byB0aGUgYnJvd3NlciBzdG9yYWdlIHRvIGJlIHJlc3RvcmVkIGxhdGVyXG4gICAgICBhZGRTdGF0ZTogZnVuY3Rpb24oY2xhc3NuYW1lKXtcbiAgICAgICAgdmFyIGRhdGEgPSAkLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleU5hbWUpO1xuXG4gICAgICAgIGlmKCFkYXRhKSAge1xuICAgICAgICAgIGRhdGEgPSBjbGFzc25hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IFdvcmRDaGVja2VyLmFkZFdvcmQoZGF0YSwgY2xhc3NuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQubG9jYWxTdG9yYWdlLnNldChzdG9yYWdlS2V5TmFtZSwgZGF0YSk7XG4gICAgICB9LFxuXG4gICAgICAvLyBSZW1vdmUgYSBzdGF0ZSBmcm9tIHRoZSBicm93c2VyIHN0b3JhZ2VcbiAgICAgIHJlbW92ZVN0YXRlOiBmdW5jdGlvbihjbGFzc25hbWUpe1xuICAgICAgICB2YXIgZGF0YSA9ICQubG9jYWxTdG9yYWdlLmdldChzdG9yYWdlS2V5TmFtZSk7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gcmVtb3ZlXG4gICAgICAgIGlmKCFkYXRhKSByZXR1cm47XG5cbiAgICAgICAgZGF0YSA9IFdvcmRDaGVja2VyLnJlbW92ZVdvcmQoZGF0YSwgY2xhc3NuYW1lKTtcblxuICAgICAgICAkLmxvY2FsU3RvcmFnZS5zZXQoc3RvcmFnZUtleU5hbWUsIGRhdGEpO1xuICAgICAgfSxcblxuICAgICAgLy8gTG9hZCB0aGUgc3RhdGUgc3RyaW5nIGFuZCByZXN0b3JlIHRoZSBjbGFzc2xpc3RcbiAgICAgIHJlc3RvcmVTdGF0ZTogZnVuY3Rpb24oJGVsZW0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkLmxvY2FsU3RvcmFnZS5nZXQoc3RvcmFnZUtleU5hbWUpO1xuXG4gICAgICAgIC8vIG5vdGhpbmcgdG8gcmVzdG9yZVxuICAgICAgICBpZighZGF0YSkgcmV0dXJuO1xuICAgICAgICAkZWxlbS5hZGRDbGFzcyhkYXRhKTtcbiAgICAgIH1cblxuICAgIH07XG4gIH07XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpO1xuIiwiLyoqPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBNb2R1bGU6IHV0aWxzLmpzXG4gKiBqUXVlcnkgVXRpbGl0eSBmdW5jdGlvbnMgbGlicmFyeSBcbiAqIGFkYXB0ZWQgZnJvbSB0aGUgY29yZSBvZiBVSUtpdFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvYyl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIFxuICAgIHZhciAkaHRtbCA9ICQoXCJodG1sXCIpLCAkd2luID0gJCh3aW5kb3cpO1xuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25FbmQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jLmJvZHkgfHwgZG9jLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdFRyYW5zaXRpb246ICd3ZWJraXRUcmFuc2l0aW9uRW5kJyxcbiAgICAgICAgICAgICAgICAgICAgTW96VHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBPVHJhbnNpdGlvbjogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgZm9yIChuYW1lIGluIHRyYW5zRW5kRXZlbnROYW1lcykge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnN0eWxlW25hbWVdICE9PSB1bmRlZmluZWQpIHJldHVybiB0cmFuc0VuZEV2ZW50TmFtZXNbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25FbmQgJiYgeyBlbmQ6IHRyYW5zaXRpb25FbmQgfTtcbiAgICB9KSgpO1xuXG4gICAgJC5zdXBwb3J0LmFuaW1hdGlvbiA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYW5pbWF0aW9uRW5kID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGRvYy5ib2R5IHx8IGRvYy5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgYW5pbUVuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEFuaW1hdGlvbjogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE1vekFuaW1hdGlvbjogJ2FuaW1hdGlvbmVuZCcsXG4gICAgICAgICAgICAgICAgICAgIE9BbmltYXRpb246ICdvQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQnLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246ICdhbmltYXRpb25lbmQnXG4gICAgICAgICAgICAgICAgfSwgbmFtZTtcblxuICAgICAgICAgICAgZm9yIChuYW1lIGluIGFuaW1FbmRFdmVudE5hbWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIGFuaW1FbmRFdmVudE5hbWVzW25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KCkpO1xuXG4gICAgICAgIHJldHVybiBhbmltYXRpb25FbmQgJiYgeyBlbmQ6IGFuaW1hdGlvbkVuZCB9O1xuICAgIH0pKCk7XG5cbiAgICAkLnN1cHBvcnQucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGZ1bmN0aW9uKGNhbGxiYWNrKXsgd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAvNjApOyB9O1xuICAgICQuc3VwcG9ydC50b3VjaCAgICAgICAgICAgICAgICAgPSAoXG4gICAgICAgICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9tb2JpbGV8dGFibGV0LykpIHx8XG4gICAgICAgICh3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIHdpbmRvdy5Eb2N1bWVudFRvdWNoKSAgfHxcbiAgICAgICAgKHdpbmRvdy5uYXZpZ2F0b3JbJ21zUG9pbnRlckVuYWJsZWQnXSAmJiB3aW5kb3cubmF2aWdhdG9yWydtc01heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFIDEwXG4gICAgICAgICh3aW5kb3cubmF2aWdhdG9yWydwb2ludGVyRW5hYmxlZCddICYmIHdpbmRvdy5uYXZpZ2F0b3JbJ21heFRvdWNoUG9pbnRzJ10gPiAwKSB8fCAvL0lFID49MTFcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgICQuc3VwcG9ydC5tdXRhdGlvbm9ic2VydmVyICAgICAgPSAod2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHwgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXIgfHwgbnVsbCk7XG5cbiAgICAkLlV0aWxzID0ge307XG5cbiAgICAkLlV0aWxzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHZhciB0aW1lb3V0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAkLlV0aWxzLnJlbW92ZUNzc1J1bGVzID0gZnVuY3Rpb24oc2VsZWN0b3JSZWdFeCkge1xuICAgICAgICB2YXIgaWR4LCBpZHhzLCBzdHlsZXNoZWV0LCBfaSwgX2osIF9rLCBfbGVuLCBfbGVuMSwgX2xlbjIsIF9yZWY7XG5cbiAgICAgICAgaWYoIXNlbGVjdG9yUmVnRXgpIHJldHVybjtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBfcmVmID0gZG9jdW1lbnQuc3R5bGVTaGVldHM7XG4gICAgICAgICAgICAgIGZvciAoX2kgPSAwLCBfbGVuID0gX3JlZi5sZW5ndGg7IF9pIDwgX2xlbjsgX2krKykge1xuICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQgPSBfcmVmW19pXTtcbiAgICAgICAgICAgICAgICBpZHhzID0gW107XG4gICAgICAgICAgICAgICAgc3R5bGVzaGVldC5jc3NSdWxlcyA9IHN0eWxlc2hlZXQuY3NzUnVsZXM7XG4gICAgICAgICAgICAgICAgZm9yIChpZHggPSBfaiA9IDAsIF9sZW4xID0gc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGg7IF9qIDwgX2xlbjE7IGlkeCA9ICsrX2opIHtcbiAgICAgICAgICAgICAgICAgIGlmIChzdHlsZXNoZWV0LmNzc1J1bGVzW2lkeF0udHlwZSA9PT0gQ1NTUnVsZS5TVFlMRV9SVUxFICYmIHNlbGVjdG9yUmVnRXgudGVzdChzdHlsZXNoZWV0LmNzc1J1bGVzW2lkeF0uc2VsZWN0b3JUZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBpZHhzLnVuc2hpZnQoaWR4KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChfayA9IDAsIF9sZW4yID0gaWR4cy5sZW5ndGg7IF9rIDwgX2xlbjI7IF9rKyspIHtcbiAgICAgICAgICAgICAgICAgIHN0eWxlc2hlZXQuZGVsZXRlUnVsZShpZHhzW19rXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHt9XG4gICAgICAgIH0sIDApO1xuICAgIH07XG5cbiAgICAkLlV0aWxzLmlzSW5WaWV3ID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xuXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKCEkZWxlbWVudC5pcygnOnZpc2libGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdpbmRvd19sZWZ0ID0gJHdpbi5zY3JvbGxMZWZ0KCksXG4gICAgICAgICAgICB3aW5kb3dfdG9wICA9ICR3aW4uc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICBvZmZzZXQgICAgICA9ICRlbGVtZW50Lm9mZnNldCgpLFxuICAgICAgICAgICAgbGVmdCAgICAgICAgPSBvZmZzZXQubGVmdCxcbiAgICAgICAgICAgIHRvcCAgICAgICAgID0gb2Zmc2V0LnRvcDtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe3RvcG9mZnNldDowLCBsZWZ0b2Zmc2V0OjB9LCBvcHRpb25zKTtcblxuICAgICAgICBpZiAodG9wICsgJGVsZW1lbnQuaGVpZ2h0KCkgPj0gd2luZG93X3RvcCAmJiB0b3AgLSBvcHRpb25zLnRvcG9mZnNldCA8PSB3aW5kb3dfdG9wICsgJHdpbi5oZWlnaHQoKSAmJlxuICAgICAgICAgICAgbGVmdCArICRlbGVtZW50LndpZHRoKCkgPj0gd2luZG93X2xlZnQgJiYgbGVmdCAtIG9wdGlvbnMubGVmdG9mZnNldCA8PSB3aW5kb3dfbGVmdCArICR3aW4ud2lkdGgoKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLlV0aWxzLm9wdGlvbnMgPSBmdW5jdGlvbihzdHJpbmcpIHtcblxuICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHN0cmluZykpIHJldHVybiBzdHJpbmc7XG5cbiAgICAgICAgdmFyIHN0YXJ0ID0gKHN0cmluZyA/IHN0cmluZy5pbmRleE9mKFwie1wiKSA6IC0xKSwgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIGlmIChzdGFydCAhPSAtMSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gKG5ldyBGdW5jdGlvbihcIlwiLCBcInZhciBqc29uID0gXCIgKyBzdHJpbmcuc3Vic3RyKHN0YXJ0KSArIFwiOyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShqc29uKSk7XCIpKSgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH07XG5cbiAgICAkLlV0aWxzLmV2ZW50cyAgICAgICA9IHt9O1xuICAgICQuVXRpbHMuZXZlbnRzLmNsaWNrID0gJC5zdXBwb3J0LnRvdWNoID8gJ3RhcCcgOiAnY2xpY2snO1xuXG4gICAgJC5sYW5nZGlyZWN0aW9uID0gJGh0bWwuYXR0cihcImRpclwiKSA9PSBcInJ0bFwiID8gXCJyaWdodFwiIDogXCJsZWZ0XCI7XG5cbiAgICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGRvbSBtb2RpZmljYXRpb25zXG4gICAgICAgIGlmKCEkLnN1cHBvcnQubXV0YXRpb25vYnNlcnZlcikgcmV0dXJuO1xuXG4gICAgICAgIC8vIEluc3RhbGwgYW4gb2JzZXJ2ZXIgZm9yIGN1c3RvbSBuZWVkcyBvZiBkb20gY2hhbmdlc1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgJC5zdXBwb3J0Lm11dGF0aW9ub2JzZXJ2ZXIoJC5VdGlscy5kZWJvdW5jZShmdW5jdGlvbihtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICQoZG9jKS50cmlnZ2VyKFwiZG9tcmVhZHlcIik7XG4gICAgICAgIH0sIDMwMCkpO1xuXG4gICAgICAgIC8vIHBhc3MgaW4gdGhlIHRhcmdldCBub2RlLCBhcyB3ZWxsIGFzIHRoZSBvYnNlcnZlciBvcHRpb25zXG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG5cbiAgICB9KTtcblxuICAgIC8vIGFkZCB0b3VjaCBpZGVudGlmaWVyIGNsYXNzXG4gICAgJGh0bWwuYWRkQ2xhc3MoJC5zdXBwb3J0LnRvdWNoID8gXCJ0b3VjaFwiIDogXCJuby10b3VjaFwiKTtcblxufShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpKTsiLCIvLyBDdXN0b20galF1ZXJ5XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcblxuXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKXtcblxuICAkKGZ1bmN0aW9uKCl7XG5cbiAgICAvLyBkb2N1bWVudCByZWFkeVxuXG4gIH0pO1xuXG59KSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
