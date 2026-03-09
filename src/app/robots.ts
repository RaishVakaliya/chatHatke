import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/chat/"],
      },
    ],
    sitemap: "https://chathatke.tech/sitemap.xml",
    host: "https://chathatke.tech",
  };
}
