const request = require("request");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");
const axios = require("axios");
const Path = require("path");
const fs = require("fs");

var images = [];
const url = "https://forum.garudalinux.org/t/share-some-funny-things/1070/11";
request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var che = cheerio.load(html);
    const { window } = new JSDOM(che.html());

    const $ = require("jquery")(window);
    $("img").each(function () {
      if (this.src) {
        images.push(this.src);
      }
    });
    counter = 0;
    images.forEach(async function (image) {
      counter++;
      const fileName = `img${counter}.jpg`;
      const path = Path.resolve(__dirname, "images", fileName);
      const writer = fs.createWriteStream(path);
      const img = await axios.get(image, { responseType: "stream" });
      console.log(img.data);
      await img.data.pipe(writer);
    });
  }
});
