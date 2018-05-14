
Package.describe({
  name    : 'semantic:ui-rating',
  summary : 'Semantic UI - Rating: Single component release',
  version : '2.2.10',
  git     : 'git://github.com/Semantic-Org/UI-Rating.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles([
    'rating.css',
    'rating.js'
  ], 'client');
});
