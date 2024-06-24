$(document).ready(function () {

  // Functionality to handle showing/hiding the Co-Member information section
  const coMemberCheckbox = document.getElementById("CoMember");
  if (coMemberCheckbox) {
    coMemberCheckbox.addEventListener("change", function () {
      const coMemberDiv = document.getElementById("CoMemberDiv");
      if (coMemberCheckbox.checked) {
        coMemberDiv.style.display = "block";
      } else {
        coMemberDiv.style.display = "none";
      }
    });
  }

  const coMemberDiv = document.getElementById("CoMemberDiv");
  if (coMemberDiv) {
    coMemberDiv.style.display = "none";
  }

  function updateBirthDate(containerId, monthSelector, daySelector, hiddenFieldSelector) {
    var month = $(containerId).find(monthSelector).val();
    var day = $(containerId).find(daySelector).val();
    if (month && day) {
      $(containerId).find(hiddenFieldSelector).val(month + '/' + day + '/1896');
    }
  }

  $("#birthday_fields #BirthMon, #birthday_fields #BirthDay").on("change", function () {
    updateBirthDate('#birthday_fields', '#BirthMon', '#BirthDay', '#BirthDate');
  });

  $("#partner_birthdate_fields #PartnerBirthMon, #partner_birthdate_fields #PartnerBirthDay").on("change", function () {
    updateBirthDate('#partner_birthdate_fields', '#PartnerBirthMon', '#PartnerBirthDay', '#PartnerBirthDate');
  });

  $(".BoatType input").click(function () {
    if (this.value != "None") {
      $(".BoatDiv").show();
      $("#UDF82").prop("required", true);
    } else {
      $(".BoatDiv").hide();
      $("#UDF82").prop("required", false);
    }
  });

  $("#Consent").click(function () {
        if (debug == true) {
            console.log("consent");
        }
    if ($(this).prop("checked")) {
      $("#Send").show();
      if ($("#signature").val() == "") {
        $("#signature").val(
          $("#FirstName").val() +
            " " +
            $("#MidName").val() +
            " " +
            $("#LastName").val()
        );
        $("#ipaddress").val(myIP());
        const d = new Date();
        $("#esaigdate").val(
          d.getMonth() +
            1 +
            "/" +
            d.getDate() +
            "/" +
            d.getFullYear() +
            " " +
            d.getHours() +
            ":" +
            d.getMinutes()
        );
      }
    } else {
      $("#Send").hide();
    }
  });

  $("#prtapp").click(function () {
    if (debug == true) {
    console.log("print");
    }
    $("#PrintContent").printThis();
    return false;
  });

  function validateBoatFields() {
    let isValid = true;
    const length = document.getElementById("UDF85");
    const beam = document.getElementById("UDF106");
    const draft = document.getElementById("UDF107");

    if (length.value < 1 || length.value > 100) {
      $("#LengthError").show();
      isValid = false;
    } else {
      $("#LengthError").hide();
    }

    if (beam.value < 1 || beam.value > 30) {
      $("#BeamError").show();
      isValid = false;
    } else {
      $("#BeamError").hide();
    }

    if (draft.value < 1 || draft.value > 20) {
      $("#DraftError").show();
      isValid = false;
    } else {
      $("#DraftError").hide();
    }

    return isValid;
  }

  function validateUDF83() {
    let isValid = true;
    const udf83Selected = document.querySelector('input[name="UDF83"]:checked');
    if (!udf83Selected) {
      $('input[name="UDF83"]').addClass("invalid-radio");
      if (debug == true) {
      console.log("Invalid UDF83 selection (Boat Type)");
      }
      isValid = false;
    } else {
      $('input[name="UDF83"]').removeClass("invalid-radio");
      if (udf83Selected.value !== "None" && !$("#UDF82").val()) {
        $("#UDF82").addClass("invalid-field");
        $("#UDF82Error").show();
        isValid = false;
      } else {
        $("#UDF82").removeClass("invalid-field");
        $("#UDF82Error").hide();
      }
    }
    return isValid;
  }

  function validateForm() {
    const isFormValid = validateBoatFields() && validateUDF83();
    return isFormValid;
  }

  $("#mmp-form").on("submit", function (event) {
    if (!validateForm()) {
      event.preventDefault(); // Prevent form submission if validation fails
      alert("Please complete the required fields.");
    }
  });
});

// Function to get user's IP address
function myIP() {
  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

  xmlhttp.open("GET", "https://api.hostip.info/get_html.php", false);
  xmlhttp.send();

  hostipInfo = xmlhttp.responseText.split("\n");

  for (i = 0; hostipInfo.length >= i; i++) {
    ipAddress = hostipInfo[i].split(":");
    if (ipAddress[0] == "IP") return ipAddress[1];
  }
  return false;
}

// Function to prevent form submission on Enter key press
function noEnter(e) {
  var keycode;
  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  return !(keycode == 13);
}
