
var captchaHash = '';
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
// alert("ready");

DisplayCaptcha()

$("#redoCaptcha").click(function() {
console.log("redoCaptcha")
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
console.log ("print")
$("#PrintContent").printThis();
return false;
});

$("#Send").click(function() {

var id = $("#MCY").val( ); // Get MemberTypeID|Cost|Years
var arrTmp = id.split("|"); // use "|" to separate
var mtid = arrTmp[0]; // Get the 1st parm - membertypeid
$("#MemberTypeID").val(mtid); // set the membertypeid in the form

$("#Send").hide();
var f = $("#form").serialize();
if ( $("#form").valid() ) {
try {
console.log (f);
console.log ("captchaHash="+captchaHash);
console.log ("captchaCode="+$('#captchaCode').val());
$.ajax({
type: "POST",
url: "https://www.emembersdb.com/CFC/Captcha.cfc",
data: {
method: 'chkCaptcha',
captchaHash: captchaHash,
captchaCode: $('#captchaCode').val(),
timeout: 8000
},
error: function(){
alert("error");
},
success: function(data) {
var rsp = JSON.parse(data);
if (rsp.SUCCESS == false) {
$('#captchaError').html(rsp.ERROR);
$('#captchaError').show();
$("#Send").show();
}
else {
$('#captcha').html('');
$('#captchaError').hide();
$("#Step1").hide();
$("#wait").show();
$("#Send").hide();
document.form.submit();
/*
$.ajax({
type: 'POST',
url: 'https://iMembersdb.net:9400/API/Membership/Member?api_key='+$("#APIKey").val(),
data: f,
error: function(jqXHR, textStatus, errorThrown) {
$("#wait").hide();
$("#Step1").show();
$("#Send").show();
alert("Could not submit new member form: "+textStatus+" Error: "+errorThrown);
},
success: function (data) {
var obj = $.parseJSON(JSON.stringify(data));
if (!obj.STATUS) {
$("#Step1").hide();
$("#ErrorDiv").html( obj.MESSAGE );
$("#Step1").show();
$("#Step2").show();
$("#wait").hide();
}
else {
$("#UserID").val( obj.USERID );
$("#Send").hide();
document.form.submit();
}
}
});
*/
}
}
});
}
catch(error) {
alert("Could not submit form.")
$("#Send").show();
}
}
else {
alert("Some required fields were not entered")
$("#Send").show();
}
});

$( "#Email" ).change(function() {
console.log( "Handler for email .change() called." );
$.ajax({
url: 'https://www.emembersdb.com/Lookup/EMailCheck.cfm',
//url: 'http://emdb.com/Lookup/EMailCheck.cfm',
type: "POST",
dataType: 'json',
data: {
AccountID: $("#AccountID").val(),
Email: $(this).val(),
IsActive: 'Y' // Search for active subscriptions
}
}).done( function( data ) {
console.log (data)
if (data == 1) {
$("#EMailDiv").show();
$("#EMailDiv").html("This email is already in the system associated with a membership.<BR>Please email membership at " + $("#AccountEMail").val() + " to change your membership type.");
$("#Send").hide();
console.log ("EMail found")
}
else {
$("#EMailDiv").hide();
console.log ("EMail NOT found")
}
});

});

$( "#fkclubtype" ).change(function() {
console.log( "Handler for membertype .change() called." );
var mt = $(this).val()
console.log (mt)
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

$('.CountryLookup').on('select2:select', function (e) {
var data = e.params.data;
console.log(data)
console.log("id="+data.id) // countrycode
console.log("country="+data.text) // countryname
console.log("cnt="+data.cnt) // count of states
$("#CountryCode").val( data.id ) // countrycode
if ( data.cnt == 0)
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
data: function (params) {
var query = {
term: params.term
}
return query;
}
},
results: function (data) {
results = [];
$.each(data, function(index, item){
results.push({
id: item.id,
text: item.text
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
console.log("id="+data.id) // statecode
console.log("StateProv="+data.text) // StateProv
$("#StateCode").val( data.statecode ) // statecode
$("#fkstateprov").val( data.text ) // StateProv
$("#ProvOrOther").val( data.province ) // Province
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
data: function (params) {
var country = $("#fkcountry").val(); // countrycode
console.log ("country="+country);
if ( country.length == 0 ){
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
results: function (data) {
results = [];
$.each(data, function(index, item){
results.push({
id: item.id,
text: item.text
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

$('.ClubLookupInZone').on('select2:select', function (e) {
console.log("ClubLookup change")
var data = e.params.data;
console.log(data)

$("#fkdistrict").val( data.districtid ) // DistrictID
$("#zonename").val( data.zonename ) // zonename
$("#ClubID").val( data.id ) // iMembersDB ClubID
$("#fkclubname").val( data.text ) // fkclubNmae
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
term: params.term
}
return query;
}
},
results: function (data) {
results = [];
// console.log (data);
$.each(data, function(index, item){
results.push({
id: item.id,
text: item.text
});
});
return {
results: results
};
},
createTag: function (params) {
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
}
catch(error) {
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
}
catch(error) {
alert("Could not submit form.")
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
error: function(){
alert("error");
},
success: function(data) {
var rsp = JSON.parse(data);
captchaHash = rsp.CAPTCHAHASH;
// $('#captcha').html('<img src="data:image/png;base64,'+rsp.CAPTCHA + '"> <a href="#" onclick="return DisplayCaptcha();"> <i class="fa fa-redo-alt fa-lg" style="margin-left: 10px; vertical-align:12px; padding: 10px; border: 1px solid grey; background-color: ghostwhite;"></i></span><br/>');
$('#captcha').html('<img src="data:image/png;base64,'+rsp.CAPTCHA + '"> <a href="#" onclick="return DisplayCaptcha();"> <img src="https://www.emembersdb.com/Images/refresh.png" style="height: 40px; margin-left: 10px; vertical-align:0px; padding: 10px; border: 1px solid grey; background-color: ghostwhite;"></i></span><br/>');

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