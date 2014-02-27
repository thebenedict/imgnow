// ADD YOUR API KEY
var API_KEY = '';

var imageGenerator = {
  getSearchUrl: function() {
    console.log($('#query').val());
    var url = 'https://www.googleapis.com/customsearch/v1?' + 
    'key=' + API_KEY + '&' + 
    'cx=015346611015245440764:5fs7ksuksqu&' +
    'q=' + encodeURIComponent($('#query').val()) + '&' +
    'searchType=image';
    console.log('requesting: ' + url);
    return url;
  },

  requestImages: function() {
    console.log('requesting images');
    return $.ajax({ 
       type: "GET",
       url: this.getSearchUrl(),
       dataType: 'json'
    }
  )},

  displayImages: function(photos) {
    if (!photos) {
      jQuery('<div/>', {
          text: 'No results'
      }).appendTo('#error');
    } else {
      for (i = 0; i < photos.length; i++) {
        var img = document.createElement('img');
        img.src = photos[i]['image']['thumbnailLink'];

        jQuery.data(img, 'link', photos[i]['link']);
        $(img).bind('click', this.getShortUrl.bind(this));
        document.body.appendChild(img);
      }
    }
  },

  getShortUrl: function(event) {
    this.shortenUrl(jQuery.data(event.target, 'link'))
    .done(function(shortUrl){
      $('#short-url').val(shortUrl['id']);
      
      // copy to clipboard
      $('#short-url').focus();
      document.execCommand('SelectAll');
      document.execCommand("Copy", false, null);
    });
  },

  shortenUrl: function(longUrl) {
    return $.ajax({
      type: "POST",
      contentType : 'application/json',
      url: "https://www.googleapis.com/urlshortener/v1/url",
      data: JSON.stringify({"longUrl": longUrl})
    })
  }

};

document.addEventListener('DOMContentLoaded', function () {
  var thread = null;

  if (!API_KEY) {
    jQuery('<div/>', {
      text: 'Add an api key in popup.js, you fancy developer you.'
    }).appendTo('#error');
    return false;
  }

  $('#query').keyup(function(){
    clearTimeout(thread);
    var target = $(this);
    thread = setTimeout(function() { 
      prom = imageGenerator.requestImages();
      prom.done(function(data) {
        imageGenerator.displayImages(data['items']);
      })
    }, 700)
  });

});
