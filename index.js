/**
 * 环境常量注入插件
 * @param {import('@babel/core')} babel
 * @param {{ [K: string]: string }} options
 * @returns {import('@babel/core').PluginObj} 插件对象
 * @example
 * ```js
 *   // 插件配置
 *   plugins: [
 *    [
 *       "babel-plugin-env-val",
 *       {
 *         ...process.env,
 *         MY_ENV_NUMBER: 111,
 *         MY_ENV_STRING: "string",
 *         MY_ENV_FUNC: (value) => {
 *           return "MY_ENV_FUNC" + value;
 *         },
 *       },
 *     ],
 *   ],
 *
 *   // 转换
 *   process.env.MY_ENV_NUMBER => 111
 *   process.env.MY_ENV_STRING => "string"
 *   process.env.MY_ENV_FUNC("_111") => "MY_ENV_FUNC_111"
 * ```
 */
const plugin = function (babel, options = {}) {
  const { types: t } = babel;
  return {
    visitor: {
      MemberExpression(path, state) {
        const opts = state.opts || options;

        if (
          //
          t.isIdentifier(path.node.property) &&
          t.isMemberExpression(path.node.object) &&
          t.isIdentifier(path.node.object.property) &&
          t.isIdentifier(path.node.object.object) &&
          path.node.object.object.name === "process" &&
          path.node.object.property.name === "env"
        ) {
          const envKey = path.node.property.name;
          const envValue = opts[envKey];
          path.replaceWithSourceString(
            envValue === undefined
              ? "undefined"
              : typeof envValue === "function"
              ? String(envValue)
              : JSON.stringify(envValue)
          );
        }
      },
    },
  };
};

module.exports = plugin;
