// Require an unambiguous labelled value before a model match can pass hard numeric filters.
const amount=String.raw`(\d+(?:\.\d{3})*(?:,\d+)?)`;
function values(text,patterns) {
  const found=new Set();
  for(const pattern of patterns) {
    for(const match of text.matchAll(new RegExp(pattern,"gi"))) {
      found.add(Number(match[1].replace(/\./g,"").replace(",",".")));
    }
  }
  return [...found];
}
export function numericCheck(filters,text) {
  const checks=[];
  if(filters.max_rent_eur) {
    const label=filters.rent_kind==="warm" ? "(?:Warmmiete|Gesamtmiete)" :
      filters.rent_kind==="kalt" ? "(?:Nettokaltmiete|Kaltmiete)" : "(?:Warmmiete|Gesamtmiete|Nettokaltmiete|Kaltmiete)";
    checks.push([label,[label+"\\s*:?\\s*"+amount+"\\s*(?:€|EUR)",amount+"\\s*(?:€|EUR)\\s*"+label],n=>n<=filters.max_rent_eur,"Mietbudget"]);
  }
  if(filters.min_rooms) checks.push(["Zimmer",[amount+"\\s*(?:Zimmer|Zi\\.)","\\bZimmer\\s*:?\\s*"+amount],n=>n>=filters.min_rooms,"Zimmerzahl"]);
  if(filters.min_sqm) checks.push(["Wohnfläche",[amount+"\\s*(?:m²|qm)\\s*Wohnfläche","Wohnfläche\\s*:?\\s*(?:ca\\.\\s*)?"+amount+"\\s*(?:m²|qm)"],n=>n>=filters.min_sqm,"Wohnfläche"]);
  for(const [,patterns,ok,name] of checks) {
    const nums=values(text,patterns);
    if(!nums.length || nums.some(ok) && !nums.every(ok))return {outcome:"unknown",reason:name+" nicht eindeutig belegt.",facts:""};
    if(!nums.some(ok))return {outcome:"miss",reason:name+" außerhalb des Suchprofils.",facts:""};
  }
}
