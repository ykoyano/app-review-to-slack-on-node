import gplay from "google-play-scraper";
import { slackExporter, SlackExporterProperties } from "./slack";

const options: gplay.IFnReviewsOptions = {
  appId: "test",
  sort: gplay.sort.NEWEST,
  paginate: true,
  lang: "ja",
};

interface IFixReviews {
  data: gplay.IReviewsItem[];
  nextPaginationToken: string;
}

const MAX_PAGENATION_COUNT = 10;
let pagingCount = 0;

const date = new Date();
date.setDate(date.getDate() - 1);

function getReviewLoop(nextPaginationToken: string | null) {
  pagingCount = pagingCount + 1;
  const newOption = {
    ...options,
    nextPaginationToken: nextPaginationToken,
  } as gplay.IFnReviewsOptions;

  gplay.reviews(newOption).then((data) => {
    const fixData = data as unknown as IFixReviews;
    console.log(fixData.nextPaginationToken);
    console.log(fixData.data.length);

    fixData.data
      .filter((review) => {
        return date < new Date(review.date);
      })
      .forEach((review) => {
        const properties: SlackExporterProperties = {
          title: review.text,
          content: review.text,
          rating: review.score,
          version: review.version,
          author_name: review.userName,
          date: review.date,
          title_link: review.url,
        };
        slackExporter(properties);
      });

    if (pagingCount <= MAX_PAGENATION_COUNT) {
      getReviewLoop(fixData.nextPaginationToken);
    }
  }, console.log);
}

export function getReview() {
  getReviewLoop(null);
}
