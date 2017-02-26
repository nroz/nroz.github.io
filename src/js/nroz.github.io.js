/*!
 * This file is part of nroz.github.io.
 *
 * Copyright (c) 1980 - 2017 Tobias Kratz
 * All rights reserved.
 */
/*
 * @author Tobias Kratz <kratz.tobias@googlemail.com>
 */

(function (factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    require(["jquery", "bootstrap"], factory);
  } else {
    console.error("Almond is not working properly.");
  }
}(function ($) {

  var partialUrl = ['//', window.location.hostname, "/content/partials/"].join(""),
    cache_ = {},
    update_ = function(hash, content) {
      // set active navigation state
      var $item = $('.nav a[href="'+hash+'"]').parent();
      $item.siblings().removeClass("active");
      $item.addClass("active");

      // set content
      $("section[data-content]").html(content);
    },
    load_ = function (hash) {
      if(cache_.hasOwnProperty(hash)) {
        return update_(hash, cache_[hash]);
      }
      var jqxhr = $.get([partialUrl, hash.substr(1), ".html"].join("")).done(function (data) {
        cache_[hash] = data;
        update_(hash, cache_[hash]);
      }).fail(function () {
        console.error("FAIL");
      });
    };
  $(window).on("hashchange", function (e) {
    e.preventDefault();
    load_(window.location.hash);
  });
  if(!window.location.hash) {
    window.location.hash = "#here";
  }
  load_(window.location.hash);
}));