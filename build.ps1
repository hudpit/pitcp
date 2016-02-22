sencha app build production

rm -r -force .\build\production\PIT_CP\rest
cp -r rest/ .\build\production\PIT_CP\rest\

rm -r -force .\build\production\PIT_CP\reset
cp -r reset/ .\build\production\PIT_CP\reset\

rm .\build\production\PIT_CP\version.json
cp version.json .\build\production\PIT_CP\version.json
