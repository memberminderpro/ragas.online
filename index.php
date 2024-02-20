<?php 

/** NOTE: This form is used to sign up new members for RAGAS.online.
* It is a modified version of the ESRAG form located at
* https://esrag.org/subscriptions/?mtid=501
*
* Production Link: https://ragas.online/join-us/
* 
* Source control is managed by the RAGAS.online GitHub repository
* https://github.com/memberminderpro/ragas.online
* 
* @name NewMember-Signup
* @version 04/18/2023 - Adapted from ESRAG
* @version 04/21/2023 - MCY stores membertype,cost,years CSS fmting
* @version 02/20/2024 - Refactored to use hCaptcha for spam protection
*/

/** IMPORTANT: Do not include these PHP comment block when copying this code to the
* WordPress page editor. It is for development documentation purposes only.
* Retain the HTML comment below for documentation to include in the WordPress page editor.
 */
?>

<!-- NOTE: This form is used to sign up new members for RAGAS.online 
    using the iMembersDB membership management system. For version 
    history, development notes,and additional documentation, visit 
    https://github.com/memberminderpro/ragas.online

    For more information or support contact Member Minder Pro, LLC
    at support@memberminderpro.com or visit https://memberminderpro.com
 -->

<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/fontawesome.min.css" rel="stylesheet" crossorigin="anonymous" />
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" crossorigin="anonymous"  />
<style>
    .entry {
        height: 30px;
    }

    .error {
        color: red
    }

    .TDData {
        font-size: 13px;
        margin: 0px;
        padding: 0px;
    }

    .thc {
        text-align: center;
    }

    .tdc {
        text-align: center;
    }

    input,
    select {
        border: 1px solid #444;
        border-radius: 4px;
        height: 22px;
    }

    input.error {
        border: 2px solid red;
    }

    .error {
        padding-left: 10px;
        color: red;
        font-size: 11px;
        font-family: Tahoma, Geneva, sans-serif;
        font-weight: bold;
    }

    .membercategorywrap {
        min-width: 200px;
        float: left;
        padding-bottom: 3px;
        white-space: nowrap;
        margin-right: 10px;
    }

    .star {
        color: red;
        font-weight: bold;
    }
</style>
<script type="text/javascript">
    $(document).ready(function() {
        alert("Top of document script is ready");
    });
