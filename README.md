Gandalf (alpha)
=======
|_0 -You shall not pass!!  ===\o/\o/

Introduction
---------------
Gandalf is an authorization and access-control module for Node.js.

The purpose of Gandalf is to have centralized authorization and a
middleware which works with [express-resource](https://github.com/visionmedia/express-resource).

"Authorization is the function of specifying access rights to resources, 
which is related to information security and computer security in general 
and to access control in particular." 
- [Wikipedia](http://en.wikipedia.org/wiki/Authorization).

If you are looking for authentication with Twitter, Google or whatsoever, 
have a look at [Passport.js](http://passportjs.org/).


Instead of following "the principle of least privilege" Gandalf will not 
interfere with any request unless you tell him to do so, resulting in the 
principle of least detriment.

Getting started
---------------
    var Gandalf      = require('gandalf'),
        bridgekeeper = Gandalf.guardTheBridge();

    app.configure(function() {
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(bridgekeeper.guard());
      return app.use(app.router);
    });

Protecting and releasing URLs
---------------
Gandalf will create an MD5 hash of every url and method combination. Example:

    GET     /forums	->  637bcc7323e8ad3a81fb6093a3bb0c60
    POST    /forums	->  c18370b07c1e3f34276ff2d7bd611975
    PUT     /forums	->  48a4e412cad3adbcc27ad1e33b12db48
    DELETE  /forums	->  511bacd922120733ef6a3a9b6ef61164

If you only want a certain user to be able to access PUT and DELETE, call
"protect" once (from an admin-page or similar):

    bridgekeeper.protect("/forums", "PUT");
    bridgekeeper.protect("/forums", "DELETE");

To open the "bridge" to everybody, just release the bridge keeper:

    bridgekeeper.release("/forums", "PUT");
    bridgekeeper.release("/forums", "DELETE");

Tests & Documentation
---------------
Doesn't exist yet.


License
-------
The MIT License

Copyright (c) 2012 Patrick Heneise, @PatrickHeneise

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.