(function ($) {
  $(document).ready(function () {
    $("#fkclubtype").change(function () {
      var mt = $(this).val();
      switch (mt) {
        case "Rotary Club":
          $("#countryrow").show();
          $("#fkmembertype").val("Active");
          $('input[name="MemberCategoryIDs"][value="390"]').prop(
            "checked",
            true
          );
          $('input[name="MemberCategoryIDs"][value="388"]').prop(
            "checked",
            false
          );
          break;
        case "Rotaract Club":
          $("#countryrow").show();
          $("#fkmembertype").val("Rotaractor");
          $('input[name="MemberCategoryIDs"][value="388"]').prop(
            "checked",
            true
          );
          $('input[name="MemberCategoryIDs"][value="390"]').prop(
            "checked",
            false
          );
          break;
        case "Non-Rotarian":
          $("#countryrow").hide();
          $("#fkmembertype").val("Non-Rotarian");
          break;
      }
    });

    $(".CountryLookup").on("select2:select", function (e) {
      var data = e.params.data;
      $("#CountryCode").val(data.id);
      if (data.cnt === 0) {
        $("#staterow").hide();
        $("#clubrow").show();
      } else {
        $("#staterow").show();
      }
    });

    $(".CountryLookup").select2({
      placeholder: "Select Country",
      ajax: {
        url: "https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm",
        type: "POST",
        dataType: "json",
        quietMillis: 100,
        data: function (params) {
          var query = {
            term: params.term,
          };
          return query;
        },
        processResults: function (data) {
          var results = data.results.map(function (item) {
            return {
              id: item.id,
              text: item.text,
              cnt: item.cnt,
            };
          });
          return {
            results: results,
          };
        },
      },
      createTag: function (params) {
        return {
          id: params.term,
          text: params.term,
          newOption: true,
        };
      },
    });

    $(".StateProvLookup").on("select2:select", function (e) {
      var data = e.params.data;
      $("#StateCode").val(data.id);
      $("#fkstateprov").val(data.text);
      if (data.selected === true) {
        $("#clubrow").show();
        initializeClubLookup();
      } else {
        $("#clubrow").hide();
      }
    });

    $(".StateProvLookup").select2({
      placeholder: "Select State or Province",
      tags: true,
      ajax: {
        url: "https://www.emembersdb.com/Lookup/FKRotaryStateProv.cfm",
        type: "POST",
        dataType: "json",
        quietMillis: 100,
        data: function (params) {
          var country = $("#fkcountry").val();
          if (country.length == 0) {
            alert("select Country first!");
            return "[]";
          }
          var query = {
            countrycode: country,
            AccountID: $("#AccountID").val(),
            term: params.term,
          };
          return query;
        },
        processResults: function (data) {
          var results = data.results.map(function (item) {
            return {
              id: item.statecode,
              text: item.text,
            };
          });
          return {
            results: results,
          };
        },
      },
      createTag: function (params) {
        return {
          id: params.term,
          text: params.term,
          newOption: true,
        };
      },
    });

    function initializeClubLookup() {
      $(".ClubLookup").select2({
        placeholder: "Rotary Club",
        tags: true,
        ajax: {
          url: "https://www.emembersdb.com/Lookup/FKRotaryClub.cfm",
          type: "POST",
          dataType: "json",
          quietMillis: 100,
          data: function (params) {
            var accountID = Number(mmpFormOptions.account_ID); // from mmpFormOptions 
            var countrycode = $(".CountryLookup option:selected").val();
				    var statecode = $("#stateprov").val();
            var orgtype = $("#fkclubtype").val();
            console.log ("accountID=" + accountID + " countrycode="+countrycode+ " statecode="+statecode+" orgtype="+orgtype);
            
            var query = {
              AccountID: accountID,
              countrycode: countrycode,
              statecode: statecode,
              orgtype: orgtype,
              term: 	params.term
            }
            return query;
          },
          processResults: function (data) {
            var results = data.results.map(function (item) {
              return {
                id: item.id,
                text: item.text,
                districtid: item.districtid,
                region: item.region,
                regionname: item.regionname,
              };
            });
            return {
              results: results,
            };
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX error for clubs:", textStatus, errorThrown);
          },
        },
        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newOption: true,
          };
        },
      });
    }

    initializeClubLookup();

    // Show region and district based on club selection
    $(".ClubLookup").on("select2:select", function (e) {
      console.log("ClubLookup change");
      var data = e.params.data;
      console.log(data);

      // Assign values to form fields
      $("#fkdistrict").val(data.districtid);
      $("#fkclubname").val(data.text);
      $("#ClubID").val(data.id);
      $("#Region").val(data.region);
      $("#RegionName").val(data.regionname);

      // Check if region_label is empty or null and set default value
      var regionLabel = mmpFormOptions.region_label ? mmpFormOptions.region_label : "Region";

      // Update the HTML with the district and region
      $("#ClubLocDiv").html(
        "District: " + data.districtid + "  " + regionLabel + ": " + data.regionname
      );
    });

  });
})(jQuery);
