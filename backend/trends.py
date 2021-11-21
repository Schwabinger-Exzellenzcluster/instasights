import logging
import math

import pandas as pd
from kats.consts import TimeSeriesData
from kats.detectors.trend_mk import MKDetector

from insight import Insight
from insight import UiTextItem
from util import get_ui_and_voice_text, to_change_percent, df_to_dict, VALUE_LIMIT

logger = logging.getLogger('TRENDS')


def make_trend_insight(
        metric: str,
        category: str,
        item: str,
        window_size: int,
        start_point,
        change_percent: int,
        data_frame: pd.DataFrame
):
    positive = change_percent >= 0
    ui_text = [UiTextItem(metric.capitalize(), 1),
               ('of ' + category.capitalize()) if category != 'product group' else 'of',
               UiTextItem(item.capitalize(), 1),
               ('have' if metric.endswith('s') else 'has') + ' been',
               UiTextItem('rising', 1) if positive else UiTextItem('falling', 1),
               'since',
               UiTextItem(str(start_point.date()), 0.5),
               'for a Total of ',
               UiTextItem(str(math.ceil(change_percent)) + '%', 1)]
    ui_text, voice_text = get_ui_and_voice_text(ui_text)

    # impact depends on change severity
    return Insight(
        metric,
        change_percent / 30,
        ui_text,
        voice_text,
        df_to_dict(data_frame)
    )


def get_trends(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_typed_trends(df, 'sales', 'product group', 'hierarchy1_id')
    insights += get_typed_trends(df, 'revenue', 'store', 'store_id')
    insights += get_typed_trends(df, 'stock', 'product', 'product_id')
    return insights


def get_typed_trends(df: pd.DataFrame, metric: str, type: str, type_id: str) -> list[Insight]:
    insights = []
    type_enum = df[type_id].drop_duplicates()

    for type_value in type_enum[:VALUE_LIMIT]:
        type_value_equals = df[type_id] == type_value
        df_tv = df.loc[type_value_equals]

        # get sales trends
        window_size = 30

        # Assume weekly seasonality
        start_point_d, start_val, end_point, end_val, df_snippet_d = get_trend(
            df_tv,
            metric,
            'down',
            window_size,
            'weekly'
        )
        change_percent_d = to_change_percent(start_val, end_val)
        start_point_u, start_val, end_point, end_val, df_snippet_u = get_trend(
            df_tv,
            metric,
            'up',
            window_size,
            'weekly'
        )
        change_percent_u = to_change_percent(start_val, end_val)

        if abs(change_percent_u) > abs(change_percent_d) and start_point_u:
            insights.append(
                make_trend_insight(
                    metric,
                    'product group',
                    type_value,
                    window_size,
                    start_point_u,
                    change_percent_u,
                    df_snippet_u
                )
            )
        elif start_point_d:
            insights.append(
                make_trend_insight(
                    metric,
                    'product group',
                    type_value,
                    window_size,
                    start_point_d,
                    change_percent_d,
                    df_snippet_d
                )
            )
        del df_tv

    logger.info(f'Added {type} {metric} trends')
    return insights


def get_trend(df: pd.DataFrame, colname: str, direction: str, window_size: int, freq: str) -> tuple:
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    df.rename(columns={'date': 'time', colname: 'value'}, inplace=True)
    ts = TimeSeriesData(df)
    mkdetector = MKDetector(data=ts, threshold=0.8)

    # detect directional trend
    change_points = mkdetector.detector(window_size=window_size, direction=direction, freq=freq)
    if len(change_points) == 0:
        return None, 1, None, 1, None
    end_point = change_points[-1][0].start_time
    start_point = end_point - pd.Timedelta(days=window_size)
    end_val = df.loc[df['time'] == end_point]['value'].values[0]

    start_val = df.loc[df['time'] == start_point]['value'].values[0]

    after_start = df['time'] >= start_point
    before_end = df['time'] <= end_point
    between = after_start & before_end
    df_snippet = df.loc[between]

    return start_point, start_val, end_point, end_val, df_snippet
