'use strict'

var locations;

$.getJSON('~/../Data/locations.json' , function (data){
  console.log(data);
  locations = data;
})

var Model = function () {
  var self = this;
  this.filter = ko.observable('');
  this.filterdplaces = ko.observableArray(locations);
  var viewModel = new ViewModel();
  this.activateMarker = function (location) {
    var marker = viewModel.markers.find(m=> m.title == location.title)
    google.maps.event.trigger(marker, 'click');
  }
  this.filterList = function () {

    var filter = self.filter().toLowerCase();
    if (filter === "") {
      viewModel.DrawMarkers(locations);
      return self.filterdplaces(locations)
    } else {
      var filterdplaces = locations.filter(loc => loc.title.toLowerCase().includes(filter)
        || loc.title.startsWith(filter));

      self.filterdplaces(filterdplaces)
      viewModel.DrawMarkers(self.filterdplaces());
    }
  }
}

var ViewModel = function () {
  var self = this;

  // Create a styles array to use with the map.
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
  this.largeInfowindow = new google.maps.InfoWindow();
  this.fsq = new ForSQ();

  // Create a new blank array for all the listing markers.
  this.markers = [];

  // Constructor creates a new map - only center and zoom are required.
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 32.8140, lng: -96.9489 },
    zoom: 11,
    styles: styles,
    mapTypeControl: false
  });

  var makeMarkerIcon = function (markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  // Style the markers a bit. This will be our listing marker icon.
  this.defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  this.highlightedIcon = makeMarkerIcon('FFFF24');

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  this.populateInfoWindow = function (marker, infowindow) {
    
      infowindow.marker = marker;
      self.fsq.getInfo(marker.position.lat(), marker.position.lng(), marker.title , infowindow);
      infowindow.open(map, marker);
      // Make sure the stop animation if the infowindow is closed.
      infowindow.addListener('closeclick', function () {
        infowindow.marker.setAnimation(null);
      });
  }

  // This function will loop through the listings and hide them all.
  this.hideListings = function () {
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setVisible(false);
    }
  }

  this.DrawMarkers = function (places) {
    var animation;
    self.hideListings();


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
        map: self.map
      });



      marker.toggleBounce = function () {
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
        } else {
          this.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function () {
        this.toggleBounce();
        // this.setAnimation(google.maps.Animation.BOUNCE);
        self.populateInfoWindow(this, self.largeInfowindow)
      });

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function () {
        this.setIcon(self.highlightedIcon);
      });
      marker.addListener('mouseout', function () {
        this.setIcon(self.defaultIcon);
      });

      // Push the marker to our array of markers.
      self.markers.push(marker);
    }
  }

  self.DrawMarkers(locations);
}




