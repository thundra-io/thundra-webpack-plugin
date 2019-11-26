# thundra-webpack-plugin

## Installation

```bash
npm install --save-dev @thundra/webpack-plugin
````

## Usage
#### **`webpack.config.js`**
```js
const { ThundraWebpackPlugin } = require('@thundra/webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'node',
    plugins: [new ThundraWebpackPlugin([
        'service.blogPostService.*[traceArgs=true,traceReturnValue=true,traceLineByLine=true]',
    ])],
}
```

To use the plugin, an instance of the `ThundraWebpackPlugin` should be added to the list of plugins in the webpack configuration file. The constructor for `ThundraWebpackPlugin` requires a list of strings, where each string defines the file and the functions that you want to instrument and the parameters for the instrumentation.

Instrumentation definition strings must be in the `<file-def>.<function-def>[parameter1=value1,parameter2=value2,...]` format where the parameter definitions are optional. Asterisk character `(*)` in the `<file-def>` and `<function-def>` is supported.

Optional parameters that are specified between the brackets can be used to trace arguments and return values or to enable line by line tracing: `traceArgs`, `traceReturnValue` and `traceLineByLine`. You can use these parameters by setting them to `true` or `false`. By default all these parameters are set to `false`.

For example the value of a instrumentation definition string could be:

* To instrument all functions in js files under `./user/service` folder with arguments to trace: `user.service.*[traceArgs=true]`
* To instrument all functions which start with get methods in the js files `./user/service` folder with arguments to trace: `user.service.*.get*[traceArgs=true]`

