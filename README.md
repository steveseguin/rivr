# rivr.js 
what
==
rivr is a micro framework for data-driven websites. Leveraging the structure of incoming JSON data, rivr performs simple website data-ingestion tasks easily, such as updating data-fields and performing data-loops of unknown length. Despite its simple function, adding custom rules and actions enable developers to build powerful and customized designs without complexity. 
why
==
rivr was built as an alternative to angular, ember, backbone, and react; sometimes you just want something super simple. 
how
==
A simple demo of rivr in action can be found here: 
https://dl.dropboxusercontent.com/u/57780/rivr/index.html

The main concept is that you create a hidden HTML template for your data, and then identify to rivr the HTML element that is the primary node (stone). From there, rivr looks at the classnames of elements and child elements for directions on what to do. Skip, loop thru the json, dig into the json, or update the element with the specific json key's value. rivr handles duplicating your hidden HTML template when there is a JSON loop and cleans things up when there is nothing.

Basic rules are implemented for common HTML elements, but if you want to do post-JSON data manipulation or custom data-attribute targets, you have to modify rivr to meet your needs.
who
==
rivr was made by someome who really hates learning other frameworks and feels overly constrained by the untalked about frustrations of them. "I JUST WANT SOMETHING SIMPLE".  If all you need is looping and data-field updating, based on some simple JSON data, rivr might be for you. Does gallerys of products, images, or other such things very simple.
dependencies
==
.. dependencies? HA! I think not. rivr is hand-coded pure javascript; it needs no mere mortal help. 
sharing
==
GPLv3.0 -- as rivr is a young and ever developing micro framework, it is very important that improvements to the framework be shared with the community; so share. Plus, we'd love to see what you are using rivr.js for!
issues
==
rivr is very strict. if the JSON and the HTML template you built do not match up, it fails. If the JSON is empty, you lose your template. if you have a very nested HTML template things will get slow. If you want to do post JSON data manipulation or events, rivr has limited structure to aid you. it is very simple, but at the same time, very easy to hack in changes. there is no purposeful support for updating data models --- you can with some hacks, but the easiest option is to just regenerate the full structure using the first element as the template: this is not appropriate for everyone.

some of these issues will be addressed in future releases.
