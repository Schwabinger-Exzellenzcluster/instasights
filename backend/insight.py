class UiTextItem:
    text: str
    relevance: float

    def __init__(self, text, relevance):
        self.text = text
        self.relevance = relevance


class Insight:
    topic: str
    impact: int
    ui_text: list[UiTextItem]
    voice_text: str

    def __init__(self, topic, impact, ui_text, voice_text):
        self.topic = topic
        self.impact = impact
        self.ui_text = ui_text
        self.voice_text = voice_text

    def to_dict(self):
        d = self.__dict__
        d['ui_text'] = list(
            map(
                lambda item: item.__dict__,
                d['ui_text']
            )
        )
        return d
