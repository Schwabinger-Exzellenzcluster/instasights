import gc
import json
import logging

import pandas as pd
from flask import Flask, send_from_directory
from flask_cors import CORS

from comparisons import get_comparisons
from predictions import get_predictions
from trends import get_trends

app = Flask(__name__)
CORS(app)

logging.basicConfig()
logging.root.setLevel('INFO')
logger = logging.getLogger('MAIN')

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

logger.info('Parsed stores data')

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
# Drop unused columns
df_sales.drop(
    columns=['promo_type_1', 'promo_type_2', 'promo_bin_2', 'promo_discount_2', 'promo_discount_type_2'],
    inplace=True
)

logger.info('Parsed sales data')

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

df_product_hierachy.drop(
    columns=['hierarchy2_id', 'hierarchy3_id', 'hierarchy4_id', 'hierarchy5_id', 'cluster_id'],
    inplace=True
)

logger.info('Parsed product hierarchy data')


df = df_sales.join(df_stores.set_index('store_id'), on='store_id')
# df = df.join(df_product_hierachy.set_index('product_id'), on='product_id')
del df_sales, df_stores
gc.collect()

end_date = '2019-10-01'
before_end_date = df['date'] <= end_date

df_cut = df.loc[before_end_date]
del df
gc.collect()

logger.info('Joined and Cut sales data')

# Adjust city names
cities_dict = {row[0]: row[1] for row in pd.read_csv(
    'dataset/augmented_sets/cities_augmented.csv',
    delimiter=';',
    dtype={
        'city_id': 'category',
        'name': 'category'
    }
).values.tolist()}
df_cut.replace(to_replace=cities_dict, inplace=True)
logger.info('Parsed augmented city data')


# Adjust store names
stores_dict = {row[0]: row[1] for row in pd.read_csv(
    'dataset/augmented_sets/cities_augmented.csv',
    delimiter=';',
    dtype={
        'store_id': 'category',
        'name': 'category'
    }
).values.tolist()}
df_cut.replace(to_replace=stores_dict, inplace=True)
logger.info('Parsed augmented store data')

# Adjust product names and categories
df_product_mapping = pd.read_csv(
    'dataset/augmented_sets/products_augmented.csv',
    delimiter=';',
    dtype={
        'product_id': 'category',
        'name': 'category',
        'hierarchy1_id': 'category',
    }
)

h1_index = df_product_hierachy.columns.get_loc('hierarchy1_id')
products_dict = {row[0]: row[1] for row in df_product_mapping.values.tolist()}
categories_dict = {row[0]: row[2] for row in df_product_mapping.values.tolist()}
old_categories_dict = {row[0]: row[h1_index] for row in df_product_hierachy.values.tolist()}

print(old_categories_dict)
print(categories_dict)

new_categories_dict = {old_categories_dict[key] : categories_dict[key] for key in old_categories_dict}
print(new_categories_dict)

df_product_mapping.drop(columns=['name'], inplace=True)

logger.info('Parsed augmented product data')

print(df_cut)
logger.info('Parsing finished')

insights = []
# add different insights
insights += get_comparisons(df_cut)
insights += get_predictions(df_cut)
insights += get_trends(df_cut)
# Broken due to some reason
# insights += get_features(df_cut)


# convert to dict
insights = list(
    map(
        lambda insight: insight.to_dict(),
        insights
    )
)
print(insights)
with open('insights.json', 'w') as f:
    f.write(json.dumps(insights))


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/insights')
def get_insights():
    res = json.dumps(insights + json.load(open('dataset/news/small_news.json')))
    return


@app.route('/insights/market')
def get_market_insights():
    return send_from_directory('dataset/turkish_market_insights', 'market_insights.json')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
