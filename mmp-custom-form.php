<?php
/**
 * Plugin Name: MMP Custom Form
 * Description: A custom HTML form with multi-vendor captcha integration support
 * Version: 1.0
 * Author: Member Minder Pro, LLC
 */

// Create shortcode for rendering the form
function mmp_custom_form_script_shortcode() {
    // Enqueue external libraries
    wp_enqueue_style('mmp-custom-form-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/fontawesome.min.css');
    wp_enqueue_style('mmp-custom-form-select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
    wp_enqueue_script('jquery');
    wp_enqueue_script('mmp-custom-form-select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
    wp_enqueue_script('mmp-custom-form-jquery-validate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js', array('jquery'), null, true);
    script
    // Enqueue the CSS specific to this form
    // wp_enqueue_style('mmp-form-style', plugin_dir_url(__FILE__) . 'css/mmp-form.css');
    wp_enqueue_style('mmp-form-style', plugin_dir_url(__FILE__) . 'templates/custom/ragas.online/join-us/css/mmp-form.css');

    // First, enqueue custom JavaScript file
    // wp_enqueue_script('mmp-form-script', plugin_dir_url(__FILE__) . 'js/mmp-form.js', array('jquery'), 
    wp_enqueue_script('mmp-form-script', plugin_dir_url(__FILE__) . 'templates/custom/ragas.online/join-us/js/mmp-form.js', array('jquery'), null, true);

    // Then, localize it with global/environment variables
    $localization_array = array(
        'recaptcha_site_key' => defined('RECAPTCHA_SITE_KEY') ? RECAPTCHA_SITE_KEY : '',
        'hcaptcha_site_key' => defined('HCAPTCHA_SITE_KEY') ? HCAPTCHA_SITE_KEY : '',
    );
    wp_localize_script('mmp-form-script', 'captchaKeys', $localization_array);

    // Include the form HTML from an external file
    // $form_html = file_get_contents(plugin_dir_path(__FILE__) . 'templates/mmp-form.html');
    $form_html = file_get_contents(plugin_dir_path(__FILE__) . 'templates/custom/ragas.online/join-us/mmp-form.html');

    // Return the form HTML as part of the shortcode output
    return $form_html;
}
add_shortcode('mmp_custom_form', 'mmp_custom_form_script_shortcode');

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

    if (!empty($_POST['g-recaptcha-response'])) {
        // Handle Google reCAPTCHA verification
        error_log('Processing Google reCAPTCHA response');
        $captcha_response = $_POST['g-recaptcha-response'];
        $verification_result = verify_recaptcha($captcha_response, $remoteip);
    } elseif (!empty($_POST['h-captcha-response'])) {
        error_log('Processing hCaptcha response');
        // Handle hCaptcha verification
        $captcha_response = $_POST['h-captcha-response'];
        $verification_result = verify_hcaptcha($captcha_response, $remoteip);
    } else {
        // No captcha response was submitted
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

    wp_die(); // This is required to terminate immediately and return a proper response
}

