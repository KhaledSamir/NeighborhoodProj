'use strict'

var map;
var fsq = new ForSQ();
var restaurantView = new RestaurantView();
// Create a new blank array for all the listing markers.
var markers = [];

var locations = [
  { title: 'LA Burger', location: { lat: 32.94282, lng: -96.95268 } },
  { title: 'Arabian Bites', location: { lat: 32.9201, lng: -96.95696 } },
  { title: 'Via Real', location: { lat: 32.861240459571, lng: -96.957242938066 } },
  { title: 'Andalous Mediterranean Grill', location: { lat: 32.9201, lng: -96.9581298828125 } },
  { title: 'Vitality Bowls', location: { lat: 32.8920611115699, lng: -96.959572487513 } },
  { title: 'Empa Mundo', location: { lat: 32.8603949, lng: -96.9921652 } },
  { title: 'Mr Max', location: { lat: 32.848083, lng: -96.9920651 } },
  { title: 'Argentina Bakery', location: { lat: 32.8402783530411, lng: -96.9918395185998 } },
  { title: 'Subz N Stuff', location: { lat: 32.8672144894962, lng: -96.9399749767212 } },
  { title: 'Buffalo Wild Wings', location: { lat: 32.917905, lng: -96.963455 } }
]

var Model = function () {
  var self = this;
  this.filter = ko.observable('');
  this.filterdplaces = ko.observableArray(locations);
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    }, {
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    }, {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    }, {
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    }, {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    }, {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    }, {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    }, {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 32.8140, lng: -96.9489 },
    zoom: 11,
    styles: styles,
    mapTypeControl: false
  });
  var viewModel = new ViewModel();

  this.filterList = function () {

    var filter = self.filter().toLowerCase();
    if (!filter) {
      reDrawMarkers(locations , viewModel);
      return self.filterdplaces(locations)
    } else {
      var filterdplaces = self.filterdplaces().filter(loc => loc.title.toLowerCase().includes(filter)
        || loc.title.startsWith(filter));
      self.filterdplaces(filterdplaces)
      reDrawMarkers(self.filterdplaces() , viewModel);
    }
  }
}


var ViewModel = function () {
  var self = this;
  this.largeInfowindow = new google.maps.InfoWindow();
  // Style the markers a bit. This will be our listing marker icon.
  this.defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  this.highlightedIcon = makeMarkerIcon('FFFF24');




  
  // Create a styles array to use with the map.

  //   google.maps.event.addDomListener(window, "resize", function() {
  //     console.log('hh')
  //     var center = map.getCenter();
  //     google.maps.event.trigger(map, "resize");
  //     map.setCenter(center); 
  //  });

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.

  

  // The following group uses the location array to create an array of markers on initialize.

  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: self.defaultIcon,
      id: i,
      map: map
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, self.largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function () {
      this.setIcon(self.highlightedIcon);
    });
    marker.addListener('mouseout', function () {
      this.setIcon(self.defaultIcon);
    });
  }
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
    infowindow.marker = marker;
    var restaurant = fsq.getInfo(marker.position.lat(), marker.position.lng(), marker.title);
    var content = restaurantView.createView(fsq.restaurant);
    infowindow.setContent(content);
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
      infowindow.marker = null;
    });
}

  this.reDrawMarkers = function (places , vm) {
  var self = vm;
  hideListings();
  for (var i = 0; i < places.length; i++) {
    // Get the position from the location array.
    var position = places[i].location;
    var title = places[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: self.defaultIcon,
      id: i,
      map: map
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, self.largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function () {
      this.setIcon(self.highlightedIcon);
    });
    marker.addListener('mouseout', function () {
      this.setIcon(self.defaultIcon);
    });
  }
}
// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}
