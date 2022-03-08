const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const json = require("./swagger.json");

const jsonToYaml = async () => {
  const data = YAML.stringify(json);
  fs.writeFileSync("swagger.yaml", data);
};

module.exports = jsonToYaml;
