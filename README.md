EXTERNAL DEPENDENCIES
=====================

- node.js

    ```
    > brew install node
    ```

- mongodb

    ```
    > brew install mongodb
    > mkdir /path/to/some/db/dir
    > mongod --dbpath /path/to/some/db/dir --smallfiles
    ```

    **DO NOT** create the db directory in the same folder as this project! Database files should never be committed to source control.

CLIENT RECORD SCHEMA
====================
The db is named `tweeviews` and the collection is named `clients`. The documents in the collection look like this:

```
{
    "name" : "xxxxxxxxx",
    "apiKey" : "xxxxxxxxx",
    "encodingKey" : "xxxxxxxxx",
    "twitterHandle" : "xxxxxxxxx",
    "consumerKey": "xxxxxxxxx",
    "consumerSecret": "xxxxxxxxx",
    "accessTokenKey": "xxxxxxxxx",
    "accessTokenSecret": "xxxxxxxxx",
    "products" : [
        {
            "externalId" : "0000",
            "hashTag" : "#tag"
        },
        {
            "externalId" : "0001",
            "hashTag" : "#tag"
        }
    ]
}
```

Working with Client Documents
-----------------------------
1. To work in the db, directly, launch `mongo` in Terminal and run

    ```
    use tweeviews
    db.clients.find()
    db.clients.find({ "name" : "clientName" })
    ```

    See the [mongodb reference](http://docs.mongodb.org/manual/reference/) for more operations.

1. In node.js, we use the [mongodb](https://www.npmjs.org/package/mongodb) npm package with singleton db and collections objects created at server start via [dbConnection.js](https://github.com/95civicdude/tweeviews/blob/master/data/dbConnection.js). You probably will never need to access the db object; just use the collections object. To work on documents, do this:

    ```
    var dbConnection = require("dbConnection.js");

    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : "clientName"
        }).each(function(err, client) {
            if (err) {
                throw err;
            }

            // do stuff with the document
            console.log(JSON.stringify(client, null, "    "));
        });
    });
    ```

To add a new client, use the form on [http://localhost:3000/clients/](http://localhost:3000/clients/).

To add a new campaign for a client, use [http://localhost:3000/campaigns/](http://localhost:3000/campaigns/).

TWITTER POLLER
==============
The Twitter poller is on by default and set to poll every 60 seconds. To turn the Twitter poller on or off, uncomment or comment out this line of code in [twitterPoller.js](https://github.com/95civicdude/tweeviews/blob/master/data/twitterPoller.js):

```
startSearchPoll(client);
```

You can search the source or look around [line 161](https://github.com/95civicdude/tweeviews/blob/master/data/twitterPoller.js#L161) to change the wait time between polls.