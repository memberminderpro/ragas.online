$(document).ready(function () {
  $("#Consent").prop("disabled", true);
  $("#Send").hide();

  console.log("Form loaded. Consent checkbox disabled and send button hidden.");

  function checkFieldValidity(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    if (!field.checkValidity()) {
      $(field).addClass("invalid-field");
      if (errorElement) {
        $(errorElement).addClass("visible");
      }
      let errorMsg = `Invalid field detected: ${field.name}`;
      if (field.validationMessage) {
        errorMsg += ` (${field.validationMessage})`;
      }
      console.log(errorMsg);
      return false;
    } else {
      $(field).removeClass("invalid-field");
      if (errorElement) {
        $(errorElement).removeClass("visible");
      }
      console.log(`Field is valid: ${field.name}`);
      return true;
    }
  }

  function checkFormValidity() {
    let isValid = true;
    $("#mmp-form input, #mmp-form select, #mmp-form textarea").each(function () {
      if (!this.checkValidity() && this.id !== "Consent") {
        isValid = false;
      }
    });
    return isValid;
  }

  $("#mmp-form input, #mmp-form select, #mmp-form textarea").on("focus", function () {
    console.log(`${this.name} focus`);
  });

  $("#mmp-form input, #mmp-form select, #mmp-form textarea").on("blur", function () {
    const wasFieldValid = checkFieldValidity(this);
    console.log(`${this.name} blur`);

    const isFormValid = checkFormValidity();
    if (isFormValid && $("#Consent").prop("disabled")) {
      $("#Consent").prop("disabled", false);
      console.log("Form is valid. Consent checkbox enabled.");
    } else if (!isFormValid && !$("#Consent").prop("disabled")) {
      $("#Consent").prop("disabled", true);
      $("#Send").hide();
      console.log("Form is invalid. Consent checkbox disabled and send button hidden.");
    }
  });

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

  $("#Send").click(function (event) {
    event.preventDefault();

    console.log("Send button clicked. Checking form validity...");
    if (!checkFormValidity()) {
      alert("Some required fields were not entered or are misformatted.");
      $("#Send").show();
      return;
    }

    var selectedCategories = [];
    $('input[name="mcidFields"]:checked').each(function () {
      selectedCategories.push($(this).val());
    });

    var selectedExperience = $("#experienceDropdown").val();
    if (selectedExperience) {
      selectedCategories.push(selectedExperience);
    }

    $("#MemberCategoryIDs").val(selectedCategories.join(","));
    console.log("Selected categories:", selectedCategories);

    var f = $("#mmp-form").serialize();
    try {
      if (debug) {
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

  $("form").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed. Default form submission prevented.");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("MMP Form Options:", mmpFormOptions);

  if (typeof $.fn.select2 !== "undefined") {
    $(".select2").select2();
    console.log("select2 initialized.");
  }

  if (typeof $.fn.validate !== "undefined") {
    $("#mmp-form").validate({
      // Validation rules
    });
    console.log("jQuery validation initialized.");
  }
});
