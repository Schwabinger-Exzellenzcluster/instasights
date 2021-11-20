from flask import Flask, request, send_from_directory
from trends import get_trends
from predictions import get_predictions
from comparisons import get_comparisons
import json
import pandas as pd
import logging

app = Flask(__name__)

# Read in CSV dataset
df_stores = pd.read_csv(
    'dataset/turkish_retail_data/store_cities.csv',
    delimiter=',',
    dtype={
        'store_id': 'category',
        'storetype_id': 'category',
        'city_id': 'category'
    }
    )
df_sales = pd.read_csv(
    'dataset/turkish_retail_data/sales.csv',
    delimiter=',',
    dtype={
        "product_id": "category",
        "store_id": "category",
        "promo_type_1": "category",
        "promo_bin_1": "category",
        "promo_type_2": "category",
        "promo_bin_2": "category",
        "promo_discount_2": "category",
        "promo_discount_type_2": "category"
    },
    parse_dates=["date"]
    )
df_product_hierachy = pd.read_csv(
    'dataset/turkish_retail_data/product_hierarchy.csv',
    delimiter=',',
    dtype={
        'product_id': 'category',
        'cluster_id': 'category',
        'hierarchy1_id': 'category',
        'hierarchy2_id': 'category',
        'hierarchy3_id': 'category',
        'hierarchy4_id': 'category',
        'hierarchy5_id': 'category'
    }
    )

df = df_sales.join(df_stores.set_index('store_id'), on='store_id')
df = df.join(df_product_hierachy.set_index('product_id'), on='product_id')

logging.basicConfig()
logging.root.setLevel('NOTSET')
logger = logging.getLogger('MAIN')

logger.debug('Parsing finished')

@app.route('/insights/market')
def get_market_insights():
    return send_from_directory('dataset/turkish_market_insights', 'market_insights.json')

@app.route('/')
def hello_world():
    return 'Hello, World!'


# @app.route('/insights')
def get_insights():
    end_date = ''  # request.args.get('date')
    if not end_date:
        end_date = '2019-10-01'
    before_end_date = df['date'] <= end_date
    df_cut = df.loc[before_end_date]

    insights = []
    insights += get_comparisons(df_cut)
    insights += get_predictions(df_cut)
    insights += get_trends(df_cut)

    insights = list(
        map(
            lambda insight: insight.to_dict(),
            insights
        )
    )

    print(insights)
    with open('insights.json', 'w') as f:
        f.write(json.dumps(insights))
    return json.dumps(insights)

print(get_insights())
if __name__ == '__main__':
    app.run()
