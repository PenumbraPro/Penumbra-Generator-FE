const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const boxen = require("boxen");
const Generator = require("yeoman-generator");

class FEGenerator extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "appName",
        message: "Project Name: ",
        validate(input) {
          if (!input) return "Please Enter Your Project Name";
          if (fs.readdirSync(".").includes(input)) {
            return "Directory with same name exists";
          }
          return true;
        },
      },
      {
        type: "list",
        choices: ["JS-React-Webpack", "TS-React-Parcel"],
        name: "template",
        message: "Which template this time?",
        default: "TS-React-Parcel",
      },
    ]).then((answers) => {
      this.answers = answers;
    });
  }

  writing() {
    const { template, appName } = this.answers;
    // coptTpl will replace <%= appName %> by Template Engine
    // from to ctx
    this.fs.copyTpl(
      // TPLS/TPL/_package.json" -> cwd
      this.templatePath(template, "_package.json"),
      this.destinationPath(appName, "package.json"),
      this.answers
    );
    fs.readdirSync(this.templatePath(template))
      .filter((name) => !name.startsWith("_"))
      .forEach((item) => {
        this.fs.copy(
          this.templatePath(template, item),
          this.destinationPath(appName, item)
        );
      });
  }

  async install() {
    const shouldAutoInstallAnswers = await this.prompt([
      {
        type: "confirm",
        name: "auto",
        message: "Install Project Dependencies",
      },
    ]);

    if (!shouldAutoInstallAnswers.auto) {
      return console.log(chalk.yellow("Auto Install Canceled"));
    }

    const projectDir = path.join(process.cwd(), this.answers.appName);
    this.spawnCommandSync(
      "npm",
      [
        "config",
        "set",
        "sass_binary_site=https://npm.taobao.org/mirrors/node-sass/",
      ],
    console.log("")
      { cwd: projectDir }
    );
    this.spawnCommandSync(
      "npm",
      ["install", "--registry=https://registry.npm.taobao.org"],
      { cwd: projectDir }
    );
  }

  end() {
    console.log("")
    console.log(chalk.bold.green("Enjoy Coding!"));
    console.log("")
    console.log(
      boxen(`powered by ${chalk.green.bold("@penumbra/cli")}`, {
        padding: 1,
        borderColor: "blueBright",
        dimBorder: true,
      })
    );
  }
}

module.exports = FEGenerator;
