# vue-dot

Specialized dot notation get, set deep merge for vue.js objects.


## Install

~~~
> npm install @websanova/vue-dot
~~~


## Usage

Note that `tgt` should always be a valid Vue data object.

~~~
var _dot = require('@websanova/vue-dot');

_dot.set('some.value.in.here', 'yay', tgt);
_dot.get('some.value.in.here', tgt);
_dot.merge(tgt, obj);
~~~