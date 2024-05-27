var captchaHash = "";

// Prevent form submission on Enter key
function noEnter(e) {
  var keycode;
  if (window.event) keycode = window.event.keyCode;
  else if (e) keycode = e.which;
  return !(keycode == 13);
}

var urlParms = getQueryParams(document.location.search);

$(document).ready(function () {
  $("#Consent").prop("disabled", true);
  $("#Send").hide();

  console.log("Form loaded. Consent checkbox disabled and send button hidden.");

  // Function to check form validity and add/remove invalid field indicators
  function checkFormValidity() {
    let isValid = true;
    $("#mmp-form input, #mmp-form select, #mmp-form textarea").each(function () {
      if (!this.checkValidity()) {
        isValid = false;
        $(this).addClass("invalid-field"); // Add invalid field indicator
        console.log("Invalid field detected:", this);
      } else {
        $(this).removeClass("invalid-field"); // Remove invalid field indicator
        console.log("Field is valid:", this);
      }
    });
    return isValid;
  }

  // Event listener for form input changes
  $("#mmp-form input, #mmp-form select, #mmp-form textarea").on("input change", function () {
    console.log("Input changed. Checking form validity...");
    if (checkFormValidity()) {
      $("#Consent").prop("disabled", false);
      console.log("Form is valid. Consent checkbox enabled.");
    } else {
      $("#Consent").prop("disabled", true);
      $("#Send").hide();
      console.log("Form is invalid. Consent checkbox disabled and send button hidden.");
    }
  });

  // Event listener for the consent checkbox
  $("#Consent").on("change", function () {
    if (this.checked) {
      $("#Send").show();
      console.log("Consent checkbox checked. Send button shown.");
    } else {
      $("#Send").hide();
      console.log("Consent checkbox unchecked. Send button hidden.");
    }
  });

  var debug = true;
  console.log("Debug mode:", debug);

  // Prevent form submission and log data in debug mode
  $("#Send").click(function (event) {
    event.preventDefault(); // Prevent the default form submission

    console.log("Send button clicked. Checking form validity...");
    if (!checkFormValidity()) {
      alert("Some required fields were not entered or are misformatted.");
      $("#Send").show();
      return;
    }

    // Collect selected checkbox values
    var selectedCategories = [];
    $('input[name="mcidFields"]:checked').each(function () {
      selectedCategories.push($(this).val());
    });

    // Get the selected dropdown value
    var selectedExperience = $("#experienceDropdown").val();
    if (selectedExperience) {
      selectedCategories.push(selectedExperience);
    }

    // Set the hidden input value
    $("#MemberCategoryIDs").val(selectedCategories.join(","));
    console.log("Selected categories:", selectedCategories);

    var f = $("#mmp-form").serialize();
    try {
      if (debug) {
        // Parse the serialized string into an object
        var formData = decodeURIComponent(f)
          .split("&")
          .reduce(function (acc, pair) {
            var [key, value] = pair.split("=");
            if (!acc[key]) {
              acc[key] = value;
            } else if (Array.isArray(acc[key])) {
              acc[key].push(value);
            } else {
              acc[key] = [acc[key], value];
            }
            return acc;
          }, {});

        // Log the object in a readable format
        console.log("Form Data:", formData);
        console.log("captchaHash=", captchaHash);
        console.log("captchaCode=", $("#captchaCode").val());
        alert("Form data logged to console. Debug mode is ON.");
      }
    } catch (error) {
      alert("Could not submit form.");
      console.log("Form submission error:", error);
    }
  });

  // Validate radio groups on form submit
  $("form").on("submit", function (event) {
    let allValid = true;
    $('input[type="radio"][required]').each(function () {
      const name = this.name;
      const radioGroup = document.getElementsByName(name);
      const isChecked = Array.from(radioGroup).some((r) => r.checked);

      if (!isChecked) {
        allValid = false;
        radioGroup.forEach((r) => r.classList.add("invalid-radio"));
        console.log("Invalid radio group:", name);
      } else {
        radioGroup.forEach((r) => r.classList.remove("invalid-radio"));
      }
    });

    if (!allValid) {
      event.preventDefault();
      alert("Please select an option for each required field.");
      console.log("Form submission prevented due to invalid radio groups.");
    }
  });

  // Prevent form submission on Enter key
  $("form").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed. Default form submission prevented.");
    }
  });
});

function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}

document.addEventListener("DOMContentLoaded", function () {
  // Log the mmpFormOptions object to the console
  console.log("MMP Form Options:", mmpFormOptions);

  // Example: Initialize select2
  if (typeof $.fn.select2 !== "undefined") {
    $(".select2").select2();
    console.log("select2 initialized.");
  }

  // Example: Initialize jQuery validation
  if (typeof $.fn.validate !== "undefined") {
    $("#mmp-form").validate({
      // Validation rules
    });
    console.log("jQuery validation initialized.");
  }
});
