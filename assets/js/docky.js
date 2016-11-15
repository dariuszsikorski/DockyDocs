// Docky Scripting by PrettyMinimal.com

// add jquery highlight function
jQuery.fn.highlight = function() {
  $(this).each(function() {
    var el = $(this);
    el.before("<div/>")
    el.prev()
      .width(el.width())
      .height(el.height())
      .css({
        "position": "absolute",
        "background-color": "#194CEC",
        "opacity": ".1"
      })
      .fadeOut(1000);
  });
}

var docky = {}; // create docky namespace
$(function() {

  // Pin right side navigation when user scrolls
  $(".bs-docs-sidebar > .nav").affix({
    offset: {
      top: 15 // y scroll to activate affix
    }
  });

  // Add search through document
  $('#searcher').keyup(function(){
    $('.doc-content > *').removeHighlight();
    if($(this).val()!=''){
      $('.doc-content > *').highlightText($(this).val(), false);
      if($('.highlightText').length > 0){
        var highlightedTop = $(".highlightText").offset().top - 50;
        $(window).scrollTop(highlightedTop);
      }
    }
    else {
      $(window).scrollTop(0);
    }
  });

  // Initialise Highlight.js for pretty syntax colouring and convert code inside <code> tag
  $('code').not('code.manualConvert').each(function() {
    $(this).text($.trim($(this).html()));
  });
  $('pre').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  // generate sidebar menu with index of contents
  docky.generateNavigation = function() {
    var navigationHtml = "";
    
    $('.doc-content > section').each(function(groupIndex) {
      var currentGroup = $('.doc-content > section')[groupIndex];
      var currentGroupHeader = $.trim($(currentGroup).children('h1').text());
      var generatedGroupId = ((groupIndex + 1) + '-' + $.trim($(currentGroup).children('h1').text()).replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-')).toLowerCase();
      $(currentGroup).attr('id', generatedGroupId);
      navigationHtml += '<li>\n<a href="#' + generatedGroupId + '">' + currentGroupHeader + "</a>";
      navigationHtml += '\n<ul class="nav">';
      
      $(currentGroup).children('div').has('h2').each(function(subgroupIndex) {
        var currentSubgroup = $(currentGroup).children('div').has('h2')[subgroupIndex];
        var currentSubgroupHeader = $.trim($(currentSubgroup).children('h2:first-child').text());
        var generatedSubgroupId = generatedGroupId + '-' + (subgroupIndex + 1) + '-' + ($.trim($(currentSubgroup).children('h2:first-child').text()).replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-')).toLowerCase();
        $(currentSubgroup).attr('id', generatedSubgroupId);
        navigationHtml += '\n\t<li><a href="#' + generatedSubgroupId + '">' + currentSubgroupHeader + '</a></li>';
      });

      navigationHtml += '\n</ul>';
      navigationHtml += '\n</li>\n';
    });
    $('.bs-docs-sidebar > .nav').html(navigationHtml);
  }
  docky.generateNavigation();

  // Docky Scroll Spy
  $('body').scrollspy({
    target: '.bs-docs-sidebar',
    offset: 65
  });

  // add page bottom margin for ScrollSpy correction
  docky.spyFix = function() {
    var fixMargin = $(window).height() - $(".group:last-child .subgroup:last-child").height() - $(".doc-content").offset().top;
    if (!(fixMargin >= 0)) {
      fixMargin = 0;
    }
    $(".doc-content").css("padding-bottom", fixMargin - 54);
  }
  $(window).resize(function() {
    docky.spyFix();
  });
  docky.spyFix();

  // correct page scrollbar position after user clicks link on navigation
  $('.bs-docs-sidebar a').not('.bs-docs-sidebar > ul li:last-child li:last-child a').click(function(e) {
    setTimeout(function() {
      var scrollOffset = $(window).scrollTop() - 50;
      // $('html, body').scrollTop(scrollOffset-10).animate({ scrollTop: scrollOffset }); // animated version
      $(window).scrollTop(scrollOffset);
    }, 0);
  });
});