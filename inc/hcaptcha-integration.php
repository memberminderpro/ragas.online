<?php
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

add_action('wp_ajax_nopriv_verify_hcaptcha_and_submit', 'handle_form_submission');
add_action('wp_ajax_verify_hcaptcha_and_submit', 'handle_form_submission');

function handle_form_submission() {
    if (!empty($_POST['h-captcha-response'])) {
        $captcha_response = $_POST['h-captcha-response'];
        $remoteip = $_SERVER['REMOTE_ADDR']; // User's IP address
        $verification_result = verify_hcaptcha($captcha_response, $remoteip);

        if ($verification_result === true) {
            // Proceed with your form submission logic, e.g., forward data to ColdFusion server
            wp_send_json_success(array('message' => 'Captcha verified, form submitted successfully.'));
        } else {
            wp_send_json_error(array('message' => 'Captcha verification failed.'));
        }
    } else {
        wp_send_json_error(array('message' => 'Captcha response is missing.'));
    }

    wp_die(); // This is required to terminate immediately and return a proper response
}
