window.onload = function() {
    modal = document.getElementById('createCGroup');
    span = document.getElementById("close-modal");
    submit = document.getElementById('submit-modal');
    selectYear = document.getElementById("year");
    var name = document.getElementById("name");
    var coLeader = document.getElementById("nameCL");
    var email = document.getElementById("email");
    var phone = document.getElementById("phone");
    var gender = document.getElementById("gender");
    var address = $('#address');
    var explain = document.getElementById("other-explanation");
    var myMarker; 
    
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
    coLeader.onchange = function() {
        validColor(coLeader);
    }
    email.onchange = function() {
        validColor(email);
    }
    address.onchange = function() {
        validColor(addresss);
    }
    phone.onchange = function() {
        validColor(phone);
    }
    gender.onchange = function() {
        validColorDrop(gender);
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
    });

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
        explainbool = true;
        if ((namebool && emailbool && phonebool && genderbool && explainbool) == false) {
            isValid = false;
        }
        return isValid;
    }

    //If valid will submit the form
    function checkValid() {
        var bool = validate();
        if (bool) {
            modal.style.display = "none";
            alert("Submitting");
            
            var form = $("#modal-form2");
            form.submit(function(ev) {
              $.ajax({
                type: 'POST',
                url: 'signup_leader.php',
                data: form.serialize(),
                success: function(data) {
                  alert(data);
                },
                error: function(data) {
                  alert(data);
                }
              });
              ev.preventDefault();
            });

        }
    }
}

    function generateCGroupPanel(garbage) {
        var array = ["Buchanan", "Campustown", "East Ames", "Freddy", "Greek", "MWL", "RCA", "Towers", "UDA", "West Ames"];
        var arr2  = [ 6, 15, 20, 6, 15, 14, 15, 6, 20, 16];
        for (var i = 0; i < array.length; i++) {
            var location = array[i];
            var html = '<div class="cgroup-area"><h5 id="general-area">' + location + '</h5><button type="button" class="join-button pull-right" id="area' + location +'" onclick="openModal()">Create</button><p>Number of cgroups: ' + numgroups(location) + '</p><p>Desired number of groups: ' + arr2[i] + '</p></div>';
            var panel = document.getElementById("side-panel");
            panel.insertAdjacentHTML('beforeend', html);
            var content = '<input id="arealoc" value="' + location + '">';
            var cginfo = document.getElementById('cgInfoContent');
            cginfo.insertAdjacentHTML('beforeend', content);
        }
    }
    
    function deleteCGroupPanels() {
    	var panels = document.getElementsByClassName('cgroup-area');
    	while (panels[0]) {
        	panels[0].parentNode.removeChild(panels[0]);
    	}
	  }


	function openModal(location) {
    	modal.style.display = "block";
    	document.getElementById("aloc").value = document.getElementById("arealoc").value;
	}

  function numgroups(location) {
    var temp = 0;
    for(var i = 0; i < allCGroups.length; i++) {
      if(allCGroups[i].area == location) {
        temp++;
      }
    }
    return temp;
  }

