function printReport(pages) {
  console.log("========================");
  console.log("REPORT");
  console.log("========================");

  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const url = page[0];
    const hits = page[1];
    console.log(`Found ${hits} links to page: ${url}`);
  }

  console.log("========================");
  console.log("END REPORT");
  console.log("========================");
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);

  pagesArray.sort((a, b) => {
    return b[1] - a[1];
  });

  return pagesArray;
}

module.exports = {
  sortPages,
  printReport,
};
