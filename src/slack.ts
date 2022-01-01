import axios, { AxiosError } from "axios";

export interface SlackExporterProperties {
  title: string;
  content: string;
  rating: number;
  version: string;
  author_name: string;
  date: string;
  title_link: string;
}

const review_colormap = {
  1: "#C72856",
  2: "#C76628",
  3: "#91C728",
  4: "#29C728",
  5: "#2874C7",
};

const URL = "";

const instance = axios.create({
  headers: { "Content-Type": "application/json" },
});

export function slackExporter(properties: SlackExporterProperties) {
  const ts = new Date(properties.date).getTime() / 1000;
  const rating = properties.rating as keyof typeof review_colormap;
  const payloadData = {
    attachments: [
      {
        fallback: properties.content,
        color: review_colormap[rating],
        author_name: properties.author_name,
        title: properties.title,
        title_link: properties.title_link,
        text: properties.content,
        fields: [
          {
            title: "Rating",
            value: Array(properties.rating + 1).join(":star:"),
            short: true,
          },
          {
            title: "Version",
            value: properties.version,
            short: true,
          },
        ],
        ts: ts,
      },
    ],
  };

  instance
    .post(URL, JSON.stringify(payloadData))
    // エラー応答の構造を明示する
    .catch((e: AxiosError) => {
      if (e.response !== undefined) {
        // e.response.data.errorはstring
        console.error(e.response.data);
      }
    });
}
