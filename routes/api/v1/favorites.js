const yaml = require("js-yaml")
const fs = require("fs")

const getKey = (apikey) => {
  return yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"))[apikey];
}
