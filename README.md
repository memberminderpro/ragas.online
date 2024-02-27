# MMP Custom Form Plugin

This plugin will create a shortcode that can be added to any code block to display a Member Minder Pro custom form that sends data to DACdb or iMembersDB. Some limited options can be managed in the admin dashboard.

## Usage

### Display a form

Add the following shortcode to any code block:

```php
[mmp-custom-form]
```

## Manage settings

Users with administrative access can edit following settings in the admin dashboard:

- Google reCaptcha site key
- Google reCaptcha secret
- AccountID
- BID
- Account Email address (The address that received submitted form data)

## Examples

### The `[RAGAS.online Join Us](https://ragas.online/join-us/)` form

This form is used to sign up new members for RAGAS.online. It is a modified version of the ESRAG form located at https://esrag.org/subscriptions/?mtid=501

## Change log

### v1.0.1

- Added confirmation modal to prevent popup blocking.

### v1.0.0

  - Converted static form to WordPress plugin
  - replaced table layout with responsive html and css
  - Moved all embeded javascript and inline css to js/scripts.js and css/sytles.css
  - refactored custom javascript to support separate methods for custom forms vs. core functionality
  - removed local third-party libraries and linked using CDN paths
  - added support for Google Recaptcha3, with optional support for hcaptcha and Turnstile.


## Original Version history:

- @version 04/18/2023 - Adapted from ESRAG
- @version 04/21/2023 - MCY stores membertype,cost,years CSS fmting
