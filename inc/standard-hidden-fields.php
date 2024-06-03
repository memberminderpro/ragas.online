<?php
function get_standard_hidden_fields() {
    return array(
        array(
            'name' => 'AccountID',
            'default_value' => '10614',
        ),
        array(
            'name' => 'ClubID',
            'default_value' => '989121',
        ),
        array(
            'name' => 'memberid',
            'default_value' => '0',
        ),
        array(
            'name' => 'UserID',
            'default_value' => '0',
        ),
        array(
            'name' => 'AddressTypeID',
            'default_value' => '1',
        ),
        array(
            'name' => 'EmailTypeID',
            'default_value' => '1',
        ),
        array(
            'name' => 'MemberTypeID',
            'default_value' => '504',
        ),
        array(
            'name' => 'UserStatusCode',
            'default_value' => 'P',
        ),
        array(
            'name' => 'AccountEmail',
            'default_value' => 'membership@esrag.org',
        ),
        array(
            'name' => 'FormType',
            'default_value' => 'Newsletter',
        ),
        array(
            'name' => 'MCY',
            'default_value' => '504|0|99',
        ),
        array(
            'name' => 'FKClubName',
            'default_value' => '',
        ),
        array(
            'name' => 'Address1',
            'default_value' => '(tbd)',
        ),
        array(
            'name' => 'StateCode',
            'default_value' => '',
        ),
        array(
            'name' => 'ProvOrOther',
            'default_value' => '',
        ),
        array(
            'name' => 'CountryCode',
            'default_value' => '',
        ),
    );
}
