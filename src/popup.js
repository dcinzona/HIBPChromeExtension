hibpChecker = function(){
  'use strict';

  var minLength = 1;
  var endpoint = 'https://api.pwnedpasswords.com/range/';

  function hasValue(obj) {
    return $(obj).val().length >= minLength;
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  function toggleButton(obj,btn){
    if(!hasValue(obj)){
      btn.hide();
    }else{
      btn.show();
    }
  }
  //on keyup, start the countdown
  $(":password").each(function (index, obj) {
    //create button
    var btn = $('<a type="button" style="display:none;margin-left:1em;float:right;cursor:pointer">Check \';--</button>');
    $(obj).before(btn);
    btn.on('click', function () {
      if(hasValue(obj)){
        hibpChecker.checkPassword(obj)
      }
    });
    //set up keyup handler
    $(obj).on('keyup', function(){
      $(obj).tooltip('destroy');
      toggleButton(obj,btn);
    });
    //show/hide if it has a value on load
    toggleButton(obj,btn);
  });

  var tooltips = {
    safe: {
      title: "This password has not been reported on haveibeenpwned.com.",
      placement: "bottom",
      html: true,
      template: '<div class="tooltip" role="tooltip"><div style="border-bottom-color: #008c00;" class="tooltip-arrow"></div><div style="background-color: #008c00;" class="tooltip-inner"></div></div>'
    },
    found: {
        title: "This password was found in a list online from past breaches. Please change it as soon as possible to avoid having your account compromised.",
        placement: "bottom",
        html: true,
        template: '<div class="tooltip" role="tooltip"><div style="border-bottom-color: #ef3737;" class="tooltip-arrow"></div><div style="background-color: #ef3737;" class="tooltip-inner"></div></div>'
    },
    rateLimit: {
      title: "Rate Limit reached.  Please try again in a second.",
      placement: "bottom",
      html: true,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    }
  }

  function checkHIBP(item) {
    var $item = $(item);
    $item.tooltip('destroy');
    var hash = SHA1($item.val()).toUpperCase();
    var prefix = hash.substr(0, 5);
    var suffix = hash.substr(5);
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
      switch (xhr.status) {
        case 200:
          var resp = xhr.responseText;
          if (resp.indexOf(suffix) !== -1) {
            $item.tooltip(tooltips.found);
          } else {
            $item.tooltip(tooltips.safe);
          }
          break;
        case 404:
          $item.tooltip(tooltips.safe);
          break;
        case 429:
          $item.tooltip(tooltips.rateLimit);
          break;
      }
      $item.tooltip('show');
    }
    var cachebreaker = '?' + 'HIBPChromeExtension';//(new Date()).getTime();
    xhr.open('GET', endpoint + prefix + cachebreaker);
    xhr.send();
  }

  return {
    checkPassword: checkHIBP
  }
}();




