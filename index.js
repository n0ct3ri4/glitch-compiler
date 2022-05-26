const fs = require("fs");
const ks = require("kaliscripter");
const rl = require("readline");
const rlint = rl.createInterface(process.stdin, process.stdout);
require("colors");

// ========================================

rlint.on("line", (input) => {
  rlint.close();
});

// function br() {
//   console.log("\u200b");
// }

/**
 * @param {string} msg
 */
function log(msg) {
  console.log(msg);
}

// ========================================

console.log("=".repeat(49));
console.log(
  " ".repeat(25 - "Glitch Compiler".length / 2) +
    "Glitch Compiler" +
    " ".repeat(25 - "Glitch Compiler".length / 2)
);
console.log("=".repeat(49));

// ========================================

ks.info("Initializing configrations...");

if (!ks.isExists(__dirname + "/.GLI/")) ks.mkdir(__dirname + "/.GLI/");

ks.write(
  __dirname + "/.GLI/node.json",
  require("prettier").format(ks.readFile("./package.json", "utf-8"), {
    parser: "json",
    endOfLine: "lf",
  })
);

ks.write(
  __dirname + "/.GLI/config.json",
  require("prettier").format(
    `{"build":{"glitch":{"version":"${
      require("./package.json").version
    }"},"includedDirs":["node_modules"],"entry":"main.gli"}}`,
    { parser: "json", endOfLine: "lf" }
  )
);

// ========================================

console.clear();

// ========================================

log(" ██████╗ ██╗     ██╗████████╗ ██████╗██╗  ██╗");
log("██╔════╝ ██║     ██║╚══██╔══╝██╔════╝██║  ██║");
log("██║  ███╗██║     ██║   ██║   ██║     ███████║");
log("██║   ██║██║     ██║   ██║   ██║     ██╔══██║");
log("╚██████╔╝███████╗██║   ██║   ╚██████╗██║  ██║");
log(" ╚═════╝ ╚══════╝╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝");

rlint.question(
  `${"Entry Point".green} (${"Full path ONLY".yellow}) > `,
  (res) => {
    if (fs.existsSync(res)) {
      var reader = rl.createInterface({
        input: new ks.Streamer().Read(res),
        output: process.stdout,
        terminal: false,
      });

      var lines = [""];
      var words = [];
      var output = "";

      reader.on("line", (input) => {
        if (input == "#end") {
          reader.close();
        } else {
          lines.push(input, "\n");
        }
      });

      reader.on("close", () => {
        // Lignes L
        lines.forEach((l) => {
          // Mots M
          l.split(" ").forEach((m) => {
            // Aliases A
            require("./aliases.json").forEach((a) => {
              if (m.includes(a.alias)) l = l.replace(a.alias, a.native);
              console.log("output :>> ", output);
            });
            console.log("output :>> ", output);
          });
          output += l;
        });

        try {
          if (!fs.existsSync(res + "/build")) {
            ks.mkdir(res + "/build");
          }

          ks.write(
            `${res}/build/${res.split("/")[res.split("/").length - 1]}.js`,
            require("prettier").format(output, {
              parser: "typescript",
              endOfLine: "lf",
              tabWidth: 2,
              useTabs: false,
            })
          );
        } catch (err) {
          ks.error(
            "An error occured, compiling your Glitch Script! Please check your code."
          );
          process.exit(1);
        } finally {
          process.exit(0);
        }
      });
    } else {
      ks.error("Cannot read this file. Please enter full pathes only!");
    }
  }
);
