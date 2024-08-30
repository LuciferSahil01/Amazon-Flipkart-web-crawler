require('dotenv').config()
//puppeteer library is used for this program
const puppeteer = require("puppeteer");
const fs = require("fs");

//connection for mongoDB
const { MongoClient } = require("mongodb");
const uri = process.env.URI_MONGODB;
const client = new MongoClient(uri);
//

console.log("Scrapping data started");
console.log("wait for 1 minute...");
// Timer For Interval Time
var minutes = 1,
  the_interval = minutes * 60 * 1000;
setInterval(function () {
  async function main() {
    //Open Browser if headless: false//browser surfing for getting data
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      "https://www.flipkart.com/search?q=car+tyre&as=on&as-show=on&otracker=AS_Query_HistoryAutoSuggest_1_4_na_na_na&otracker1=AS_Query_HistoryAutoSuggest_1_4_na_na_na&as-pos=1&as-type=HISTORY&suggestionId=car+tyre&requestId=c699b198-d449-4cd9-afca-0782ecefb481&as-backfill=on",
      {
        timeout: 0,
        waitUntil: "networkidle0",
      }
    );

    //Finding page Values in Page number (page=1 of "last value")
    const N = await page.$$eval("._2MImiq > span", (nodes) =>
      nodes.map((n) => n.innerText)
    );
    const M = N[0].slice(10, 13);
    console.log(M);
    //  return false;
    //for loop for page traversal
    for (let i = 0; i < M; i++) {
      //setting up arrow function for productData(Sending all Data into productData)
      const productData = await page.evaluate(async (data) => {
        //making list local for getting push data into list
        const list = [];
        //by using //div[@class".class"] we are finding selectors
        //document.querySelectorAll("className")
        const items = document.querySelectorAll("div[data-id]");
        console.log(items);
        //Using for each loop for-each getting each value for the selected card
        items.forEach((item, index) => {
          console.log(`Scrapping: ${index}`);
          //Getting Name data from Selector
          const title =
            item.querySelector("a.s1Q9rs") &&
            item.querySelector("a.s1Q9rs").title;
          //Getting model data from Selector
          const model =
            item.querySelector("div._3Djpdu") &&
            item.querySelector("div._3Djpdu").innerText;
          //Getting mrp data from Selector
          const price =
            item.querySelector("div._3I9_wc") &&
            item
              .querySelector("div._3I9_wc")
              .innerText.replace("₹", "")
              .replace(",", "");
          //Getting price data from Selector
          const mrp =
            item.querySelector("div._30jeq3") &&
            item.querySelector("div._30jeq3").innerText.replace("₹", "").replace(",", "");
          //Getting rating data from Selector
          const rating =
            item.querySelector("div._3LWZlK") &&
            item.querySelector("div._3LWZlK").innerText.replace("(", "");
          //Getting image link data from Selector
          const imglink =
            item.querySelector("img._396cs4 _3exPp9, img") &&
            item.querySelector("img._396cs4 _3exPp9, img").src;
          //Getting url data from Selector
          const url =
            item.querySelector("a.s1Q9rs, href") &&
            item.querySelector("a.s1Q9rs, href").href;
          //Getting discount data from Selector
          const discount =
            item.querySelector("div._3Ay6Sb") &&
            item.querySelector("div._3Ay6Sb").innerText;
          //Getting numbers of rating rated by user data from Selector
          const numberOfRating =
            item.querySelector("span._2_R_DZ") &&
            item
              .querySelector("span._2_R_DZ")
              .innerText.replace("(", "")
              .replace(")", "")
              .replace(",", "");
          const d = new Date();
          let timeStamp = d.toString();
          //using condition for not print any data which has no Price
          if (price != null) {
            //Pushing Data into list for getting data into list
            list.push({
              title: title,
              model: model,
              mrp: mrp,
              price: price,
              rating: rating,
              discount: discount,
              numberOfRating: numberOfRating,
              imglink: imglink,
              url: url,
              timeStamp: timeStamp,
            });
          }
        });
        console.log(items);
        //returning list data into
        return list;
      });
      console.log(productData);
      const json = JSON.stringify(productData, null, 2);
      //Sending data into mongoDB
      (async () => {
        //using try catch to catch the error
        try {
          //connecting mongodb
          await client.connect();
          //defining productData into product to use map
          var product = productData;
          //making a collection into mongoDB
          const flipkart_cartyreCollection = await client
            .db()
            .collection("flipkart_cartyreCollection");
          //making arrow function for tha map
          //using updateOne for bulk insert if condition satisfy then update condition if match other wise update
          let Update = product.map((condition) => ({
            updateOne: {
              filter: { title: condition.title },
              update: { $set: condition },
              upsert: true,
            },
          }));
          //use bulkWrite for multiple documents can be inserted/updated/deleted in one shot
          flipkart_cartyreCollection.bulkWrite(Update).catch((e) => {
            console.log(e);
          });
        } catch (e) {
          console.log("Error: ", e.message);
        }
      })();
      //waiting for the next button to be clicked
      await page.waitForSelector("a._1LKTO3");
      //next button is clicked then it will move forward
      await page.click(".yFHi8N a:last-child");
    }
    //browser will close after every time interval
    await browser.close();
  }

  main();
}, the_interval);
