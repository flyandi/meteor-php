Package.describe({
  name: 'flyandi:php',
  version: '1.0.0',
  summary: 'Allows to use your legacy PHP scripts in Meteor',
  git: 'http://github.com/flyandi/meteor-php',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.0');
  api.addFiles('php.js');
  api.export('PHP');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('flyandi:php');
  api.addFiles('php.test.js');
});
