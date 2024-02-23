
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
        let captchaSolved = false;

        const $emailDiv = $("#EMailDiv");
        const $send = $("#Send");
        const $hcSend = $(".captcha-send");

        // Function to handle showing/hiding captcha and submit button based on consent
        function toggleCaptchaAndButton() {
            if ($("#Consent").is(":checked")) {
                $(".captcha-send").show(); // Show captcha
                if (captchaSolved) {
                    $("#Send").show().prop("disabled", false); // Show and enable submit button if captcha is solved
                } else {
                    $("#Send").hide(); // Otherwise, keep the submit button hidden
                }
            } else {
                $(".captcha-send").hide(); // Hide captcha and submit button if consent is not checked
                $("#Send").hide();
            }
        }

        // Consent checkbox change event
        $("#Consent").change(function() {
            toggleCaptchaAndButton(); // Call the function to toggle captcha and button based on consent
        });

        // Define the onCaptchaSuccess function to handle captcha success
        window.onCaptchaSuccess = function(token) {
            captchaSolved = true; // Set flag to true when captcha is solved
            if ($("#Consent").is(":checked")) {
                $("#Send").show().prop("disabled", false); // Show and enable submit button
            }
        };

        $("#prtapp").click(function() {
            console.log("print")
            $("#PrintContent").printThis();
            return false;
        });

        $send.click(async function(event) {
            if (!captchaSolved) {
                event.preventDefault(); // Prevent form submission if captcha not solved
                alert("Please complete the captcha challenge.");
                return;
            } else {
                console.log("Captcha solved, proceeding with form submission.");            
                // Serialize form data for AJAX submission
                let formData = $("#joinForm").serialize();
            
                // Prepare data for the WordPress AJAX request, including the action
                let ajaxData = formData + '&action=verify_hcaptcha_and_submit';
            
                $.ajax({
                    url: '/wp-admin/admin-ajax.php', // Direct path to admin-ajax.php
                    type: 'POST',
                    data: ajaxData,
                    dataType: 'json', // Expecting JSON response
                    success: function(validationResponse) {
                        if (validationResponse.success) {
                            // hCaptcha validation succeeded, enable the submit button
                            $('#Send').prop('disabled', false);

                            // Dynamically update the UI with the redirection message
                            $('#messageContainer').html("<h4>Thank You!</h4><p>You will now be redirected to our payment gateway in a new window to complete the process. You may safely navigate away from this page or close this tab.</p>");

                            // Temporarily disable captcha response fields
                            $('input[name="g-recaptcha-response"], input[name="h-captcha-response"]').prop('disabled', true);

                            // Serialize and log the form data for inspection
                            let formData = $("#joinForm").serialize();

                            console.log("Form data being sent: ", formData);

                            // Optionally, confirm with the developer if they want to continue
                            let shouldContinue = confirm("Do you want to proceed with form submission with the above data?");
                            if (!shouldContinue) {
                                return; // Stop if not proceeding
                            }

                            // Directly submit the form to the original action endpoint
                            $("#joinForm").attr("target", "_blank").hide().submit();

                        } else {
                            // Handle hCaptcha validation failure
                            alert('Captcha validation failed.');
                        }
                    },
                    error: function() {
                        // Handle AJAX request error
                        alert('AJAX request failed.');
                    }
                });
            }
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
                    $hcSend.hide();
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
    });