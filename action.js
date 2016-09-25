var map;
var marksFace = new google.maps.MarkerImage('../Images/salt_teal_white_border.png',
    new google.maps.Size(40, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(20, 20));
var userLocation;
var geocoder;
var apiKey = "AIzaSyB2mnvZqIZXdQYIy7jZu31JQLnhhgKFjJ4";
var modal;
var span;
var btn;

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

//Centers the map to show the desied location
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

window.onload = function() {
    modal = document.getElementById('signup');
    span = document.getElementById("close-modal");
    submit = document.getElementById('submit-modal');
    btn = document.getElementById("btn1");
    selectYear = document.getElementById("year");
    btn.onclick = openModal;
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var gender = document.getElementById("gender");
    var location = document.getElementById("location");
    var year = document.getElementById("year");
    var explain = document.getElementById("other-explanation");

    function validColor(obj) {
        if (obj.validity.valid) {
            obj.style.boxShadow = "none";
            obj.style.border = "1px solid #ABABAB";
        } else {
            obj.style.boxShadow = "0 0 5px rgba(255, 0, 0, 1)";
            obj.style.border = "1px solid rgba(255, 0, 0, 1)";
        }
    }

    name.onchange = function() {
        validColor(name);
    }
    email.onchange = function() {
        validColor(email);
    }
    phone.onchange = function() {
        validColor(phone);
    }
    gender.onchange = function() {
        validColorDrop(gender);
    }
    location.onchange = function() {
        validColorDrop(location);
    }
    year.onchange = function() {
        validColorDrop(year);
    }
    explain.onchange = function() {
        validColor(explain);
    }

    function validColorDrop(obj) {
        if (obj.value == "") {
            obj.style.border = "1px solid red";
            obj.style.boxShadow = "0 0 5px rgba(255, 0, 0, 1)";
        } else {
            obj.style.border = "1px solid #ABABAB";
            obj.style.boxShadow = "none";
        }
    }

    selectYear.onchange = function() {
        if (selectYear.value == "other") {
            document.getElementById("otherDiv").style.display = "block";
        } else {
            document.getElementById("otherDiv").style.display = "none";
        }
    }

    span.onclick = function() {
        modal.style.display = "none";
    }
    submit.onclick = function() {
        checkValid();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.querySelector('#entered-address').addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            goToEnteredAddress();
        }
    })

    function openModal() {
        modal.style.display = "block";
    }

    function val(obj, bool) {
        if (!obj.validity.valid) {
            bool = false;
        }
        return bool;
    }

    function valDropDown(obj, bool) {
        if (obj.value == "") {
            obj.style.bocShadow = "0 0 5px red";
            obj.style.border = "red";
            bool = false;
        }
        return bool;
    }

    function validate() {
        var isValid = true;
        namebool = val(name, isValid);
        emailbool = val(email, isValid);
        phonebool = val(phone, isValid);
        genderbool = valDropDown(gender, isValid);
        locbool = valDropDown(location, isValid);
        yearbool = valDropDown(year, isValid);
        explainbool = true;
        if (year.value == "other" && explain.value == "") {
            explainbool = false;
            explain.style.border = "1px solid red";
            explain.style.boxShadow = "0 0 5px red";
        }
        if ((namebool && emailbool && phonebool && genderbool && locbool && yearbool && explainbool) == false) {
            isValid = false;
        }
        return isValid;
    }

    function checkValid() {
        var bool = validate();
        if (bool) {
            //TODO - the information within the modal must be transfered into the database
            modal.style.display = "none";
        }
    }
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

//initializes C-Groups that exist on campus in known and consistant locations from year to year
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

//TODO unfinished but should take a c-group object in and add a C-Group panel into the side panel displaying the relevant information about the C-Group
function generateCGroupPanel(cgObject) {
    var html = '<div class="cgroup-panel"><h5 id="location-time">' + cgObject.location + cgObject.time + '</h5><button type="button" class="join-button pull-right" id="cgroup' + cgObject.ID + '">Join</button><p id="leader-names">' + leaderToString(cgObject) + '</p><p id="address">' + cgObject.address + '</p></div>';
    var panel = document.getElementById("side-panel");
    panel.insertAdjacentHTML("beforeend", html);
}

//Creates a string with all of the leaders for a given C-Group
function leaderToString(cgObject) {
    var leaderString = cgObject.leader[0];
    for (i = 1; i < cgObject.leader.length(); i++) {
        leaderString += '/' + cgObject.leader[i];
    }
    return leaderString;
}