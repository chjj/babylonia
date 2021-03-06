# Babylonia

A zero-dependency package which vendors _all_ [@babel] modules for security and
simplicity. It follows the same versioning scheme as babel:
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

## Disclaimer & Reasoning

Although its snappy name may make it look like one, Babylonia is _not_ an
official @babel module. It's simply a snapshot of all @babel NPM packages. It
was specifically created for the [bcoin] development cycle. Bcoin is a
cryptocurrency project whose devs and users are particularly target-able for
certain kinds of package attacks like the one seen on the `event-stream`
package. As such, we seek to minimize the NPM attack surface.

### Why not use shrinkwrap?

Bundling the dependencies directly allows one to clone directly from github
without having to run `npm install`. We are aiming to minimize reliance on NPM
altogether.

### Why not use babel-standalone?

`babel-standalone` by itself does not provide a complete solution. Several
plugins and presets would still need to be included. Furthermore, as of
babel@7.2.2 `babel-preset-env-standalone` is broken and throws an error when
required.

### Why not bundle it?

Babel is a massive codebase and it is non-trivial to compile it into a single
file (as evidenced by the official babel-preset-env-standalone package not even
working!), especially when its baked-in behavior assumes dynamic requires for
things like presets and plugins.

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

[@babel]: https://babeljs.io/
[bcoin]: https://github.com/bcoin-org
