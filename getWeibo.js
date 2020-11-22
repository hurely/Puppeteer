/*
 * @Author: 左太宇
 * @Date: 2020-11-21 16:20:48
 * @LastEditTime: 2020-11-21 16:59:10
 * @LastEditors: 左太宇
 * @message:
 */
const puppeteer = require("puppeteer");
var fs = require("fs"); //文件模块
var path = require("path"); //系统路径模块

/**
 * 1.先通过 puppeteer.launch() 创建一个浏览器实例 Browser 对象
 * 2.然后通过 Browser 对象创建页面 Page 对象
 * 3.然后 page.goto() 跳转到指定的页面
 * 4.调用 page.screenshot() 对页面进行截图
 * 5.关闭浏览器
 */

async function mian() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://s.weibo.com/top/summary?cate=realtimehot");
  console.log("页面加载完毕");

  await page.waitForSelector("#pl_top_realtimehot"); // 等待元素加载之后，否则获取不到异步加载的元素
  await page.screenshot({ path: "example.png" });
  const data = await page.$$eval("#pl_top_realtimehot .td-02", (e) => {
    const ctn = e.map((v, i) => {
      let obj = {
        id: i,
        title: v.children[0].innerText,
        url: v.children[0].href,
      };
      return obj;
    });

    return ctn;
  });
  console.log("榜单数据", JSON.stringify(data));
  let content = JSON.stringify(data)
  await browser.close();
  // 一个页面爬取完毕以后稍微歇歇，不然太快网站会把你当成机器人弹出验证码（虽然我们本来就是机器人）
  await page.waitFor(2500);

  var file = path.join(__dirname, "data/weibo.json");

  //写入文件
  fs.writeFile(file, content, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("文件创建成功，地址：" + file);
  });
}
mian();
