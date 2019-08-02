# datagists

JS module for data storage &amp; retrieval on Github's Gists

To use it, you have to import it first:

`import { DataGists } from "./gists.js";`

Then you can create a DataGists object, which can be fed two parameters: Auth Token (Mandatory, can be obtained at https://github.com/settings/tokens - todo: OAuth should be used instead). Second parameter is the Id of the Gist you want to use. This is optional, not providing it will create a new private gist.

`let dgObj = new DataGists(auth_token,[gists_id]);`
