# Embedded Preact Template

This is forked from https://github.com/tonilopezmr/embedded-preact-template

The idea is to have a single html file with a single placeholder that we can replace with a JSON blob.
It can then be used as an interactive report for the given data.

To use it, take the placeholder in the index.html file and replace it with the JSON blob.
Then open the file in a browser.  modified.html is an example of what it should look like.

### build files

The build files are output into build/index.html and build/modified.html.  index.html has no
data in it, while modified.html has an example report.  These should be built automatically
by the github actions, but also by running 'yarn install && yarn build'
