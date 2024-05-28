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
      case 933:
        $("#mcy_933").prop("checked", true);
        break;
      case 935:
        $("#mcy_935").prop("checked", true);
        break;
      case 938:
      default:
        $("#mcy_938").prop("checked", true);
        break;
    }

    // Update the $mtid variable whenever the selection changes
    $("input[name='MCY']").change(function () {
      var selectedValue = $(this).val();
      $mtid = parseInt(selectedValue.split('|')[0], 10);
      console.log("current mtid: " + $mtid);
    });

    // Handle changes to club type and update relevant fields
    $("#fkclubtype").change(function () {
      var mt = $(this).val();
      switch (mt) {
        case "Rotary Club":
          $('input[name="MemberCategoryIDs"][value="390"]').prop("checked", true);
          $('input[name="MemberCategoryIDs"][value="388"]').prop("checked", false);
          break;
        case "Rotaract Club":
          $('input[name="MemberCategoryIDs"][value="388"]').prop("checked", true);
          $('input[name="MemberCategoryIDs"][value="390"]').prop("checked", false);
          break;
        case "Non-Rotarian":
          $('input[name="MemberCategoryIDs"][value="388"]').prop("checked", false);
          $('input[name="MemberCategoryIDs"][value="390"]').prop("checked", false);
          break;
      }
    });
  }

  // Additional form validation logic
  const form = document.querySelector('form');
  const MemberCategoryIDs = document.querySelectorAll('input[name="MemberCategoryIDs"]');
  const interestsCheckboxes = document.querySelectorAll('#interests input[name="MemberCategoryIDs"]');
  const fkclubtype = document.getElementById('fkclubtype');
  const clubname = document.getElementById('clubname');
  const clubNameError = document.getElementById('ClubLocDiv');

  form.addEventListener('submit', (event) => {
    let mcidValues = [];
    let isExperienceSelected = false;
    let isInterestSelected = false;

    MemberCategoryIDs.forEach((field) => {
      if (field.type === 'radio' && field.checked) {
        isExperienceSelected = true;
      }
      if (field.checked) {
        mcidValues.push(field.value);
      }
    });

    interestsCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        isInterestSelected = true;
      }
    });

    if (!isExperienceSelected) {
      alert('Please select your WASH Experience.');
      event.preventDefault();
      return;
    }

    if (!isInterestSelected) {
      alert('Please select at least one area of interest.');
      event.preventDefault();
      return;
    }

    const mcidString = mcidValues.join(', ');
    const mcidHiddenInput = document.createElement('input');
    mcidHiddenInput.type = 'hidden';
    mcidHiddenInput.name = 'mcid';
    mcidHiddenInput.value = mcidString;
    form.appendChild(mcidHiddenInput);
  });

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
