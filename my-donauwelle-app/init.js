#!/usr/bin/env node

import * as prompts from "@clack/prompts";
import * as kl from "kolorist";
import { cpSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const s = prompts.spinner();

async function createDonauwelle() {
  const args = process.argv.slice(2);
  prompts.intro(
    kl.trueColor(
      113,
      60,
      28
    )("donauwelle - easily write web apps with server logic.")
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
    async () => {
      const templateDir = join(import.meta.dirname || process.cwd(), ".");
      cpSync(templateDir, targetDir, { recursive: true });
    },
    "Set up project directory"
  );

  await useSpinner(
    "Installing project dependencies...",
    //() => installDeps(targetDir, opts),
    "Installed project dependencies"
  );

  const gettingStarted =
    `${kl.dim("$")} ${kl.lightBlue(`cd ${dir}`)}\n` +
    `${kl.dim("$")} ${kl.lightBlue("bun run serve")}`;

  prompts.note(gettingStarted, "Getting Started");
  prompts.outro(kl.green(`You're all set!`));
}
createDonauwelle();

async function useSpinner(startMessage, fn, finishMessage) {
  s.start(startMessage);
  await fn();
  s.stop(kl.green(finishMessage));
}
