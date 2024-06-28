<?php

add_action('admin_menu', 'mmp_custom_form_add_admin_menu');
add_action('admin_init', 'mmp_custom_form_settings_init');

function mmp_custom_form_add_admin_menu()
{
    add_menu_page('MMP Custom Form Settings', 'MMP Custom Form', 'manage_options', 'mmp_custom_form', 'mmp_custom_form_options_page', 'https://plus.dacdb.org/wp-content/uploads/2024/05/round-icon-20.png', 110);
}

function mmp_custom_form_settings_init()
{
    register_setting('mmpPlugin', 'mmp_custom_form_settings', 'mmp_custom_form_settings_sanitize');

    // Account and Custom Form Settings Section
    add_settings_section(
        'mmp_custom_form_mmpPlugin_account_section',
        __('Account and Custom Form Settings', 'mmp'),
        'mmp_custom_form_account_settings_section_callback',
        'mmpPlugin'
    );

    add_settings_field(
        'mmp_custom_form_account_id',
        __('Account ID', 'mmp'),
        'mmp_custom_form_account_id_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );

    add_settings_field(
        'mmp_custom_form_bid',
        __('BID', 'mmp'),
        'mmp_custom_form_bid_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );

    add_settings_field(
        'mmp_custom_form_clubid',
        __('Club ID', 'mmp'),
        'mmp_custom_form_clubid_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );

    add_settings_field(
        'mmp_custom_form_account_email',
        __('Account Email', 'mmp'),
        'mmp_custom_form_account_email_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );

    add_settings_field(
        'mmp_custom_form_show_region',
        __('Show Region on Form', 'mmp'),
        'mmp_custom_form_show_region_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );
    add_settings_field(
        'mmp_custom_form_region_label',
        __('Region Label', 'mmp'),
        'mmp_custom_form_region_label_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_account_section'
    );

    // Default New Member Type Section
    add_settings_section(
        'mmp_custom_form_mmpPlugin_default_MCY_section',
        __('Default New Member Type', 'mmp'),
        'mmp_custom_form_default_member_type_section_callback',
        'mmpPlugin'
    );

    add_settings_field(
        'mmp_custom_form_default_member_type_id',
        __('Default Member Type ID', 'mmp'),
        'mmp_custom_form_default_member_type_id_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_default_MCY_section'
    );

    add_settings_field(
        'mmp_custom_form_membership_cost',
        __('Membership Cost', 'mmp'),
        'mmp_custom_form_membership_cost_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_default_MCY_section'
    );

    add_settings_field(
        'mmp_custom_form_term',
        __('Term (in whole years)', 'mmp'),
        'mmp_custom_form_term_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_default_MCY_section'
    );

    // Consent and Disclosure Text Section
    add_settings_section(
        'mmp_custom_form_mmpPlugin_consent_text_section',
        __('Consent and Acknowledgement Content', 'mmp'),
        'mmp_custom_form_consent_text_section_callback',
        'mmpPlugin'
    );

    add_settings_field(
        'mmp_custom_form_consent_title',
        __('Title', 'mmp'),
        'mmp_custom_form_consent_title_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_consent_text_section'
    );

    add_settings_field(
        'mmp_custom_form_consent_text',
        __('Text', 'mmp'),
        'mmp_custom_form_consent_text_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_consent_text_section'
    );

    // Spam Protection Integration Section
    add_settings_section(
        'mmp_custom_form_mmpPlugin_spam_prevention_section',
        __('Spam Protection Integration', 'mmp'),
        'mmp_custom_form_spam_protection_section_callback',
        'mmpPlugin'
    );

    add_settings_field(
        'mmp_custom_form_recaptcha_site_key',
        __('reCAPTCHA Site Key', 'mmp'),
        'mmp_custom_form_recaptcha_site_key_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_spam_prevention_section'
    );

    add_settings_field(
        'mmp_custom_form_recaptcha_secret_key',
        __('reCAPTCHA Secret Key', 'mmp'),
        'mmp_custom_form_recaptcha_secret_key_render',
        'mmpPlugin',
        'mmp_custom_form_mmpPlugin_spam_prevention_section'
    );
}

function mmp_custom_form_account_settings_section_callback()
{
    echo '<p>Enter the account details and custom form settings for the MMP Custom Form plugin.</p>';
}

function mmp_custom_form_default_member_type_section_callback()
{
    echo '<p>These settings determine the default member type to select if the form is ever accessed without the mtid querystring in the URL. If necessary, users will still be able to change member types in the Membership Level section of the form.</p>';
}

function mmp_custom_form_spam_protection_section_callback()
{
    echo '<p>Enter a <a href="https://www.google.com/recaptcha/about/" target="_blank">Google reCAPTCHA v3</a> key pair to protect the form from spam submissions. Keys may be created and managed by logging into the <strong><a href="https://www.google.com/recaptcha/admin" target="_blank">Admin Console</a></strong></p>';
}

function mmp_custom_form_consent_text_section_callback() { 
    echo '<p>Enter the title and text to display in the <em><strong>Consent and Disclosures</strong></em> section of the form. Both fields are optional and may be left blank to exclude them from the public-facing form.</p>';
}


function mmp_custom_form_recaptcha_site_key_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['mmp_custom_form_recaptcha_site_key']) ? esc_attr($options['mmp_custom_form_recaptcha_site_key']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[mmp_custom_form_recaptcha_site_key]' value='<?php echo $value; ?>' placeholder="Enter reCAPTCHA Site Key">
<?php
}

function mmp_custom_form_recaptcha_secret_key_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['mmp_custom_form_recaptcha_secret_key']) ? esc_attr($options['mmp_custom_form_recaptcha_secret_key']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[mmp_custom_form_recaptcha_secret_key]' value='<?php echo $value; ?>' placeholder="Enter reCAPTCHA Secret Key">
<?php
}

function mmp_custom_form_account_id_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['AccountID']) ? esc_attr($options['AccountID']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[AccountID]' value='<?php echo $value; ?>' placeholder="e.g., 12345">
<?php
}

function mmp_custom_form_bid_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['BID']) ? esc_attr($options['BID']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[BID]' value='<?php echo $value; ?>' placeholder="e.g., 1234">
<?php
}
function mmp_custom_form_clubid_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['ClubID']) ? esc_attr($options['ClubID']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[ClubID]' value='<?php echo $value; ?>' placeholder="e.g., 12345">
    <p class="description">Enter the Club ID for the club or group where the new member will be added.</p>
<?php
}

