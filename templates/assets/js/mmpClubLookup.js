
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