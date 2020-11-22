/*
 * @Author: 左太宇
 * @Date: 2020-05-28 15:57:20
 * @LastEditTime: 2020-11-21 16:28:35
 * @LastEditors: 左太宇
 * @message: 
 */
const puppeteer = require('puppeteer')

/**
 * 1.先通过 puppeteer.launch() 创建一个浏览器实例 Browser 对象
 * 2.然后通过 Browser 对象创建页面 Page 对象
 * 3.然后 page.goto() 跳转到指定的页面
 * 4.调用 page.screenshot() 对页面进行截图
 * 5.关闭浏览器
 */

async function mian() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://wht.im/')
  console.log('页面加载完毕')
  await page.waitForSelector('.info') //等待元素加载之后，否则获取不到异步加载的元素
  // 获取页面的标题
  const title = await page.title()
  console.info(`标题是: ${title}`)
  await page.click('.design')
  await page.screenshot({ path: 'example.png' })
  const ulAll = await page.$$eval('.info ul', (e) => {
    const ctn = e.map((v, i) => {
      let obj = { content: [] }
      obj.id = i
      obj.title = v.children[0].innerText
      // obj.val = v.children
      for (const key in v.children) {
        if (v.children.hasOwnProperty(key) && key != 0) {
          const element = v.children[key]
          obj.content.push({
            url: element.firstChild.href,
            name: element.innerText,
          })
        }
      }
      return obj
    })

    return ctn
  })
  console.log('所有的ul标签', JSON.stringify(ulAll))
  await browser.close()
  // 一个页面爬取完毕以后稍微歇歇，不然太快网站会把你当成机器人弹出验证码（虽然我们本来就是机器人）
  await page.waitFor(2500)
}
mian()
