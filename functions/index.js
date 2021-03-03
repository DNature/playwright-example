const functions = require("firebase-functions");
const playwright = require("playwright");

exports.scrapeImages = functions.https.onRequest(async (req, res) => {
    // Randomly select a browser
    // You can also specify a single browser that you prefer
    for (const browserType of ["firefox", "webkit"]) {
      console.log(browserType); // To know the chosen one 😁
      const browser = await playwright[browserType].launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto("https://www.instagram.com/accounts/login/");

      await page.waitForSelector('[type=submit]', {
        state: 'visible'
      })
      // You can also take screenshots of pages
      // await page.screenshot({
      //   path: `ig-sign-in.png`,
      // });
      await page.type("[name=username]", "<your-username>");
      await page.type('[type="password"]', "<your-password>");
      await page.click("[type=submit]");
      await page.waitForSelector('[placeholder=Search]', { state: 'visible' })
      await page.goto(`https://www.instagram.com/divine_hycenth`);
      await page.waitForSelector("img", {
        state: 'visible',
      });
      // await page.screenshot({ path: `profile.png` });
      // Execute code in the DOM
      const data = await page.evaluate(() => {
        const images = document.querySelectorAll("img");
        const urls = Array.from(images).map((v) => v.src);
        return urls;
      });
      await browser.close();
      console.log(data);
      // Return the data in form of json
      return res.status(200).json(data);
    }
  });