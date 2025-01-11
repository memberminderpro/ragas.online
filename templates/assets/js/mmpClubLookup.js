$(document).ready(function () {
    $("#fkclubtype").change(function () {
      var mt = $(this).val();
      switch (mt) {
        case 'Rotary Club':
          $("#countryrow").show();
          $("#fkmembertype").val("Active");
          $('input[name="MemberCategoryIDs"][value="390"]').prop('checked', true);
          $('input[name="MemberCategoryIDs"][value="388"]').prop('checked', false);
          break;
        case 'Rotaract Club':
          $("#countryrow").show();
          $("#fkmembertype").val("Rotaractor");
          $('input[name="MemberCategoryIDs"][value="388"]').prop('checked', true);
          $('input[name="MemberCategoryIDs"][value="390"]').prop('checked', false);
          break;
        case 'Non-Rotarian':
          $("#countryrow").show();
          $("#fkmembertype").val("Non-Rotarian");
          break;
      }
    });
  
    $('.CountryLookup').on('select2:select', function (e) {
      var data = e.params.data;
      var selectedClubType = $('#fkclubtype').val();
      
      $("#CountryCode").val(data.id);
      $("#fkcountry").val(data.id);
      
      if (data.cnt === 0 && selectedClubType !== "Non-Rotarian") {
        $("#staterow").hide();
        $("#clubrow").show();
      } else if (data.cnt > 0) {
        $("#staterow").show();
        $("#clubrow").hide();
      } else {
        $("#staterow").hide();
        $("#clubrow").hide();
      }
    });
  
    $('.CountryLookup').select2({
      placeholder: 'Select Country',
      ajax: {
        url: 'https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm',
        type: "POST",
        dataType: 'json',
        quietMillis: 100,
        data: function (params) {
          var query = {
            term: params.term
          };
          return query;
        },
        processResults: function (data) {
          var results = data.results.map(function (item) {
            return {
              id: item.id,
              text: item.text,
              cnt: item.cnt
            };
          });
          return {
            results: results
          };
        }
      },
      createTag: function (params) {
        return {
          id: params.term,
          text: params.term,
          newOption: true
        };
      }
    });
  
    $('.StateProvLookup').on('select2:select', function (e) {
      var data = e.params.data;
      $("#StateCode").val(data.id);
      $("#fkstateprov").val(data.text);
      var selectedClubType = $('#fkclubtype').val();
      
      if (data.selected === true && selectedClubType !== "Non-Rotarian") {
        $("#clubrow").show();
        initializeClubLookup();
      } else {
        $("#clubrow").hide();
      }
    });
  
    $('.StateProvLookup').select2({
      placeholder: 'Select State or Province',
      tags: true,
      ajax: {
        url: 'https://www.emembersdb.com/Lookup/FKRotaryStateProv.cfm',
        type: "POST",
        dataType: 'json',
        quietMillis: 100,
        data: function (params) {
          var country = $("#fkcountry").val();
          if (country.length == 0) {
            alert("select Country first!");
            return '[]';
          }
          var query = {
            countrycode: country,
            AccountID: $("#AccountID").val(),
            term: params.term
          };
          return query;
        },
        processResults: function (data) {
          var results = data.results.map(function (item) {
            return {
              id: item.statecode,
              text: item.text
            };
          });
          return {
            results: results
          };
        }
      },
      createTag: function (params) {
        return {
          id: params.term,
          text: params.term,
          newOption: true
        };
      }
    });
  
    function initializeClubLookup() {
      $('.ClubLookup').select2({
        placeholder: 'Rotary Club',
        tags: true,
        ajax: {
          url: 'https://www.emembersdb.com/Lookup/FKRotaryClubNoRegion.cfm',
          type: "POST",
          dataType: 'json',
          quietMillis: 100,
          data: function (params) {
            var countrycode = $("#fkcountry").val() || $("#CountryCode").val();
            var statecode = $("#stateprov").val();
            var orgtype = $("#fkclubtype").val();
            
            console.log("Country Code:", countrycode);
            console.log("State Code:", statecode);
            console.log("Org Type:", orgtype);

            var query = {
              CountryCode: countrycode,
              StateCode: statecode,
              OrgType: orgtype,
              term: params.term
            };
            return query;
          },
          processResults: function (data) {
            var results = data.results.map(function (item) {
              return {
                id: item.id,
                text: item.text,
                districtid: item.districtid
              };
            });
            return {
              results: results
            };
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX error for clubs:", textStatus, errorThrown);
          }
        },
        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newOption: true
          };
        }
      });
    }
  
    initializeClubLookup();
  
    $('.ClubLookup').on('select2:select', function (e) {
      var data = e.params.data;
      $("#fkdistrict").val(data.districtid);
      $("#ClubID").val(data.id);
      $("#fkclubname").val(data.text);
      $("#ClubLocDiv").html("Rotary District: "+ data.districtid);
    });
  });
  