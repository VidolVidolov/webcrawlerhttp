const { JSDOM } = require("jsdom");

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Pages
): Promise<Record<string, number>> {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentURL);

  if (baseURLObject.hostname !== currentURLObject.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;
  console.log(`Actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `Error in fetch with status code: ${resp.status} on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType || !contentType.includes("text/html")) {
      console.log(
        `No HTML found, content type is ${
          contentType || "unknown"
        } on page: ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await resp.text();
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }

    return pages;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error in fetch: ${error.message}, on page ${currentURL}`);
    } else {
      console.log(`Unknown error occurred on page ${currentURL}`);
    }
    return pages;
  }
}

export function getURLsFromHTML(htmlBody: string, baseURL: string) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const element of linkElements) {
    if (element.href.startsWith("/")) {
      try {
        const urlObject = new URL(`${baseURL}${element.href}`);
        urls.push(urlObject.href);
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Error with relative url: ${error.message}`);
        } else {
          console.log(`Unknown error occurred on page ${baseURL}`);
        }
      }
    } else {
      try {
        const urlObject = new URL(element.href);
        urls.push(urlObject.href);
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Error with absolute url: ${error.message}`);
        } else {
          console.log(`Unknown error occurred on page ${baseURL}`);
        }
      }
    }
  }

  return urls;
}

export function normalizeURL(urlString: string) {
  const urlObject = new URL(urlString);
  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
