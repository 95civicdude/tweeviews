EXTERNAL DEPENDENCIES
=====================
You must have node installed. From Terminal:

    ```
    > brew install node
    ```

CLIENT RECORD SCHEMA
====================
The app expects the documents in the mongo collection to have this format:

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
1. To work in the db, directly, launch `mongo` in Terminal, connecting to the hackathon server instance. Ask around for the server URL. Then, run mongo commands against the tweeviews database and clients collection. See the [mongodb reference](http://docs.mongodb.org/manual/reference/) for mongo operations.

1. In node.js, we use the [mongodb](https://www.npmjs.org/package/mongodb) npm package with singleton db and collections objects created at server start via [dbConnection.js](https://github.com/95civicdude/tweeviews/blob/master/data/dbConnection.js). You probably will never need to access the db object; just use the collections object. To work on documents, do this:

    ```
    var dbConnection = require("dbConnection.js");

    dbConnection.getCollection(function(clients) {
        // find a client by name
        clients.find({
            "name" : "clientName"
        // loop over each client found with the given name
        }).each(function(err, client) {
            if (err) {
                throw err;
            }

            // do stuff with each client document
            console.log(JSON.stringify(client, null, "    "));
        });
    });
    ```

To add a new client, use the form on [http://localhost:3000/clients/](http://localhost:3000/clients/).

To add a new campaign for a client, use [http://localhost:3000/campaigns/](http://localhost:3000/campaigns/).

TWITTER POLLER
==============
The Twitter poller is on by default and set to poll every 10 minutes. To turn the Twitter poller off, set `data.twitterPoller.pollingInterval = 0` in [config.js](https://github.com/95civicdude/tweeviews/blob/master/config.js).

CONFIGURATION
=============
Place configuration settings in [config.js](https://github.com/95civicdude/tweeviews/blob/master/config.js).