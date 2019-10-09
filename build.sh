#!/bin/bash

npm i # Make sure deps are up to date
for file in `ls server/*.js web/*.html web/*.js web/*.css`; do
	mkdir -p build/`dirname $file`
	rm build/$file 2> /dev/null
	touch build/$file
	node node_modules/minify/bin/minify.js $file > build/$file
done
# copy asset files to built section, no errors
cp web/*.png build/web/ 2> /dev/null
cp web/*.ico build/web/ 2> /dev/null
cp web/*.md build/web/  2> /dev/null

mkdir -p build/web/socket.io
cp node_modules/socket.io-client/dist/*.js build/web/socket.io/ 2> /dev/null

combiner="
	local file = io.open(\"build/web/index.html\")
	local data = file:read(\"*all\")
	file:close()
	file = io.open(\"build/web/index.html\", \"w\")
	data = data:gsub(\"<script src=([^\\\"=<>]-)>[ \t\n]*</script>\", function(src)
		local script = io.open(\"build/web\" .. src)
		if script then
			local code = script:read(\"*all\")
			script:close()
			return \"<script>\" .. code .. \"</script>\"
		else
			print(\"Not found: build/web\" .. src)
		end
	end)
	data = data:gsub(\"<link rel=stylesheet href=([^\\\"=<>]-)>\", function(src)
		local style = io.open(\"build/web/\" .. src)
		if style then
			local css = style:read(\"*all\")
			if css then
				style:close()
				return \"<style>\" .. css .. \"</style>\"
			else
				print(\"Not found: build/web/\" .. src)
			end
		else
			print(\"Not found: build/web/\" .. src)
		end
	end)
	data = data:gsub(\"/%*%%BUILDHOST%%%*/.-/%*%%ENDHOST%%%*/\", \"\\\"https://uniblocks.101100.ca:5000\\\"\")
	file:write(data)
	file:close()
"

echo $combiner | lua5.3 -

# Make the github pages site
cp README.md docs/info.md
rm -rf docs/game/* 2> /dev/null
mkdir -p docs/game
cp -r build/web/* docs/game/ 2> /dev/null # no error if no files found
