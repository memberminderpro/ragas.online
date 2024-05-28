<?php

// Verify Google reCAPTCHA
function verify_recaptcha($captchaResponse, $remoteip) {
    $settings = get_option('mmp_custom_form_settings');
    $secretKey = $settings['mmp_custom_form_recaptcha_secret_key'];
    $verifyURL = "https://www.google.com/recaptcha/api/siteverify";

    $args = array(
        'body' => array(
            'secret' => $secretKey,
            'response' => $captchaResponse,
            'remoteip' => $remoteip
        )
    );

    error_log('Sending Google reCAPTCHA verification request: ' . print_r($args, true));
    $response = wp_remote_post($verifyURL, $args);

    // Error handling and response processing
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        error_log("Google reCAPTCHA verification failed: $error_message");
        return "Something went wrong: $error_message";
    } else {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body);
        if (isset($data->success) && $data->success) {
            error_log('Google reCAPTCHA verification succeeded');
            return true;
        } else {
            $error_codes = isset($data->{'error-codes'}) ? implode(', ', $data->{'error-codes'}) : 'No error codes returned';
            error_log('Google reCAPTCHA verification failed: ' . $error_codes);
            return false;
        }
    }
}

// Handle form submission and captcha verification
add_action('wp_ajax_nopriv_verify_and_submit_captcha', 'handle_captcha_form_submission');
add_action('wp_ajax_verify_and_submit_captcha', 'handle_captcha_form_submission');

function handle_captcha_form_submission() {
    error_log('handle_captcha_form_submission called'); // Add this line

    $remoteip = $_SERVER['REMOTE_ADDR']; // User's IP address

    if (!empty($_POST['g-recaptcha-response'])) {
        // Handle Google reCAPTCHA verification
        error_log('Processing Google reCAPTCHA response');
        $captcha_response = $_POST['g-recaptcha-response'];
        $verification_result = verify_recaptcha($captcha_response, $remoteip);
    } else {
        // No captcha response was submitted
        error_log('Captcha response is missing.');
        wp_send_json_error(array('message' => 'Captcha response is missing.'));
        wp_die();
    }

    // Proceed based on the verification result
    if ($verification_result === true) {
        error_log('Captcha verified successfully');
        wp_send_json_success();
    } else {
        error_log('Captcha verification failed');
        wp_send_json_error(array('message' => 'Captcha verification failed.'));
    }

    wp_die(); // Terminate immediately and return a proper response
}
