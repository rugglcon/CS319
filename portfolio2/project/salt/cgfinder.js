window.onload = function() {
    modal = document.getElementById('signup');
    span = document.getElementById("close-modal");
    submit = document.getElementById('submit-modal');
    selectYear = document.getElementById("year");
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var gender = document.getElementById("gender");
    var location = document.getElementById("location");
    var year = document.getElementById("year");
    var explain = document.getElementById("other-explanation");

    //Checks the validity of field and changes color of border if invalid
    function validColor(obj) {
        if (obj.validity.valid) {
            obj.style.boxShadow = "none";
            obj.style.border = "1px solid #ABABAB";
        } else {
            obj.style.boxShadow = "0 0 5px rgba(255, 0, 0, 1)";
            obj.style.border = "1px solid rgba(255, 0, 0, 1)";
        }
    }

    //Listeners set for all modal fields to check for validity of their field
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
        if (selectYear.value == "other") {
            document.getElementById("otherDiv").style.display = "block";
        } else {
            document.getElementById("otherDiv").style.display = "none";
        }
    }
    explain.onchange = function() {
        validColor(explain);
    }

    //Checks validity of dropdown fields
    function validColorDrop(obj) {
        if (obj.value == "") {
            obj.style.border = "1px solid red";
            obj.style.boxShadow = "0 0 5px rgba(255, 0, 0, 1)";
        } else {
            obj.style.border = "1px solid #ABABAB";
            obj.style.boxShadow = "none";
        }
    }

    //Closes out of modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    //Checks to see if all fields are valid
    submit.onclick = function() {
        checkValid();
    }
    
    //Closes out of modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //Listens to Entered Address field in event the "enter" key is pressed to move the center of the map to the given location
    document.querySelector('#entered-address').addEventListener('keypress', function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            e.preventDefault();
            goToEnteredAddress();
        }
    })

    //Checks validity of a given object
    function val(obj, bool) {
        if (!obj.validity.valid) {
            bool = false;
        }
        return bool;
    }

    //Checks if dropdown is valid (is not on the "-- Select --" item)
    function valDropDown(obj, bool) {
        if (obj.value == "") {
            obj.style.bocShadow = "0 0 5px red";
            obj.style.border = "red";
            bool = false;
        }
        return bool;
    }

    //Checks to see if the whole modal is valid and ready for submission
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

    $("#leader-login-btn").onclick = function() {
      leaderLogin();
    }

    function leaderLogin() {
      var form = $("#login-form");
      form.submit(function(ev) {
        $.ajax({
          type: 'POST',
          url: 'login.php',
          data: form.serialize(),
          success: function(data) {
            callback(data);
          },
          error: function(data) {
            alert("There was an error.");
          }
        });
        ev.preventDefault();
      });
    }

    function callback(data) {
      console.log(data);
      alert("Success");
    }

    //If valid will submit the form
    function checkValid() {
        var bool = validate();
        if (bool) {
            modal.style.display = "none";
            //submitForm();
            var form = $("#modal-form");
            form.submit(function(ev) {
              $.ajax({
                type: 'POST',
                url: 'signup_student.php',
                data: form.serialize(),
                success: function(data) {
                  callback(data);
                }
              });
              ev.preventDefault();
            });
        }
    }
}


function openModal(idNumber) {
    modal.style.display = "block";
    document.getElementById("groupID").value = document.getElementById("cgID" + idNumber).value;
}
//take a c-group object in and add a C-Group panel into the side panel displaying the relevant information about the C-Group
function generateCGroupPanel(cgObject) {
    var html = '<div class="cgroup-panel"><h5 id="location-time">' + cgObject.location + ' ' + cgObject.time + '</h5><button type="button" class="join-button pull-right" id="cgroup' + cgObject.ID + '" onclick="openModal(' + cgObject.ID + ')">Join</button><p id="leader-names">' + leaderToString(cgObject) + '</p><p id="address">' + cgObject.area + '</p></div>';
    var panel = document.getElementById("side-panel");
    panel.insertAdjacentHTML('beforeend', html);
    var content = '<input id="cgID' + cgObject.ID + '" value="' + cgObject.ID + '">';
    var cginfo = document.getElementById('cgInfoContent');
    cginfo.insertAdjacentHTML('beforeend', content);
}

//reloads side panels
function deleteCGroupPanels() {
    var panels = document.getElementsByClassName('cgroup-panel');
    while (panels[0]) {
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

