EXTERNAL DEPENDENCIES
=====================

- node.js

        > brew install node

- mongodb (local to this project)

        > brew install mongodb
        > mkdir /path/to/some/db/dir
        > mongod --dbpath /path/to/some/db/dir --smallfiles

CLIENT RECORD SCHEMA
====================

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

To add a new client, use the form on [http://localhost:3000/clients/](http://localhost:3000/clients/).
To add a new campaign for a client, use [http://localhost:3000/campaigns/](http://localhost:3000/campaigns/).