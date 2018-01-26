#!/usr/bin/env bash

NPM=$(npm bin)

$NPM/tsc --project tsconfig.json

for module_name in $(ls src/modules); do
    source_dir=src/modules/$module_name
    dist_dir=dist/modules/$module_name
    build_dir=build/modules/$module_name

    $NPM/rollup \
        --config rollup.config.js \
        --output.file $dist_dir/index.js \
        $build_dir/index.js

    node src/config.js \
        | $NPM/mustache - $source_dir/index.html \
        > $dist_dir/index.html

    $NPM/postcss \
        --no-map \
        --output $dist_dir/index.css \
        $source_dir/index.css
done

$NPM/postcss src/common/*.css \
    --no-map \
    --dir dist/common/

cp -r src/common/images dist/common
