#!/bin/bash

npm i # Make sure deps are up to date
for file in `ls server/*.js web/*.html web/*.js web/*.css`; do
	mkdir -p build/`dirname $file`
	touch build/$file
	node node_modules/minify/bin/minify.js $file > build/$file
done
#cp web/*.png build/web/
cp web/*.ico build/web/
#cp web/*.md build/web/

combiner="
	--TODO: combine files into html
"

for file in `ls build/web/*.html`; do
	echo $combiner | lua5.3 - $file
done
