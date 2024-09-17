const { JSDOM } = require("jsdom");

async function crawlPage(currnetURL) {
  console.log(`Actively crawling: ${currnetURL}`);

  try {
    const resp = await fetch(currnetURL);
    if (resp.status > 399) {
      console.log(
        `Error in fetch with status code: ${resp.status} on page: ${currnetURL}`
      );
      return;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `No HTML found, content type is ${contentType} on page: ${currnetURL}`
      );
    }
    const htmlBody = await resp.text();
  } catch (error) {
    console.log(`Error in fetch: ${error.message}, on page ${currnetURL}`);
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const element of linkElements) {
    if (element.href.startsWith("/")) {
      try {
        const urlObject = new URL(`${baseURL}${element.href}`);
        urls.push(urlObject.href);
      } catch (error) {
        console.log(`Error with relative url: ${error.message}`);
      }
    } else {
      try {
        const urlObject = new URL(element.href);
        urls.push(urlObject.href);
      } catch (error) {
        console.log(`Error with absolute url: ${error.message}`);
      }
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const urlObject = new URL(urlString);
  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