</script>
<div id="Step1">
    <h3>Join Us!</h3>
    <form id="form" name="form" Action="https://www.emembersdb.com/nm/custom.cfm" method="Post">
        <!-- These parameters MUST be changed for each account membership application -->
        <input type="hidden" name="AccountID" value="10621" id="AccountID" /> <!-- Account -->
        <input type="hidden" name="APIKey" value="72a929802e4f44a0beea7c69aaf795da" id="APIKey" /> <!-- APIKey -->
        <input type="hidden" name="BID" value="1040" id="BID" /> <!-- Account -->
        <input type="hidden" name="MemberID" value="0" /> <!-- Default MemberID -->
        <input type="hidden" name="UserID" value="0" id="UserID" /><!-- UserID -->
        <input type="hidden" name="AddressTypeID" value="1" /> <!-- Default Address type -->
        <input type="hidden" name="EmailTypeID" value="1" /> <!-- Default Email type -->
        <input type="hidden" name="UserStatusCode" value="P" /> <!-- DefaultUser Status -->
        <input type="hidden" name="MemberTypeID" value="587" id="MemberTypeID" /> <!-- Default MemberTypeID -->
        <!-- <input type="hidden" name="AccountEmail" value="membership@RAGAS.online" id="AccountEMail" /> Who gets the application -->
        <input type="hidden" name="AccountEmail" value="rob.moore@memberminderpro.com" id="AccountEMail" />
        <input id="fkclubname" type="hidden" name="fkclubname" value=""> <!--- FK reference in iMembersDB Region(Club) tab --->
        <input id="fkdistrict" type="hidden" name="fkdistrict" value="0"> <!--- FK reference in iMembersDB Region(Club) tab --->
        <input id="Region" type="hidden" name="Region" value="0">
        <input id="zonename" type="hidden" name="zonename" value="">
        <input id="ClubID" type="hidden" name="ClubID" value="989153">

        <div id="PrintContent">
            <table border="0" cellpadding="3" cellspacing="0">
                <tbody>
                    <tr>
                        <td align="center">
                            <span style="font-size:24px; font-family:Tahoma, Geneva, sans-serif; font-weight:bold;">YES! I would like to join RAGAS</span><br>
                            <span style="font-size:14px; font-family:Tahoma, Geneva, sans-serif; font-weight:bold;">(Information provided will be used strictly for RAGAS use unless otherwise instructed)<br />
                                <!--- <span style="font-size:14px;font-family:Tahoma, Geneva, sans-serif;font-weight:bold"><i>(If you are a returning member please log into your account to renew your membership.)</i> <a href="http://www.imembersdb.com" target="_blank" rel="noopener">iMembersDB Login</a> </span><br /> --->
                            </span>
                            <br />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table border="0" cellpadding="3" cellspacing="0">
                <tbody>
                    <tr>
                        <td align="center">
                            <div>
                                <span style="font-size:13px; font-family:Tahoma, Geneva, sans-serif;font-weight:normal;"><u><em>Applicants are asked to complete the following information.</em></u> Starred items(*) are required.</span><br />
                                <span style="font-size:13px; font-family:Tahoma, Geneva, sans-serif;font-weight:normal;">After completing this form, click ‘Submit’.
                                    A copy of this application will be emailed to you. Or you can also print this form and mail it to the address below.
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <br />
            <table border="0" cellpadding="3" cellspacing="0" style="padding-top:12px">
                <tbody>
                    <tr>
                        <td align="left"><span style="font-size:14px; font-family:Tahoma, Geneva, sans-serif; font-weight:bold;color: #FF0000;">Member Information: </span></td>
                    </tr>
                </tbody>
            </table>

            <table border="0" cellpadding="0" cellspacing="0">
                <tbody>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Member Type: </td>
                        <td class="TDData">
                            <select id="MCY" name="MCY" style="width: 350px; height: 30px; color: #444" class="TxtIn">
                                <option value="588|75|5"> 5-Year Membership ($75.00 USD)</option>
                                <option value="587|30|1"> 1-Year Annual ($30.00 USD)</option>
                                <option value="589|15|1"> 1-Year Rotaractor/Peace Fellow ($15.00 USD)</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> First Name: </td>
                        <td class="TDData"><input class="entry" id="FirstName" type="text" maxlength="32" name="FirstName" value="" onkeypress="return noEnter(event)" required size="32" placeholder="First Name" /></td>
                    </tr>

                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Last Name: </td>
                        <td class="TDData"><input class="entry" id="LastName" type="text" maxlength="32" name="LastName" value="" style="height: 25px;" onkeypress="return noEnter(event)" required size="32" placeholder="Last Name" /></td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Email Address </td>
                        <td class="TDData"><input class="entry" id="Email" type="text" maxlength="64" name="email" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="32" required placeholder="EMail Address" />
                            <div id="EMailDiv" style="display: none; color: red">This email is already in the system. Please email membership at membership@RAGAS.org to change your membership type.</div>
                        </td>
                    </tr>

                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Are you a: </td>
                        <td class="TDData">
                            <select id="fkclubtype" name="fkclubtype" style="width: 350px; height: 30px; color: #444" class="TxtIn">
                                <option value="Rotary Club"> Rotarian</option>
                                <option value="Rotaract Club"> Rotaractor</option>
                                <option value="Non-Rotarian"> Non-Rotarian / Peace Fellow</option>
                            </select>
                            <input id="fkmembertype" type="hidden" name="fkmembertype" value="Active"> <!--- FK reference in iMembersDB Region(Club) tab --->
                        </td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Club Country: </td>
                        <td class="TDData">
                            <select id="fkcountry" name="fkcountry" style="width: 300px;" class="TxtIn CountryLookup"> </select>
                        </td>
                    </tr>
                    <tr id="staterow">
                        <td class="TDData" width="170"><span class="star">*</span> State/Province: </td>
                        <td class="TDData">
                            <select id="stateprov" name="stateprov" style="width: 300px;" class="TxtIn StateProvLookup"></select>
                            <input id="fkstateprov" type="hidden" name="fkstateprov" value=""> <!--- FK reference in iMembersDB Region(Club) tab (not currently used) --->
                        </td>
                    </tr>
                    <tr class="hide9">
                        <td class="TDData" width="170"><span style="color: red; font-weight: bold;">*</span> Club Name: </td>
                        <td class="TDData">
                            <select id="clubname" type="text" name="clubname" style="width: 400px;" class="TxtIn ClubLookupInZone"></select>
                            <div id="ClubLocDiv"></div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" style="padding-top:12px">
                <tbody>
                    <tr>
                        <td align="left"><span style="font-size:14px; font-family:Tahoma, Geneva, sans-serif; font-weight:bold; color: #FF0000;">Billing Address: </span></td>
                    </tr>
                </tbody>
            </table>

            <table border="0" cellpadding="3" cellspacing="0">
                <tbody>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> Address1: </td>
                        <td class="TDData"><input class="entry" id="Address1" type="text" maxlength="50" name="Address1" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="50" type="text" value="" required placeholder="Street Address" /> (Address)</td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170">Address2: </td>
                        <td class="TDData"><input class="entry" id="Address2" type="text" maxlength="50" name="Address2" style="height: 25px;" onkeypress="return noEnter(event)" size="50" placeholder="Ste / Suite" /> (Ste/Suite)</td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170"><span class="star">*</span> City: </td>
                        <td class="TDData"><input class="entry" id="City" type="text" maxlength="50" name="City" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="50" required placeholder="City" /></td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170">State Code: </td>
                        <td class="TDData"><input class="entry" id="StateCode" type="text" maxlength="3" name="StateCode" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="3" /></td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170">Province: </td>
                        <td class="TDData"><input class="entry" id="ProvOrOther" type="text" maxlength="20" name="ProvOrOther" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="20" placeholder="Province" /></td>
                    </tr>
                    <tr>
                        <td class="TDData" width="170">Country Code: </td>
                        <td class="TDData">
                            <input class="entry" id="CountryCode" type="text" maxlength="3" name="CountryCode" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="3" required />
                            <input class="entry" id="CountryName" type="hidden" maxlength="3" name="CountryName" value="" />
                        </td>
                    </tr>
                    <tr class="hide25">
                        <td class="TDData" width="170"><span class="star">*</span>Postal Code: </td>
                        <td class="TDData"><input class="entry" id="PostalZip" type="text" maxlength="12" name="PostalZip" value="" style="height: 25px;" onkeypress="return noEnter(event)" size="12" required placeholder="Zip / Postal Code" /></td>
                    </tr>

                </tbody>
            </table>
        </div>

        <div>
            <P> RAGAS and our membership management system vendor, Member Minder Pro, LLC, dba iMembersDB, is collecting your personal information in order to process your online application for RAGAS membership. The Registrant authorizes RAGAS to collect and use personal information about the Registrant for the purpose of receiving communications and the purposes described in the RAGAS policies relating to data privacy - RAGAS.online/privacy. Permission may be withdrawn at any time by contacting RAGAS’s Privacy Officer at privacy@ragas.online. Please check the "I Consent" checkbox below to allow us to collect, use, and disclose your personal information as described above.</P>
            <BR><BR>
            <input id="Consent" type="checkbox" name="consent" value="1"> <strong>I Consent</strong><br />
        </div>
        <P class="noprint"><a href="" id="prtapp">Click here</a> to print.<br>
            <br>
            <input id="Send" type="button" name="Send" value="Submit Application" class="btn btn-warning noprint" style="display: none;">
    </form>
