import logging
import math

import pandas as pd

from insight import Insight
from insight import UiTextItem
from util import to_weekly, to_yearly, to_monthly, get_ui_and_voice_text, to_change_percent, VALUE_LIMIT

logger = logging.getLogger('COMP')


def make_national_comparison_insight(
        metric: str,
        delta: str,
        change_percent: int
) -> Insight:
    positive = change_percent >= 0
    ui_text = ['National',
               UiTextItem(metric.capitalize(), 1),
               'are' if metric.endswith('s') else 'is',
               UiTextItem('up', 1) if positive else UiTextItem('down', 1),
               UiTextItem(str(math.ceil(abs(change_percent))) + '%', 1),
               'this',
               UiTextItem(str(delta).capitalize(), 0.5)
               ]
    ui_text, voice_text = get_ui_and_voice_text(ui_text)

    # impact depends on change severity
    return Insight(metric, change_percent / 10, ui_text, voice_text, None)


def make_comparison_insight(
        metric: str,
        category: str,
        item: str,
        delta: str,
        change_percent: int
) -> Insight:
    positive = change_percent >= 0
    ui_text = [UiTextItem(metric, 1),
               ('of ' + category.capitalize()) if category != 'product group' else 'of',
               UiTextItem(item.capitalize(), 1),
               'are' if metric.endswith('s') else 'is',
               UiTextItem('up', 1) if positive else UiTextItem('down', 1),
               UiTextItem(str(math.ceil(abs(change_percent))) + '%', 1),
               'this',
               UiTextItem(str(delta).capitalize(), 0.5)
               ]
    ui_text, voice_text = get_ui_and_voice_text(ui_text)

    # impact depends on change severity
    return Insight(metric, change_percent / 10, ui_text, voice_text, None)


def get_comparisons(df: pd.DataFrame) -> list[Insight]:
    insights = []
    insights += get_typed_comparisons(df, 'sales', 'month', 'product group', 'hierarchy1_id')
    insights += get_typed_comparisons(df, 'sales', 'week', 'product', 'product_id')
    insights += get_global_comparisons(df, 'sales', 'month')
    insights += get_global_comparisons(df, 'revenue', 'year')
    insights += get_global_comparisons(df, 'sales', 'week')
    return insights


def get_global_comparisons(df: pd.DataFrame, metric: str, t_delta: str) -> list[Insight]:
    insights = []

    comp_val, curr_val = get_comparison(df, metric, t_delta)
    change_percent = to_change_percent(comp_val, curr_val)
    insights.append(
        make_comparison_insight(
            metric, 'global', 'global', t_delta, change_percent
        )
    )

    # get sales comparison yearly
    logger.info(f'Added global {metric} comparisons for {t_delta}')
    return insights


def get_typed_comparisons(df: pd.DataFrame, metric: str, t_delta: str, type: str, type_id: str) -> list[Insight]:
    insights = []
    type_enum = df[type_id].drop_duplicates()
    for type_value in type_enum[:VALUE_LIMIT]:
        equals_type_value = df[type_id] == type_value
        df_tv = df.loc[equals_type_value]

        steps = 30  # TODO

        comp_val, end_val = get_comparison(df_tv, metric, t_delta)
        change_percent = to_change_percent(comp_val, end_val)
        insights.append(
            make_comparison_insight(metric, type, type_value, t_delta, change_percent)
        )

    logger.info(f'Added {type} {metric} comparisons for {t_delta}')

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
