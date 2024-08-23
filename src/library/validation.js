function extractDomain(url) {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "([a-z\\d]([a-z\\d-]*[a-z\\d])*(\\.[a-z]{2,})+)" +
      "(\\/[\\w\\d%_.~+-]*)*$",
    "i"
  );

  if (urlPattern.test(url)) {
    try {
      const hostname = new URL(url).hostname;
      return hostname;
    } catch (e) {
      const hostname = new URL("http://" + url).hostname;
      return hostname;
    }
  }
  return null;
}

// const url =
//   "https://www.amazon.in/gp/your-account/order-history/?ref=ppx_pt2_dt_b_sao_in";

// console.log(extractDomain(url));

async function fetchFavicon(domain) {
  const response = await fetch(`https://logo.clearbit.com/${domain}`);
  if (response.ok) {
    return response.url;
  } else {
    throw new Error("Favicon not found");
  }
}

module.exports = extractDomain;
module.exports = fetchFavicon;
