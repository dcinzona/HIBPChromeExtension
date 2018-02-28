hibpChecker = function(){
  'use strict';

  var minLength = 1;

  function hasValue(obj) {
    return $(obj).val().length >= minLength;
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
    var btn = $('<button type="button" class="pwndChecker" style="display:none;margin-left:1em;">Check Password</button>');
    $(obj).before(btn);
    btn.on('click', function () {
      if(hasValue(obj)){
        hibpChecker.checkPassword(obj);
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

  var statuses = {
    Found: 200,
    Safe: 404,
    RateLimit: 429
  }

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
    $(item).tooltip('destroy');
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://haveibeenpwned.com/api/v2/pwnedpassword/" + sha1($(item).val()), true);
    xhr.onload = function () {
      switch (xhr.status) {
        case statuses.Found:
          $(item).tooltip(tooltips.found);
          break;
        case statuses.Safe:
          $(item).tooltip(tooltips.safe);
          break;
        case statuses.RateLimit:
          $(item).tooltip(tooltips.rateLimit);
          break;
      }
      $(item).tooltip('show');
    };
    xhr.send();
  }

  return {
    checkPassword: checkHIBP
  }
}();




