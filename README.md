# babel-plugin-env-val

babel 环境变量替换插件

## 插件功能

环境变量替换为常量值

## 插件配置

```js
// babel.config.js
module.exports = {
  presets: [
    // other presets
  ],
  plugins: [
    [
      "babel-plugin-env-val",
      {
        ...process.env,
        MY_ENV_NUMBER: 111,
        MY_ENV_STRING: "string",
        MY_ENV_FUNC: (value) => {
          return "MY_ENV_FUNC" + value;
        },
      },
    ],
  ],
};
```

## 使用

根据[以上配置](#插件配置)插件执行结果如下

```js
// 输入内容
process.env.MY_ENV_NUMBER;
// 输出内容
111
```

```js
// 输入内容
process.env.MY_ENV_FUNC('_222');
// 输出内容
"MY_ENV_FUNC_222"
```
