$(document).ready(function () {
  // Functionality to handle showing/hiding the Co-Member information section
  const coMemberCheckbox = document.getElementById('CoMember');
  if (coMemberCheckbox) {
      coMemberCheckbox.addEventListener('change', function () {
          const coMemberDiv = document.getElementById('CoMemberDiv');
          if (coMemberCheckbox.checked) {
              coMemberDiv.style.display = 'block';
          } else {
              coMemberDiv.style.display = 'none';
          }
      });
  }

  // Ensure the Co-Member div is hidden initially
  const coMemberDiv = document.getElementById('CoMemberDiv');
  if (coMemberDiv) {
      coMemberDiv.style.display = 'none';
  }

  // Birth date handling
  $("#BirthMon, #PartnerBirthMon").change(function () {
      var m = parseInt($(this).val());
      var d = $(this).closest('tr').find(".BirthDay").val();
      if (m > 0 & m < 13) {
          m = $(this).closest('tr').find(".BirthMon").val();
      } else {
          alert("please enter 1 to 12");
          m = 1;
      }
      var d = $(this).closest('tr').find(".BirthDay").val();
      $(this).closest('tr').find(".BirthDate").val(m + '/' + d + '/1896');
  });

  $("#BirthDay, #PartnerBirthDay").change(function () {
      var m = $(this).closest('tr').find(".BirthMon").val();
      var d = parseInt($(this).val());
      if (d > 0 & d < 32) {
          d = $(this).closest('tr').find(".BirthDay").val();
      } else {
          alert("please enter 1 to 31");
          d = 1;
      }
      $(this).closest('tr').find(".BirthDate").val(m + '/' + d + '/1896');
  });

  // Boat type handling
  $(".BoatType").click(function () {
      if (this.value == 'None')
          $(".BoatDiv").hide();
      else
          $(".BoatDiv").show();
  });

  $("#Consent").click(function () {
      console.log("consent");
      if ($(this).prop('checked')) {
          $("#Send").show();
          if ($("#signature").val() == '') {
              $("#signature").val($("#FirstName").val() + ' ' + $("#MidName").val() + ' ' + $("#LastName").val());
              $("#ipaddress").val(myIP());
              $("#esaigdate").val(d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes());
          }
      }
      else {
          $("#Send").hide();
      }
  });

  $("#prtapp").click(function () {
      console.log("print");
      $("#PrintContent").printThis();
      return false;
  });

  // New validation logic for Length, Beam, and Draft fields
  function validateBoatFields() {
      let isValid = true;
      const length = document.getElementById('UDF85');
      const beam = document.getElementById('UDF106');
      const draft = document.getElementById('UDF107');

      if (length.value < 1 || length.value > 100) {
          $('#LengthError').show();
          isValid = false;
      } else {
          $('#LengthError').hide();
      }

      if (beam.value < 1 || beam.value > 30) {
          $('#BeamError').show();
          isValid = false;
      } else {
          $('#BeamError').hide();
      }

      if (draft.value < 1 || draft.value > 20) {
          $('#DraftError').show();
          isValid = false;
      } else {
          $('#DraftError').hide();
      }

      return isValid;
  }

  // Form submission handler
  $('#form').submit(function (event) {
      if (!validateBoatFields()) {
          event.preventDefault(); // Prevent form submission if validation fails
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
  if (window.event)
      keycode = window.event.keyCode;
  else if (e)
      keycode = e.which;
  return !(keycode == 13);
}
