<?php

/**
 * Plugin Name: MMP Custom Form
 * Description: A custom HTML form with multi-vendor captcha integration support
 * Version: 1.1
 * Author: Member Minder Pro, LLC
 */

// Create a settings page for the plugin
require_once plugin_dir_path(__FILE__) . 'inc/admin-page.php';

// Create shortcode for rendering the form
function mmp_custom_form_script_shortcode()
{
    // Fetch settings
    $settings = get_option('mmp_custom_form_settings');
    $accountID = isset($settings['AccountID']) ? esc_attr($settings['AccountID']) : null;
    $bid = isset($settings['BID']) ? esc_attr($settings['BID']) : null;
    $recaptcha_site_key = isset($settings['mmp_custom_form_recaptcha_site_key']) ? $settings['mmp_custom_form_recaptcha_site_key'] : null;
    $account_email = isset($settings['AccountEmail']) ? $settings['AccountEmail'] : null;
    $default_member_type_id = isset($settings['DefaultMemberTypeID']) ? esc_attr($settings['DefaultMemberTypeID']) : null;
    $membership_cost = isset($settings['MembershipCost']) ? esc_attr($settings['MembershipCost']) : 100;
    $term = isset($settings['Term']) ? esc_attr($settings['Term']) : 1;

    // Localize script with configuration options
    $localization_array = array(
        'recaptcha_site_key' => $recaptcha_site_key,
        'account_ID' => $accountID,
        'BID' => $bid,
        'account_email' => $account_email,
        'default_member_type_id' => $default_member_type_id,
        'membership_cost' => $membership_cost,
        'term' => $term
    );

    // Check if options exist, otherwise enqueue the development script
    if (!$recaptcha_site_key || !$accountID || !$bid || !$account_email || !$default_member_type_id) {
        wp_enqueue_script('mmp-form-options', plugin_dir_url(__FILE__) . 'assets/js/mmpFormOptions.js', array(), null, true);

        // Add inline script to check if mmpFormOptions is defined
        wp_add_inline_script('mmp-form-options', '
            if (typeof mmpFormOptions !== "undefined") {
                mmpFormOptions = {
                    recaptcha_site_key: mmpFormOptions.recaptcha_site_key,
                    account_ID: mmpFormOptions.account_ID,
                    BID: mmpFormOptions.BID,
                    account_email: mmpFormOptions.account_email,
                    default_member_type_id: mmpFormOptions.default_member_type_id,
                    membership_cost: mmpFormOptions.membership_cost,
                    term: mmpFormOptions.term
                };
            } else {
                window.location.href = "' . admin_url('admin.php?page=mmp_custom_form') . '";
                alert("Please configure the MMP Custom Form settings.");
            }
        ');

        // Ensure that localized script can use the fallback options
        $localization_array = array(
            'recaptcha_site_key' => '<script>document.write(mmpFormOptions.recaptcha_site_key);</script>',
            'account_ID' => '<script>document.write(mmpFormOptions.account_ID);</script>',
            'BID' => '<script>document.write(mmpFormOptions.BID);</script>',
            'account_email' => '<script>document.write(mmpFormOptions.account_email);</script>',
            'default_member_type_id' => '<script>document.write(mmpFormOptions.default_member_type_id);</script>',
            'membership_cost' => '<script>document.write(mmpFormOptions.membership_cost);</script>',
            'term' => '<script>document.write(mmpFormOptions.term);</script>'
        );
    }

    // Enqueue external libraries
    wp_enqueue_style('mmp-custom-form-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/fontawesome.min.css');
    wp_enqueue_style('mmp-custom-form-select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
    wp_enqueue_script('jquery');
    wp_enqueue_script('mmp-custom-form-select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
    wp_enqueue_script('mmp-custom-form-jquery-validate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js', array('jquery'), null, true);
    wp_enqueue_script('google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . $recaptcha_site_key, array(), null, true);

    // Enqueue default styles and scripts
    wp_enqueue_style('mmp-form-style', plugin_dir_url(__FILE__) . "templates/assets/css/mmp-form.css");
    wp_enqueue_style('mmp-form-print-style', plugin_dir_url(__FILE__) . "templates/assets/css/mmp-form-print.css", array(), null, 'print');
    wp_enqueue_script('mmp-form-script', plugin_dir_url(__FILE__) . "templates/assets/js/mmp-form.js", array('jquery'), null, true);

    // Enqueue club lookup script after the DOM is fully loaded
    wp_enqueue_script('mmp-club-lookup', plugin_dir_url(__FILE__) . "templates/assets/js/mmpClubLookup.js", array('jquery', 'mmp-form-script'), null, true);

    // Validate and verify captcha responses
    require_once plugin_dir_path(__FILE__) . 'inc/captcha-verification.php';    // Build the base directory path for custom templates
    $base_dir = plugin_dir_path(__FILE__) . "templates/custom/{$accountID}/{$bid}/";

    // Conditionally enqueue custom styles and scripts if they exist
    $custom_css_exists = file_exists($base_dir . 'css/mmp-form-custom.css');
    $custom_js_exists = file_exists($base_dir . 'js/mmp-form-custom.js');

    if ($custom_css_exists) {
        wp_enqueue_style('mmp-form-custom-style', plugin_dir_url(__FILE__) . "templates/custom/{$accountID}/{$bid}/css/mmp-form-custom.css");
    }
    if ($custom_js_exists) {
        wp_enqueue_script('mmp-form-custom-script', plugin_dir_url(__FILE__) . "templates/custom/{$accountID}/{$bid}/js/mmp-form-custom.js", array('jquery'), null, true);
    }

    // Add inline script to log the inclusion of custom files
    wp_add_inline_script('mmp-form-script', '
        if (' . ($custom_css_exists ? 'true' : 'false') . ') {
            console.log("Custom CSS file loaded.");
        }
        if (' . ($custom_js_exists ? 'true' : 'false') . ') {
            console.log("Custom JS file loaded.");
        }
    ');

    wp_localize_script('mmp-form-script', 'mmpFormOptions', $localization_array);

    // Include the form HTML from an external file
    $form_html_path = $base_dir . 'mmp-form.html';
    if (file_exists($form_html_path)) {
        $form_html = file_get_contents($form_html_path);
    } else {
        $form_html = '<p>Form template not found. Please check the account ID and BID settings.</p>';
    }

    return $form_html;
}
add_shortcode('mmp_custom_form', 'mmp_custom_form_script_shortcode');
