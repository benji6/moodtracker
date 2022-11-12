import json
import os
import time
from datetime import datetime, timezone
from decimal import Decimal
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

import boto3

APP_ID = region = os.environ["OPENWEATHER_API_KEY"]
HEADERS = {"Content-Type": "application/json"}
HEADERS_WITH_CACHE_CONTROL = {
    **HEADERS,
    "Cache-Control": "immutable,max-age=31536000",
}


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


table = boto3.resource("dynamodb").Table("moodtracker_weather")


def is_valid_coord(s):
    if s.lower() == "nan":
        return False
    try:
        float(s)
        # Rounding latitude and longitude to 1 decimal place gives a resolution of about 10km (https://en.wikipedia.org/wiki/Decimal_degrees#Precision).
        # According to https://www.metoffice.gov.uk/weather/guides/observations/uk-observations-network "The average separation of stations in this network is about 40 km enabling the weather associated with the typical low pressure and frontal systems that cross the UK to be recorded. Some weather features occur on smaller scales (for example thunderstorms) and may evade the surface network altogether. For the detection of these satellites and weather radars play an important role."
        # So 10km should be a high enough resolution for weather accuracy, but also low enough for caching to have potential (may become backed by a DB in future)
        if "." in s and len(s) - s.index(".") == 2:
            return True
        return False
    except ValueError:
        return False


def handler(event, context):
    lat = event["queryStringParameters"]["lat"]
    lon = event["queryStringParameters"]["lon"]
    t = event["queryStringParameters"]["t"]

    errors = []

    if not is_valid_coord(lat):
        errors.append(
            "`lat` query string parameter is invalid: Ensure it is a number with 1 decimal place"
        )
    lat_float = float(lat)
    if lat_float < -90 or lat_float > 90:
        errors.append("`lat` is not between -90 and 90")

    if not is_valid_coord(lon):
        errors.append(
            "`lon` query string parameter is invalid: Ensure it is a number with 1 decimal place"
        )
    lon_float = float(lon)
    if lon_float < -180 or lon_float > 180:
        errors.append("`lon` is not between -180 and 180")

    if not t.isdigit():
        errors.append("`t` query string parameter is invalid: Ensure it is an integer")
    # Adds a buffer of 1 hour to allow for plenty of clock skew
    if int(t) > round(time.time() + 3600):
        errors.append(
            "`t` query string parameter is in the future: Ensure it is in the past"
        )

    if len(errors):
        print("400 errors:", errors)
        return {
            "body": json.dumps({"errors": errors}),
            "headers": HEADERS,
            "statusCode": 400,
        }

    cache_key = {
        "coordinates": f"{lat}:{lon}",
        "timestamp": int(t),
    }

    try:
        item = table.get_item(Key=cache_key).get("Item")
        if item:
            print("Cache hit")
            return {
                "body": json.dumps(item["data"], cls=DecimalEncoder),
                "headers": HEADERS_WITH_CACHE_CONTROL,
                "statusCode": 200,
            }
    except Exception as e:
        print(e)

    print("Cache miss")

    url = f"https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={t}&appid={APP_ID}"

    try:
        # consider lambda timeout if you change this timeout
        with urlopen(url, timeout=10) as response:
            body = response.read()
    except HTTPError as e:
        print("Upstream error:", e)
        return {
            "body": json.dumps({"errors": ["Upstream API HTTP error"]}),
            "headers": HEADERS,
            "statusCode": 502,
        }
    except URLError as e:
        print("Upstream error:", e)
        return {
            "body": json.dumps({"errors": ["Upstream API URL error"]}),
            "headers": HEADERS,
            "statusCode": 502,
        }
    except TimeoutError:
        print("Upstream error:", TimeoutError)
        return {
            "body": json.dumps({"errors": ["Upstream API timed out"]}),
            "headers": HEADERS,
            "statusCode": 504,
        }

    try:
        table.put_item(
            Item={
                **cache_key,
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "data": json.loads(body, parse_float=Decimal),
            }
        )
    except Exception as e:
        print(e)

    return {
        "body": body,
        "headers": HEADERS_WITH_CACHE_CONTROL,
        "statusCode": 200,
    }
