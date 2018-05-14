#### Dropdown

- **Dropdown/Search/Checkbox** - Removes use of deprecated `dispatchEvent` DOM APIs for generating simulated events

### Version 2.2.0 - June 26, 2016

- **Rating** - Added new setting `fireOnInit` for rating, which defaults to `false`. When set to true `onRate` will fire when rating is initialized [#3712](https://github.com/Semantic-Org/Semantic-UI/issues/3712)
- **Rating** - Fixed `ui rating` to not used outlined star in basic variation, instead using a lighter filled in star for increased visibility [#3730](https://github.com/Semantic-Org/Semantic-UI/issues/3730)
- **Rating** - rating does not fire `onRate` when rating is initialized [#3712](https://github.com/Semantic-Org/Semantic-UI/issues/3712)

### Version 2.0.3 - July 8, 2015

- **Popup** - Popup `preserve` setting (which preserves popup in DOM to avoid regenerating on each show/hide) was set to `true` by default causing generated popups to remain in DOM. [#1369](https://github.com/Semantic-Org/Semantic-UI/issues/1369)

### Version 2.0.0 - June 30, 2015

- **Rating** - Rating now correctly adjusts if `data` attributes change
- **Rating** - Rating styles have been adjusted to use subtle transitions and tweaked color values.

### UI Changes

- **Rating** - Vertical alignment of `ui rating` with inline content now accounts for parent line height
- **Card** - Star / Like button colors have been fixed to match `ui rating` inside `card`

### Version 1.0.0 - November 24, 2014

- **Rating** - Rating now uses an embedded icon font to maximize compatibility
- **Rating** - Rating can now automatically generate icons without including them
- **Rating** - Rating can use data attributes to specify individual ratings

### Version 0.19.0 - July 3, 2014

- **Docs** - Language clarified for menu/rating definition **Thanks jnbt/ewiner**

### Version 0.15.4 - April 04, 2014

- **Rating** - Fixes issue where rating was behaving erratically in Chrome

### Version 0.10.2 - Dec 13, 2013

- **Rating** - Fixes vertical alignment with text

### Version 0.9.6 - Dec 04, 2013

- **Rating** - Ratings now receive class disabled when read only, instead of receiving ``active`` when rateable since active are much more common

### Version 0.4.1 - Oct 9, 2013

- Fixes heart rating color

### Version 0.3.2 - Oct 2, 2013

- Adds more sizes to ratings
- Adds new methods to rating: 'get rating', 'clear rating', 'disable', 'enable', adds new setting 'clearable'
- Fixes rating line height issue
- Fixes rating not being sent as first callback parameter on 'onRate'

### Version 0.1.0 - Sep 25, 2013

-  Rating icon missing font content with icon font update
- Padding on side of rating
- Rating settings documentation