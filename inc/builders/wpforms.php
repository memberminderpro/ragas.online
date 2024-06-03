<?php

function post_wpforms_to_custom_endpoint($form_id, $endpoint_url, $fields, $form_data) {
    if ($form_data['id'] != $form_id) {
        return;
    }

    // Extract the first name and last name from the form entry
    $firstname = '';
    $lastname = '';

    foreach ($fields as $field) {
        if ($field['name'] == 'Name') {
            $firstname = isset($field['first']) ? $field['first'] : '';
            $lastname = isset($field['last']) ? $field['last'] : '';
        }
    }

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

add_action('wpforms_process_complete', function($fields, $entry, $form_data, $entry_id) {
    post_wpforms_to_custom_endpoint(123, 'https://your-endpoint-url.com/', $fields, $form_data); // Adjust '123' to your form ID
}, 10, 4);