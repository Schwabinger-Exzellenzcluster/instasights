import logging

import kats.consts
import pandas as pd
from kats.consts import TimeSeriesData
from kats.tsfeatures.tsfeatures import TsFeatures

from insight import Insight
from insight import UiTextItem

logger = logging.getLogger('FEAT')
logging.getLogger('numba').setLevel(logging.WARNING)


def get_features(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_seasonal_products(df)
    return insights


def get_seasonal_products(df: pd.DataFrame) -> list[Insight]:
    # Create time series for each product
    products = df['product_id'].drop_duplicates()
    feature_list = []
    model = TsFeatures()
    for product in products:
        # Analyze revenue for now
        equals_product = df['product_id'] == product
        df_p = df.loc[equals_product]
        ts_p = create_time_series(df_p, 'revenue')
        print("Got here")
        feature_list.append(model.transform(ts_p))

    df_features = pd.DataFrame(feature_list)

    # extract product with greatest seasonality
    p_index_max = df_features['seasonality_strength'].argmax()
    p_index_min = df_features['seasonality_strength'].argmin()

    p_max = product[p_index_max]
    p_min = product[p_index_min]

    ui_text = [
        UiTextItem(p_max, 1),
        UiTextItem('is the', 0),
        UiTextItem('most seasonal product', 0.5),
        UiTextItem(', while', 0),
        UiTextItem(p_min, 1),
        UiTextItem('is the', 0),
        UiTextItem('least seasonal product', 0.5),
    ]

    voice_text = list(
        map(
            lambda item: item.text,
            ui_text
        )
    )

    voice_text = ' '.join(voice_text)

    # impact depends on change severity
    return [Insight('revenue', 0, ui_text, voice_text)]


def create_time_series(df: pd.DataFrame, colname: str) -> kats.consts.TimeSeriesData:
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    df = df.rename(columns={'date': 'time', colname: 'value'})
    return TimeSeriesData(df)
