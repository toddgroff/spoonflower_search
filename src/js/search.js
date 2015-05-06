$(function() {

  showPopularResults();

  ////////////////////////////////////////////////////////////////////////////////
 //GET 40 MOST POPULAR TO DISPLAY ON LOAD

 function showPopularResults() {
   Api.getPopularList().done(function(response) {
     var results = response.results[0].results;
     var resultElements = apiResultsToHtml(results);
     $('.results-list').empty().append(resultElements);
   });
 }

 ////////////////////////////////////////////////////////////////////////////////
   // COLOR PICKER

  //  $('#picker').colpick({
  //    // flat: true,
  //    layout: 'hex',
  //    submit: 0,
  //    colorScheme: 'light',
  //    onChange: function(hsb, hex, rgb, el, bySetColor) {
  //      $(el).css('border-color', '#' + hex);
  //      // Fill the text box just if the color was set using the picker,
  //      // and not the colpickSetColor function.
  //      if (!bySetColor) $(el).val(hex);
  //    }
  //  }).keyup(function() {
  //    $(this).colpickSetColor(this.value);
  //  });


   ////////////////////////////////////////////////////////////////////////////////
   //GET BY KEYWORD API CALL

   $('.new-search').submit(function(e) {
     e.preventDefault();

     //grab the values of the search options, change them if there is a value
     var keywordSearch = '';
     var keyword = $('.keyword').val();
     if (keyword !== '') {
      // keyword = keyword.split(' ').join('%20');
      //not sure that is necessary
       console.log(keyword);
       keywordSearch = 'q=' + keyword;
     }

     var colorSearch = '';
     var color = $('.color').val();
     if (color !== '') {
       colorSearch = 'color1=' + color;
     }

     var productSearch = '';
     //looking for a checked product button, if exists, resets product variable
     var checked = $('.product-section input[type=radio]:checked');
     if (checked.length > 0) {
         productSearch = 'substrate=' + checked.val();
     }

     Api.getDesignBySearch(keywordSearch, productSearch, colorSearch).done(function(response) {
       var results = response.results[0].results;
       console.log(results);
       var resultElements = apiResultsToHtml(results);
       if (results.length === 0) {
         $('.results-list').empty().append('<i class="fa fa-frown-o"></i> There are no fabrics matching your keyword. Please try again.');
         $('.results-list').addClass('error');
       } else {
         $('.results-list').empty().append(resultElements);
       }

     });

   });

  ////////////////////////////////////////////////////////////////////////////////
  //Translate API calls to html

  function apiResultsToHtml(results) {

    return results.map(function(designItem) {
      var img = $('<img>');
      img.attr('data-id', designItem.id);
      img.attr('src', designItem.thumbnail_url);

      var imgCont = $('<div class="design-img-container"></div>');
      imgCont.append(img);

      var designName = $('<div class="design-name-container"><h3 class="design-name">' + designItem.name + '</h3></div>');

      var designer = $('<div class="designer-container"><h3 class="fabric-designer">by ' + designItem.user.screen_name + '</h3></div>');

      var li = $('<li></li>');
      li.data('item', designItem);
      li.addClass('design-preview card search-result');
      li.append(imgCont);
      li.append(designName);
      li.append(designer);

      return li;
    });
  }


});
