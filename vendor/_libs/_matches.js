;(function (proto) {

  // adapted from https://gist.github.com/elijahmanor/6452535
  if (!proto.matches) {
    proto.matches = proto.matchesSelector ||
      proto.mozMatchesSelector ||
      proto.msMatchesSelector ||
      proto.webkitMatchesSelector;
  }

  // from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  if (!proto.closest) {
    proto.closest = function closest(s) {
        var el = this;
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (ancestor.matches(s)) return ancestor;
            ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
    };
  }

})(Element.prototype)
