
.PHONY: all clean

all: upload-routes upload-js

clean:
	rm -f out/stops_information.json

upload-routes: out/routes.json
	scp out/routes.json granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

upload-stops_information: stops/stops.txt 
	scp out/stops_information.json granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

upload-js: web/script.js
	scp web/script.js granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

upload-php: web/index.php
	scp web/index.php granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

upload-css: web/main.css
	scp web/main.css granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

upload-header: web/header.php
	scp web/header.php granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW

synch:
	rsync -av web/ granskye@u1-1.ms.mff.cuni.cz:/afs/ms/u/g/granskye/WWW/