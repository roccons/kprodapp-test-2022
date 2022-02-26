// requestAnimationFrame polyfill for IE10+ and others, by aMarCruz.
// 2015/01/19
// 2015/05/09 - last rev

// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon, Erik Möller.

// MIT license

!(function(win) {

  var haveraf = function(vendor) {
    return win.requestAnimationFrame && win.cancelAnimationFrame ||
      (
        (win.requestAnimationFrame = win[vendor + 'RequestAnimationFrame']) &&
        (win.cancelAnimationFrame = (win[vendor + 'CancelAnimationFrame'] ||
                                     win[vendor + 'CancelRequestAnimationFrame']))
      );
  };

  // there is not more -o- or -ms- prefix
  if (!haveraf('webkit') && !haveraf('moz') ||
      /iP(ad|hone|od).*OS 6/.test(win.navigator.userAgent)) {   // IE9-, buggy iOS6

    // closures
    var lastTime = 0;

    // polyfills
    win.requestAnimationFrame = function(callback) {
      var nowTime = Date.now();
      var nextTime = Math.max(lastTime + 16, nowTime);
      return win.setTimeout(function() {
          callback(lastTime = nextTime);
        }, nextTime - nowTime);
    };

    win.cancelAnimationFrame = win.clearTimeout;
  }

})(window);
