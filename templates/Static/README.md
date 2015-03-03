<%= clientName %> <%= appName %>
==============

## Frontend Build systems

The source CSS/JS files for the project is located under Web/Source. The compiled production files are under Web/Dist - these should NOT be edited.

### GULP

This project uses a GULP command-line job to run the SASS CSS preprocessor and JSHint for Javascript checking. They can be run on command, or trigger automatically on file change.

The Gulp job does:
- removes old compiled CSS files,
- compiles and concatenate SASS files to CSS,
- runs JSHint, concatenates and minifies the Javascript files
- compiles HTML from modules
- copies CSS, JS, Images, Fonts and HTML files from the source folder to the dist folder
- runs a local web server for development


Make sure you have [Node.js and Npm](http://nodejs.org/), version 0.10.32 or up, installed. If you don't have the Gulp Client installed, do this it from the command line:

	npm install -g gulp

Then run:

	npm install

After this, you should be able to run the grunt job:

	gulp

## Frameworks
Bootstrap 3.3.2
jQuery 1.11.2

Any part of the frameworks that is not used should be removed from compilation.
