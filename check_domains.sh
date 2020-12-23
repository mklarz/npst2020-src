#!/bin/bash
## NOTICE
# Dirty quick script to track "stuff". Buy me a beer :))


## CONSTANTS
SCRIPT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
SITE_DIR="$SCRIPT_PATH/sites"

# Files we want to track, files ending with ".map" will considered as sourcemaps and unpacked.
FILES=(robots.txt humans.txt index.html egg.jpg site.webmanifest global.css build/bundle.css build/bundle.css.map build/bundle.js build/bundle.js.map)

# The domains to monitor
DOMAINS=(npst.no dass.npst.no slede8.npst.no spst.no pingvin.spst.no egg.spst.no)

## FUNCTIONS
download_files() {
  # Download the tracked files from the specified URL
  DOMAIN="$1"
  URL="$2"
  OUTPUT_DIR="$3"
  for FILE in "${FILES[@]}"; do
    TMP_FILE=$(mktemp /tmp/npst.XXXXXX)
    FILE_URL="$URL/$FILE"
    OUTPUT_PATH="$OUTPUT_DIR/$FILE"
    echo "Downloading: $FILE_URL"
    # Store the file temporary
    wget -q "$FILE_URL" -O "$TMP_FILE"
    FILE_SIZE=$(stat -c%s "$TMP_FILE")

    if [ $FILE_SIZE -ne 0 ]; then
      if [[ $URL == "https://dass.npst.no"* ]] && [[ $FILE == *"bundle.js" ]]; then
        # Only dass.npst.no includes the release version of the platform
        RELEASE=$(cat "$TMP_FILE" | grep -Po 'release:"(\K.*?)"' | tr -d '"')
        if [[ ! -z "$RELEASE" ]]; then
          echo "$RELEASE" > "$SCRIPT_PATH/release_version.txt"
          COMMIT_MESSAGE="[$DOMAIN] Release version update"
        fi
      fi
      mv "$TMP_FILE" "$OUTPUT_PATH"
    else
      rm "$TMP_FILE"
    fi
	done
}

unpack_sourcemaps() {
	DOMAIN="$1"
	DOMAIN_DIR="$SITE_DIR/$DOMAIN"
	RELATIVE_OUTPUT_DIR="./sites/$DOMAIN/unpacked"
	ABSOLUTE_OUTPUT_DIR="$DOMAIN_DIR/unpacked"

  # Unpack each sourcemap, delete the old unpacked files first
  for FILE in $DOMAIN_DIR/files/build/*.map; do
    if [[ $FILE == *"css"* ]]; then
      rm -rf "$ABSOLUTE_OUTPUT_DIR/css"
      OUTPUT_DIR="$RELATIVE_OUTPUT_DIR/css"
    else
      rm -rf "$ABSOLUTE_OUTPUT_DIR/js"
      OUTPUT_DIR="$RELATIVE_OUTPUT_DIR/js"
    fi

    echo "Unpacking file: $FILE"

    # source-map-unpack, best alternative atm.
    # This tool also messes with paths, removing the first characters of each root file
    # Fixed by:
    # - editing source-map-unpack/dist/index.js (see source-map-unpack/index.js in this repo)
    # - running npx patch-package
    # In addition, it requires relative paths
    # Another alternative is python: unwebpack-sourcemap, albeit more messy
    unpack "$OUTPUT_DIR" "$FILE"
  done
}

commit_diff() {
  # Commit the changes
  COMMIT_MESSAGE="$1"
  git add -A
  git commit -m "$COMMIT_MESSAGE"
}

handle_diff() {
  DOMAIN="$1"
  COMMIT_MESSAGE="$2"
  DOMAIN_DIR="$SITE_DIR/$DOMAIN"

  # Check sourcemaps
  unpack_sourcemaps $DOMAIN

  # Commit the differences
  commit_diff $COMMIT_MESSAGE
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

  COMMIT_MESSAGE="[$DOMAIN] UPDATE"
  # Let's download all the files we track
  download_files "$DOMAIN" "$URL" "$DOMAIN_DIR/files"

  if [[ `git status --porcelain` ]]; then
    # We have a diff! Let's handle it
    echo "There are differences, checking..."
    handle_diff $DOMAIN $COMMIT_MESSAGE
  else
    echo "No differences"
  fi
}

## GOGO
echo "Starting script..."

# Initialize stuff
mkdir -p $SITE_DIR

cd $SCRIPT_PATH # dirty

# Handle each domain
for DOMAIN in "${DOMAINS[@]}"; do
  check_domain "$DOMAIN"
done

# Push changes (if any)
git push origin main
