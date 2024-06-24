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
      case 499:
        $("#mcy_499").prop("checked", true);
        break;
      case 501:
        $("#mcy_501").prop("checked", true);
        break;
      case 502:
        $("#mcy_502").prop("checked", true);
        break;
      case 503:
        $("#mcy_503").prop("checked", true);
        break;
      case 546:
        $("#mcy_546").prop("checked", true);
        break;
      case 500:
      default:
        $("#mcy_500").prop("checked", true);
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
  const clubname = document.getElementById('clubname');
  const clubNameError = document.getElementById('ClubLocDiv');

  fkclubtype.addEventListener('change', function () {
    if (this.value === 'Rotary Club' || this.value === 'Rotaract Club') {
      clubname.required = true;
      clubNameError.textContent = 'Please select your club name.';
    } else {
      clubname.required = false;
      clubNameError.textContent = '';
    }
  });
});
})(jQuery);
