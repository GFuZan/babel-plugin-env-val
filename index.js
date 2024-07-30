/**
 * 环境常量注入插件
 * @param {import('@babel/core')} babel
 * @param {{ [K: string]: string }} options
 * @returns {{ visitor: import('@babel/core').Visitor }} 插件对象
 *@example
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
  return {
    visitor: {
      Program(rootPath, state) {
        rootPath.traverse(traverseOptions, {
          options: state.opts || options,
          babel,
        });
      },
    },
  };
};

/**
 * @type {import('@babel/core').Visitor}
 */
const traverseOptions = {
  Identifier(path, state) {
    const {
      options,
      babel: { template, types: t },
    } = state;
    const { name } = path.node;
    if (
      name === "process" &&
      path.key === "object" &&
      t.isMemberExpression(path.parent) &&
      t.isIdentifier(path.parent.property) &&
      path.parent.property.name === "env" &&
      path.parentPath.key === "object" &&
      t.isMemberExpression(path.parentPath.parent) &&
      t.isIdentifier(path.parentPath.parent.property)
    ) {
      const envKey = path.parentPath.parent.property.name;
      const envValue = options[envKey];
      path.parentPath.parentPath.replaceWithSourceString(
        envValue === undefined
          ? "undefined"
          : typeof envValue === "function"
          ? String(envValue)
          : JSON.stringify(envValue)
      );
    }
  },
};

module.exports = plugin;
