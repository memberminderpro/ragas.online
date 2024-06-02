<script>
var captchaHash = '';

$(document).ready(function() {
	// alert("ready");

	DisplayCaptcha()

	$("#redoCaptcha").click(function() {
		console.log("redoCaptcha")
		DisplayCaptcha()
	});

	$("#Send").click(function() {
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
							}
						else {
							$('#captcha').html('');
							$('#captchaError').hide();
							// alert("OK to Submit Form");
              $("#Send").hide();
							document.form.submit();
						}
					}
				});
			}
			catch(error) {
				alert("Could not submit form.")
			}
		}
		else {
			alert("Some required fields were not entered")
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
				Email:	   $(this).val(),
				IsActive:  'N'	// N=Search all Member types  prvent duplicate emails getting in
				}
		}).done( function( data ) {
			console.log (data)
			if (data == 1) {
				$("#EMailDiv").show();
				$("#EMailDiv").html("This email is already in the system.<BR>Please email membership at " + $("#AccountEMail").val() + " to change your membership type.");
				$("#Send").hide();
				console.log ("EMail found")
			}
			else {
				$("#EMailDiv").hide();
				$("#Send").show();
				console.log ("EMail NOT found")
			}
		});
	});

	$('.CountryLookup').on('select2:select', function (e) {
	    var data = e.params.data;
	    console.log(data)
	    console.log("id="+data.id)					// countrycode
	    console.log("country="+data.text)			// countryname
	    console.log("cnt="+data.cnt)				// count of states
		$("#CountryCode").val( data.id )			// countrycode
		if ( data.cnt == 0)
			$("#staterow").hide();
		else
			$("#staterow").show();
	});
	$('.CountryLookup').select2({
	 	placeholder:  'Select Country',
	 	//tags: 		  true,
	 	ajax: {
	 		url: 'https://www.emembersdb.com/Lookup/FKRotaryCountry.cfm',
	 	 	//url: 'http://emdb.com/Lookup/FKRotaryCountry.cfm',
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
	    console.log("id="+data.id)					// statecode
	    console.log("country="+data.text)			// StateProv
		$("#StateCode").val( data.statecode )		// statecode
		$("#ProvOrOther").val( data.province )		// Province
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

});

function SendEMail() {
	var f = $("#form").serialize();
	$.ajax({
		type: "POST",
		url: "https://www.emembersdb.com/Portal/ESRAG/Newsletter.cfm",
		//url: "http://emdb.com/Portal/ESRAG/Newsletter.cfm",
		data: f,
		error: function(){
			alert("error");
		},
		success: function(data) {
			$('#Step2').html( data );
			console.log ("new newsletter subscriber email sent")
		}
	});
	return false;
}

function DisplayCaptcha() {
	$.ajax({
		type: "POST",
		url: "https://emembersdb.com/CFC/Captcha.cfc",
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
			$('#captcha').html('<img decoding="async" src="data:image/png;base64,'+rsp.CAPTCHA + '"> <a href="#" onclick="return DisplayCaptcha();"> <i class="fa fa-redo-alt fa-lg" style="margin-left: 10px; vertical-align:12px; padding: 10px; border: 1px solid grey; background-color: ghostwhite;"></i></span><br />');
		}
	});
	return false;
}

function noEnter(e) { // Do not allow Enter Key to cause submission
var keycode;
if (window.event)
keycode = window.event.keyCode;
else if (e)
keycode = e.which;
return !(keycode == 13);
}
</script>