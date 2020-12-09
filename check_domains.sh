#!/bin/bash
## NOTICE
# Dirty quick script to track "stuff". Buy me a beer :))


## CONSTANTS
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
SITE_DIR="$SCRIPT_PATH/sites"

# Files we want to track, files ending with ".map" will considered as sourcemaps and unpacked.
FILES=(site.webmanifest global.css build/bundle.css build/bundle.css.map build/bundle.js build/bundle.js.map)

# The domains to monitor
DOMAINS=(npst.no dass.npst.no slede8.npst.no spst.no)

## FUNCTIONS
download_files() {
	# Download the tracked files from the specified URL
	URL="$1"
	OUTPUT_DIR="$2"
	for FILE in "${FILES[@]}"; do
		FILE_URL="$URL/$FILE"
		OUTPUT_PATH="$OUTPUT_DIR/$FILE"
		echo "Downloading: $FILE_URL"
		wget -q "$FILE_URL" -O "$OUTPUT_PATH"
	done
}

unpack_sourcemaps() {
	DOMAIN="$1"
	DOMAIN_DIR="$SITE_DIR/$DOMAIN"
	OUTPUT_DIR="./sites/$DOMAIN/unpacked"
	ABSOLUTE_OUTPUT_DIR="$DOMAIN_DIR/unpacked"

	# Unpack each sourcemap, delete the old unpacked files first
	for FILE in $DOMAIN_DIR/files/build/*.map; do
		if [[ $FILE == *"css"* ]]; then
			rm -rf "$ABSOLUTE_OUTPUT_DIR/css"
			OUTPUT_DIR="$OUTPUT_DIR/css"
		else
			rm -rf "$ABSOLUTE_OUTPUT_DIR/js"
			OUTPUT_DIR="$OUTPUT_DIR/js"
		fi

		echo "Unpacking file: $FILE"

		# source-map-unpack, best alternative atm.
		# This tool also messes with paths, removing the first characters of each root file
		# Fixed by:
		# - editing source-map-unpack/dist/index.js
		# - setting WEBPACK_SUBSTRING_INDEX = 11 to 10
		# - running npx patch-package
		# In addition, it requires relative paths
		# Another alternative is python: unwebpack-sourcemap, albeit more messy
		unpack "$OUTPUT_DIR" "$FILE" &>/dev/null
	done
}

commit_diff() {
	DOMAIN="$1"
	DOMAIN_DIR="$2"
	echo $DOMAIN
	echo $DOMAIN_DIR
}

handle_diff() {
	DOMAIN="$1"
	DOMAIN_DIR="$SITE_DIR/$DOMAIN"

	# Check sourcemaps
	unpack_sourcemaps $DOMAIN

	# Commit the differences
	#commit_diff $DOMAIN $DOMAIN_DIR
}

check_domain() {
	DOMAIN="$1"
	URL="https://$DOMAIN"
	echo "Checking $DOMAIN"
	DOMAIN_DIR="$SITE_DIR/$DOMAIN"

	# Create directories if missing
	mkdir -p "$DOMAIN_DIR/unpacked/js"
	mkdir -p "$DOMAIN_DIR/unpacked/css"
	mkdir -p "$DOMAIN_DIR/files/build"

	# Let's download all the files we track
	download_files "$URL" "$DOMAIN_DIR/files"

	if [[ `git status --porcelain` ]]; then
		# We have a diff! Let's handle it
		handle_diff $DOMAIN
	fi
}

## GOGO
# Initialize stuff
mkdir -p $SITE_DIR

# Handle each domain
for DOMAIN in "${DOMAINS[@]}"; do
	check_domain "$DOMAIN"
done
