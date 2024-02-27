# RAGAS.online `Join Us` form

This form is used to sign up new members for RAGAS.online. It is a modified version of the ESRAG form located at https://esrag.org/subscriptions/?mtid=501

## Original Version history:

- @version 04/18/2023 - Adapted from ESRAG
- @version 04/21/2023 - MCY stores membertype,cost,years CSS fmting
- @version 02/26/2024
  - Converted to WordPress plugin
  - replaced table layout with responsive html and css
  - Moved all embeded javascript and inline css to js/scripts.js and css/sytles.css
  - refactored custom javascript to support separate methods for custom forms vs. core functionality
  - removed local third-party libraries and linked using CDN paths
  - added support for GoogleRecaptcha3, with optional support for hcaptcha and turnstile
