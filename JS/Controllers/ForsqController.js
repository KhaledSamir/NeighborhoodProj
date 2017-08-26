var Client_ID = "LEIXSMCPJ01VRB1F0XP22Z2F5EIP10TFN5VTJYU5NZYHWXJM";
var ClientSecret = "HUNL4DBSS0IWKR0J2HCPA4MLKPMU3VHZMSMZIOYXGRPQEODL";


var ForSQ = function () {
    var restaurantView = new RestaurantView();
    var self = this;
    this.getInfo = function (lat , lng , title , infowindow) {
        var coordinates = lat + "," + lng;
        var url = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates +
                  "&query=" + title + 
                  "&client_id=" + Client_ID +
                  "&client_secret=" + ClientSecret +
                  '&v=20160118';

        var settings = {
            "crossDomain": true,
            "url": url,
            "method": "GET"
          };
          
          $.getJSON(settings).done(function (data) {
            var restaurant = data.response.venues[0];
            var content = restaurantView.createView(restaurant);
            infowindow.setContent(content);
            infowindow.open(map, infowindow.marker);
          })
          .fail(function(err){
              alert('There is error happening when we try to request your data with ForSquare API');
              if(err)
                console.dir(err);
          })

    }
}