var map;
var marksFace = new google.maps.MarkerImage('../Images/salt_teal_white_border.png',
    new google.maps.Size(40, 40),
    new google.maps.Point(0, 0),
    new google.maps.Point(20, 20));
var userLocation;
var geocoder;
var MAPSapiKey = "AIzaSyB2mnvZqIZXdQYIy7jZu31JQLnhhgKFjJ4";
var modal;
var span;
var btn;
var allCGroups = new Array();
var sheetsAPIKey = "AIzaSyB8etchYuqZ6vjFFXKulZZVBzhuz1nqUew";
var sheetsClientID = "426312107480-mvsate2e7vjsosdeb8aa2hfotejlhhdg.apps.googleusercontent.com";
var sheetsClientSecret = "zQybClul1_GZhvencNDlH-l1";


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

//Centers the map to show the desired location
function goToCurrentLocation() {
    map.setCenter(userLocation.position);
}

function goToRichardsonCourt() {
    initialize(42.024029, -93.639859, 17);
    cGroupInfo("Richardson Court");

    searchArea("RCA");
}

function goToBuchanan() {
    initialize(42.022243, -93.643411, 19);
    cGroupInfo("Buchanan");

    searchArea("Buchanan");
}

function goToNorth() {
    initialize(42.047757, -93.632436, 14);
    cGroupInfo("North Ames");

    searchArea("Freddy");
}

function goToSouth() {
    initialize(42.015378, -93.645143, 14);
    cGroupInfo("South Ames");

    searchArea("Towers", "Campustown");
}

function goToEast() {
    initialize(42.034114, -93.601174, 14);
    cGroupInfo("East Ames");

    searchArea("East Ames");
}

function goToWest() {
    initialize(42.017865, -93.674740, 15);
    cGroupInfo("West Ames");

    searchArea("West Ames");
}

function goToUnionDrive() {
    initialize(42.024147, -93.651688, 17);
    cGroupInfo("Union Drive");

    searchArea("UDA");
}

function goToFreddy() {
    initialize(42.033877, -93.641563, 17);
    cGroupInfo("Frederickson Court");

    searchArea("Freddy");

}

function goToGreek() {
    initialize(42.020898, -93.643505, 17);
    cGroupInfo("Greek");

    searchArea("Greek", "Campustown");
}

/**
 * Searches for groups with given area
 */
function searchArea(area1, area2) {
    deleteCGroupPanels();

    for(v = 0; v < allCGroups.length; v++) {
        if(allCGroups[v].area == area1 || allCGroups[v].area == area2) {
            generateCGroupPanel(allCGroups[v]);
            btn = document.getElementById("cgroup"+allCGroups[v].ID);
            btn.onclick = openModal;

            initNewMarker(allCGroups[v]);
        }
        if(area1 == "Freddy" || area1 == "Greek" || area1 == "West Ames" || area1 == "East Ames" || 
            area1 == "Towers" || area2 == "Freddy" || area2 == "Greek" || area2 == "West Ames" || 
            area2 == "East Ames" || area2 == "Towers") {
            initNewMarker(allCGroups[v]);
        }
    }
}

window.onload = function() {
    modal = document.getElementById('signup');
    span = document.getElementById("close-modal");
    submit = document.getElementById('submit-modal');
    // btn = document.getElementById("btn1");
    selectYear = document.getElementById("year");
    // btn.onclick = openModal;
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
            submitForm();
        }
    }
}

function openModal() {
    modal.style.display = "block";
}

/**
 * makes a popup telling the student they have joined a group
 */
function submitForm() {
    alert("Welcome to Salt!");
}

/**
 * Gets data from spreadsheet
 */
function getData(range) {
    for(i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        var tmpGroup = new cGroup();
        tmpGroup.addLeader(row[0]);
        tmpGroup.addLeader(row[1]);
        tmpGroup.addEmail(row[2]);
        tmpGroup.addPhone(row[3]);
        tmpGroup.addTime(row[4]);
        tmpGroup.addLoc(row[5]);
        tmpGroup.addArea(row[6]);
        tmpGroup.addID(i);

        allCGroups[i] = tmpGroup;
    }
    // if(allCGroups[0] != null) {
    //     console.log("hey this worked");
    // }

    for(c = 0; c < 6; c++) {
        generateCGroupPanel(allCGroups[c]);
        btn = document.getElementById("cgroup"+allCGroups[c].ID);
        btn.onclick = openModal;
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
    this.time = "Monday, 7:00";
    // number of members, someone joining this group 
    // will just increment by 1
    this.numMembers = 0;

    this.area = "";

    this.ID = "";

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
    this.addMember = function(){numMembers++;};
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

/**
 * Sets a marker at the given objects location
 */
function initNewMarker(cgObject) {
    var geo = new google.maps.Geocoder();
    geo.geocode({"address": cgObject.location},
        function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();

                var newMarker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    icon: marksFace
                });
                newMarker.setMap(map);
                newMarker.addListener("click", function() {
                    cGroupInfo(cgObject.area);
                });
            }
        }
    )
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

//take a c-group object in and add a C-Group panel into the side panel displaying the relevant information about the C-Group
function generateCGroupPanel(cgObject) {
    var html = '<div class="cgroup-panel"><h5 id="location-time">' + cgObject.location + ' ' + cgObject.time + '</h5><button type="button" class="join-button pull-right" id="cgroup' + cgObject.ID + '">Join</button><p id="leader-names">' + leaderToString(cgObject) + '</p><p id="address">' + cgObject.area + '</p></div>';
    var panel = document.getElementById("side-panel");
    panel.insertAdjacentHTML('beforeend', html);
}

//reloads side panels
function deleteCGroupPanels() {
    var panels = document.getElementsByClassName('cgroup-panel');
    while(panels[0]) {
        panels[0].parentNode.removeChild(panels[0]);
    }
}

//Creates a string with all of the leaders for a given C-Group
function leaderToString(cgObject) {
    var leaderString = cgObject.leaders[0];
    for (i = 1; i < cgObject.leaders.length; i++) {
        leaderString += '/' + cgObject.leaders[i];
    }
    return leaderString;
}