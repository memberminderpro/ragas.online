jQuery(document).ready(function($) {
    // Function to set specific IDs for fields
    function setFieldIDs() {
        // WPForms
        $('.firstname-field input').attr('id', 'firstname');
        $('.lastname-field input').attr('id', 'lastname');
        $('.email-field input').attr('id', 'Email');
        $('.country-field select').attr('id', 'fkcountry');
        $('.state-field select').attr('id', 'fkstateprov');
        
        // Gravity Forms - Set IDs for subfields of the Name field
        $('input.firstname-field').attr('id', 'firstname');
        $('input.lastname-field').attr('id', 'lastname');
        $('input.email-field').attr('id', 'Email');
        $('select.country-field').attr('id', 'fkcountry');
        $('select.state-field').attr('id', 'fkstateprov');

        // Gravity Forms - Specific handling for Name field subfields
        $('.gfield_name_first input').attr('id', 'firstname');
        $('.gfield_name_last input').attr('id', 'lastname');
    }

    // Function to load countries
    function loadCountries() {
        return $.ajax({
            url: 'https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm',
            type: "POST",
            dataType: 'json',
            success: function(data) {
                let countrySelect = $('#fkcountry');
                countrySelect.empty();
                $.each(data, function(index, item) {
                    countrySelect.append(new Option(item.text, item.id));
                });
            }
        });
    }

    // Function to load states based on selected country
    function loadStates(countryCode) {
        return $.ajax({
            url: 'https://www.emembersdb.com/Lookup/FKRotaryStateProv.cfm',
            type: "POST",
            dataType: 'json',
            data: { countrycode: countryCode },
            success: function(data) {
                let stateSelect = $('#fkstateprov');
                stateSelect.empty();
                $.each(data, function(index, item) {
                    stateSelect.append(new Option(item.text, item.id));
                });
                if (data.length > 0) {
                    stateSelect.closest('.form-field, .gfield').show();
                } else {
                    stateSelect.closest('.form-field, .gfield').hide();
                }
            }
        });
    }

    // Function to check if email exists
    function checkEmail(email) {
        return $.ajax({
            url: 'https://www.emembersdb.com/Lookup/EMailCheck.cfm',
            type: "POST",
            dataType: 'json',
            data: {
                AccountID: $('input[name="AccountID"]').val(),
                Email: email,
                IsActive: 'N'
            },
            success: function(data) {
                if (data == 1) {
                    $('#email-error').show().text('This email is already in the system. Please email membership@esrag.org to change your membership type.');
                    $('input[type="submit"], button[type="submit"]').hide();
                } else {
                    $('#email-error').hide();
                    $('input[type="submit"], button[type="submit"]').show();
                }
            }
        });
    }

    // Set field IDs on page load
    setFieldIDs();

    // Load countries on page load
    loadCountries();

    // Event listener for country change
    $(document).on('change', '#fkcountry', function() {
        let selectedCountry = $(this).val();
        loadStates(selectedCountry);
    });

    // Event listener for email change
    $(document).on('change', '#Email', function() {
        let email = $(this).val();
        checkEmail(email);
    });

    // Custom function to prevent form submission on Enter key
    $(document).on('keypress', 'form', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
});
