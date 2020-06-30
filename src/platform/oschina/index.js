import axios from "../../axios";

const fs = require("fs");
const $ = require("cheerio");
const yaml = require("js-yaml");
import * as vscode from "vscode";

const re = /---(.*?)---/s;

function getFrontMatter(content) {
  const s = re.exec(content)[1];
  let obj = yaml.safeLoad(s) || {};
  return obj;
}

function setFrontMatter(fm, content) {
  console.log("setFrontMatter", fm, yaml.dump(fm));
  const s = yaml.dump(fm) + "\n" + content.replace(re, "");
  // fs.writeFileSync(path, s, "utf8");
  return s;
}
// cookie 信息
const cookie = vscode.workspace.getConfiguration().get("publish-blog.cookie");

// 个人主页
const mainPage = vscode.workspace
  .getConfiguration()
  .get("publish-blog.mainPage");

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  cookie,
  referrer: mainPage,
};

// 将path路径中的md文件发布到osc
async function publish(path) {
  console.log("osc", path);
  let info = await getInfo();
  console.log("info", info);
  const url = `${mainPage}/blog/save`;
  const CONTENT = fs.readFileSync(path, "utf8");
  let frontMatter = getFrontMatter(CONTENT);
  // 默认将第一个tag作为分类
  let catalogName = frontMatter.tag[0];
  let catalog =
    catalogName in info.catalog
      ? info.catalog[catalogName]
      : await addCatalog(catalogName, info);

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
    isRecommend: 0,
  };

  let resp = await axios.post(url, data, { headers });
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
  console.log("blogUrl", blogUrl);
  // 写入 fm
  frontMatter["_publish_blog"] = {
    oschina: blogUrl,
  };

  let s = setFrontMatter(frontMatter, CONTENT);
  fs.writeFileSync(path, s, "utf8");
  //   console.log(resp.data);

  // {
  //   code: 1,
  //   message: '发表成功'
  // }
  return resp;
}

// 获取发布时的信息, 分类, user_code, 类别等
async function getInfo() {
  const url = `${mainPage}/blog/write`;
  console.log("getInfo", url);
  let html = await axios.get(url, { headers });
  // console.log("html", html);
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
    dataUserId,
  };
}

// 添加新的分类, 返回新增加的分类id
async function addCatalog(name, info) {
  const url = `${mainPage}/blog/quick_add_blog_catalog`;
  const data = {
    space: info.dataUserId,
    userCode: info.userCode,
    user_code: info.userCode,
    name,
  };
  let resp = await axios.post(url, data, { headers });
  // 新增加的分类的id号
  return resp.result.id;
}

export default publish;
