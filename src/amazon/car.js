require('dotenv').config()
const puppeteer = require("puppeteer");
// to make connection with mongo db
const { MongoClient } = require('mongodb');
const uri = process.env.URI_MONGODB;
const client = new MongoClient(uri);
console.log("Scrapping data started");
// putting interval time
var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function () {
    console.log("wait for 1 minute...");
    async function main() {
        // for opening browser if headless : false / if true then program will run without chromium
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        // navigating to target link
        await page.goto(
            "https://www.amazon.in/s?k=car+tyre&ref=nb_sb_noss");
        // finding the value to run the loop  
        const N = await page.$$eval(
            "span.s-pagination-item.s-pagination-disabled",
            (nodes) => nodes.map((n) => n.innerText)
        );
        const M = N[1];
        for (let i = 0; i < M; i++) {
            // arrow function for get values in productData
            const productData = await page.evaluate(async (data) => {
                const list = [];
                //getting all values for selector 
                const items = document.querySelectorAll("div.s-card-container.s-overflow-hidden.aok-relative.puis-include-content-margin.s-latency-cf-section.s-card-border");
                // foreach loop for getting values of each product
                items.forEach((item, index) => {
                    console.log(`Scrapping: ${index}`);
                    // for getting title from the class selector
                    const title =
                        item.querySelector("span.a-size-medium.a-color-base.a-text-normal") &&
                        item.querySelector("span.a-size-medium.a-color-base.a-text-normal").innerText;
                    // for getting rating out of 5 from the class selector
                    const rating =
                        item.querySelector("span.a-icon-alt") &&
                        item.querySelector("span.a-icon-alt").innerText;
                    // for getting Number of rating from the class selector
                    const numberOfRating =
                        item.querySelector("span.a-size-base.s-underline-text") &&
                        item.querySelector("span.a-size-base.s-underline-text").innerText.replace(",", "");
                    // for getting price from the class selector
                    const price =
                        item.querySelector("span.a-price-whole") &&
                        item.querySelector("span.a-price-whole").innerText.replace(",", "");
                    // for getting MRP from the class selector
                    const mrp =
                        item.querySelector("span.a-price[data-a-color='secondary'] span.a-offscreen") &&
                        item.querySelector("span.a-price[data-a-color='secondary'] span.a-offscreen").innerText.replace(",", "").replace("₹", "");
                    // for getting discount from the class selector
                    const discount =
                        item.querySelector(".s-price-instructions-style div span:nth-child(3)") &&
                        item.querySelector(".s-price-instructions-style div span:nth-child(3)").innerText.replace("(", "").replace(")", "");
                    // for getting image source from the class selector
                    const imglink =
                        item.querySelector("img.s-image") &&
                        item.querySelector("img.s-image").src;
                    // for getting URL from the class selector
                    const url =
                        item.querySelector("a.a-link-normal.s-no-outline") &&
                        item.querySelector("a.a-link-normal.s-no-outline").href;
                    //for getting timestamp
                    const d = new Date();
                    let timeStamp = d.toString();
                    // putting if condtion to stop values entering the list if price is null 
                    if (price != null) {
                        //pushing values in list 
                        list.push({
                            title: title,
                            rating: rating,
                            numberOfRating: numberOfRating,
                            price: price,
                            mrp: mrp,
                            discount: discount,
                            imglink: imglink,
                            url: url,
                            timeStamp: timeStamp
                        });
                    }
                });

                return list;
            });
            console.log(productData);
            // async function to insert values in mongoDB
            (async () => {
                try {
                    await client.connect();
                    var data = productData;
                    const amazon_cartyreCollection = await client.db().collection('amazon_cartyreCollection');
                    // to update the data by matching title
                    let Update = data.map(point => ({
                        updateOne: {
                            filter: { title: point.title },
                            update: { $set: point },
                            upsert: true
                        }
                    }));
                    // to insert the data in bulk
                    amazon_cartyreCollection.bulkWrite(Update).catch(e => {
                        console.log(e);
                    });
                }
                //to show error if present in try block
                catch (e) {
                    console.log('Error: ', e.message);
                }
            })();
            // to move the scrapper on the next page
            await page.click(".s-pagination-next"), {
                timeout: 0,
                waitUntill: "networkile0"
            };
            await page.waitForSelector(".s-pagination-next");
        }
        //to close the browser
        await browser.close();
    }
    main();
}, the_interval);