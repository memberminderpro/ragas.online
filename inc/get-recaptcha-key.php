<?php

header('Content-Type: application/json');

// Ensure that WordPress functions are available
require_once($_SERVER['DOCUMENT_ROOT'].'/wp-load.php');

function get_recaptcha_site_key() {
    $settings = get_option('mmp_custom_form_settings');
    $site_key = $settings['mmp_custom_form_recaptcha_site_key'];
    echo json_encode(['site_key' => $site_key]);
    wp_die();
}

get_recaptcha_site_key();