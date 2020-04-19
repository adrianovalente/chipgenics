#!/bin/bash

echo 'Building web application... 🔨'

# Cleaning dist environment
rm -rf website/dist/ 2> /dev/null

webpack --config website/webpack.config.js
cp website/src/index.html website/dist/index.html
cp website/src/favicon.ico website/dist/favicon.ico
cp -r roms website/dist/roms
