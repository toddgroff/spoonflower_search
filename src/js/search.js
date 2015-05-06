$(function() {

  showPopularResults();


  ////////////////////////////////////////////////////////////////////////////////
 //GET 40 MOST POPULAR TO DISPLAY ON LOAD

 function showPopularResults() {
   Api.getPopularList().done(function(response) {
     var results = response.results[0].results;
     var resultElements = apiResultToElements(results);
     $('.results-list').empty().append(resultElements);
   });
 }

   ////////////////////////////////////////////////////////////////////////////////
   //COLOR-PICKER


   $('.color-search').submit(function(e) {
     e.preventDefault();
     Api.getDesignByColor($('input', this).val()).done(function(response) {
       var results = response.results[0].results;
       var resultElements = apiResultToElements(results);

       $('.results-list').empty().append(resultElements);
     })
   });

   $('.fabric-modal-box').on('click', function(e) {
     e.stopPropagation();
   });

   ////////////////////////////////////////////////////////////////////////////////
   //GET BY KEYWORD API CALL

   $('.new-search').submit(function(e) {
     e.preventDefault();

     //grab the values of the search options
     var keyword = $('.keyword').val();
     var color = $('.color').val();
     var product = '';
     //looking for a checked product button, if exists, resets product var
     var selected = $('.product[type=radio]:checked');
     if (selected.length > 0) {
         product = selected.val();
     }

     Api.getDesignBySearch(keyword, product, color).done(function(response) {
       var results = response.results[0].results;
       var resultElements = apiResultToElements(results);
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

  function apiResultToElements(results) {

    return results.map(function(designItem) {
      var img = $('<img>');
      img.attr('data-id', designItem.id);
      img.attr('src', designItem.thumbnail_url);

      var imgCont = $('<div class="fabric-img-container"></div>');
      imgCont.append(img);

      var designName = $('<div class="name-container"><h3 class="fabric-name">' + designItem.name + '</h3></div>');

      var designer = $('<div class="designer-container"><h3 class="fabric-designer">' + designItem.screen_name + '</h3></div>');

      var li = $('<li></li>');
      li.data('item', designItem);
      li.addClass('fabric-preview card search-result');
      li.append(imgCont);
      li.append(designName);
      li.append(designer);

      return li;
    });
  }


});