function mmp_custom_form_account_email_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['AccountEmail']) ? esc_attr($options['AccountEmail']) : get_option('admin_email');
?>
    <input type='email' name='mmp_custom_form_settings[AccountEmail]' value='<?php echo $value; ?>' placeholder="Example: user@domain.sample">
    <p class="description">Enter the email address that should receive the submissions.</p>
<?php
}

function mmp_custom_form_show_region_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['show_region']) ? esc_attr($options['show_region']) : get_option('show_region');
?>
    <div class="toggle">
        <div class="switch"><input type="checkbox" id="show_region" name="mmp_custom_form_settings[show_region]" value="1" <?= $value === '1' ? 'checked' : ''; ?> data-true-label="On (Region will be visible on the form)" data-false-label="Off (Region will not be displayed on the form)"><label class="slider" for="show_region"></label></div><label class="option-label" id="label_show_region" for="show_region">On (Region will be visible on the form)</label>
    </div>
<?php
}

function mmp_custom_form_region_label_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['region_label']) ? esc_attr($options['region_label']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[region_label]' value='<?php echo $value; ?>' placeholder="Example: ESRAG Region">
<?php
}

function mmp_custom_form_default_member_type_id_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['DefaultMemberTypeID']) ? esc_attr($options['DefaultMemberTypeID']) : '';
?>
    <input type='text' name='mmp_custom_form_settings[DefaultMemberTypeID]' value='<?php echo $value; ?>' placeholder="Example: 123">
<?php
}

function mmp_custom_form_membership_cost_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['MembershipCost']) ? esc_attr($options['MembershipCost']) : '';
?>
    <input type='number' name='mmp_custom_form_settings[MembershipCost]' value='<?php echo $value; ?>' min="0" step="1" placeholder="Example: $100">
<?php
}

function mmp_custom_form_term_render()
{
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['Term']) ? esc_attr($options['Term']) : '';
?>
    <select name='mmp_custom_form_settings[Term]'>
        <?php for ($i = 1; $i <= 10; $i++) : ?>
            <option value='<?php echo $i; ?>' <?php selected($value, $i); ?>><?php echo $i; ?></option>
        <?php endfor; ?>
        <option value='25' <?php selected($value, '25'); ?>>25</option>
        <option value='50' <?php selected($value, '50'); ?>>50</option>
        <option value='75' <?php selected($value, '75'); ?>>75</option>
        <option value='100' <?php selected($value, '100'); ?>>100</option>
        <option value='lifetime' <?php selected($value, 'lifetime'); ?>>Lifetime</option>
    </select>
<?php
}
function mmp_custom_form_consent_title_render() { 
    $options = get_option('mmp_custom_form_settings');
    $value = isset($options['consent_title']) ? esc_attr($options['consent_title']) : '';
    ?>
    <input type='text' name='mmp_custom_form_settings[consent_title]' value='<?php echo $value; ?>' placeholder="e.g.: Consent and Acknowledgement">
    <?php
}

function mmp_custom_form_consent_text_render() {
    $options = get_option('mmp_custom_form_settings');
    $content = isset($options['consent_text']) ? $options['consent_text'] : '';
    wp_editor($content, 'consent_text', array(
        'textarea_name' => 'mmp_custom_form_settings[consent_text]',
        'media_buttons' => true,
        'textarea_rows' => 10,
        'teeny' => false
    ));
}

