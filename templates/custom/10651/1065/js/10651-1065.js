var captchaHash = '';
function noEnter(e) {		// Do not allow Enter Key to cause submission
var keycode;
if (window.event)
    keycode = window.event.keyCode;
else if (e)
    keycode = e.which;
return !(keycode == 13);
}

var urlParms = getQueryParams(document.location.search);
$(document).ready(function () {
    //alert("ready");

    // Read the URL Param to setup the MemberTypeID|Cost|NoYrs
    console.log("urlParms.mtid: " + urlParms.mtid);
    var mtid = parseInt(urlParms.mtid);
    console.log("Constructed mtid: " + mtid);

    // Map the member type passed on the URL to the MCY (MembertypeID, Cost, NoYrs) value
    switch (mtid) { 
        case 933:
            $("#MCY").val(mtid + "|100|5")
            $("#MemberTypeID").val(mtid)
            break;
        case 935:
            $("#MCY").val(mtid + "|10|1")
            $("#MemberTypeID").val(mtid)
            break;
        case 938:
        default:
            $("#MCY").val(mtid + "|25|1")
            $("#MemberTypeID").val(mtid)
            break
    }

    DisplayCaptcha()

    $("#redoCaptcha").click(function() {
        console.log('User clicked "redoCaptcha"');
        DisplayCaptcha()
    });

    $("#Consent").click(function() {
            if ( $(this).prop('checked') && $("#EMailDiv").is(":hidden") ) {
                    $(this).attr("checked", "checked");
            $("#Send").show();
            } else {
                $(this).prop("checked", false);
                $("#Send").hide();
                }
    });

    $("#prtapp").click(function() {
        console.log ('User clicked "print"');
        $("#PrintContent").printThis();
        return false;
    });

    var debug = false; 
    console.log("Debug mode: " + debug);
    $("#Send").click(function () {
        $("#Send").hide();

        // Collect selected checkbox values
        var selectedCategories = [];
        $('input[name="mcidFields"]:checked').each(function() {
            selectedCategories.push($(this).val());
        });

        // Get the selected dropdown value
        var selectedExperience = $('#experienceDropdown').val();
        if (selectedExperience) {
            selectedCategories.push(selectedExperience);
        }

        // Set the hidden input value
        $('#MemberCategoryIDs').val(selectedCategories.join(','));

        var f = $("#form").serialize();
        if ($("#form").valid()) {
            try {
                if (debug) {                    // Parse the serialized string into an object
                    var formData = decodeURIComponent(f).split('&').reduce(function(acc, pair) {
                        var [key, value] = pair.split('=');
                        if (!acc[key]) {
                            acc[key] = value;
                        } else if (Array.isArray(acc[key])) {
                            acc[key].push(value);
                        } else {
                            acc[key] = [acc[key], value];
                        }
                        return acc;
                }, {});

                // Log the object in a readable format
                console.log("Form Data:", formData);

                // Optionally, log each key-value pair on a new line
                console.log("Readable Form Data:");
                Object.entries(formData).forEach(([key, value]) => {
                    console.log(`${key}: ${value}`);
                });
                console.log("captchaHash=" + captchaHash);
                console.log("captchaCode=" + $('#captchaCode').val());
                alert("Form data logged to console. Debug mode is ON.");
                $("#Send").show();
            } else {
                $.ajax({
                    type: "POST",
                    url: "https://www.emembersdb.com/CFC/Captcha.cfc",
                    data: {
                        method: 'chkCaptcha',
                        captchaHash: captchaHash,
                        captchaCode: $('#captchaCode').val(),
                        timeout: 8000
                    },
                    error: function () {
                        alert("error");
                    },
                    success: function (data) {
                        var rsp = JSON.parse(data);
                        if (rsp.SUCCESS == false) {
                            $('#captchaError').html(rsp.ERROR);
                            $('#captchaError').show();
                            $("#Send").show();
                        }
                        else {
                            $('#captcha').html('');
                            $('#captchaError').hide();
                            $("#form").submit();
                        }
                    }
                });
            }
            }
            catch (error) {
                alert("Could not submit form.")
                $("#Send").show();
            }
        }
        else {
            alert("Some required fields were not entered")
            $("#Send").show();
        }
    });

    /* SECTION: Club Lookup */
    $( "#fkclubtype" ).change(function() {
        console.log( "Handler for membertype .change() called." );
        var mt = $(this).val()
        console.log (mt)
        switch (mt) {
            case 'Rotary Club':
                $("#countryrow").show();
                $("#fkmembertype").val("Active");
                $('input[name="mcidFields"][value="390"]').prop('checked', true);
                $('input[name="mcidFields"][value="388"]').prop('checked', false);
                console.log( "Handler for membertype .change() called." );
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
        console.log(data)
        console.log("id="+data.id)					// countrycode
        console.log("country="+data.text)			// countryname
        console.log("cnt="+data.cnt)				// count of states
        $("#CountryCode").val( data.id )			// countrycode
        if (data.cnt === 0) {
            $("#staterow").hide();
            $("#clubrow").show();
        } else {
            $("#staterow").show();
        }
    });
    $('.CountryLookup').select2({
        placeholder:  'Select Country',
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm',
            // url: 'http://emdb.com/Lookup/FKRotaryCountry.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function (params) {
                var query = {
                    term: 	params.term
                }
                return query;
            }
        },
        results: function (data) {
            results = [];
            $.each(data, function(index, item){
                results.push({
                    id: 	item.id,
                    text: 	item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function (params) {
            return {
                id: params.term,
                text: params.term,
                newOption: true
            }
        }
    });

    $('.StateProvLookup').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data)
        $("#StateCode").val( data.statecode )		// statecode
        $("#fkstateprov").val( data.statecode )		// StateProv
        $("#ProvOrOther").val( data.province )		// Province
        if (data.selected === true) {
            $("#clubrow").show();
        } else {
            $("#clubrow").hide();
        }
    });
    $('.StateProvLookup').select2({
        placeholder: 'Select State or Province',
        tags: 		  true,
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryStateProv.cfm',
            // url: 'http://emdb.com/Lookup/FKRotaryStateProv.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function (params) {
                var country = $("#fkcountry").val();	// countrycode
                console.log ("country="+country);
                if ( country.length == 0 ){
                    alert("select Country first!");
                    return '[]';
                }
                var query = {
                    countrycode: country,
                    AccountID: $("#AccountID").val(),
                    term: 	params.term
                }
                return query;
            }
        },
        results: function (data) {
            results = [];
            $.each(data, function(index, item){
                results.push({
                    id: 	item.statecode,
                    text: 	item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function (params) {
            return {
                id: params.term,
                text: params.term,
                newOption: true
            }
        }
    });

    $('.ClubLookup').on('select2:select', function (e) {
        console.log("ClubLookup change")
        var data = e.params.data;
        console.log(data)

        $("#fkdistrict").val( data.districtid )		// DistrictID
        $("#Region").val( data.region )				// Region
        $("#RegionName").val( data.regionname )		// regionname
        $("#ClubID").val( data.id )					// iMembersDB ClubID
        $("#fkclubname").val( data.text )			// fkclubNmae
        $("#ClubLocDiv").html("Distict: " + data.districtid + "   ESRAG Region: " + data.regionname)

    });

    $('.ClubLookup').select2({
        placeholder: 'Rotary Club',
        tags: 		  true,
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryClubNoRegion.cfm',
            // url: 'http://emdb.com/Lookup/FKRotaryClub.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function (params) {
                var countrycode = $(".CountryLookup option:selected").val();
                var statecode = $("#StateCode").val();
                var orgtype = $("#fkclubtype").val();
                console.log ("countrycode="+countrycode+ " statecode="+statecode+" orgtype="+orgtype);
                var query = {
                    AccountID: $("#AccountID").val(),
                    countrycode: countrycode,
                    statecode: statecode,
                    orgtype: orgtype,
                    term: 	params.term
                }
                return query;
            }
        },
        results: function (data) {
            results = [];
            $.each(data, function(index, item){
                results.push({
                    id: 	item.id,
                    text: 	item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function (params) {
            return {
                id:   params.id,
                text: params.text,
                newOption: true
            }
        }
    });
    /* !SECTION: Club Lookup */

});

function DisplayCaptcha() {
    $.ajax({
        type: "POST",
        url: "https://www.emembersdb.com/CFC/Captcha.cfc",
        data: {
            method: 'getCaptcha',
            timeout: 16000,
        },
        error: function () {
            alert("error");
        },
        success: function (data) {
            var rsp = JSON.parse(data);
            captchaHash = rsp.CAPTCHAHASH;
            varsrc = 'data:image/png;base64,' + rsp.CAPTCHA;
            $('#TestBox').val(varsrc);
            $("#cimg").attr("src", varsrc);
        }
    });
    return false;
}
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}