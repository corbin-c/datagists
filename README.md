# DataGists

JS module for data storage & retrieval on [Github's Gists](https://gist.github.com/).
It makes use of [Github's API v3](https://developer.github.com/v3/).

To run DataGists, import it first:

`import { DataGists } from "./gists.js";`

Then you can create a DataGists object, which can be fed two parameters: Auth
Token (Mandatory, can be obtained at https://github.com/settings/tokens - todo:
OAuth should be used instead). Second parameter is the Id of the Gist you want
to use. This is optional, not providing it will create a new private gist.

`let dgObj = new DataGists(auth_token,[gists_id]);`

Once created, DataGists object has to be initialized, this will check the auth
token & gist ID. Inconsistent data will raise exceptions:

`dgObj.init();`

As this function fetches Github's API, you might want to wait for it being done
before doing something else, with `await` operator.