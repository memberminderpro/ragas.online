$(document).ready(function () {
  //alert("ready");

 
  var urlParams = new URLSearchParams(window.location.search);
  var $mtid = urlParams.get('mtid');
  
  if ($mtid) {
      $mtid = parseInt($mtid, 10);
  } else {
      // Default value from localized script
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

  
  // WASH RAG wants to store member type to Member Category ID fields.
  // This will write the value to the appropriate categorty ID when the member type is selected.
  $("#fkclubtype").change(function () {
    var mt = $(this).val();
    switch (mt) {
      case "Rotary Club":
        $('input[name="mcidFields"][value="390"]').prop("checked", true);
        console.log(
          `Custom Handler for membertype .change() set mcid 388 to "False".`
        );
        $('input[name="mcidFields"][value="388"]').prop("checked", false);
        console.log(
          `Custom Handler for membertype .change() set mcid 390 to "True".`
        );
        break;
      case "Rotaract Club":
        $('input[name="mcidFields"][value="388"]').prop("checked", true);
        console.log(
          `Custom Handler for membertype .change() set mcid 388 to "True".`
        );
        $('input[name="mcidFields"][value="390"]').prop("checked", false);
        console.log(
          `Custom Handler for membertype .change() set mcid 390 to "False".`
        );
        break;
      case "Non-Rotarian":
        $('input[name="mcidFields"][value="388"]').prop("checked", false);
        console.log(
          `Custom Handler for membertype .change() set mcid 388 to "False".`
        );
        $('input[name="mcidFields"][value="390"]').prop("checked", false);
        console.log(
          `Custom Handler for membertype .change() set mcid 390 to "False".`
        );
        break;
    }
  });

});
