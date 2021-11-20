import os
import requests

key = os.environ.get('SMMRY')
smmry_url = "https://api.smmry.com"

def get_summary(text):
    r = requests.get()