// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"axios/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_axios.default.interceptors.request.use(function (config) {
  if (config.method === "post") {
    config.data = _qs.default.stringify(config.data);
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

_axios.default.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log("response", response.status);
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  // console.log("error");
  return Promise.reject(error);
});

var _default = _axios.default;
exports.default = _default;
},{}],"platform/oschina/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("../../axios"));

var vscode = _interopRequireWildcard(require("vscode"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = require("fs");

const $ = require("cheerio");

const yaml = require("js-yaml");

const re = /\x2D\x2D\x2D([\s\S]*?)\x2D\x2D\x2D/;

function getFrontMatter(content) {
  const s = re.exec(content)[1];
  let obj = yaml.safeLoad(s) || {};
  return obj;
}

function setFrontMatter(fm, content) {
  console.log("setFrontMatter", fm, yaml.dump(fm));
  const s = yaml.dump(fm) + "\n" + content.replace(re, ""); // fs.writeFileSync(path, s, "utf8");

  return s;
} // cookie 信息


const cookie = vscode.workspace.getConfiguration().get("publish-blog.cookie"); // 个人主页

const mainPage = vscode.workspace.getConfiguration().get("publish-blog.mainPage");
const headers = {
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  cookie,
  referrer: mainPage
}; // 将path路径中的md文件发布到osc

async function publish(path) {
  console.log("osc", path);
  let info = await getInfo();
  console.log("info", info);
  const url = `${mainPage}/blog/save`;
  const CONTENT = fs.readFileSync(path, "utf8");
  let frontMatter = getFrontMatter(CONTENT); // 默认将第一个tag作为分类

  let catalogName = frontMatter.tag[0];
  let catalog = catalogName in info.catalog ? info.catalog[catalogName] : await addCatalog(catalogName, info);
  const data = {
    draft: "",
    id: "",
    user_code: info.userCode,
    title: frontMatter.title,
    content: CONTENT.replace(re, ""),
    content_type: 3,
    catalog: catalog,
    // 默认全部发送到编程语言, 或者第一个分类, 或者可以在front matter 中自定义
    classification: "428609",
    type: 1,
    origin_url: "",
    privacy: 0,
    deny_comment: 0,
    as_top: 0,
    downloadImg: 0,
    isRecommend: 0
  };
  let resp = await _axios.default.post(url, data, {
    headers
  });
  `
code:1
message:"发表成功"
time:"2020-06-30 17:57:14"
result:{
id
catalog:7028036
classification:428609
content:"
as_top:0
abstracts:"Front Matter in VuePress Any markdown fi
id:4330304
}
`;
  console.log("resp", resp);
  let id = resp.result.id;
  let blogUrl = `${mainPage}//blog/${id}`;
  console.log("blogUrl", blogUrl); // 写入 fm

  frontMatter["_publish_blog"] = {
    oschina: blogUrl
  };
  let s = setFrontMatter(frontMatter, CONTENT);
  fs.writeFileSync(path, s, "utf8"); //   console.log(resp.data);
  // {
  //   code: 1,
  //   message: '发表成功'
  // }

  return resp;
} // 获取发布时的信息, 分类, user_code, 类别等


async function getInfo() {
  const url = `${mainPage}/blog/write`;
  console.log("getInfo", url);
  let html = await _axios.default.get(url, {
    headers
  }); // console.log("html", html);
  // catalog classification

  let dom = $.load(html || "");
  let classificationDom = dom('select[name="classification"]>option');
  let classification = classificationDom.toArray().reduce((pre, now) => {
    pre[$(now).text()] = now.attribs.value;
    return pre;
  }, {});
  let catalogDom = dom('select[name="catalog"]>option');
  let catalog = catalogDom.toArray().reduce((pre, now) => {
    pre[$(now).text()] = now.attribs.value;
    return pre;
  }, {});
  let userCodeDom = dom("input[name=user_code]");
  let userCode = userCodeDom[0].attribs.value;
  let dataUserIdDom = dom('val[data-name="spaceId"]');
  let dataUserId = dataUserIdDom[0].attribs["data-value"];
  return {
    classification,
    catalog,
    userCode,
    dataUserId
  };
} // 添加新的分类, 返回新增加的分类id


async function addCatalog(name, info) {
  const url = `${mainPage}/blog/quick_add_blog_catalog`;
  const data = {
    space: info.dataUserId,
    userCode: info.userCode,
    user_code: info.userCode,
    name
  };
  let resp = await _axios.default.post(url, data, {
    headers
  }); // 新增加的分类的id号

  return resp.result.id;
}

var _default = publish;
exports.default = _default;
},{"../../axios":"axios/index.js"}],"platform/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _oschina = _interopRequireDefault(require("./oschina"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function publishAll(path) {
  console.log("publishAll", path);
  return (0, _oschina.default)(path);
}

var _default = publishAll;
exports.default = _default;
},{"./oschina":"platform/oschina/index.js"}],"extension.js":[function(require,module,exports) {
"use strict";

var vscode = _interopRequireWildcard(require("vscode"));

var _platform = _interopRequireDefault(require("./platform"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "publish-blog" is now active!'); // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  let disposable = vscode.commands.registerCommand("publish-blog.publish", async function ({
    fsPath
  }) {
    let {
      code
    } = await (0, _platform.default)(fsPath); // The code you place here will be executed every time your command is executed

    if (code === 1) {
      vscode.window.showInformationMessage("发布成功");
    } else {
      vscode.window.showErrorMessage("发布失败");
    }
  });
  context.subscriptions.push(disposable);
}

exports.activate = activate; // this method is called when your extension is deactivated

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
},{"./platform":"platform/index.js"}]},{},["extension.js"], null)
//# sourceMappingURL=/extension.js.map