# Dionysos Background Field
> This component is a part of the **Olympus Dionysos fields** for **WordPress**.  
> It uses `wpColor` and `wpMedia` WordPress javascript bundle to manage field.

```sh
composer require getolympus/olympus-dionysos-field-background
```

---

[![Olympus Component][olympus-image]][olympus-url]
[![CodeFactor Grade][codefactor-image]][codefactor-url]
[![Packagist Version][packagist-image]][packagist-url]
[![MIT][license-image]][license-blob]

---

<p align="center">
    <img src="https://github.com/GetOlympus/olympus-dionysos-field-background/blob/master/assets/field-background-64.png" />
</p>

---

## Field initialization

Use the following lines to add an `background field` in your **WordPress** admin pages or custom post type meta fields:

```php
return \GetOlympus\Dionysos\Field\Background::build('my_background_field_id', [
    'title'       => 'Ooh, got ourselves an epic now...',
    'can_upload'  => false,
    'default'     => [],
    'description' => 'Oh crap, I got knocked!',
    'size'        => 'thumbnail',

    /**
     * Settings definition
     * @see the `Settings definition` section below
     */
    'settings' => [],
]);
```

## Variables definition

| Variable      | Type    | Default value if not set | Accepted values |
| ------------- | ------- | ------------------------ | --------------- |
| `title`       | String  | `'Background'` | *empty* |
| `can_upload`  | Boolean | `false` | `true` or `false` |
| `default`     | Array   | *empty* | *empty* |
| `description` | String  | *empty* | *empty* |
| `settings`    | Array   | `[]` | see [Settings definition](#settings-definition) |
| `size`        | String  | `'thumbnail'` | image sizes from `add_image_size()` [WordPress function](https://developer.wordpress.org/reference/functions/add_image_size/) |

Notes:
* `can_upload` value is defined thanks to `current_user_can('upload_files')` (see [WordPress reference](https://codex.wordpress.org/Function_Reference/current_user_can))

## Settings definition

The `settings` variable is an array of options defined below:

| Variable      | Type    | Default value if not set | Accepted values |
| ------------- | ------- | ------------------------ | --------------- |
| `upload`      | Boolean | `true` | `true` or `false` |
| `color`       | Array   | `[]` | see [WordPress reference](https://core.trac.wordpress.org/browser/trunk/src/js/_enqueues/lib/color-picker.js) |
| `upload`      | Array   | `[]` | see [WordPress reference](https://core.trac.wordpress.org/browser/trunk/src/wp-admin/js/media.js) |

## Retrive data

Retrieve your value from Database with a simple `get_option('my_background_field_id', [])` (see [WordPress reference][getoption-url]).  
Below, a `json_encode()` example to understand how data are stored in Database:

```json
{
  "background-color": "transparent",
  "background-image": "https://vignette.wikia.nocookie.net/despicableme/images/1/1d/Kevin_minions.png/revision/latest/scale-to-width-down/350?cb=20170703052012",
  "background-position": "left top",
  "background-repeat": "no-repeat",
  "background-size": "cover"
}
```

And below, a simple example to show how to iterate on the data array in `PHP`:

```php
// Get background from Database
$background = get_option('my_background_field_id', []);

// Check if background is empty and display it
if (!empty($background)) {
    $style = '';

    foreach ($background as $attr => $value) {
        $style .= $attr.':'.$value.';';
    }

    echo '<div style="'.$style.'">My content</div>';
}
```

## Release History

0.0.2
- Add display
- Add JS integration

0.0.1
- Initial commit

## Contributing

1. Fork it (<https://github.com/GetOlympus/olympus-dionysos-field-background/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

---

**Built with ♥ by [Achraf Chouk](https://github.com/crewstyle "Achraf Chouk") ~ (c) since a long time.**

<!-- links & imgs dfn's -->
[olympus-image]: https://img.shields.io/badge/for-Olympus-44cc11.svg?style=flat-square
[olympus-url]: https://github.com/GetOlympus
[codefactor-image]: https://www.codefactor.io/repository/github/GetOlympus/olympus-dionysos-field-background/badge?style=flat-square
[codefactor-url]: https://www.codefactor.io/repository/github/getolympus/olympus-dionysos-field-background
[getoption-url]: https://developer.wordpress.org/reference/functions/get_option/
[license-blob]: https://github.com/GetOlympus/olympus-dionysos-field-background/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat-square
[packagist-image]: https://img.shields.io/packagist/v/getolympus/olympus-dionysos-field-background.svg?style=flat-square
[packagist-url]: https://packagist.org/packages/getolympus/olympus-dionysos-field-background