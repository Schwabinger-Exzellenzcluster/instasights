import pandas as pd

from insight import UiTextItem


def to_weekly(df: pd.DataFrame):
    # Assumption: column is named 'date'
    return df.resample('W', on='date').sum().reset_index()


def to_yearly(df: pd.DataFrame):
    return df.resample('Y', on='date').sum().reset_index()


def to_monthly(df: pd.DataFrame):
    return df.resample('M', on='date').sum().reset_index()


def get_ui_and_voice_text(mixed_arr: list) -> tuple:
    ui_text = list(
        map(
            lambda item: item if isinstance(item, UiTextItem) else UiTextItem(item, 0),
            mixed_arr
        )
    )

    voice_text = list(
        map(
            lambda item: item.text,
            ui_text
        )
    )

    voice_text = ' '.join(voice_text)

    return ui_text, voice_text


def to_change_percent(start_val, end_val):
    return ((end_val / start_val) - 1) * 100

def df_to_dict(df: pd.DataFrame) -> dict:
    d = {'xLabel': 'time', 'yLabel' : 'value'}
    data_x = df['time'].array
    data_y = df['value'].array

    data = list(map(
        lambda t: {'x': str(t[0]), 'y' : t[1]},
        zip(data_x, data_y)
    ))
    d.update({'data': data})
    return d
