import pandas as pd

def turn_weekly(df: pd.DataFrame):
    # Assumption: column is named 'date'
    df.set_index('date').groupby