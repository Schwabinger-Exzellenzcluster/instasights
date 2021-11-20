import logging
import math

import pandas as pd
from insight import Insight
from kats.detectors.trend_mk import MKDetector
from kats.consts import TimeSeriesData
from kats.models.prophet import ProphetModel, ProphetParams
from insight import UiTextItem

logger = logging.getLogger('PREDICT')


def make_prediction_insight(
        type: str,
        category: str,
        item: str,
        positive: bool,
        steps: int,
        change_percent: int
) -> Insight:
    ui_text = [UiTextItem(type, 1),
               'of',
               UiTextItem(category, 0),
               UiTextItem(item, 1),
               'are predicted to',
               UiTextItem('rise', 1) if positive else UiTextItem('fall', 1),
               UiTextItem(str(math.ceil(change_percent)) + '%', 1),
               'within',
               UiTextItem(str(steps), 0.5),
               'days']
    ui_text = list(
        map(
            lambda item: item if isinstance(item, UiTextItem) else UiTextItem(item, 0),
            ui_text
        )
    )

    voice_text = list(
        map(
            lambda item: item.text,
            ui_text
        )
    )

    voice_text = ' '.join(voice_text)

    # impact depends on change severity
    return Insight(type, change_percent / 10, ui_text, voice_text)


def make_stock_alter_insight(store: str, product: str, steps: int) -> Insight:
    ui_text = ['Stock of ',
               UiTextItem(product, 1),
               'in store',
               UiTextItem(store, 0),
               'is predicted to',
               UiTextItem('run out', 1),
               'within',
               UiTextItem(str(steps), 0.5),
               'days']
    ui_text = list(
        map(
            lambda item: item if isinstance(item, UiTextItem) else UiTextItem(item, 0),
            ui_text
        )
    )

    voice_text = list(
        map(
            lambda item: item.text,
            ui_text
        )
    )

    voice_text = ' '.join(voice_text)

    # impact depends on change severity
    return Insight('stock', -3, ui_text, voice_text)


def get_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_store_type_predictions(df)
    insights += get_store_predictions(df)
    return insights


def get_store_type_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    store_types = df['storetype_id'].drop_duplicates()
    for store_type in store_types:
        equals_store_type = df['storetype_id'] == store_type
        df_st = df.loc[equals_store_type]

        steps = 30
        # get sales predictions
        curr_value, frcst_val = get_prediction(df_st, 'sales', steps)
        change_percent = ((frcst_val / curr_value) - 1) * 100
        insights.append(
            make_prediction_insight('sales', 'store type', store_type, change_percent >= 0, steps, change_percent)
        )

        # get revenue predictions
        curr_value, frcst_val = get_prediction(df_st, 'revenue', steps)
        change_percent = ((frcst_val / curr_value) - 1) * 100
        insights.append(
            make_prediction_insight('revenue', 'store type', store_type, change_percent >= 0, steps, change_percent)
        )
        del df_st

    logger.debug('Added store type predictions')

    return insights


def get_store_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    stores = df['store_id'].drop_duplicates()

    # random selection of stores
    for store in stores[10:16]:
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
            curr_value, frcst_val = get_prediction(df_p, 'stock', steps)

            # Are we running out of stock
            if (frcst_val <= 0):
                insights.append(make_stock_alter_insight(store, product, steps))
                break

    logger.debug('Added store predictions')

    return insights


def get_prediction(df: pd.DataFrame, colname: str, steps: int) -> int:
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

    return curr_val, frcst_val
