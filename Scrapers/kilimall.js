const ScrapeKilimall = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  let info = data.data.products;

  let itemInfo = info.map((el, idx) => ({
    uid: el.goods_id,
    source: "Kilimall",
    name: el.name,
    imageUrl: el.images["ORIGIN"],
    price: el.price_unit,
  }));

  let urls = itemInfo.map((ids, ix) => {
    return `https://api.kilimall.com/ke/v1/product/comment/list?goodsId=${ids.uid}&page=1&size=3`;
  });

  // console.log(urls);

  // let requests = urls.map((url) => fetch(url));

  let reviews = await Promise.all(urls.map((url) => fetch(url)))
    .then((resp) => Promise.all(resp.map((r) => r.json())))
    .then((result) => {
      // console.log(result);
      return result.map((pd) => pd.data.list);
    });

  return reviews;
};

ScrapeKilimall(
  "https://api.kilimall.com/ke/v1/product/search?size=40&page=1&brand_id=&keyword=iphone+x&order=&min=&max=&free_shipping=&have_gift=&logistic_type=&search_type=filter_search"
);
