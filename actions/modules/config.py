import os

MONGODB_STRING = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
WEATHER_KEY= os.environ.get("WEATHER_KEY", "eqerqerfwrw")
WEATHER_ID= os.environ.get("WEATHER_ID", "fwefwrgrgregte")
APP_URL= os.environ.get("APP_URL", "http://localhost:5000")