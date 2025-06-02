#!/usr/bin/env node

// blatently copied from the preact-project:
// https://github.com/preactjs/create-preact

import * as prompts from "@clack/prompts";
import * as kl from "kolorist";
import { spawn } from "node:child_process";
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

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
      const templateDir = join(process.cwd(), ".");
      cpSync(templateDir, targetDir, { recursive: true });

      // change the package.json name to the project name
      const packageJsonPath = join(targetDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      packageJson.name = dir.split("/").pop() || dir;
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
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
