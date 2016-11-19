var map;
var saltLogo = new google.maps.MarkerImage('../Images/salt_teal_white_border.png',
    new google.maps.Size(40, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(20, 20));
var userLocation;
var geocoder;
var modal;
var span;
var btn;
var dataReceived = false;
var allCGroups = new Array();
var CLIENT_ID = '426312107480-mvsate2e7vjsosdeb8aa2hfotejlhhdg.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

function login() {
    $("#login-form").css('display', 'block');
}

/**
 * Gets data from database
 */
function getData(range, create) {
    var count = 0;
    for (i = 0; range[i] != null; i += 9) {
        var tmpGroup = new cGroup();
        if(range[i + 1] != "") {
          var name = range[i + 1].split(/(?=[A-Z])/);
          if(name.length == 3) {
            var tmp = name[0] + name[1] + " " + name[2];
          } else {
            var tmp = name[0] + " " + name[1];
          }
          tmpGroup.addLeader(tmp);
        }
        if(range[i + 2] != "") {
          var name = range[i + 2].split(/(?=[A-Z])/);
           if(name.length == 3) {
            var tmp = name[0] + name[1] + " " + name[2];
          } else {
            var tmp = name[0] + " " + name[1];
          }
          tmpGroup.addLeader(tmp);
        }
        if(range[i + 3] != "") {
          var name = range[i + 3].split(/(?=[A-Z])/);
          if(name.length == 3) {
            var tmp = name[0] + name[1] + " " + name[2];
          } else {
            var tmp = name[0] + " " + name[1];
          }
          tmpGroup.addLeader(tmp);
        }
        tmpGroup.addTime(range[i + 4]);
        tmpGroup.addLoc(range[i + 5]);
        tmpGroup.addArea(range[i + 6]);
        tmpGroup.addID(range[i]);
        tmpGroup.addLatLong(range[i + 7], range[i + 8]);

        allCGroups[count] = tmpGroup;
        count++;
    }

    if(create == true) {
      generateCGroupPanel();
    } else {
      for (c = 0; c < 12; c++) {
        generateCGroupPanel(allCGroups[c]);
        //btn = document.getElementById("cgroup" + allCGroups[c].ID);
      }
    }
    dataReceived = true;
    createMarkers();
}

/**
 * Uses ajax to pull groups from database
 * 
 */
function pullData(create) {
    $.ajax({
        type: 'GET',
        url: 'groups.php',
        data: { format: 'json' },
        error: function() {
            appendPre('An error has occurred');
        },
        success: function(data) {
            var tmp = data.split(",");
            getData(tmp, create);
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

//Initializes the map to the center of ISU's campus
function initializeISU() {
    initialize(42.027005, -93.646661, 15);
}

//Initalizes the map to the given latitude and longitude with the given zoom level
function initialize(givenLat, givenLon, givenZoom) {
    geocoder = new google.maps.Geocoder();
    var mapProp = {
        center: new google.maps.LatLng(givenLat, givenLon),
        zoom: givenZoom,
        panControl: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        overviewMapControl: false,
        rotateControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            featureType: 'poi',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        }, {
            featureType: 'landscape',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        }]
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);


    userLocation = new google.maps.Marker({
        position: new google.maps.LatLng(42.027005, -93.646661),
        icon: "../Images/location_icon_small.png"
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            userLocation.setPosition(pos);
            userLocation.setMap(map);
        }, function() {
            handleLocationError(true, userLocation, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, userLocation, map.getCenter());
    }

    if (dataReceived) {
        createMarkers();
    }

}

function handleLocationError(browserHasGeolocation, userLocation, pos) {
    userLocation.setPosition(pos);
}

var listener1 = google.maps.event.addDomListener(window, 'load', function() {
    initializeISU();
});

$(document).ready(function() {
  var latlongbtn = document.getElementById("latlong-btn");

  if(latlongbtn) {
  latlongbtn.onclick = function() {
			//myMarker = new google.maps.Marker({
					//position: mapCenter,
					//map: map,)
					//draggable: true,
					//animation: google.maps.Animation.DROP,
					//title: "This is a new marker!",
					//icon: "http://maps.google.com/mapfiles/ms/micons/blue.png"
			//});
	    
      alert("Lat/long: " + userLocation.position.lat() + ", " + userLocation.position.lng());
			//google.maps.event.addListener(map, 'click', function(event) {
					//alert("Latitude: " + event.latLong.lat() + " " + ", longitude: " + event.latLng.lng());
			//});
    }
  }
});


//Centers the map to show the desired location
function goToCurrentLocation() {
    map.setCenter(userLocation.position);
}

//Centers map to RCA and calls function to populate side bar with the desired c-group cards
function goToRichardsonCourt() {
    initialize(42.024029, -93.639859, 17);
    cGroupInfo("Richardson Court");
    searchArea("RCA", "MWL");
}

//Centers map to Buchanan and calls function to populate side bar with the desired c-group cards
function goToBuchanan() {
    initialize(42.022243, -93.643411, 19);
    cGroupInfo("Buchanan");
    searchArea("Buchanan");

}

//Centers map to North Ames and calls function to populate side bar with the desired c-group cards
function goToNorth() {
    initialize(42.047757, -93.632436, 14);
    cGroupInfo("North Ames");
    searchArea("North Ames");
}

//Centers map to South Ames and calls function to populate side bar with the desired c-group cards
function goToSouth() {
    initialize(42.015378, -93.645143, 14);
    cGroupInfo("South Ames");
    searchArea("South Ames");
}

//Centers map to East Ames and calls function to populate side bar with the desired c-group cards
function goToEast() {
    initialize(42.034114, -93.601174, 14);
    cGroupInfo("East Ames");
    searchArea("EastAmes");
}

//Centers map to West Ames and calls function to populate side bar with the desired c-group cards
function goToWest() {
    initialize(42.017865, -93.674740, 15);
    cGroupInfo("West Ames");
    searchArea("West Ames");
}

//Centers map to Union Drive and calls function to populate side bar with the desired c-group cards
function goToUnionDrive() {
    initialize(42.024147, -93.651688, 17);
    cGroupInfo("Union Drive");
    searchArea("UDA");
}

//Centers map to Freddy and calls function to populate side bar with the desired c-group cards
function goToFreddy() {
    initialize(42.033877, -93.641563, 17);
    cGroupInfo("Frederickson Court");
    searchArea("Freddy");
}

//Centers map to Greek and calls function to populate side bar with the desired c-group cards
function goToGreek() {
    initialize(42.020898, -93.643505, 17);
    cGroupInfo("Greek");
    searchArea("Greek");
}

/**
 * Searches for groups with given area
 */
function searchArea(area1, area2) {
    deleteCGroupPanels();
    for (v = 0; v < allCGroups.length; v++) {
        if (allCGroups[v].area == area1 || allCGroups[v].area == area2) {
            generateCGroupPanel(allCGroups[v]);
            //btn = document.getElementById("cgroup" + allCGroups[v].ID);
            //btn.onclick = openModal;
        }
    }
}

function searchAreaSpecific(cgroup) {
    deleteCGroupPanels();
    generateCGroupPanel(cgroup);
    for (v = 0; v < allCGroups.length; v++) {
        if (allCGroups[v].area == cgroup.area && allCGroups[v] != cgroup) {
            generateCGroupPanel(allCGroups[v]);
            //btn = document.getElementById("cgroup" + allCGroups[v].ID);
            //btn.onclick = openModal(allCGroups[v].ID);
        }
    }
}








/**
 * Creates a cGroup() object and defines function properties.
 * All initialization is done in the constructor, no parameters
 * need to be passed.
 */
function cGroup() {
    // array of Strings for names of leaders
    this.leaders = new Array();
    // String for location. We could separate this a little into
    // street, city, state, ZIP
    this.location = "";
    // contact email
    this.email = "";
    // contact phone number
    this.phone = "";
    // also a String
    this.time = "";
    // number of members, someone joining this group 
    // will just increment by 1
    this.numMembers = 0;

    this.area = "";

    this.ID = "";

    this.lat = "";

    this.longitude = "";

    this.addLatLong = function(lat, longitude) {
        this.latlong = lat + "," + longitude;
    };

    this.addID = function(num) {
        this.ID += num;
    };

    this.addArea = function(area) {
        this.area = area;
    };

    /**
     * Sets email
     * 
     * @param {string} contact email
     */
    this.addEmail = function(email) {
        this.email = email;
    };

    /**
     * Sets phone number
     * 
     * @param {string} contact phone number
     */
    this.addPhone = function(phoneNumber) {
        this.phone = phoneNumber;
    };

    /**
     * Sets time for this group
     * 
     * @param {string} time that the group will be meeting
     */
    this.addTime = function(time) {
        this.time = time;
    };

    /**
     * Sets this location to 'loc'
     * 
     * @param {string}
     */
    this.addLoc = function(loc) {
        this.location = loc;
    };

    /**
     * Just returns the array of leaders, mostly for debugging purposes
     */
    this.getLeaders = function() {
        return this.leaders;
    };

    /**
     * Adds the leader to the leader array
     * 
     * @param {string}
     */
    this.addLeader = function(leader) {
        this.leaders[this.leaders.length] = leader;
        // this.numLeaders++;
    };

    /**
     * Pretty obvious what this does.
     */
    this.addMember = function() { numMembers++; };
}

function goToEnteredAddress() {
    var address = document.getElementById("entered-address").value;
    geocoder.geocode({ "address": address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            cGroupInfo(address.split(",", 1));
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

//Changes the text above the side panel to say "C-Groups near " selected location/address
function cGroupInfo(location) {
    var temp = "C-Groups Near " + location;
    document.getElementById("side-panel-title").innerHTML = temp;
}

function cGroupInfoSpecific(cgroup) {
    var temp = "C-Groups Near " + cgroup.area;
    document.getElementById("side-panel-title").innerHTML = temp;
    searchAreaSpecific(cgroup);
}

function createMarkers() {
    for (i = 0; i < allCGroups.length; i++) {
        initNewMarker(allCGroups[i]);
    }
}



/**
 * Sets a marker at the given objects location
 */
function initNewMarker(cgObject) {
    if (cgObject.latlong != undefined) {
        var pos = cgObject.latlong.split(",");
        var newMarker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(parseFloat(pos[0]), parseFloat(pos[1])),
            icon: saltLogo
        });
        newMarker.setMap(map);
        google.maps.event.addListener(newMarker, 'click', function() { cGroupInfoSpecific(cgObject, cgObject.area); });
    }
}
