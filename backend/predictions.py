import pandas as pd
from insight import Insight
from kats.detectors.trend_mk import MKDetector
from kats.consts import TimeSeriesData
from kats.models.prophet import ProphetModel, ProphetParams
from insight import UiTextItem


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
               UiTextItem(str(change_percent) + '%', 1),
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
    return Insight(type, abs(change_percent) / 10, ui_text, voice_text)


def get_predictions(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_store_type_predictions(df)
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

    return insights


def get_prediction(df: pd.DataFrame, colname: str, steps: int) -> int:
    # create time series
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    df = df.rename(columns={'date': 'time',  colname: 'value'})
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
