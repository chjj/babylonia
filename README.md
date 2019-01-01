# Babylonia

A zero-dependency package which vendors _all_ `@babel` modules for security and
simplicity.

Babylonia makes use of the fact that NPM allows non-toplevel `node_modules`
directories to be packaged. It follows the same versioning scheme as babel:
e.g. `babylonia@7.2.2` includes `@babel/core@7.2.2`.

## Usage

Simply require `babylonia` instead of `@babel/core`. All modules typically
residing under `@babel/` will resolve with `babylonia/` as a prefix.

``` js
const fs = require('fs');
const path = require('path');
const babel = require('babylonia');
const filename = path.resolve(process.argv[2]);

const options = {
  presets: [
    ['babylonia/preset-env', {
      targets: {
        browsers: ['last 2 versions']
      },
      useBuiltIns: 'usage',
      loose: true
    }]
  ],
  filename,
  code: true,
  ast: false
};

const config = babel.loadPartialConfig(options);
const code = fs.readFileSync(filename, 'utf8');

babel.transform(code, config.options, (err, result) => {
  if (err)
    throw err;

  console.log(result.code);
});
```

As an extra bonus, babylonia users never have to consider which @babel modules
to add to their package.json.

## CLI Usage

This module will provide `babel`, `babel-external-helpers`, `babel-node`, and
`babel-parser` commands. This will conflict with the regular `@babel/cli`,
`@babel/node`, and `@babel/parser`.

``` bash
$ babel -h
```

## Disclaimer

Although its snappy name may make it look like one, Babylonia is _not_ an
official @babel module. It's simply a snapshot of all @babel NPM packages. It
was specifically created for the [bcoin] development cycle. Bcoin is a
cryptocurrency project whose devs and users are particularly target-able for
certain kinds of package attacks like the one seen on the `event-stream`
package. As such, we seek to minimize the NPM attack surface.

## License

Babel License

```
MIT License

Copyright (c) 2014-2018 Sebastian McKenzie and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

Babylonia License

```
This software is licensed under the MIT License.

Copyright (c) 2018, Christopher Jeffrey (https://github.com/chjj)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[bcoin]: https://github.com/bcoin-org
