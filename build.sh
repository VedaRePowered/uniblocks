#!/bin/bash

npm i # Make sure deps are up to date
for file in `ls server/*.js web/*.html web/*.js web/*.css`; do
	mkdir -p build/`dirname $file`
	rm build/$file
	touch build/$file
	node node_modules/minify/bin/minify.js $file > build/$file
done
#cp web/*.png build/web/
cp web/*.ico build/web/
#cp web/*.md build/web/

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
	file:write(data)
	file:close()
"

echo $combiner
echo $combiner | lua5.3 -

# Make the github pages site
cp README.md docs/info.md
cp -r build/web docs/game/
