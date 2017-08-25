var Client_ID = "LEIXSMCPJ01VRB1F0XP22Z2F5EIP10TFN5VTJYU5NZYHWXJM";
var ClientSecret = "HUNL4DBSS0IWKR0J2HCPA4MLKPMU3VHZMSMZIOYXGRPQEODL";


var ForSQ = function () {
    var restaurant = {};
    var self = this;
    this.getInfo = function (lat , lng , title) {
        var coordinates = lat + "," + lng;
        var url = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates +
                  "&query=" + title + 
                  "&client_id=LEIXSMCPJ01VRB1F0XP22Z2F5EIP10TFN5VTJYU5NZYHWXJM" +
                  "&client_secret=HUNL4DBSS0IWKR0J2HCPA4MLKPMU3VHZMSMZIOYXGRPQEODL&v=&v=20160118";

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
              console.log('There is error happening when we try to request your data');
              console.log(err);
          })

    }
}