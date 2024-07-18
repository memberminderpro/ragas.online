<?php

/**
 * Plugin Name: MMP Custom Form
 * Description: A custom HTML form with multi-vendor captcha integration support
 * Version: 1.2.13.1
 * Author: Member Minder Pro, LLC
 */

function initialize_mmpcf_plugin()
{
    if (!function_exists('get_plugin_data')) {
        require_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }

    $plugin_data = get_plugin_data(__FILE__);
    $version = $plugin_data['Version'];

    define('MMPCF_PLUGIN_VERSION', $version);
    define('MMPCF_PLUGIN_URL', plugin_dir_url(__FILE__));
    define('MMPCF_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

initialize_mmpcf_plugin();

wp_enqueue_script("jquery");

// Create a settings page for the plugin
require_once MMPCF_PLUGIN_DIR . 'inc/admin-page.php';

// Enqueue admin styles and scripts
function mmp_custom_form_enqueue_admin_styles() {
    wp_enqueue_style('mmp-custom-form-admin', MMPCF_PLUGIN_URL . 'assets/css/admin.css', array(), MMPCF_PLUGIN_VERSION);
    wp_enqueue_script('mmp-custom-form-admin-js', MMPCF_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), MMPCF_PLUGIN_VERSION, true);
    
    // Localize script to pass plugin URL
    wp_localize_script('mmp-custom-form-admin-js', 'mmpcf', array(
        'pluginUrl' => MMPCF_PLUGIN_URL,
    ));
}
add_action('admin_enqueue_scripts', 'mmp_custom_form_enqueue_admin_styles');

// Enqueue front-end styles and scripts
function enqueue_mmp_custom_form_scripts() {
    wp_enqueue_style('mmp-form-style', MMPCF_PLUGIN_URL . 'templates/assets/css/mmp-form.css', array(), MMPCF_PLUGIN_VERSION);
    wp_enqueue_style('mmp-form-print-style', MMPCF_PLUGIN_URL . 'templates/assets/css/mmp-form-print.css', array(), MMPCF_PLUGIN_VERSION, 'print');

    wp_enqueue_style('mmp-custom-form-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/fontawesome.min.css');
    wp_enqueue_style('mmp-custom-form-select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
    wp_enqueue_script('mmp-custom-form-select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
    wp_enqueue_script('mmp-custom-form-jquery-validate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js', array('jquery'), null, true);

    // Fetch settings
    $settings = get_option('mmp_custom_form_settings');
    $localization_array = array(
        'recaptcha_site_key' => isset($settings['mmp_custom_form_recaptcha_site_key']) ? $settings['mmp_custom_form_recaptcha_site_key'] : null,
        'account_ID' => isset($settings['AccountID']) ? esc_attr($settings['AccountID']) : null,
        'BID' => isset($settings['BID']) ? esc_attr($settings['BID']) : null,
        'ClubID' => isset($settings['ClubID']) ? esc_attr($settings['ClubID']) : null,
        'account_email' => isset($settings['AccountEmail']) ? $settings['AccountEmail'] : null,
        'default_member_type_id' => isset($settings['DefaultMemberTypeID']) ? esc_attr($settings['DefaultMemberTypeID']) : null,
        'membership_cost' => isset($settings['MembershipCost']) ? esc_attr($settings['MembershipCost']) : 100,
        'term' => isset($settings['Term']) ? esc_attr($settings['Term']) : 1,
        'show_region' => isset($settings['show_region']) ? esc_attr($settings['show_region']) : 0,
        'region_label' => isset($settings['region_label']) ? esc_attr($settings['region_label']) : 'Region',
        'consent_title' => isset($settings['consent_title']) ? esc_attr($settings['consent_title']) : '',
        'consent_text' => isset($settings['consent_text']) ? esc_attr($settings['consent_text']) : ''
    );

    // Enqueue the main script and localize it with the configuration options
    wp_enqueue_script('mmp-form-script', MMPCF_PLUGIN_URL . 'templates/assets/js/mmp-form.js', array('jquery'), MMPCF_PLUGIN_VERSION, true);
    wp_localize_script('mmp-form-script', 'mmpFormOptions', $localization_array);

    // Conditionally enqueue custom scripts if they exist
    $accountID = $localization_array['account_ID'];
    $bid = $localization_array['BID'];
    $clubid = $localization_array['ClubID'];
    $base_dir = MMPCF_PLUGIN_DIR . "templates/custom/{$accountID}/{$bid}/{$clubid}/";

    $custom_css_exists = file_exists($base_dir . 'css/mmp-form-custom.css');
    $custom_js_exists = file_exists($base_dir . 'js/mmp-form-custom.js');

    if ($custom_css_exists) {
        wp_enqueue_style('mmp-form-custom-style', MMPCF_PLUGIN_URL . "templates/custom/{$accountID}/{$bid}/{$clubid}/css/mmp-form-custom.css", array(), MMPCF_PLUGIN_VERSION);
    }
    if ($custom_js_exists) {
        wp_enqueue_script('mmp-form-custom-script', MMPCF_PLUGIN_URL . "templates/custom/{$accountID}/{$bid}/{$clubid}/js/mmp-form-custom.js", array('jquery', 'mmp-form-script'), MMPCF_PLUGIN_VERSION, true);
    }

    wp_add_inline_script('mmp-form-script', '
        if (' . ($custom_css_exists ? 'true' : 'false') . ') {
            console.log("Custom CSS file loaded.");
        }
        if (' . ($custom_js_exists ? 'true' : 'false') . ') {
            console.log("Custom JS file loaded.");
        }
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_mmp_custom_form_scripts');

// Create shortcode for rendering the form
function mmp_custom_form_shortcode()
{
    // Fetch settings
    $settings = get_option('mmp_custom_form_settings');
    $accountID = isset($settings['AccountID']) ? esc_attr($settings['AccountID']) : null;
    $bid = isset($settings['BID']) ? esc_attr($settings['BID']) : null;
    $clubid = isset($settings['ClubID']) ? esc_attr($settings['ClubID']) : null;

    // Include the form HTML from an external file
    $base_dir = MMPCF_PLUGIN_DIR . "templates/custom/{$accountID}/{$bid}/{$clubid}/";
    $form_html_path = $base_dir . 'mmp-form.html';
    if (file_exists($form_html_path)) {
        $form_html = '<div class="mmp-custom-form">' . file_get_contents($form_html_path) . '</div>';
    } else {
        $form_html = '<p>Form template not found. Please check the account ID, BID, and ClubID settings.</p>';
    }

    return $form_html;
}
add_shortcode('mmp_custom_form', 'mmp_custom_form_shortcode');

?>
