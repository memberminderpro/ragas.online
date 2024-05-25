$(document).ready(function () {
    $("#fkclubtype").change(function () {
        console.log("Handler for membertype .change() called.");
        var mt = $(this).val();
        console.log(mt);
        switch (mt) {
            case 'Rotary Club':
                $("#countryrow").show();
                $("#fkmembertype").val("Active");
                $('input[name="mcidFields"][value="390"]').prop('checked', true);
                $('input[name="mcidFields"][value="388"]').prop('checked', false);
                console.log("Handler for membertype .change() called.");
                break;
            case 'Rotaract Club':
                $("#countryrow").show();
                $("#fkmembertype").val("Rotaractor");
                $('input[name="mcidFields"][value="388"]').prop('checked', true);
                $('input[name="mcidFields"][value="390"]').prop('checked', false);
                break;
            case 'Non-Rotarian':
                $("#countryrow").hide();
                $("#fkmembertype").val("Non-Rotarian");
                break;
        }
    });

    $('.CountryLookup').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
        console.log("id=" + data.id);          // countrycode
        console.log("country=" + data.text);   // countryname
        console.log("cnt=" + data.cnt);        // count of states
        $("#CountryCode").val(data.id);        // countrycode
        if (data.cnt === 0) {
            $("#staterow").hide();
            $("#clubrow").show();
        } else {
            $("#staterow").show();
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
                console.log("AJAX request params:", params);
                var query = {
                    term: params.term
                };
                return query;
            },
            processResults: function (data) {
                console.log("AJAX response data:", data);
                var results = data.results.map(function (item) {
                    return {
                        id: item.id,
                        text: item.text,
                        cnt: item.cnt // Assuming 'cnt' is part of the response
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
        console.log(data);
        $("#fkstateprov").val(data.statecode);      // Set hidden field value
        $("#ProvOrOther").val(data.province);       // Province
        if (data.selected === true) {
            $("#clubrow").show();
            // Reinitialize ClubLookup on state selection
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
                var country = $("#fkcountry").val();    // countrycode
                console.log("country=" + country);
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
                    var countrycode = $("#CountryCode").val(); // Note: Use #CountryCode for the correct parameter
                    var statecode = $("#stateprov").val(); // Correct element to get statecode
                    var orgtype = $("#fkclubtype").val();
                    console.log("AJAX request params for clubs:", {
                        CountryCode: countrycode,
                        StateCode: statecode,
                        OrgType: orgtype,
                        term: params.term
                    });
                    var query = {
                        CountryCode: countrycode,
                        StateCode: statecode,
                        OrgType: orgtype,
                        term: params.term
                    };
                    console.log("Clubs Query:", query); // Ensure query is correct
                    return query;
                },
                processResults: function (data) {
                    console.log("AJAX response data for clubs:", data);
                    if (!data.results) {
                        console.error("No results found for clubs.");
                        return { results: [] };
                    }
                    var results = data.results.map(function (item) {
                        return {
                            id: item.id,
                            text: item.text
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

    initializeClubLookup(); // Ensure ClubLookup is initialized on page load

    $('.ClubLookup').on('select2:select', function (e) {
        console.log("ClubLookup change");
        var data = e.params.data;
        console.log(data);

        $("#fkdistrict").val(data.districtid);      // DistrictID
        $("#Region").val(data.region);              // Region
        $("#RegionName").val(data.regionname);      // regionname
        $("#ClubID").val(data.id);                  // iMembersDB ClubID
        $("#fkclubname").val(data.text);            // fkclubNmae
        $("#ClubLocDiv").html("District: " + data.districtid + "   ESRAG Region: " + data.regionname);
    });
});
/* !SECTION: Club Lookup */
