var Api = setupSpoonflowerApi();

function setupSpoonflowerApi() {
  var baseUrl = 'http://api.v1.spoonflower.com/design/';
  var limit = '40';
  http://api.v1.spoonflower.com:80/design/search?q=goats&&limit=40&&&substrate=fabric&&&&color1=%234e81bd&&&&&jsonp=callback

  function fetchUrl(url) {
    var promise = $.Deferred();
    // this has to change for JSONP
    var req = $.ajax({
      //url property with this value
      url: url,
      dataType: "jsonp",
      //HTTP Basic Authentication... would obviously want to do something different
      //in the long run so credentials are not accessible in the code
      beforeSend: function (xhr) {
        xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('demo:irondemo'))
      },
      timeout: 5000, // fake .fail() a lot of time for the request to be successfully completed
      success: function(data) {
        promise.resolve(data);
      },
      error: function(data) {
        promise.reject(req, 'Unknown error', data);
      }
    });
    return promise;
  }


  var self = {

    getPopularList: function(limit) {
      var freshtastic = '&sort=freshtastic';
      var url = baseUrl + 'search?limit=' + limit + freshtastic;
      return fetchUrl(url);
    },

    getDesignBySearch: function(keywordSearch, substrateSearch, colorSearch ) {
      var url = baseUrl + 'search?' +
        keywordSearch +
        '&limit=' + limit + '&'
        substrateSearch + '&' +
        colorSearch + '&' +
        'jsonp=callback';
      return fetchUrl(url);
    }

  }
  return self;
}