</div>

<div id="Step2" style="display:none;">
    <h3>Problem!</h3>
    <P>There was a system error creating your new membership. Please contact support to resolve this issue.</P>
    <P><BR />
    <div id="ErrorDiv"></div>
    </P>
    <BR>
</div>

<div id="wait" style="display: none;">
    <div style="margin-top:25px;" align="center">
        <div style="width: auto">
            <img src="https://www.emembersdb.com/Portal/images/tm.png" height="50"><BR>
            <h4 style="font-family:Tahoma, Geneva, sans-serif">Please wait... We are taking you over to Team Merchant</h4>
            <BR>
            <img src="https://www.emembersdb.com/images/loading.gif" height="30">
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js" defer></script>
<script>
    function noEnter(e) { // Do not allow Enter Key to cause submission
        var keycode;
        if (window.event)
            keycode = window.event.keyCode;
        else if (e)
            keycode = e.which;
        return !(keycode == 13);
    }

    var urlParms = getQueryParams(document.location.search);

    $(document).ready(function() {
        console.log("Lower custom script block ready");
        $("#Consent").click(function() {
            if ($(this).prop('checked') && $("#EMailDiv").is(":hidden")) {
                $(this).attr("checked", "checked");
                $("#Send").show();
            } else {
                $(this).prop("checked", false);
                $("#Send").hide();
            }
        });

        $("#prtapp").click(function() {
            console.log("print")
            $("#PrintContent").printThis();
            return false;
        });

        $("#Send").click(function() {

            var id = $("#MCY").val(); // Get MemberTypeID|Cost|Years
            var arrTmp = id.split("|"); // use "|" to separate
            var mtid = arrTmp[0]; // Get the 1st parm - membertypeid
            $("#MemberTypeID").val(mtid); // set the membertypeid in the form

            $("#Send").click(function() {
                var id = $("#MCY").val(); // Get MemberTypeID|Cost|Years
                var arrTmp = id.split("|"); // use "|" to separate
                var mtid = arrTmp[0]; // Get the 1st parm - membertypeid
                $("#MemberTypeID").val(mtid); // set the membertypeid in the form

                $("#Send").hide();
                var f = $("#form").serialize();
                if ($("#form").valid()) {
                    // Removed captcha-related console logs and AJAX call
                    $("#Step1").hide();
                    $("#wait").show();
                    $("#Send").hide();
                    document.form.submit();
                    // Note: Ensure any necessary adjustments to form submission logic here
                } else {
                    alert("Some required fields were not entered")
                    $("#Send").show();
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
                    Email: $(this).val(),
                    IsActive: 'Y' // Search for active subscriptions
                }
            }).done(function(data) {
                console.log(data)
                if (data == 1) {
                    $("#EMailDiv").show();
                    $("#EMailDiv").html("This email is already in the system associated with a membership.<BR>Please email membership at " + $("#AccountEMail").val() + " to change your membership type.");
                    $("#Send").hide();
                    console.log("EMail found")
                } else {
                    $("#EMailDiv").hide();
                    console.log("EMail NOT found")
                }
            });

        });

        $("#fkclubtype").change(function() {
            console.log("Handler for membertype .change() called.");
            var mt = $(this).val()
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
            var data = e.params.data;
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
                // url: 'http://emdb.com/Lookup/FKRotaryCountry.cfm',
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
            var data = e.params.data;
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
            var data = e.params.data;
            console.log(data)

            $("#fkdistrict").val(data.districtid) // DistrictID
            $("#zonename").val(data.zonename) // zonename
            $("#ClubID").val(data.id) // iMembersDB ClubID
            $("#fkclubname").val(data.text) // fkclubNmae
            $("#ClubLocDiv").html("Distict: " + data.districtid + "   RAGAS zone: " + data.zonename)

        });

        $('.ClubLookupInZone').select2({
            placeholder: 'Rotary Club',
            tags: true,
            ajax: {
                url: 'https://www.emembersdb.com/Lookup/FKRotaryClubInZone.cfm',
                // url: 'http://emdb.com/Lookup/FKRotaryClubInZone.cfm',
                type: "POST",
                dataType: 'json',
                quietMillis: 100,
                data: function(params) {
                    var countrycode = $(".CountryLookup option:selected").val();
                    var statecode = $("#StateCode").val();
                    var orgtype = $("#fkclubtype").val();
                    console.log("countrycode=" + countrycode + " statecode=" + statecode + " orgtype=" + orgtype);
                    var query = {
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
                // console.log (data);
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

        $("#paycc").click(function() {
            var f = $("#form2").serialize();
            var url = 'https://emembersdb.com/Portal/pbcc.cfm';
            //var url = 'http://Localhost/emembersdb/Portal/pbcc.cfm';

            try {
                $('#form2').attr('action', url);
                $('#form2').submit();
            } catch (error) {
                alert("Could not submit form.")
            }
        });

        $("#payck").click(function() {
            var f = $("#form2").serialize();
            var url = 'https://emembersdb.com/Portal/pbck.cfm';
            //var url = 'http://Localhost/emembersdb/Portal/pbck.cfm';

            try {
                $('#form2').attr('action', url);
                $('#form2').submit();
            } catch (error) {
                alert("Could not submit form.")
            }
        });
    });
});
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

</script>