function mmp_custom_form_options_page()
{
?>
    <div id="mmp-plugin-container" class="wrap">
        <div id="mmp-settings">
            <form action='options.php' method='post'>
                <header class="mmp-masthead">
                    <div class="logo-container">
                        <a href="https://memberminderpro.com" target="_blank"><img src="https://plus.dacdb.org/wp-content/uploads/2023/07/mmp-icon_512.png" title="Member Minder Pro — Powering DACdb and iMembersDB" alt="Logo"></a>
                    </div>
                    <div class="title-container">
                        <h1>MMP Custom Form Settings</h1>
                        <h2>Need help? Open a support ticket on <a href="https://www.dacdbsupport.com/new-ticket" title="Open a support ticket on DACdb" target="_blank"><strong>DAC</strong>db</a> or <a href="https://www.imemberssupport.com/new-ticket" title="Open a support ticket on iMembersDB" target="_blank">i<strong>Members</strong>db</a>.</h2>
                    </div>
                    <div class="save-container">
                        <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes" style="width: 119px;"></p>
                    </div>
                </header>
                <main style="width: 100%; max-width: 640px">
                    <h2>Basic Usage</h2>
                    <p>To add the custom form to any WordPress page or post, edit the page or post where you want the form to appear. In the content area, type or paste the following shortcode:</p>
                    <pre id="mmp-custom-form-shortcode" style="cursor: pointer; background: #f4f4f4; padding: 10px; border: 1px solid #ddd; display: inline-block;">[mmp_custom_form]</pre>
                    <p>Click the code above to copy it to your clipboard, then paste it into the editor. When you publish or update the page, the custom form will be displayed.</p>
                    <?php
                    settings_fields('mmpPlugin');
                    do_settings_sections('mmpPlugin');
                    submit_button();
                    ?>
                </main>
                <footer id="mmp-admin-footer" style="text-align: center; margin-top: 20px;">
                    <p>Copyright © 2023-<?php echo date("Y"); ?> <a href="https://memberminderpro.com/" target="_blank"><strong>Member Minder Pro, LLC</strong></a> — Powering <a href="https://www.dacdbsupport.com/new-ticket" title="Open a support ticket on DACdb" target="_blank"><strong>DAC</strong>db</a> &amp; <a href="https://www.imemberssupport.com/new-ticket" title="Open a support ticket on iMembersDB" target="_blank">i<strong>Members</strong>db</a></p>
                </footer>
            </form>

        </div>
    </div>
    <script>
        document.getElementById('mmp-custom-form-shortcode').addEventListener('click', function() {
            var code = '[mmp_custom_form]';
            var textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Shortcode copied to clipboard!');
        });
    </script>
<?php
}

function mmp_custom_form_settings_sanitize($input)
{
    $sanitized_input = array();

    if (isset($input['mmp_custom_form_recaptcha_site_key'])) {
        $sanitized_input['mmp_custom_form_recaptcha_site_key'] = sanitize_text_field($input['mmp_custom_form_recaptcha_site_key']);
    }
    if (isset($input['mmp_custom_form_recaptcha_secret_key'])) {
        $sanitized_input['mmp_custom_form_recaptcha_secret_key'] = sanitize_text_field($input['mmp_custom_form_recaptcha_secret_key']);
    }
    if (isset($input['AccountID'])) {
        $sanitized_input['AccountID'] = sanitize_text_field($input['AccountID']);
    }
    if (isset($input['BID'])) {
        $sanitized_input['BID'] = sanitize_text_field($input['BID']);
    }
    if (isset($input['ClubID'])) {
        $sanitized_input['ClubID'] = sanitize_text_field($input['ClubID']);
    }
    if (isset($input['AccountEmail'])) {
        $sanitized_input['AccountEmail'] = sanitize_email($input['AccountEmail']);
    }
    if (isset($input['DefaultMemberTypeID'])) {
        $sanitized_input['DefaultMemberTypeID'] = sanitize_text_field($input['DefaultMemberTypeID']);
    }
    if (isset($input['MembershipCost'])) {
        $sanitized_input['MembershipCost'] = intval($input['MembershipCost']);
    }
    if (isset($input['Term'])) {
        $sanitized_input['Term'] = is_numeric($input['Term']) ? intval($input['Term']) : sanitize_text_field($input['Term']);
    }
    if (isset($input['show_region'])) {
        $sanitized_input['show_region'] = is_numeric($input['show_region']) ? intval($input['show_region']) : sanitize_text_field($input['show_region']);
    }
    if (isset($input['region_label'])) {
        $sanitized_input['region_label'] = is_numeric($input['region_label']) ? intval($input['region_label']) : sanitize_text_field($input['region_label']);
    }
    if (isset($input['consent_title'])) {
        $sanitized_input['consent_title'] = sanitize_text_field($input['consent_title']);
    }
    if (isset($input['consent_text'])) {
        $sanitized_input['consent_text'] = wp_kses_post($input['consent_text']);
    }

    return $sanitized_input;
}
