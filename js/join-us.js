function getQueryParams(qs) {
    let params = new URLSearchParams(qs);
    let result = {};
    params.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

function noEnter(e) {
    let keycode = e.which || e.keyCode; // Modern browsers support e.which
    if (keycode === 13) { // 13 is the Enter key
        e.preventDefault(); // Prevent form submission
    }
}

jQuery(document).ready(function($) {

    const $emailDiv = $("#EMailDiv");
    const $captchaSend = $(".captcha-send");
    const $consent = $("#Consent");
    const $joinForm = $("#joinForm");
    const $send = $("#Send");

    // Function to handle showing/hiding captcha and submit button based on consent
    function toggleCaptchaAndButton() {
        if ($consent.is(":checked")) {
            $captchaSend.show(); // Show captcha
            $send.show().prop("disabled", false); // Show and enable submit button if captcha is solved
        } else {
            $captchaSend.hide(); // Hide captcha and submit button if consent is not checked
            $send.prop("disabled", true);
        }
    }

    // Consent checkbox change event
    $consent.change(function() {
        toggleCaptchaAndButton(); // Call the function to toggle captcha and button based on consent
    });

    $send.click(async function(event) {


        // Serialize form data for AJAX submission
        let formData = $joinForm.serialize();
        // Log the form data for inspection
        console.log("Form data being sent: ", formData);

        // Optionally, confirm with the developer if they want to continue
        let shouldContinue = confirm("Do you want to proceed with form submission with the above data?");
        if (!shouldContinue) {
            return; // Stop if not proceeding
        }

        // Dynamically update the UI with the redirection message
        $('#messageContainer').html("<h4>Thank You!</h4><p>You will now be redirected to our payment gateway in a new window to complete the process. You may safely navigate away from this page or close this tab.</p>");

        // Submit form data to the form action URL
        // $joinForm.attr("target", "_blank").hide().submit();
        alert("Form data sent to server. Please check the console for the form data.");

    });

    $("#Email").change(function() {
        console.log("Handler for email .change() called.");
        $.ajax({
            url: 'https://www.emembersdb.com/Lookup/EMailCheck.cfm',
            type: "POST",
            dataType: 'json',
            data: {
                AccountID: $("#AccountID").val(),
                Email: $(this).val().trim(),
                IsActive: 'Y' // Search for active subscriptions
            }
        }).done(function(data) {
            console.log(data)
            if (data == 1) {
                $emailDiv.show();
                $emailDiv.html(`This email is already in the system associated with a membership.Please email membership at ${$("#AccountEMail").val()} to change your membership type.`);
                $captchaSend.hide();
                console.log("EMail found")
            } else {
                $emailDiv.hide();
                console.log("EMail NOT found")
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            $emailDiv.html("Error checking email. Please try again.").show();
            console.error("Email change AJAX request failed: " + textStatus, errorThrown);
        });
    });
    $("#fkclubtype").change(function() {
        console.log("Handler for membertype .change() called.");
        let mt = $(this).val()
        console.log(mt)
        switch (mt) {
            case 'Rotary Club':
                $(".hide9").show();
                $("#fkmembertype").val("Active");
                break;
            case 'Rotaract Club':
                $(".hide9").show();
                $("#fkmembertype").val("Rotaractor");
                break;
            case 'Non-Rotarian':
                $(".hide9").hide();
                $("#fkmembertype").val("Non-Rotarian");
                break;
        }
    });

    $('.CountryLookup').on('select2:select', function(e) {
        let data = e.params.data;
        console.log(data)
        console.log("id=" + data.id) // countrycode
        console.log("country=" + data.text) // countryname
        console.log("cnt=" + data.cnt) // count of states
        $("#CountryCode").val(data.id) // countrycode
        if (data.cnt == 0)
            $("#staterow").hide();
        else
            $("#staterow").show();
    });

    $('.CountryLookup').select2({
        placeholder: 'Select Country',
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function(params) {
                var query = {
                    term: params.term
                }
                return query;
            }
        },
        results: function(data) {
            results = [];
            $.each(data, function(index, item) {
                results.push({
                    id: item.id,
                    text: item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function(params) {
            return {
                id: params.term,
                text: params.term,
                newOption: true
            }
        }
    });

    $('.StateProvLookup').on('select2:select', function(e) {
        let data = e.params.data;
        console.log(data)
        console.log("id=" + data.id) // statecode
        console.log("StateProv=" + data.text) // StateProv
        $("#StateCode").val(data.statecode) // statecode
        $("#fkstateprov").val(data.text) // StateProv
        $("#ProvOrOther").val(data.province) // Province
    });

    $('.StateProvLookup').select2({
        placeholder: 'Select State or Province',
        tags: true,
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryStateProv.cfm',
            // url: 'http://emdb.com/Lookup/FKRotaryStateProv.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function(params) {
                var country = $("#fkcountry").val(); // countrycode
                console.log("country=" + country);
                if (country.length == 0) {
                    alert("select Country first!");
                    return '[]';
                }
                var query = {
                    countrycode: country,
                    AccountID: $("#AccountID").val(),
                    term: params.term
                }
                return query;
            }
        },
        results: function(data) {
            results = [];
            $.each(data, function(index, item) {
                results.push({
                    id: item.id,
                    text: item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function(params) {
            return {
                id: params.term,
                text: params.term,
                newOption: true
            }
        }
    });

    $('.ClubLookupInZone').on('select2:select', function(e) {
        console.log("ClubLookup change")
        let data = e.params.data;
        console.log(data)

        $("#fkdistrict").val(data.districtid) // DistrictID
        $("#zonename").val(data.zonename) // zonename
        $("#ClubID").val(data.id) // iMembersDB ClubID
        $("#fkclubname").val(data.text) // fkclubNmae
        $("#ClubLocDiv").html("District: " + data.districtid + "   RAGAS zone: " + data.zonename)

    });

    $('.ClubLookupInZone').select2({
        placeholder: 'Rotary Club',
        tags: true,
        ajax: {
            url: 'https://www.emembersdb.com/Lookup/FKRotaryClubInZone.cfm',
            type: "POST",
            dataType: 'json',
            quietMillis: 100,
            data: function(params) {
                let countrycode = $(".CountryLookup option:selected").val();
                let statecode = $("#StateCode").val();
                let orgtype = $("#fkclubtype").val();
                console.log("countrycode=" + countrycode + " statecode=" + statecode + " orgtype=" + orgtype);
                let query = {
                    AccountID: $("#AccountID").val(),
                    countrycode: countrycode,
                    statecode: statecode,
                    orgtype: orgtype,
                    term: params.term
                }
                return query;
            }
        },
        results: function(data) {
            results = [];
            $.each(data, function(index, item) {
                results.push({
                    id: item.id,
                    text: item.text
                });
            });
            return {
                results: results
            };
        },
        createTag: function(params) {
            return {
                id: params.id,
                text: params.text,
                newOption: true
            }
        }
    });

    $("#prtapp").click(function() {
        console.log("print")
        $("#PrintContent").printThis();
        return false;
    });
});