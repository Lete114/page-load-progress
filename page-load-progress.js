;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      (global.pageLoadProgress = factory()))
})(this, function () {
  'use strict'
  // Polyfill CustomEvent
  ;(function () {
    try {
      new window.CustomEvent('T')
    } catch (e) {
      var CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined }
        var evt = document.createEvent('CustomEvent')
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
      }
      CustomEvent.prototype = window.Event.prototype
      window.CustomEvent = CustomEvent
    }
  })()

  // Polyfill matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (selector) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(selector)
        var i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  // Polyfill closest
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this
      if (!document.documentElement.contains(el)) return null
      do {
        if (el.matches(selector)) return el
        el = el.parentElement
      } while (el !== null)
      return null
    }
  }

  var link = document.createElement('link')
  var isPrefetch = link.relList && link.relList.supports && link.relList.supports('prefetch')
  // Polyfill prefetch
  var prefetch = function (url, end, error) {
    if (isPrefetch) {
      var link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      link.onload = end
      link.onerror = error
      document.head.appendChild(link)
    } else {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.onload = end
      xhr.onerror = error
      xhr.send()
    }
  }

  var customEventFactory = function (eventName) {
    document.documentElement.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true
      })
    )
  }

  function indexHandler(params) {
    var path = params.replace(/(\/index\.html|\/)$/gi, '')
    if (!path.length) path = '/'
    return path
  }

  var options = {}
  window.addEventListener('click', function (event) {
    var target = event.target
    if (target instanceof Element && (target = target.closest('a[href]:not([target^=_]):not([download])'))) {
      var href = target.href
      var isEqual = indexHandler(new URL(href).pathname) === indexHandler(location.pathname)
      if (target.tagName !== 'A' || isEqual) return

      var ignoreKeywords = options.ignoreKeywords || []
      for (var i = 0; i < ignoreKeywords.length; i++) {
        if (href.indexOf(ignoreKeywords[i]) !== -1) return
      }

      if (href && location.origin === new URL(href).origin) {
        if (event.ctrlKey) return
        event.preventDefault()
        customEventFactory('progress:start')
        prefetch(
          href,
          function () {
            customEventFactory('progress:end')
            setTimeout(() => {
              window.open(href, '_self')
            }, options.defer || 500)
          },
          function () {
            customEventFactory('progress:error')
          }
        )
      }
    }
  })

  return function (_options) {
    options = _options
  }
})
