#!/bin/bash

# Define variables
OUTPUT_DIR=pkg
ZIP_NAME="gmail-hide-message-contents.zip"
FILES_TO_INCLUDE=("src/manifest.json" "src/popup.html" "src/popup.js" "src/content.js" "src/icon16.png" "src/icon32.png" "src/icon48.png" "src/icon128.png" "src/preview.png")

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Create the zip file using tar
echo "Creating zip package..."
tar --use-compress-program=zip -cf "$OUTPUT_DIR/$ZIP_NAME" "${FILES_TO_INCLUDE[@]}"

# Check if the zip was created successfully
if [ $? -eq 0 ]; then
    echo "Package created successfully: $OUTPUT_DIR/$ZIP_NAME"
else
    echo "Failed to create the package. Please check the file paths and try again."
fi