app.search = $(function() {
  var pastSearches = [];

  loadSearches();

  showPopularResults();


  ////////////////////////////////////////////////////////////////////////////////
  //LOADING PAST SEARCHES FROM LOCAL STORAGE

  function loadSearches () {
   pastSearches = JSON.parse(localStorage.getItem('pastSearches') || '[]');
   return pastSearches;
  }


  ////////////////////////////////////////////////////////////////////////////////
  //ADDING EVENT HANDLER FOR LOADING PAST RESULTS AND RENDERING AS HTML

  function pastSearchesToHtml (pastSearches) {
    return pastSearches.map(function (pastSearch) {
      var keyword = pastSearch.keywordSearch;
      var color =  pastSearch.colorSearch;
      var product = pastSearch.productSearch.slice(10);

      var colorBlock = $('<span class="color-block"></span>');
      colorBlock.css('background-color', '#' + color);

      var searchItem = $('<li class="past-search-item"></li>');
      searchItem.attr('data-keyword', keyword);
      searchItem.attr('data-color', color);
      searchItem.attr('data-product', pastSearch.productSearch);

      searchItem.append(product + ' ');
      searchItem.append(keyword + ' ');
      searchItem.append(colorBlock);

      return searchItem[0];
    });
  }

  function pastSearchesToPage () {
    pastSearches = loadSearches();
    if (pastSearches.length === 0) {
      $('.past-searches-list').empty().append('<li class="past-search-item">You don\'t currently have any past searches</li>');
    } else {
      searchItems = pastSearchesToHtml(pastSearches);
      $('.past-searches-list').empty().append(searchItems);
    }
  }

  $('.past-searches').on('click', function (e) {
    e.stopPropagation();
    pastSearchesToPage();
    $('.past-searches-list').toggleClass('show');
    $('body').on('click', function (e) {
      e.stopPropagation();
      $('.past-searches-list').removeClass('show');
    });
  });

  function viewPastSearch () {
    $('.past-searches-list').on('click', '.past-search-item', function () {
      var pastSearchItem = $(this);

      //grab the values of the search options, change them if there is a value
      var keywordSearch = '';
      var keyword = pastSearchItem.attr('data-keyword');

      if (keyword !== '') {
       // keyword = keyword.split(' ').join('%20');
       //not sure that is necessary
        keywordSearch = 'q=' + keyword;
      }

      var colorSearch = '';
      var color = pastSearchItem.attr('data-color');
      if (color !== '') {
        colorSearch = 'color1=' + color;
      }

      var productSearch = '';
      //looking for a checked product button, if exists, resets product variable
      var product = pastSearchItem.attr('data-product');
      if (product !== '') {
          productSearch = product;
      }

      printSearchResults(keywordSearch, colorSearch, productSearch);
    });

  }

  viewPastSearch();


  ////////////////////////////////////////////////////////////////////////////////
  //ADD CLASS TO SELECTED RADIO LABEL

  $('.product-label').on('click', function () {
    $('.product-label').removeClass('selected');
    $(this).addClass('selected');
  });

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
  //COLOR PICKER FUNCTIONALITY

   $('#picker').colpick({
     // flat: true,
     layout: 'hex',
     submit: 0,
     colorScheme: 'light',
     onChange: function(hsb, hex, rgb, el, bySetColor) {
       $(el).css('border-color', '#' + hex);
       // Fill the text box just if the color was set using the picker,
       // and not the colpickSetColor function.
       if (!bySetColor) $(el).val(hex);
     }
   }).keyup(function() {
     $(this).colpickSetColor(this.value);
   });


   ////////////////////////////////////////////////////////////////////////////////
   //GET BY SEARCH CRITERIA

   function runSearch () {
     $('.new-search').submit(function(e) {
       e.preventDefault();

       //grab the values of the search options, change them if there is a value
       var keywordSearch = '';
       var keyword = $('.keyword').val();
       if (keyword !== '') {
        // keyword = keyword.split(' ').join('%20');
        //not sure that is necessary
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

       ////////////////////////////////////////////////////////////////////////////////
       //SAVING PAST SEARCHES TO LOCAL STORAGE
       var search = {
         keywordSearch: keyword,
         colorSearch: color,
         productSearch: productSearch,
       };


      function saveSearches () {
      //NOT CERTAIN WHY THIS IS NOT WORKING, HAVE TRIED OTHER THINGS SUCH AS
      //.CONTAINS BUT TO NO AVAIL
       if (pastSearches.indexOf(search) < 0) {
         pastSearches.unshift(search);
       }

       if (pastSearches.length > 5) {
           pastSearches.pop();
         }
        localStorage.setItem('pastSearches', JSON.stringify(pastSearches))
      }

      saveSearches();


     printSearchResults(keywordSearch, productSearch, colorSearch);

     });
  }

  runSearch();

  ////////////////////////////////////////////////////////////////////////////////
  //API CALL WITH SEARCH CRITERIA

  function printSearchResults (keywordSearch, productSearch, colorSearch) {
   Api.getDesignBySearch(keywordSearch, productSearch, colorSearch).done(function(response) {
     var results = response.results[0].results;
     var resultElements = apiResultsToHtml(results);
     if (results.length === 0) {
       $('.results-list').empty().append('<i class="fa fa-frown-o"></i> There are no fabrics matching your search. Please try again.');
       $('.results-list').addClass('error');
     } else {
       $('.results-list').empty().append(resultElements);
     }

   });
 }

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

      var designer = $('<div class="designer-container"><span class="designer">by ' + designItem.user.screen_name + '</span></div>');

      var description = $('<div class="description-container"><p class="description">' + designItem.short_description + '</p></div>');

      var li = $('<li></li>');
      li.data('item', designItem);
      li.addClass('design-preview search-result');
      li.append(imgCont);
      li.append(designName);
      li.append(designer);

      //checking to see if there is a description value before adding it to html
      if (designItem.short_description !== '') {
        var addDescription = li.append(description);
        return addDescription;
      }

      return li;
    });
  }


});
