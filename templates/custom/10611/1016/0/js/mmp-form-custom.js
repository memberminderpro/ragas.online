(function($) {
$(document).ready(function () {
  if (typeof mmpFormOptions !== 'undefined') {
    var urlParams = new URLSearchParams(window.location.search);
    var $mtid = urlParams.get('mtid');

    if ($mtid) {
      $mtid = parseInt($mtid, 10);
    } else {
      $mtid = parseInt(mmpFormOptions.default_member_type_id, 10);
    }

    // Set the initial value of MCY based on $mtid
    switch ($mtid) {
      case 530: // 530 Active 2yrs
        $("#mcy_530").prop("checked", true);
        break;
      case 507: // 507 Active 5yrs
        $("#mcy_507").prop("checked", true);
        break;
      default: // 526 Active 1yr
        $("#mcy_526").prop("checked", true);
        break;
    }

    // Update the $mtid variable whenever the selection changes
    $("input[name='MCY']").change(function () {
      var selectedValue = $(this).val();
      $mtid = parseInt(selectedValue.split('|')[0], 10);
      console.log("current mtid: " + $mtid);
    });

    // Function to update the CSS variables
    function updateCSSVariables() {
      const root = document.documentElement;

      if (mmpFormOptions.color_required_highlight) {
        root.style.setProperty('--custom-required-highlight', mmpFormOptions.color_required_highlight);
      }
      if (mmpFormOptions.color_invalid_field_highlight) {
        root.style.setProperty('--custom-invalid-field-highlight', mmpFormOptions.color_invalid_field_highlight);
      }
      if (mmpFormOptions.color_invalid_field_outline) {
        root.style.setProperty('--custom-invalid-field-outline', mmpFormOptions.color_invalid_field_outline);
      }
      if (mmpFormOptions.color_field_focus_outline) {
        root.style.setProperty('--custom-field-focus-outline', mmpFormOptions.color_field_focus_outline);
      }
    }

    // Call the function to update the CSS variables
    updateCSSVariables();
  }

  // Additional form validation logic
  const form = document.querySelector('form');
  const fkclubtype = document.getElementById('fkclubtype');
  const countryrow = document.getElementById('countryrow');
  const staterow = document.getElementById('staterow');
  const clubrow = document.getElementById('clubrow');
  const clubname = document.getElementById('clubname');
  const clubNameError = document.getElementById('ClubLocDiv');

  fkclubtype.addEventListener('change', function () {
    if (this.value === 'Rotary Club' || this.value === 'Rotaract Club') {
      countryrow.style.display = 'block';
      staterow.style.display = 'block';
      clubrow.style.display = 'block';
      clubname.required = true;
      clubNameError.textContent = 'Please select your club name.';
    } else {
      countryrow.style.display = 'none';
      staterow.style.display = 'none';
      clubrow.style.display = 'none';
      clubname.required = false;
      clubNameError.textContent = '';
    }
  });

  // Birthday validation
  const birthday = document.getElementById('Birthday');
  const birthdayError = document.getElementById('BirthdayError');

  birthday.addEventListener('change', function() {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])$/;
    if (!regex.test(this.value)) {
      birthdayError.textContent = 'Please enter a valid birthday in DD/MM format.';
      this.setCustomValidity('Invalid birthday format');
    } else {
      birthdayError.textContent = '';
      this.setCustomValidity('');
    }
  });

  // Email duplicate check
  const email = document.getElementById('Email');
  const emailDuplicate = document.getElementById('EmailDuplicate');

  email.addEventListener('change', function() {
    // You'll need to implement the actual AJAX call to check for duplicate emails
    // This is just a placeholder to show how it might work
    checkDuplicateEmail(this.value).then(isDuplicate => {
      if (isDuplicate) {
        emailDuplicate.style.display = 'block';
        this.setCustomValidity('Email already in use');
      } else {
        emailDuplicate.style.display = 'none';
        this.setCustomValidity('');
      }
    });
  });

  // Placeholder function for email duplicate check
  function checkDuplicateEmail(email) {
    // Implement the actual AJAX call here
    return new Promise(resolve => {
      // Simulating an AJAX call
      setTimeout(() => {
        resolve(false); // Assume it's not a duplicate for this example
      }, 1000);
    });
  }

  // Form submission
  form.addEventListener('submit', function(event) {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  });
});
})(jQuery);