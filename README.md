# DataGists

[DataGists](https://github.com/corbin-c/datagists/) is a project by
[Clément CORBIN](https://github.com/corbin-c/). Feel free to contribute.

JS module for data storage & retrieval on [Github's Gists](https://gist.github.com/).
It makes use of [Github's API v3](https://developer.github.com/v3/).

To run DataGists, import it first:

`import { DataGists } from "https://corbin-c.github.io/datagists/DataGists.js";`

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

Now, getting a file raw content can be achieved easily:

`dgObj.getContent(file_name);`

Similarly, putting content to a file is done as follow:

`dgObj.putContent(file_name,content,[append]);`

The optional `[append]` parameter is a boolean flag. If set to true, content
will be added to the file instead of overwriting it. **Note: new content added
to the file is appended at the beggining of the file.**
