import json
import logging
import math

import pandas as pd
from kats.consts import TimeSeriesData
from kats.models.prophet import ProphetModel, ProphetParams

from insight import Insight
from insight import UiTextItem
from util import get_ui_and_voice_text, df_to_dict, VALUE_LIMIT, to_change_percent

logger = logging.getLogger('PREDICT')


def make_prediction_insight(
        metric: str,
        category: str,
        item: str,
        steps: int,
        change_percent: int,
        forecast: pd.DataFrame,
) -> Insight:
    positive = change_percent >= 0
    ui_text = [UiTextItem(metric.capitalize(), 1),
               ('of ' + category.capitalize()) if category != 'product group' else 'of',
               UiTextItem(item.capitalize(), 1),
               ('are' if metric.endswith('s') else 'is') + ' predicted to',
               UiTextItem('rise', 1) if positive else UiTextItem('fall', 1),
               UiTextItem(str(math.ceil(abs(change_percent))) + '%', 1),
               'within',
               UiTextItem(str(steps) + 'Days', 0.5),
               ]
    ui_text, voice_text = get_ui_and_voice_text(ui_text)

    # impact depends on change severity
    forecast.rename(columns={'fcst': 'value'}, inplace=True)
    return Insight(metric, change_percent / 10, ui_text, voice_text, df_to_dict(forecast))


def make_stock_alert_insight(store: str, product: str, steps: int, forecast: pd.DataFrame) -> Insight:
    ui_text = ['Stock of ',
               UiTextItem(product.capitalize(), 1),
               'in Store',
               UiTextItem(store.capitalize(), 1),
               'is predicted to',
               UiTextItem('run out', 1),
               'within',
               UiTextItem(str(steps) + ' Days', 0.5),
               ]

    ui_text, voice_text = get_ui_and_voice_text(ui_text)
    # impact depends on change severity
    return Insight('stock', -3, ui_text, voice_text, df_to_dict(forecast))


def get_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_typed_predictions(df, 'revenue', 'city', 'city_id')
    # insights += get_typed_predictions(df, 'sales', 'product', 'product_id')
    insights += get_typed_predictions(df, 'sales', 'product group', 'hierarchy1_id')
    insights += get_stock_alert_predictions(df)
    return insights


def get_typed_predictions(df: pd.DataFrame, metric: str,  type: str, type_id: str) -> list[Insight]:
    insights = []
    type_enum = df[type_id].drop_duplicates()
    for type_value in type_enum[:VALUE_LIMIT]:
        equals_type_value = df[type_id] == type_value
        df_tv = df.loc[equals_type_value]

        steps = 30  # TODO

        curr_value, frcst_val, forecast = get_prediction(df_tv, metric, steps)
        change_percent = to_change_percent(curr_value, frcst_val)
        insights.append(
            make_prediction_insight(
                metric,
                type,
                type_value,
                steps,
                change_percent,
                forecast
            )
        )

    logger.info(f'Added {type} {metric} predictions')

    return insights


def get_stock_alert_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    stores = df['store_id'].drop_duplicates()

    # random selection of stores
    count = 0
    for store in stores[:VALUE_LIMIT]:
        equals_store = df['store_id'] == store
        df_st = df.loc[equals_store]
        products = df_st['product_id'].drop_duplicates()
        for product in products:

            equals_product = df_st['product_id'] == product

            df_p = df_st.loc[equals_product]

            # product must still be in store
            if df_p['date'].max() != df_st['date'].max():
                logger.debug(f'Skipped product {product} as it was no longer in store')
                continue

            steps = 30
            # get stock alerts
            curr_value, frcst_val, forecast = get_prediction(df_p, 'stock', steps)

            # Are we running out of stock
            if (frcst_val <= 0):
                insights.append(make_stock_alert_insight(store, product, steps, forecast))
                count += 1
                if count >= 1: # Prevent long running times
                    return insights

    logger.info('Added stock alert predictions')

    return insights


def get_prediction(df: pd.DataFrame, colname: str, steps: int) -> tuple:
    # create time series
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    df = df.rename(columns={'date': 'time', colname: 'value'})
    ts = TimeSeriesData(df)

    curr_val = df['value'].values[-1]

    params = ProphetParams(seasonality_mode='multiplicative')
    m = ProphetModel(ts, params)

    # fit model
    m.fit()

    # make prediction for next 30 days
    forecast = m.predict(steps=steps, freq='D')

    end_point = forecast['time'].values[-1]
    frcst_val = forecast['fcst'].values[-1]

    return curr_val, frcst_val, forecast
