$(function() {
  var pastSearches = [];

  loadSearches();

  showPopularResults();


  ////////////////////////////////////////////////////////////////////////////////
  //LOADING PAST SEARCHES FROM LOCAL STORAGE

  function loadSearches () {
   pastSearches = JSON.parse(localStorage.getItem('pastSearches') || '[]');
   console.log(pastSearches);
   return pastSearches;
  }

  ////////////////////////////////////////////////////////////////////////////////
  //ADDING EVENT HANDLER FOR LOADING PAST RESULTS AND RENDERING AS HTML

  function pastSearchesToHtml (pastSearches) {
    pastSearches.map(function (pastSearch) {
      var keyword = pastSearch.keywordSearch;
      var color = '#' + pastSearch.colorSearch;
      var product = pastSearch.productSearch.slice(10);
      console.log(keyword + color + product);

      var colorBlock = $('<span class="color-block"></span>');
      colorBlock.css('background-color', color);

      var searchItem = $('<li class="past-search-item">' product + ' ' + keyword + ' ' +  colorBlock'</li>');

      return searchItem;
    });
  }

  function pastSearchesToPage ()
    if (pastSearches.length === 0) {
      $('.past-searches-list').append('<li class="past-search-item">You don\'t currently have any past searches</li>');
    } else {
      $('.past-searches-list').empty().append(pastSearchesToHtml(pastSearches));
    }
  });

  $('.past-searches').on('click', function (e) {
    e.stopPropagation();
    pastSearchesToPage(pastSearches);
    $('.past-searches-list').toggleClass('show')
    $('body').on('click', function (e) {
      e.stopPropagation();
      $('past-searches-list').removeclass('show');
    })

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
       console.log(color);
       colorSearch = 'color1=' + color;
     }

     var productSearch = '';
     //looking for a checked product button, if exists, resets product variable
     var checked = $('.product-section input[type=radio]:checked');
     if (checked.length > 0) {
       console.log(checked.val());
         productSearch = 'substrate=' + checked.val();
     }

     ////////////////////////////////////////////////////////////////////////////////
     //SAVING PAST SEARCHES TO LOCAL STORAGE
     var search = {
       keywordSearch: keyword,
       colorSearch: color,
       productSearch: productSearch,
     };

     console.log(search);

    function saveSearches () {
      console.log(pastSearches.indexOf(search));
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

    console.log(pastSearches);

    ////////////////////////////////////////////////////////////////////////////////
    //API CALL WITH SEARCH CRITERIA

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
