<?php

// Verify hCaptcha
function verify_hcaptcha($captchaResponse, $remoteip) {
    $secretKey = HCAPTCHA_SECRET_KEY; // Ensure this is defined in wp-config.php
    $verifyURL = "https://hcaptcha.com/siteverify";

    $args = array(
        'body' => array(
            'secret' => $secretKey,
            'response' => $captchaResponse,
            'remoteip' => $remoteip
        )
    );

    // Debugging: Log data being sent for verification
    error_log('Sending hCaptcha verification request: ' . print_r($args, true));

    $response = wp_remote_post($verifyURL, $args);

    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        // Debugging: Log any errors encountered during the request
        error_log('hCaptcha request error: ' . $error_message);
        return "Something went wrong: $error_message";
    } else {
        $body = wp_remote_retrieve_body($response);
        // Debugging: Log the response body for inspection
        error_log('hCaptcha verification response: ' . $body);
        
        $data = json_decode($body);
        if ($data->success) {
            return true;
        } else {
            // Debugging: Log failure details
            error_log('hCaptcha verification failed: ' . print_r($data, true));
            return false;
        }
    }
}

// Verify Google reCAPTCHA
function verify_recaptcha($captchaResponse, $remoteip) {
    $secretKey = RECAPTCHA_SECRET_KEY; // Define this in wp-config.php
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

    // Similar error handling and response processing as verify_hcaptcha
    if (is_wp_error($response)) {
        $error_message = $response->get_error_message();
        return "Something went wrong: $error_message";
    } else {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body);
        if (isset($data->success) && $data->success) {
            error_log('Google reCAPTCHA verification succeeded');
            return true;
        } else {
            error_log('Google reCAPTCHA verification failed: ' . (isset($data->{'error-codes'}) ? implode(', ', $data->{'error-codes'}) : 'No error codes returned'));
            return false;
        }
    }
}

// Adjusted form submission handler to check for both hCaptcha and reCAPTCHA responses
add_action('wp_ajax_nopriv_verify_and_submit_captcha', 'handle_captcha_form_submission');
add_action('wp_ajax_verify_and_submit_captcha', 'handle_captcha_form_submission');

function handle_captcha_form_submission() {
    $remoteip = $_SERVER['REMOTE_ADDR']; // User's IP address

    if (!empty($_POST['h-captcha-response'])) {

        error_log('Processing hCaptcha response');

        // Handle hCaptcha verification
        $captcha_response = $_POST['h-captcha-response'];
        $verification_result = verify_hcaptcha($captcha_response, $remoteip);
    } elseif (!empty($_POST['g-recaptcha-response'])) {

        error_log('Processing Google reCAPTCHA response');

        // Handle reCAPTCHA verification
        $captcha_response = $_POST['g-recaptcha-response'];
        $verification_result = verify_recaptcha($captcha_response, $remoteip);
    } else {
        // No captcha response was submitted
        error_log('Captcha response is missing');
        wp_send_json_error(array('message' => 'Captcha response is missing.'));
        wp_die();
    }

    // Proceed based on the verification result
    if ($verification_result === true) {
        error_log('Captcha verified successfully');
        // Form submission logic
        wp_send_json_success(array('message' => 'Captcha verified, form submitted successfully.'));
    } else {
        error_log('Captcha verification failed');
        wp_send_json_error(array('message' => 'Captcha verification failed.'));
    }

    wp_die(); // This is required to terminate immediately and return a proper response
}
