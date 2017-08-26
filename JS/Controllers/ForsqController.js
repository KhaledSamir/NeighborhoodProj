var Client_ID = "YourClientID";
var ClientSecret = "YourClientSecret";


var ForSQ = function () {
    var restaurant = {};
    var self = this;
    this.getInfo = function (lat , lng , title) {
        var coordinates = lat + "," + lng;
        var url = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates +
                  "&query=" + title + 
                  "&client_id=" + Client_ID +
                  "&client_secret=" + ClientSecret +
                  '&v=20160118';

        var settings = {
            "async": false,
            "crossDomain": true,
            "url": url,
            "method": "GET"
          };
          
          $.getJSON(settings).done(function (data) {
            var restaurant = data.response.venues[0];
            self.restaurant = restaurant;
          })
          .fail(function(err){
              console.error('There is error happening when we try to request your data');
              if(err)
                console.dir(err);
          })

    }
}