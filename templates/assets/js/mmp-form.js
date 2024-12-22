$(document).ready(function () {
  var debug = false; // Set this to false in production
  $("#Consent").prop("disabled", true);
  $("#Send").hide();

  console.log("Form loaded. Consent checkbox disabled and send button hidden.");
  console.log("Debug mode:", debug);

  function getPostData() {
    let postData = $("#mmp-form").serializeArray();

    // Filter out the confirm_password, consent, and recaptcha_site_key fields
    postData = postData.filter(function (item) {
      return item.name !== 'confirm_password' && item.name !== 'Consent' && item.name !== 'recaptcha_site_key';
    });

    // Add values from mmpFormOptions if available
    if (typeof mmpFormOptions !== 'undefined') {
      postData.push({ name: 'accountID', value: Number(mmpFormOptions.account_ID) });
      postData.push({ name: 'BID', value: Number(mmpFormOptions.BID) });
      postData.push({ name: 'ClubID', value: Number(mmpFormOptions.ClubID) });
      postData.push({ name: 'accountemail', value: mmpFormOptions.account_email });
      console.log("Using values from WordPress localized script data.");
    }

    return postData;
  }

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

  $("#Email").change(function () {
    if (this.checkValidity()) {
      console.log("Handler for email .change() called.");
      $.ajax({
        url: "https://www.emembersdb.com/Lookup/EMailCheck.cfm",
        type: "POST",
        dataType: "json",
        data: {
          AccountID: Number(mmpFormOptions.account_ID),
          Email: $(this).val().trim(),
          IsActive: "Y", // Search for active subscriptions
        },
      })
      .done(function (data) {
        console.log(data);
        if (data == 1) {
          $("#email-error").show().html(
            `This email is already associated with a membership. Please contact <a href="mailto:${mmpFormOptions.account_email}?subject=Duplicate%20Membership%20Email%20Address">${mmpFormOptions.account_email}</a> to change your membership type.`
          );
          $("#Send").hide();
          console.log("Email found");
        } else {
          $("#email-error").hide();
          console.log("Email NOT found");
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        $("#email-error").html("Error checking email. Please try again.").show();
        console.error("Email change AJAX request failed: " + textStatus, errorThrown);
      });
    } else {
      console.log("Invalid email address");
    }
  });

  $("#Send").click(function (event) {
    event.preventDefault();

    console.log("Send button clicked. Checking form validity...");
    if (!checkFormValidity()) {
      alert("Some required fields were not entered or are misformatted.");
      $("#Send").show();
      return;
    }

    grecaptcha.ready(function () {
      grecaptcha.execute(mmpFormOptions.recaptcha_site_key, { action: 'submit' }).then(function (token) {
        console.log("reCAPTCHA token received:", token); // Debugging output
        // alert("reCAPTCHA token received: " + token); // Debugging output

        var postData = getPostData();
        // Rename g-recaptcha-response to g_recaptcha_response
        postData.push({ name: 'g_recaptcha_response', value: token });

        if (debug) {
          var formData = postData.reduce(function (acc, item) {
            if (!acc[item.name]) {
              acc[item.name] = item.value;
            } else if (Array.isArray(acc[item.name])) {
              acc[item.name].push(item.value);
            } else {
              acc[item.name] = [acc[item.name], item.value];
            }
            return acc;
          }, {});

          console.log("Form Data:", formData);
          // alert("Form data logged to console. Debug mode is ON.");
        } else {
          // Use a form to submit data to custom.cfm and perform redirection
          var $form = $("<form>", {
            action: "https://www.emembersdb.com/nm/custom.cfm",
            method: "post",
          }).appendTo('body');

          $.each(postData, function (i, item) {
            $("<input>", {
              type: "hidden",
              name: item.name,
              value: item.value
            }).appendTo($form);
          });

          $form.submit();
        }
      });
    });
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