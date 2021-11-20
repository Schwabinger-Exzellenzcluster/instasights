import logging
import math

import pandas as pd
from insight import Insight
from kats.detectors.trend_mk import MKDetector
from kats.consts import TimeSeriesData
from kats.models.prophet import ProphetModel, ProphetParams
from insight import UiTextItem

logger = logging.getLogger('COMP')

def make_comparison_insight(
        type: str,
        category: str,
        item: str,
        positive: bool,
        delta: str,
        change_percent: int
) -> Insight:
    ui_text = [UiTextItem(type, 1),
               'of',
               UiTextItem(category, 0),
               UiTextItem(item, 1),
               'are',
               UiTextItem('up', 1) if positive else UiTextItem('down', 1),
               UiTextItem(str(math.ceil(change_percent))  + '%', 1),
               'this',
               UiTextItem(str(delta), 0.5)
               ]
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


def get_comparisons(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_global_comparisons(df)
    return insights


def get_global_comparisons(df: pd.DataFrame) -> list[Insight]:
    insights = []
    steps = 30
    # get sales comparisons
    t_delta = 'year'
    comp_val, curr_val = get_comparison(df, 'sales', t_delta)
    change_percent = ((curr_val / comp_val) - 1) * 100
    insights.append(
        make_comparison_insight(
            'sales', 'global', 'global', change_percent >= 0, t_delta, change_percent
            )
    )

    logger.debug('Added global comparisons')
    return insights


def get_comparison(df: pd.DataFrame, colname: str, delta: str) -> tuple:
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    end_point = df['date'].values[-1]
    end_val = df[colname].values[-1]

    comp_point = end_point
    if delta == 'day':
        comp_point -= pd.Timedelta(days=1)
    elif delta == 'week':
        comp_point -= pd.Timedelta(weeks=1)
    elif delta == 'month':
        comp_point -= pd.Timedelta(days=30)
    elif delta == 'year':
        comp_point -= pd.Timedelta(days=365)

    comp_val = df.loc[df['date'] == comp_point][colname].values[0]

    return comp_val, end_val
