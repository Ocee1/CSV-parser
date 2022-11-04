const fs = require("fs");
const csv = require("csv-parser");
const crypto = require("crypto");
const converter = require("json-2-csv");


const result = [];
let hashedJson = [];

// Insert the file name in the format "filename.csv"
const file = "";

const readCSVFile = async () => {
  await fs
    .createReadStream(file)
    .pipe(csv())
    .on("data", (data) => {
      result.push(data);
    })
    .on("end", async () => {
      for (let c = 0; c < result.length; c++) {
        let item = result[c];
        const Chia = await {
          format: "CHIP-0007",
          name: item.Name,
          description: item.Description || "",
          minting_tool: item.Minting_tool || "",
          sensitive_content: false,
          series_number: item["Series Number"] || "",
          series_total: 420,
          attributes: [
            {
              trait_type: "Gender",
              value: item.Gender || "",
            },
          ],
          collection: {
            // "name": item.Collection.name || '',
            id: item.UUID || "",
          },
        };

        if (item.Attributes != "") {
          let attrArr = item.Attributes.split(", " || ". ");
          for (var i = 0; i < attrArr.length; i++) {
            let attr = attrArr[i].split(":");
            Chia.attributes.push({
              trait_type: attr[0],
              value: attr[1],
            });
          }
        }
        var fileName = "./json/" + item.Filename + ".json";
        fs.writeFileSync(fileName, JSON.stringify(Chia), (err) => {
          if (err) throw err;
        });

        const fileBuffer = fs.readFileSync(fileName);
        const hash = crypto.createHash("sha256");

        const finalHex1 = hash.update(fileBuffer).digest("hex");
        item["Hash"] = finalHex1;
        hashedJson.push(item);
      }
      converter.json2csv(result, (err, csv) => {
        let fName = file.split(".csv");
        if (err) throw err;

        fs.writeFileSync(fName[0] + ".output.csv", csv);
      });

      
    });
};



readCSVFile();

