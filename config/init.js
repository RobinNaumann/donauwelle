#!/usr/bin/env node

// blatently copied from the preact-project:
// https://github.com/preactjs/create-preact

import * as prompts from "@clack/prompts";
import * as kl from "kolorist";
import { spawn } from "node:child_process";
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function useSpinner(startMessage, fn, finishMessage) {
  const s = prompts.spinner();
  s.start(startMessage);
  await fn();
  s.stop(kl.green(finishMessage));
}

async function createDonauwelle() {
  const args = process.argv.slice(2);
  prompts.intro(
    kl.trueColor(
      113,
      60,
      28
    )(
      "donauwelle - easily write web apps with server logic." +
        "\n" +
        kl.bold("   ⚠️  make sure you have Bun (bun.sh) installed!")
    )
  );

  const { dir } = await prompts.group(
    {
      dir: () =>
        prompts.text({
          message: "Project directory:",
          placeholder: "my-donauwelle-app",
          validate(value) {
            if (value.length == 0) {
              return "Directory name is required!";
            } else if (existsSync(value)) {
              return "Refusing to overwrite existing directory or file! Please provide a non-clashing name.";
            }
          },
        }),
    },

    {
      onCancel: () => {
        prompts.cancel(kl.yellow("Cancelled"));

        process.exit(0);
      },
    }
  );

  const targetDir = resolve(process.cwd(), dir);
  await useSpinner(
    "Setting up your project directory...",
    () => {
      try {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const templateDir = resolve(__dirname, "../");
        cpSync(templateDir, targetDir, {
          recursive: true,
          filter: (src) => {
            if (src.endsWith("/config/init.js")) return false;
            if (src.endsWith("node_modules")) return false;
            if (src.endsWith("bun.lockb")) return false;
            return true;
          },
        });

        // change the package.json name to the project name
        const packageJsonPath = join(targetDir, "package.json");
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        packageJson.name = dir.split("/").pop() || dir;
        packageJson.description = `a project with donauwelle`;
        packageJson.author = undefined;
        packageJson.bin = undefined;
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      } catch (e) {
        console.error("Error setting up project directory:", e);
        throw e;
      }
    },
    "Set up project directory"
  );

  await useSpinner(
    "Installing project dependencies...",
    async () => {
      await new Promise((resolve, reject) => {
        const proc = spawn("bun", ["install"], {
          cwd: targetDir,
          stdio: "inherit",
        });
        proc.on("close", (code) => resolve()); // ignore failure
      });
    },
    "Installed project dependencies"
  );

  const gettingStarted =
    `${kl.dim("$")} ${kl.lightBlue(`cd ${dir}`)}\n` +
    `${kl.dim("$")} ${kl.lightBlue("bun run serve")}`;

  prompts.note(gettingStarted, "Getting Started");
  prompts.outro(kl.green(`You're all set!`));
}
createDonauwelle();
