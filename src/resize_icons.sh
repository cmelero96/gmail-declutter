#!/bin/bash

# Check if ImageMagick's convert command is available
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is not installed. Please install it and try again."
    exit 1
fi

# Input file
INPUT_FILE="iconMaster.png"

# Check if the input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Input file $INPUT_FILE not found!"
    exit 1
fi

# Output sizes and filenames
declare -A sizes=(
    [128]="icon128.png"
    [48]="icon48.png"
    [32]="icon32.png"
    [16]="icon16.png"
)

# Resize the image for each size
for size in "${!sizes[@]}"; do
    output_file="${sizes[$size]}"
    echo "Creating $output_file with size ${size}x${size}..."
    magick "$INPUT_FILE" -resize "${size}x${size}" "$output_file"
done

echo "All icons have been created successfully!"