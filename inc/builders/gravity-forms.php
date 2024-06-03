
<?php 

function post_gravity_form_to_custom_endpoint($form_id, $endpoint_url, $entry, $form) {
    if ($form['id'] != $form_id) {
        return;
    }

    // Extract the first name and last name from the form entry
    $firstname = isset($entry['1.3']) ? $entry['1.3'] : ''; // Adjust '1.3' to your form's first name sub-field ID
    $lastname = isset($entry['1.6']) ? $entry['1.6'] : ''; // Adjust '1.6' to your form's last name sub-field ID

    // Prepare the data to be posted
    $data = array(
        'firstname' => $firstname,
        'lastname' => $lastname,
    );

    // Add standard hidden fields
    $standard_hidden_fields = get_standard_hidden_fields();
    foreach ($standard_hidden_fields as $hidden_field) {
        $data[$hidden_field['name']] = $hidden_field['default_value'];
    }

    // Use wp_remote_post to send the data
    $response = wp_remote_post($endpoint_url, array(
        'method'    => 'POST',
        'body'      => $data,
    ));

    // Handle the response as needed
    if (is_wp_error($response)) {
        // There was an error
        error_log('Error posting to custom endpoint: ' . $response->get_error_message());
    } else {
        // Successfully posted
        error_log('Successfully posted to custom endpoint: ' . wp_remote_retrieve_body($response));
    }
}

add_action('gform_after_submission', function($entry, $form) {
    post_gravity_form_to_custom_endpoint(1, 'https://your-endpoint-url.com/', $entry, $form); // Adjust '1' to your form ID
}, 10, 2);