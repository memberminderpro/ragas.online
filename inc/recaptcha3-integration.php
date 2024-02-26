<?php 

function verify_recaptcha($token, $remoteip) {
    $secret = 'YOUR_SECRET_KEY'; // Replace with your reCAPTCHA secret key
    $response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
        'body' => [
            'secret' => $secret,
            'response' => $token,
            'remoteip' => $remoteip
        ]
    ]);

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    return $data;
}

add_action('wp_ajax_nopriv_submit_form', 'handle_form_submission'); // For non-logged-in users
add_action('wp_ajax_submit_form', 'handle_form_submission'); // For logged-in users

function handle_form_submission() {
    $recaptcha_response = $_POST['g-recaptcha-response'];
    $remoteip = $_SERVER['REMOTE_ADDR'];

    $verification = verify_recaptcha($recaptcha_response, $remoteip);
    if ($verification['success']) {
        // The reCAPTCHA was successfully verified
        // Proceed with your form processing logic here
    } else {
        // reCAPTCHA verification failed
        wp_send_json_error('reCAPTCHA verification failed');
    }

    // Make sure to end script execution for AJAX handlers
    wp_die();
}
