+++
title = "Adding Tailwind CSS v4 to Your Aurelia 2 + Vite + TypeScript Project with this Bash Script"
authors = ["Dwayne Charrington"]
description = "Adding Tailwind CSS v4 to Your Aurelia 2 + Vite + TypeScript project can be done in seconds with this bash script."
date = 2025-01-23T12:00:00Z
lastmod = 2025-01-23T12:00:00Z
tags = ["bash", "scripts", "workflow"]
+++

With the news of TailwindCSS v4 being released, I thought it would be a good time to share a bash script that will help you add TailwindCSS v4 to your Aurelia 2 + Vite + TypeScript project without having to worry about the setup and configuration.

This script will install the necessary dependencies, update the Vite config, and create the necessary CSS imports—so you can focus on design instead of setup. If you already have Tailwind configured, this script will not overwrite your existing configuration and is not for upgrading your existing Tailwind configuration.

Before we get started, make sure you have an Aurelia 2 project using Vite and TypeScript. If you don't, you can use simply run: `npx makes aurelia new-project-name -s typescript` (replacing `new-project-name` with the name of your project).

Once you have an Aurelia 2 project, you can run the script by running `./add-tailwind.sh` in the root of your project. Ensure the script is executable by running `chmod +x add-tailwind.sh`.

```bash
#!/usr/bin/env bash

# 1. Install Tailwind CSS and the Vite plugin
npm install -D tailwindcss @tailwindcss/vite

# 2. Add the Tailwind import to vite.config.ts if it's not already there
#    Mac/BSD `sed` uses the '' argument for in-place edits; on Linux, remove the extra ''
if ! grep -q "import tailwindcss from '@tailwindcss/vite'" vite.config.ts; then
  sed -i '' "1i\\
import tailwindcss from '@tailwindcss/vite'
" vite.config.ts
fi

# 3. Add `tailwindcss()` to the plugins array if it's missing
if ! grep -q "tailwindcss()" vite.config.ts; then
  sed -i '' "s/plugins: \[/plugins: \[\\n    tailwindcss(),/g" vite.config.ts
fi

# 4. Ensure src/my-app.css exists and has the Tailwind import at the very top
if [ ! -f ./src/my-app.css ]; then
  # If file doesn’t exist, create it with the Tailwind import
  cat <<EOF > ./src/my-app.css
@import "tailwindcss";
EOF
  echo "Created my-app.css with Tailwind import."
else
  # If file exists but lacks the Tailwind import, add it at the very top
  if ! grep -q '@import "tailwindcss";' ./src/my-app.css; then
    sed -i '' '1 i\
@import "tailwindcss";
' ./src/my-app.css
    echo "Added Tailwind import to the top of my-app.css."
  else
    echo "my-app.css already has the Tailwind import."
  fi
fi

echo "TailwindCSS setup complete!"
```

Once the script completes, Tailwind v4 is installed, and your Aurelia project is configured to load Tailwind styles via Vite.