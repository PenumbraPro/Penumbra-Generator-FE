const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");
module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "appName",
        message: "Project Name:",
        validate(input) {
          if (!input) return "Please Enter Your Project Name";
          if (fs.readdirSync(".").includes(input)) {
            return "Directory with same name exists";
          }
          return true;
        }
      },
      {
        type: "list",
        choices: ["Javascript", "TypeScript"],
        name: "language",
        message: "Which language this time?",
        default: "TypeScript"
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const { language, appName } = this.answers;
    // coptTpl will replace <%= appName %> by Template Engine
    this.fs.copyTpl(
      // JvasScript/_package.json"
      this.templatePath(language, "_package.json"),
      this.destinationPath(appName, "package.json"),
      this.answers
    );
    // copy support file/file directory
    fs.readdirSync(this.templatePath(language))
      .filter(name => !name.startsWith("_"))
      .forEach(item => {
        this.fs.copy(
          this.templatePath(language, item),
          this.destinationPath(appName, item)
        );
      });
  }

  install() {
    const projectDir = path.join(process.cwd(), this.answers.appName);
    this.spawnCommandSync(
      "npm",
      [
        "config",
        "set",
        "sass_binary_site=https://npm.taobao.org/mirrors/node-sass/"
      ],
      { cwd: projectDir }
    );
    this.spawnCommandSync(
      "npm",
      ["install", "--registry=https://registry.npm.taobao.org"],
      { cwd: projectDir }
    );
  }

  end() {
    this.log("Enjoy Coding!");
  }
};
