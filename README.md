![grafik](https://user-images.githubusercontent.com/23716586/143298832-6e8b7692-48d3-4a28-be31-e8e00ddda4f1.png)

[Winning submission](https://devpost.com/software/instasights) for the **SAP challenge** "Business Analytics meets Generation Z" at [hackaTUM 2021](https://hackatum21.devpost.com/submissions/search?utf8=%E2%9C%93&prize_filter%5Bprizes%5D%5B%5D=50427).

# Instasights
Instasights provides instant insights into the development of your business. Through bite-sized Instagram-stlye stories insights can be easily processed and prioritized.
Enjoy a working prototype by opening the [Instasights web app](https://hackatum-instasights.web.app/) in Google Chrome on your laptop or your smartphone. 

## Inspiration
**Modern companies** require **modern leadership**. Nowadays business insights are often presented in cluttered, bloated and boring dashboards. However, through the likes of TikTok and Instagram, the **next generation of leaders** is much more accustomed to consuming **information in short and fun bite-sized pieces**. We aim to bridge this gap.

## What it does
**Instasights** offers an instant overview of the **latest important company insights** though **Instagram-like stories**. Our web app includes **audio-visual** stories that present short summaries of the most important recent insights gathered though our **data analysis** in the backend. **Color coding and animation** of the summary texts **based on business impact** allows for even easier processing. We even offer a **daily briefing** that includes the most important insights from all topics. We also include summarized relevant business news that can provide **context for developments** within the company.
Additionally, stories can include **polls among the companies leadership** to evaluate whether one of the automatically found trends requires instant action.

## How we built it
We built the web app using **Angular** in combination with Ionic. The data for the stories is fetched from a **Flask server**. The server generates the insights from the provided [kaggle dataset](https://www.kaggle.com/berkayalan/retail-sales-data) using **kats** (including Prophet), **pandas** and **Python**. Insights are delivered to the frontend using a custom and generic format that is independent of the used dataset. We use the browser's **text-to-speech** capabilities to narrate stories and leverage Unsplash to get an image that fits the context.
