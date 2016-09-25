var map;
var saltLogo = '../Images/salt_logo_small.jpg';
var marksFace = new google.maps.MarkerImage('../Images/salt_teal_white_small.png',
    new google.maps.Size(40, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(20, 20));
var userLocation;
var geocoder;
var apiKey = "AIzaSyB2mnvZqIZXdQYIy7jZu31JQLnhhgKFjJ4";

var sheetSrc = "https://docs.google.com/spreadsheets/d/1UlBlLoto8QNT3558MwLjgbcvuhQUH9GXQmspBaoVaJ8/edit?ts=57e15ae1#gid=2042134768";

var CLIENT_ID = '769872060184-gon53at54dmqn7h54t4c38od6sru3nph.apps.googleusercontent.com';

/* API key to access Google Sheets API */
var sheetsAPIKey = "AIzaSyA2fSUmxTZAp0y5I5GXWP2c30WIFIFyxBo";

/* ID for the spreadsheet */
var spreadsheetID = "1UlBlLoto8QNT3558MwLjgbcvuhQUH9GXQmspBaoVaJ8";

function initializeISU() {
    initialize(42.027005, -93.646661, 15);
}

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
        icon: "Images/location_icon_small.png"
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

    initializeCGroups();

}

function handleLocationError(browserHasGeolocation, userLocation, pos) {
    userLocation.setPosition(pos);
    // userLocation.setContent(browserHasGeolocation ?
    //     'Error: The Geolocation service failed.' :
    //     'Error: Your browser doesn\'t support geolocation.');
}

var listener1 = google.maps.event.addDomListener(window, 'load', function() {
    initializeISU();
});

function goToCurrentLocation() {
    map.setCenter(userLocation.position);
}

function goToRichardsonCourt() {
    initialize(42.024029, -93.639859, 17);
    cGroupInfo("Richardson Court");
}

function goToBuchanan() {
    initialize(42.022243, -93.643411, 19);
    cGroupInfo("Buchanan");
}

function goToNorth() {
    initialize(42.047757, -93.632436, 14);
    cGroupInfo("North Ames");
}

function goToSouth() {
    initialize(42.015378, -93.645143, 14);
    cGroupInfo("South Ames");
}

function goToEast() {
    initialize(42.034114, -93.601174, 14);
    cGroupInfo("East Ames");
}

function goToWest() {
    initialize(42.017865, -93.674740, 15);
    cGroupInfo("West Ames");
}

function goToUnionDrive() {
    initialize(42.024147, -93.651688, 17);
    cGroupInfo("Union Drive");
}

function goToFreddy() {
    initialize(42.033877, -93.641563, 17);
    cGroupInfo("Frederickson Court");
}

function goToGreek() {
    initialize(42.020898, -93.643505, 17);
    cGroupInfo("Greek");
}

// var enteredAddressField;
// $(docuemnt).ready(function() {
//     enteredAddressField = document.getElementById("entered-address");
//     enteredAddressField.addEventListener("keydown", function(event) {
//         if (event.keyCode == 13) {
//             goToEnteredAddress();
//         }
//     });
// });

window.onload = function() {
    document.querySelector('#entered-address').addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            goToEnteredAddress();
        }
    })
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

function cGroupInfo(location) {
    var temp = "C-Groups Near " + location;
    document.getElementById("side-panel-title").innerHTML = temp;
}

// function getLeaders(cgroup) {
//     gapi.client.sheets.spreadsheets.values.get({
//         spreadsheetId: spreadsheetID,
//         range: 'cgroups!A1:B10',
//     }).then(function(response) {
//         var range = response.result;
//         if(range.values.length > 0) {
//             for(i = 0; i < range.values.length; i++) {
//                 var row = range.values[i];
//                 cgroup.addLeader(row[0]);
//                 cgroup.addLeader(row[1]);
//             }
//         }
//     });
// }

/**
* Load Sheets API client library.
*/
function loadSheetsApi() {
    var discoveryUrl =
        'https://sheets.googleapis.com/$discovery/rest?version=v4';
    gapi.client.load(discoveryUrl).then(listMajors);
}

/**
 * Grabs entire Google Sheet, and creates a cgroup
 * for every row in the sheet
 */
