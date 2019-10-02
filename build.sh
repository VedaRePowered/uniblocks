#!/bin/bash

for file in `ls server/*.js web/*.html web/*.js web/*.css`; do
	mkdir -p `dirname $file`
	touch build/$file
	minify $file > build/$file
done
