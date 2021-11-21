import logging
import math

import pandas as pd

from insight import Insight
from insight import UiTextItem
from util import to_weekly, to_yearly, to_monthly, get_ui_and_voice_text

logger = logging.getLogger('COMP')

def make_comparison_insight(
        type: str,
        category: str,
        item: str,
        delta: str,
        change_percent: int
) -> Insight:
    positive = change_percent >= 0
    ui_text = ['National',
               UiTextItem(type.capitalize(), 1),
               'are' if type.endswith('s') else 'is',
               UiTextItem('up', 1) if positive else UiTextItem('down', 1),
               UiTextItem(str(math.ceil(abs(change_percent))) + '%', 1),
               'this',
               UiTextItem(str(delta).capitalize(), 0.5)
               ]
    ui_text, voice_text = get_ui_and_voice_text(ui_text)

    # impact depends on change severity
    return Insight(type, change_percent / 10, ui_text, voice_text, None)


def get_comparisons(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_global_comparisons(df, 'sales')
    return insights


def get_global_comparisons(df: pd.DataFrame, metric: str) -> list[Insight]:
    insights = []

    # get sales weekly
    t_delta = 'month'
    comp_val, curr_val = get_comparison(df, metric, t_delta)
    change_percent = ((curr_val / comp_val) - 1) * 100
    insights.append(
        make_comparison_insight(
            metric, 'global', 'global',t_delta, change_percent
        )
    )

    # get sales comparison yearly
    logger.info(f'Added global {metric} comparisons')
    return insights


def get_comparison(df: pd.DataFrame, colname: str, delta: str) -> tuple:
    df = df.groupby(by=['date'])[colname].sum().to_frame().reset_index()
    if delta == 'day':
        # do nothing
        pass
    elif delta == 'week':
        df = to_weekly(df)
    elif delta == 'month':
        df = to_monthly(df)
    elif delta == 'year':
        df = to_yearly(df)

    # dont take last value due to resampling anomalies
    end_point = df['date'].values[-2]
    end_val = df[colname].values[-2]

    comp_point = df['date'].values[-3]
    comp_val = df[colname].values[-3]
    return comp_val, end_val
