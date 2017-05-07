# get-sass-vars-sync

[![NPM version](https://img.shields.io/npm/v/get-sass-vars-sync.svg)](https://www.npmjs.org/package/get-sass-vars-sync) 
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/get-sass-vars-sync/master.svg?label=build)](https://travis-ci.org/itgalaxy/get-sass-vars-sync) 
[![dependencies Status](https://david-dm.org/itgalaxy/get-sass-vars-sync/status.svg)](https://david-dm.org/itgalaxy/get-sass-vars-sync) 
[![devDependencies Status](https://david-dm.org/itgalaxy/get-sass-vars-sync/dev-status.svg)](https://david-dm.org/itgalaxy/get-sass-vars-sync?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/itgalaxy/get-sass-vars-sync.svg)](https://greenkeeper.io/)

Get Sass variables synchronously as JSON object.

## Install

```shell
npm install get-sass-vars-sync node-sass --save-dev
```

The sass-loader requires [node-sass](https://github.com/sass/node-sass) 
as [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies). 
Thus you are able to specify the required versions accurately.

## Usage

```js
const fs = require('fs');
const sassVarsSync = require('get-sass-vars-sync').default;

sassVarsSync(fs.readFileSync('./index.scss', 'utf-8'))
    .then(function ( json ) {
        console.log(json);
        /* {
        "$foo": "16px",
        "$bar": "17.6px",
        "$baz": 42,
        "$foo-bar": "#666",
        "$foo-bar-baz": "#262626",
        "$foo-bar-baz-bad": "#123",
        "$grault": [1, 2, "3", "4px", "42%", "1.23457px", [4, 5, 6], {"foo": "bar baz"}],
        "$garply": {"foo": 1, "bar": [2, 3], "baz": "3 3 3"},
        "$qux": false,
        "$fred": true,
        "$corgle": null
        } */
  });
```

### `index.scss`

```scss
$foo: 16px;
$bar: $foo * 1.1;
$baz: 42;
$foo-bar: #666;
$foo-bar-baz: darken($foo-bar, 25%);
$foo-bar-baz-bad: #123 !default;
$grault: 1, 2, "3", 4px, 42%, 1.23456789px, (4,5,6), (foo: "bar baz");
$garply: (
    foo: 1,
    bar: (2, 3),
    baz: "3 3 3"
);
$qux: false;
$fred: true;
$corgle: null;

.nested {
    .selector {
        $nested-var: thud;
    }
}
```

## API

### sassVarsSync(str, options)

Returns: `Object`

Gets Sass variables from Sass string.

Only top-level variables will be considered, anything inside selector or at-rule is ignored. **PR welcome**.

#### str

Type: `String`

Sass input string.

#### opts

Type: `Object`

##### camelize

Type: `Boolean`  
Default: `false`

Camelize first-level JSON object keys and strip inital `$` (e.g. `$foo-bar` will become `fooBar`).

##### sassOptions

Type: `Object`

[Options for node-sass](https://github.com/sass/node-sass#options).

## Related

- [get-sass-vars](https://github.com/niksy/get-sass-vars) - Thanks you for inspiration.

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
