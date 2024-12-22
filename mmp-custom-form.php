<?php

/**
 * Plugin Name: MMP Custom Form
 * Description: A custom HTML form with multi-vendor captcha integration support
 * Version: 1.2.14.beta2
 * Author: Member Minder Pro, LLC
 * Text Domain: mmp-custom-form
 * Domain Path: /languages
 */

// Prevent WordPress from attempting to load translations for this plugin
add_filter('load_textdomain_mofile', function($mofile, $domain) {
    if ($domain === 'mmp-custom-form') {
        return false;
    }
    return $mofile;
}, 10, 2);

// Also prevent just-in-time loading of translations
add_filter('plugin_locale', function($locale, $domain) {
    if ($domain === 'mmp-custom-form') {
        return 'en_US';
    }
    return $locale;
}, 10, 2);


function set_mmpcf_plugin_version()
{
    if (!function_exists('get_plugin_data')) {
        require_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }

    $plugin_data = get_plugin_data(__FILE__);
    $version = $plugin_data['Version'];

    define('MMPCF_PLUGIN_VERSION', $version);
}

$plugin = plugin_basename(__FILE__);
// Ensure the plugin version is set.
set_mmpcf_plugin_version();

if (!defined('MMPCF_PLUGIN_URL')) {
    define('MMPCF_PLUGIN_URL', plugin_dir_url(__FILE__));
}
if (!defined('MMPCF_PLUGIN_DIR')) {
    define('MMPCF_PLUGIN_DIR', plugin_dir_path(__FILE__));
}

function mmpcf_enqueue_scripts() {
    wp_enqueue_script("jquery");
}
add_action('wp_enqueue_scripts', 'mmpcf_enqueue_scripts');



// Create a settings page for the plugin
require_once MMPCF_PLUGIN_DIR . 'inc/admin-page.php';

