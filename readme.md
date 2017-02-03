# Droplect.js - Bootstrap 3 dropdown-select component

Personally, I created this plugin as pure as possible to replace HTML `<select>` inputs in dropdown mode by Bootstrap 3 dropdown component in order to keep select's simplicity combined with formatting features of BS dropdown.

Features:
- It mimics a `<select>` element which can be formatted all the way you could need, isn't fantastic enough? :D
- Ok, it supports keyboard-navigation: <kbd>up</kbd>, <kbd>down</kbd>, <kbd>home</kbd>, <kbd>end</kbd>, <kbd>enter</kbd>, and <kbd>escape</kbd>!
- Ok, ok, so it also supports type-ahead item search at 350ms of typing speed!

## Installation
You can just download the latest version from its GitHub repository at https://github.com/Webapper/droplect-js or using composer:
```
composer require webapper/droplect-js
```

Ensure the files will be placed into your project's www document-root where remote user agents can access it!

----------
## Usage

You should include the JS and CSS files in your HTML ***after*** the place of where you included jQuery and Bootstrap:
```html
<link href="webapper/droplect-js/src/droplect.css" rel="stylesheet">
<script src="webapper/droplect-js/src/droplect.js"></script>
```
> **notice**: *you can customize the user-interface of droplect by customizing the basic BS3 dropdown component and/or overriding our basic droplect.css.*

### Single-selection mode

Droplect extends BS3 dropdowns by its new toggle mode `droplect` and it can map the selected value into an existing `<input>` by ID using `data-map-to` setting, the droplect will copy the selected item's value of `data-value` attribute (see `<li>` tags):

```html
 <div class="dropdown">
     <input type="hidden" id="tricky" name="my-no-more-selects">
     <button id="dLabel" type="button" class="btn btn-default btn-droplect" data-toggle="droplect" data-map-to="tricky" aria-haspopup="true" aria-expanded="false">
         Droplect trigger
         <span class="caret"></span>
     </button>
     <ul class="droplect dropdown-menu" aria-labelledby="dLabel">
         <li data-value="option-1"><a href="#">Action</a></li>
         <li data-value="option-2"><a href="#">Another action</a></li>
         <li data-value="option-3"><a href="#">Something else here</a></li>
         <li role="separator" class="divider"></li>
         <li data-value="option-4"><a href="#">Separated link</a></li>
     </ul>
 </div>
```
As long as it's a part of a `<form>` which can be sent, the droplect's value in our sample can be accessed by accessing the `my-no-more-selects` POST/GET request parameter.

### Multiple-selection mode
If you want to use a droplect in multi-selection mode you just need to add `data-multiple="multiple"` attribute setting into its button and leave it without any `data-map-to` as of multiple selection mapping should be managed by your hand, using an HTML solution to keep better consistency and flexibility of your markup.

In this sample code below we use checkbox inputs, you probably noticed that all the `data-value` attributes are used regardless the use of `value` attributes of `<input>` tags.
```html
<div class="dropdown">
	<button id="multisel-droplect" type="button" class="btn btn-default btn-droplect form-control" data-toggle="droplect" data-multiple="multiple" aria-haspopup="true" aria-expanded="false">Combine my options! <span class="caret"></span></button>
	<ul class="droplect dropdown-menu" aria-labelledby="multisel-droplect">
		<li class="dropdown-header">Choose something</li>
		<li data-value="option-1"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-1">Action</label></a></li>
		<li data-value="option-2"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-2">Another action</label></a></li>
		<li data-value="option-3"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-3">Something else here</label></a></li>
	    <li role="separator" class="divider"></li>
	    <li data-value="option-4"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-4">Separated link</label></a></li>
	</ul>
</div>
```

### Events to be observed

You can listen a toggled DOM element for events when they triggered eg. by using
```javascript
$('[data-toggle="droplect"]').on(...)
```

Events supported by Droplect.js are:

- `hide.bs.droplect` will be triggered when droplects going to be hidden (thus, **before** of dropdown menu hide),
- `hidden.bs.droplect` will be triggered when droplects are hidden from now on (so **after** of dropdown menu hide),
- `show.bs.droplect` will be triggered when droplects going to be shown (it is **before** of dropdown menu became visible),
- `shown.bs.droplect` will be triggered when droplects became visibly (which is **after** of dropdown menu appeared visibly), additionally a `focus` event will be triggered on latest selected option's `<a>` element after of this was happened,
- `select.bs.droplect` will be triggered after a value selected from the list of options you provided,
- `focus` will be triggered after a value selected and droplect closed its dropdown, this is because of usablitiy issues,

Also, you can observe `change` events on the DOM element which used for mapping selection defined in `data-map-to` attribute.

### Living Samples of Usage

Want a living trial of what is this? You can! Simply visit https://jsfiddle.net/7raekpqp/ in order to have some fun :)

### Pre-selected State

In most of cases we use form input components rendered on the server-side thus we might need to display them populated and/or selected. This is also possible with Droplect.js which means you can define what option(s) selected by default, representing eg. a list of selection stored previously for a user, by using `data-selected="selected"` attributes:

For single-selection mode:
```html
 <li data-value="option-1"><a href="#">Action</a></li>
 <li data-value="option-2" data-selected="selected"><a href="#">Another action</a></li>
 <li data-value="option-3"><a href="#">Something else here</a></li>
```

For multi-selection mode:
```html
<li data-value="option-1" data-selected="selected"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-1" checked>Action</label></a></li>
<li data-value="option-2"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-2">Another action</label></a></li>
<li data-value="option-3" data-selected="selected"><a href="#" class="checkbox"><label><input type="checkbox" name="multisel[]" value="option-3" checked>Something else here</label></a></li>
```
> You may noticed that the checkbox of item we marked as selected also marked as `checked`, so you should maintain the state of checkboxes as well.

A demo presents this feature in work at https://jsfiddle.net/7raekpqp/1/ so you could check it.

## Legal info
This component based on the original Bootstrap v3.3.7 dropdown.js, although I changed the most of it it's about time to credits for original dropdown's authors - thanks guys!

By the way I'm not much into legals and stuff I mention to my code under the terms of [WTFPL](http://www.wtfpl.net/).