function pullData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetID,
        range: 'cgroups!A1:H',
    }).then(function(response) {
        var range = response.result;
        if(range.values.length > 0) {
            for(i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                var tmpGroup = new cGroup();
                tmpGroup.addLeader(row[0]);
                tmpGroup.addLeader(row[1]);
                tmpGroup.addEmail(row[2]);
                tmpGroup.addPhone(row[3]);
                tmpGroup.addTime(row[4]);
                tmpGroup.addLoc(row[5]);
            }
        }
    });
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
    this.time = "Monday, 7:00";
    // number of members, someone joining this group 
    // will just increment by 1
    this.numMembers = 0;

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
    this.addMember = function(){numMembers++;};
}



function initializeCGroups() {
    initLinden();
    initMaple();
    initBuchanan();
    initBWR();
    initFriley();
    initHelzer();
    initLarch();
    initWillow();
    initOakElm();
    initMartin();
    initEaton();
}

function initLinden() {
    var Linden = new google.maps.Marker({
        position: new google.maps.LatLng(42.023075, -93.640319),
        icon: marksFace
    });
    Linden.setMap(map);
    Linden.addListener("click", function() {
        cGroupInfo("Linden");
    });
}

function initMaple() {
    var Maple = new google.maps.Marker({
        position: new google.maps.LatLng(42.023614, -93.638735),
        icon: marksFace
    });
    Maple.setMap(map);
    Maple.addListener("click", function() {
        cGroupInfo("Maple");
    });
}

function initLarch() {
    var Larch = new google.maps.Marker({
        position: new google.maps.LatLng(42.023253, -93.638045),
        icon: marksFace
    });
    Larch.setMap(map);
    Larch.addListener("click", function() {
        cGroupInfo("Larch");
    });
}

function initWillow() {
    var Willow = new google.maps.Marker({
        position: new google.maps.LatLng(42.023900, -93.637730),
        icon: marksFace
    });
    Willow.setMap(map);
    Willow.addListener("click", function() {
        cGroupInfo("Willow");
    });
}

function initOakElm() {
    var OakElm = new google.maps.Marker({
        position: new google.maps.LatLng(42.025131, -93.640317),
        icon: marksFace
    });
    OakElm.setMap(map);
    OakElm.addListener("click", function() {
        cGroupInfo("Oak/Elm");
    });
}

function initBWR() {
    var BWR = new google.maps.Marker({
        position: new google.maps.LatLng(42.023587, -93.642125),
        icon: marksFace
    });
    BWR.setMap(map);
    BWR.addListener("click", function() {
        cGroupInfo("Birch/Welch/Roberts");
    });
}

function initFriley() {
    var Friley = new google.maps.Marker({
        position: new google.maps.LatLng(42.023725, -93.650448),
        icon: marksFace
    });
    Friley.setMap(map);
    Friley.addListener("click", function() {
        cGroupInfo("Friley");
    });
}

function initHelzer() {
    var Helzer = new google.maps.Marker({
        position: new google.maps.LatLng(42.024085, -93.651814),
        icon: marksFace
    });
    Helzer.setMap(map);
    Helzer.addListener("click", function() {
        cGroupInfo("Helzer");
    });
}

function initEaton() {
    var Eaton = new google.maps.Marker({
        position: new google.maps.LatLng(42.024568, -93.652797),
        icon: marksFace
    });
    Eaton.setMap(map);
    Eaton.addListener("click", function() {
        cGroupInfo("Eaton");
    });
}

function initMartin() {
    var Martin = new google.maps.Marker({
        position: new google.maps.LatLng(42.023856, -93.653042),
        icon: marksFace
    });
    Martin.setMap(map);
    Martin.addListener("click", function() {
        cGroupInfo("Martin");
    });
}

function initBuchanan() {
    var Buchanan = new google.maps.Marker({
        position: new google.maps.LatLng(42.022052, -93.643851),
        icon: marksFace
    });
    Buchanan.setMap(map);
    Buchanan.addListener("click", function() {
        cGroupInfo("Buchanan");
    });

}

function generateCGroupPanel() {
    var html = '<div class="cgroup-panel"><h5 id="location-time"></h5><button type="button" class="join-button pull-right">Join</button><p id="leader-names"></p><p id="address"></p></div>';
    var panel = document.getElementById("side-panel");
    panel.insertAdjacentHTML("beforeend", html);
}

// function createCGroup(location, leader1, leader2) {

//     generateCGroupPanel(location);
// }