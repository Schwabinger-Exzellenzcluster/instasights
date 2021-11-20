import datetime
import logging
import math

import pandas as pd

from insight import Insight
from kats.detectors.trend_mk import MKDetector
from kats.consts import TimeSeriesData
from insight import UiTextItem

logger = logging.getLogger('TRENDS')


def make_trend_insight(
        type: str,
        category: str,
        item: str,
        positive: bool,
        window_size: int,
        start_point,
        change_percent: int
):
    ui_text = [UiTextItem(type, 1),
               'of',
               UiTextItem(category, 0),
               UiTextItem(item, 1),
               'have been',
               UiTextItem('rising', 1) if positive else UiTextItem('falling', 1),
               'since',
               UiTextItem(str(start_point.date()), 0.5),
               'for a total of ',
               UiTextItem(str(math.ceil(change_percent)) + '%', 1)]
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
    return Insight(type, change_percent / 30, ui_text, voice_text)


def get_trends(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_hierarchy_trends(df)
    return insights


def get_hierarchy_trends(df: pd.DataFrame) -> list[Insight]:
    insights = []
    hierarchies1 = df['hierarchy1_id'].drop_duplicates()

    for hierarchy in hierarchies1:
        equals_hierarchy = df['hierarchy1_id'] == hierarchy
        df_h1 = df.loc[equals_hierarchy]

        # get sales trends
        # Assume weekly seasonality
        start_point_d, start_val, end_point, end_val = get_trend(df_h1, 'sales', 'down', 'weekly')
        change_percent_d = ((end_val / start_val) - 1) * 100
        start_point_u, start_val, end_point, end_val = get_trend(df_h1, 'sales', 'down', 'weekly')
        change_percent_u = ((end_val / start_val) - 1) * 100

        if change_percent_u > change_percent_d:
            insights.append(
                make_trend_insight('sales', 'product group', hierarchy, True, 30, start_point_u, change_percent_u)
            )
        else:
            insights.append(
                make_trend_insight('sales', 'product group', hierarchy, False, 30, start_point_d, change_percent_d)
            )
        del df_h1

    logger.debug('Added product hierarchy trends')
    return insights


def get_trend(df: pd.DataFrame, colname: str, direction: str, freq : str) -> tuple:
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    df = df.rename(columns={'date': 'time', colname: 'value'})
    ts = TimeSeriesData(df)
    mkdetector = MKDetector(data=ts, threshold=0.8)

    # detect downwards trend
    window_size = 30
    change_points = mkdetector.detector(window_size=window_size, direction=direction, freq=freq)
    end_point = change_points[-1][0].start_time
    start_point = end_point - pd.Timedelta(days=window_size)
    end_val = df.loc[df['time'] == end_point]['value'].values[0]


    start_val = df.loc[df['time'] == start_point]['value'].values[0]

    return start_point, start_val, end_point, end_val
