const PUBLISHER_ID = "7021619610918878755";

export const CAMPAIGN_IDS = {
  shopee: "5364019948494167455", // ID chiến dịch Shopee mẫu
  lazada: "5364019948494167456", // ID chiến dịch Lazada mẫu
  tiki: "4348614231480407268",   // ID chiến dịch Tiki thực tế
  beautybox: "5364019948494167458", // ID chiến dịch Beautybox thực tế
  concung: "5204532880919025215", // ID chiến dịch Con Cưng thực tế
  thefaceshop: "4679977611385258995", // ID chiến dịch The Face Shop thực tế
  bestme: "4847393244670897258" // ID chiến dịch Bestme thực tế
} as const;

interface AffiliateConfig {
  rawProductUrl: string;
  articleId: string;
  campaignId: keyof typeof CAMPAIGN_IDS;
  ingredientTag?: string;
  saleSeason?: string;
}

export function generateStandardATLink({
  rawProductUrl,
  articleId,
  campaignId,
  ingredientTag = "general",
  saleSeason = "july-2026"
}: AffiliateConfig): string {
  if (!rawProductUrl) return "";
  const cId = CAMPAIGN_IDS[campaignId];

  // Mã hóa Base64 an toàn cho cả môi trường Node (server) và Browser (client)
  const base64Url = typeof window !== "undefined"
    ? window.btoa(unescape(encodeURIComponent(rawProductUrl)))
    : Buffer.from(rawProductUrl).toString("base64");

  const encodedUrlEnc = encodeURIComponent(base64Url);
  const dynamicSub = encodeURIComponent(articleId);
  const utmSource = encodeURIComponent("gocdadep.com");
  const utmMedium = encodeURIComponent("affiliate");
  const utmCampaign = encodeURIComponent(saleSeason);
  const utmContent = encodeURIComponent(ingredientTag);

  return `https://fast.accesstrade.com.vn/deep_link/v5/${PUBLISHER_ID}/${cId}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}&sub4=${dynamicSub}&url_enc=${encodedUrlEnc}`;
}
