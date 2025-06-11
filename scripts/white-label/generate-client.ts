import fs from 'fs-extra'
import path from 'path'
import prompts from 'prompts'

async function main() {
  const response = await prompts([
    { name: 'client', message: 'Nome do cliente', type: 'text' },
    { name: 'primary', message: 'Cor primária (hex)', type: 'text' },
    { name: 'secondary', message: 'Cor secundária (hex)', type: 'text' },
    { name: 'font', message: 'Fonte principal', type: 'text' },
    { name: 'titleSize', message: 'Tamanho do título (ex: 3.75rem)', type: 'text' },
    { name: 'titleLine', message: 'Line-height do título', type: 'text' },
    { name: 'bodySize', message: 'Tamanho do corpo', type: 'text' },
    { name: 'bodyLine', message: 'Line-height do corpo', type: 'text' },
    { name: 'bodyWidth', message: 'Largura do corpo (ex: auto)', type: 'text' }
  ])

  const basePath = path.resolve(__dirname, '../../')
  const clientPath = path.resolve(__dirname, `../../clients/${response.client}-ds`)
  await fs.copy(basePath, clientPath, {
    filter: (src) => !src.includes('clients') && !src.includes('.git')
  })

  const tailwindPath = path.join(clientPath, 'tailwind.config.cjs')
  let tailwind = await fs.readFile(tailwindPath, 'utf-8')
  tailwind = tailwind.replace(/extend:\s*{/, `extend: {
      colors: {
        primary: '${response.primary}',
        secondary: '${response.secondary}',
      },
      fontFamily: {
        sans: ['${response.font}', 'sans-serif'],
      },
      fontSize: {
        title: ['${response.titleSize}', { lineHeight: '${response.titleLine}' }],
        body: ['${response.bodySize}', { lineHeight: '${response.bodyLine}' }],
      },`)
  await fs.writeFile(tailwindPath, tailwind, 'utf-8')

  const packageJsonPath = path.join(clientPath, 'package.json')
  let pkg = await fs.readFile(packageJsonPath, 'utf-8')
  pkg = pkg.replace(/"name":\s*"[^"]+"/, `"name": "${response.client}-ds"`)
           .replace(/Levva Design System/gi, `${response.client} Design System`)
           .replace(/levva/gi, response.client.toLowerCase())
  await fs.writeFile(packageJsonPath, pkg, 'utf-8')

  const readmePath = path.join(clientPath, 'README.md')
  if (await fs.pathExists(readmePath)) {
    let readme = await fs.readFile(readmePath, 'utf-8')
    readme = readme.replace(/Levva Design System/gi, `${response.client} Design System`)
                   .replace(/levva-ds/gi, `${response.client}-ds`)
                   .replace(/github.com\/.*\/levva-ds/gi, `github.com/${response.client}/${response.client}-ds`)
    await fs.writeFile(readmePath, readme, 'utf-8')
  }

  console.log(`✔ Projeto white label criado em: clients/${response.client}-ds`)
}

main()