// Create shortcode for rendering the form
function mmp_custom_form_shortcode()
{
    // Fetch settings
    $settings = get_option('mmp_custom_form_settings');
    $accountID = isset($settings['AccountID']) ? esc_attr($settings['AccountID']) : null;
    $bid = isset($settings['BID']) ? esc_attr($settings['BID']) : null;
    $clubid = isset($settings['ClubID']) ? esc_attr($settings['ClubID']) : null;
    $recaptcha_site_key = isset($settings['mmp_custom_form_recaptcha_site_key']) ? $settings['mmp_custom_form_recaptcha_site_key'] : null;
    $account_email = isset($settings['AccountEmail']) ? $settings['AccountEmail'] : null;
    $default_member_type_id = isset($settings['DefaultMemberTypeID']) ? esc_attr($settings['DefaultMemberTypeID']) : null;
    $membership_cost = isset($settings['MembershipCost']) ? esc_attr($settings['MembershipCost']) : 100;
    $term = isset($settings['Term']) ? esc_attr($settings['Term']) : 1;
    $show_region = isset($settings['show_region']) ? esc_attr($settings['show_region']) : 0;
    $region_label = isset($settings['region_label']) ? esc_attr($settings['region_label']) : 'Region';
    $consent_title = isset($settings['consent_title']) ? esc_attr($settings['consent_title']) : '';
    $consent_text = isset($settings['consent_text']) ? esc_attr($settings['consent_text']) : '';

    // Localize script with configuration options
    $localization_array = array(
        'recaptcha_site_key' => $recaptcha_site_key,
        'account_ID' => $accountID,
        'BID' => $bid,
        'ClubID' => $clubid,
        'account_email' => $account_email,
        'default_member_type_id' => $default_member_type_id,
        'membership_cost' => $membership_cost,
        'term' => $term,
        'show_region' => $show_region,
        'region_label' => $region_label,
        'consent_title' => $consent_title,
        'consent_text' => $consent_text
    );

    // Check if options exist, otherwise enqueue the development script
    // Check if options exist, otherwise enqueue the development script
    if (
        !$recaptcha_site_key ||
        !$accountID ||
        (!($bid || $formtype)) ||
        ($clubid === null) ||
        ($account_email === null) ||
        !$default_member_type_id
    ) {
        wp_enqueue_script('mmp-form-options', plugin_dir_url(__FILE__) . 'assets/js/mmpFormOptions.js', array('jquery'), MMPCF_PLUGIN_VERSION, true);

        // Add inline script to check if mmpFormOptions is defined
        wp_add_inline_script('mmp-form-options', '
            if (typeof mmpFormOptions !== "undefined") {
                mmpFormOptions = {
                    recaptcha_site_key: mmpFormOptions.recaptcha_site_key,
                    account_ID: mmpFormOptions.account_ID,
                    BID: mmpFormOptions.BID,
                    ClubID: mmpFormOptions.ClubID,
                    account_email: mmpFormOptions.account_email,
                    default_member_type_id: mmpFormOptions.default_member_type_id,
                    membership_cost: mmpFormOptions.membership_cost,
                    term: mmpFormOptions.term,
                    show_region: mmpFormOptions.show_region,
                    region_label: mmpFormOptions.region_label,
                    consent_title: mmpFormOptions.consent_title,
                    consent_text: mmpFormOptions.consent_text
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
            'ClubID' => '<script>document.write(mmpFormOptions.ClubID);</script>',
            'account_email' => '<script>document.write(mmpFormOptions.account_email);</script>',
            'default_member_type_id' => '<script>document.write(mmpFormOptions.default_member_type_id);</script>',
            'membership_cost' => '<script>document.write(mmpFormOptions.membership_cost);</script>',
            'term' => '<script>document.write(mmpFormOptions.term);</script>',
            'show_region' => '<script>document.write(mmpFormOptions.show_region);</script>',
            'region_label' => '<script>document.write(mmpFormOptions.region_label);</script>',
            'consent_title' => '<script>document.write(mmpFormOptions.consent_title);</script>',
            'consent_text' => '<script>document.write(mmpFormOptions.consent_text);</script>'
        );
    }

    // Enqueue external libraries
    wp_enqueue_style('mmp-custom-form-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/fontawesome.min.css');
    wp_enqueue_style('mmp-custom-form-select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
    wp_enqueue_script('mmp-custom-form-select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
    wp_enqueue_script('mmp-custom-form-jquery-validate', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js', array('jquery'), null, true);
    wp_enqueue_script('google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . $recaptcha_site_key, array(), null, true);

    // Enqueue default styles and scripts
    wp_enqueue_style('mmp-form-style', plugin_dir_url(__FILE__) . "templates/assets/css/mmp-form.css", array(), MMPCF_PLUGIN_VERSION);
    wp_enqueue_style('mmp-form-print-style', plugin_dir_url(__FILE__) . "templates/assets/css/mmp-form-print.css", array(), MMPCF_PLUGIN_VERSION, 'print');
    wp_enqueue_script('mmp-form-script', plugin_dir_url(__FILE__) . "templates/assets/js/mmp-form.js", array('jquery'), MMPCF_PLUGIN_VERSION, true);

    // Enqueue club lookup script after the DOM is fully loaded
    if ($show_region == 1) {
        wp_enqueue_script('mmp-club-lookup', plugin_dir_url(__FILE__) . "templates/assets/js/mmpClubRegionLookup.js", array('jquery', 'mmp-form-script'), MMPCF_PLUGIN_VERSION, true);
    } else {
        wp_enqueue_script('mmp-club-lookup', plugin_dir_url(__FILE__) . "templates/assets/js/mmpClubLookup.js", array('jquery', 'mmp-form-script'), MMPCF_PLUGIN_VERSION, true);
    }

    // Validate and verify captcha responses
    require_once plugin_dir_path(__FILE__) . 'inc/captcha-verification.php';    // Build the base directory path for custom templates
    $base_dir = plugin_dir_path(__FILE__) . "templates/custom/{$accountID}/{$bid}/{$clubid}/";

    // Conditionally enqueue custom styles and scripts if they exist
    $custom_css_exists = file_exists($base_dir . 'css/mmp-form-custom.css');
    $custom_js_exists = file_exists($base_dir . 'js/mmp-form-custom.js');

    if ($custom_css_exists) {
        wp_enqueue_style('mmp-form-custom-style', plugin_dir_url(__FILE__) . "templates/custom/{$accountID}/{$bid}/{$clubid}/css/mmp-form-custom.css", array(), MMPCF_PLUGIN_VERSION);
    }
    if ($custom_js_exists) {
        wp_enqueue_script('mmp-form-custom-script', plugin_dir_url(__FILE__) . "templates/custom/{$accountID}/{$bid}/{$clubid}/js/mmp-form-custom.js", array('jquery', 'mmp-form-script'), MMPCF_PLUGIN_VERSION, true);
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
        $form_html = '<div class="mmp-custom-form">' . file_get_contents($form_html_path) . '</div>';
    } else {
        $form_html = '<p>Form template not found. Please check the account ID, BID, and ClubID settings.</p>';
    }

    return $form_html;
}
add_shortcode('mmp_custom_form', 'mmp_custom_form_shortcode');
