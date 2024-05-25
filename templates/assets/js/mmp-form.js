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

    var debug = true; 
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

document.addEventListener('DOMContentLoaded', function () {
    // Log the mmpFormOptions object to the console
    console.log('MMP Form Options:', mmpFormOptions);

    // Your existing form handling code here
    // Example: Initialize select2
    if (typeof $.fn.select2 !== 'undefined') {
        $('.select2').select2();
    }

    // Example: Initialize jQuery validation
    if (typeof $.fn.validate !== 'undefined') {
        $('#mmp-form').validate({
            // Validation rules
        });
    }
});
