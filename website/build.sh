#!/bin/bash

echo 'Building web application... 🔨'

# Cleaning dist environment
rm -rf website/dist/ 2> /dev/null
mkdir -p website/dist

webpack --config website/webpack.config.js
cp website/src/index.html website/dist/index.html
