console.log("Beginning");
console.log("importing");
// Webscraping module
const puppeteer = require('puppeteer');
// mail module
const sendmail = require('sendmail')();
// scheduling module
var schedule = require('node-schedule');


const send = require('gmail-send')({
    user: 'jamienasnotifications1@gmail.com',
    pass: 'xm8p9z0p9z20',
    to:   'oabwebster@gmail.com',
    subject: 'Switch Notifications',
  });


// console.log("setup scraping function");
async function get_switch_price() {
//    console.log("get_switch_price");
   let price = null; 
//    const browser = await puppeteer.launch();
   const browser = await puppeteer.launch({args: ['--no-sandbox']});
//    const browser = await puppeteer.launch({headless:false});
   const page = await browser.newPage();
   await page.goto("https://www.amazon.co.uk/", {waitUntil: "networkidle0"});
   await page.evaluate('document.querySelector("#twotabsearchtextbox").value = "nintendo switch"')
    let search_form = await page.$(".nav-searchbar");
   await page.focus('#twotabsearchtextbox');
   await Promise.all([
        search_form.press("Enter"),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    let a_elements = await page.$$(".a-link-normal");
    // console.log(a_elements);
    if(a_elements == null) {
        return null;
    }
    let trigger_string = "https://www.amazon.co.uk/Nintendo-Switch-Neon-Red-blue";
    let href_value = "";
    let set_value = false;
    for(let a = 0; a < a_elements.length; a++) {
        let element = a_elements[a];
        let first_result = await element.getProperty("href");
        href_value = await first_result.jsonValue();
        // console.log(href_value);
        if(href_value.substring(0,trigger_string.length) == trigger_string){
            console.log(trigger_string)
            console.log(trigger_string.length)
            console.log(href_value.substring(trigger_string.length))
            console.log("using:", href_value);
            set_value = true;
            break;
        }
    }
    if (set_value==false) {
        console.log("string not matched");
        console.log(trigger_string)
        console.log(trigger_string.length)
        console.log(href_value.substring(0,trigger_string.length))
        // console.log("using:", href_value);
        return null;
    }
    await Promise.all([
        page.goto(href_value),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    let price_element = await page.$("#priceblock_ourprice");
    if (price_element != null) {
        price = await (await price_element.getProperty("innerHTML")).jsonValue();
        console.log("done:", price);
        send({
            text: 'Switch price is currently' + String(price),  
          }, (error, result, fullResult) => {
            if (error) console.error(error);
            console.log(result);
          })
    } else {
        console.log("price element was null");
        return null;
    }
   let exit = await browser.close();
//    return price;
}


get_switch_price();


// once every 2 mins
// const cron_timings = "0 0/2 * * * *";
/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

// console.log("setup cron function");

// var j = schedule.scheduleJob('cron_timings', () => {
//     // scrape the amazon page
//     let current_price = get_switch_price;
// async function convert(input) {
//     if (typeof(input) === "Promise") {
//         input = await input;
//     }
//     return input;
// }

// let result = convert(get_switch_price());
// send the data
// sendmail({
//     from: 'jamie@ubuntu1.localnet',
//     to: 'jamieapps101@gmail.com',
//     // replyTo: 'jason@yourdomain.com',
//     subject: 'Switch price warning',
//     html: 'Switch price is currently £' + String(result),
//     }, function (err, reply) {
//     console.log(err && err.stack)
//     console.dir(reply)
// });
// });




