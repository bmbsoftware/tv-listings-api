# TV Listings API
This API provides a way to generate custom program guides in the XMLTV format. The guide can then be easily be imported into Tvheadend or other similar utilities that use XMLTV formatted program guides.
## Usage
The API can be used by adding a new `tvListings.json` file to the data directory (See the example file). This can contain as many channels and programs as you wish. My use case was to create a simple program guide for a group of online weather cameras.

There is a single endpoint exposed from the API:
```
{protocol}://{apiUrl}:{port}/api/xml/tvlistings/{number_of_days_to_return}
```

The information in the `tvListings.json` file will be parsed, and the program information will be returned for the number of days requested.

## Docker
An included Dockerfile will allow easy setup and running of the API. The container image can easily be combined with other containers in a Docker Compose setup to provide a robust streaming TV solution.
