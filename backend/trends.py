import pandas as pd

from insight import Insight
import datetime


def get_trends(df: pd.DataFrame, date: datetime) -> list[Insight]:
    insights = []
    insights + get_product_trends(df, date)
    return insights


def get_product_trends(df: pd.DataFrame, date: datetime) -> list[Insight]:
    insights = []
    products = df['product_id']

    for product in products:
        pass

    return insights
