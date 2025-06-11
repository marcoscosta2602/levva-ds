#!/usr/bin/env node
import chalk from "chalk"

function getInvoker() {
  const args = process.argv.slice(2)
  const env = process.env
  const npmExecPath = env.npm_execpath || ""
  const packageName = "levva@latest"

  if (npmExecPath.includes("pnpm")) {
    return `pnpm dlx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else if (npmExecPath.includes("yarn")) {
    return `yarn dlx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else if (npmExecPath.includes("bun")) {
    return `bunx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  } else {
    return `npx ${packageName}${args.length ? ` ${args.join(" ")}` : ""}`
  }
}

const main = async () => {
  console.log(
    chalk.yellow(
      "The 'levva-ui' package is deprecated. Please use the 'levva' package instead:"
    )
  )
  console.log("")
  console.log(chalk.green(`  ${getInvoker()}`))
  console.log("")
  console.log(
    chalk.yellow("For more information, visit: https://ui.levva.com/docs/cli")
  )
  console.log("")
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error.message)
  process.exit(1)
})
