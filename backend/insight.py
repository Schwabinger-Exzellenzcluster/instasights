import random
import uuid


class UiTextItem:
    text: str
    relevance: float

    def __init__(self, text, relevance):
        self.text = text
        self.relevance = relevance


class Insight:
    uuid
    topic: str
    impact: int
    ui_text: list[UiTextItem]
    voice_text: str
    data: dict

    def __init__(self, topic, impact, ui_text, voice_text, data):
        self.uuid = str(uuid.uuid4())
        self.topic = topic
        self.impact = impact
        self.ui_text = ui_text
        self.voice_text = voice_text
        self.data = data

    def to_dict(self):
        d = self.__dict__
        d['ui_text'] = list(
            map(
                lambda item: item.__dict__,
                d['ui_text']
            )
        )
        if d['topic'] == 'revenue':
            d['topic'] = 'finance'

        # Add random question
        questions = [
            {
                'question': 'Should this be discussed in today\'s meeting?',
                'answerA': {
                    'text': 'Yes',
                    'votes': random.randint(1, 30)
                },
                'answerB': {
                    'text': 'No',
                    'votes': random.randint(1, 30)
                }

            },
            {
                'question': 'Does this require immediate action?',
                'answerA': {
                    'text': 'Yes',
                    'votes': random.randint(1, 30)
                },
                'answerB': {
                    'text': 'No',
                    'votes': random.randint(1, 30)
                }

            },
            {
                'question': 'When does this need to be addressed?',
                'answerA': {
                    'text': 'within a week',
                    'votes': random.randint(1, 30)
                },
                'answerB': {
                    'text': 'Sometime later',
                    'votes': random.randint(1, 30)
                }

            }
        ]

        if random.choice([0,1]) == 0:
            d['poll'] = random.choice(questions)
        else:
            d['poll'] = None

        return d
