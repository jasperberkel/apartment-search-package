import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
export const origin = "https://www.immobilienscout24.de";
export const startURL = origin + "/Suche/de/wohnung-mieten";

export class SourceIssue extends Error {}
const blocked = /ich bin kein roboter|captcha|access denied|zugriff (?:verweigert|gesperrt)|ungewöhnliche(?:r|n)? (?:zugriffe|datenverkehr)|verify (?:you are|that you are) human/i;
export function checkPage(page) {
  if (blocked.test(page.notice)) throw new SourceIssue("Zugriffssperre bei ImmoScout24");
  if (new URL(page.url).origin !== origin) throw new SourceIssue("Unerwartete Weiterleitung");
}

// Executed in Chromium. Only read the public page as rendered, never embedded state or private APIs.
export function readPage() {
  const main = document.querySelector("main") || document.body;
  const notice = document.title + "\n" + document.body.innerText.slice(0,2500);
  const cards = new Map();
  for (const link of main.querySelectorAll("a[href*='/expose/']")) {
    const url = new URL(link.href);
    const id = /^\/expose\/(\d+)\/?$/.exec(url.pathname)?.[1];
    if (!id || url.origin !== "https://www.immobilienscout24.de" || cards.has(id)) continue;
    let box = link.closest("[data-obid], [data-id], article, li");
    if (!box || Array.from(box.querySelectorAll("a[href*='/expose/']")).some(a => new URL(a.href).pathname.replace(/\/$/,"") !== "/expose/"+id)) box = link;
    if (!box.getClientRects().length) continue;
    const title = (box.querySelector("h2,h3,h4")?.innerText || link.innerText || link.getAttribute("aria-label") || "").trim().slice(0,400);
    const facts = box.innerText.split("\n").map(s=>s.trim()).filter(s=>s && !/^(?:neu|gesponsert|merk(?:en|liste)|vor \d+ (?:minuten|stunden|tagen)|heute|gestern)$/i.test(s)).join("\n").slice(0,1800);
    cards.set(id,{id,url:url.origin+"/expose/"+id,title,facts,photo:box.querySelector("img")?.currentSrc || null});
  }
  const next = Array.from(main.querySelectorAll("a[href]")).find(a=>a.rel==="next" || /^(?:nächste(?: seite)?|weiter)$/i.test(a.getAttribute("aria-label") || a.innerText.trim()));
  const selected = Array.from(document.querySelectorAll("h1, [aria-selected=true], [class*=chip], [class*=Chip], [class*=breadcrumb], [data-testid*=location]"))
    .filter(e=>e.getClientRects().length).map(e=>e.value || e.innerText || "").join("\n").slice(0,5000);
  const details = main.innerText.slice(0,14000);
  return {url:location.href,notice,selected,cards:[...cards.values()],next:next?.href,
    empty:/keine (?:passenden )?(?:angebote|ergebnisse|treffer)|\b0 (?:angebote|treffer|ergebnisse)/i.test(notice),
    details,photo:main.querySelector("picture img, figure img, img[itemprop=image]")?.currentSrc || null};
}

export async function command(...args) {
  const {stdout} = await run("openclaw",["browser","--browser-profile","openclaw","--json",...args],
    {timeout:45000,maxBuffer:5*1024*1024});
  return JSON.parse(stdout);
}
const norm = s=>s.normalize("NFKC").toLocaleLowerCase("de").replace(/\s+/g," ").trim();
function formRef(snapshot,roles,label) {
  for (const line of snapshot.split("\n")) {
    const match = line.match(/^\s*-\s+(button|textbox|combobox|option|link|searchbox|radio)\s+"([^"]*)".*?\[ref=(\w+)\]/);
    if (match && roles.includes(match[1]) && label(norm(match[2]))) return match[3];
  }
}
export class Browser {
  constructor(cli=command) { this.cli=cli; }
  async open(url) {
    const opened=await this.cli("open",url);
    if (!opened.targetId) throw new SourceIssue("Kein Browser-Tab");
    this.tab=opened.targetId;
  }
  async action(name,...args) { return this.cli(name,...args,"--target-id",this.tab); }
  async page() {
    const {result}=await this.action("evaluate","--fn",readPage.toString());
    checkPage(result);
    return result;
  }
  async snapshot() { return (await this.action("snapshot")).snapshot; }
  async close() { if(this.tab) await this.cli("close",this.tab); }
  async navigate(url) {
    const u=new URL(url);
    if(u.origin!==origin || !/^\/(?:Suche\/|expose\/\d+\/?$)/.test(u.pathname)) throw new SourceIssue("Unbekannter Scout-Link");
    await this.action("navigate",u.href);
    return this.page();
  }
  async search(area,radius) {
    await this.navigate(startURL);
    let snap=await this.snapshot();
    const dismiss=formRef(snap,["button"],s=>/^(nur notwendige|alle ablehnen|ablehnen)$/.test(s));
    if(dismiss) { await this.action("click",dismiss); snap=await this.snapshot(); }
    let input=formRef(snap,["textbox","combobox","searchbox"],s=>/ort|stadt|gebiet|adresse|wo suchen|plz/.test(s));
    if(!input) {
      const change=formRef(snap,["button"],s=>/suchort|ort ändern|suchgebiet|wo suchen/.test(s));
      if(change) { await this.action("click",change); input=formRef(await this.snapshot(),["textbox","combobox","searchbox"],s=>/ort|stadt|gebiet|adresse|plz/.test(s)); }
    }
    if(!input) throw new SourceIssue("Scout-Ortsauswahl nicht lesbar");
    await this.action("fill","--fields",JSON.stringify([{ref:input,value:area,type:"textbox"}]));
    const a=norm(area);
    let pick;
    for(let i=0;i<3 && !pick;i++) {
      snap=await this.snapshot();
      pick=formRef(snap,["option","button"],s=>s===a || s.startsWith(a+",") || s.startsWith(a+" ("));
    }
    if(!pick) throw new SourceIssue("Scout hat den Suchort nicht eindeutig angeboten");
    await this.action("click",pick);
    if(radius) {
      snap=await this.snapshot();
      const control=formRef(snap,["button","combobox"],s=>/umkreis|radius/.test(s));
      if(control) await this.action("click",control);
      const distance=formRef(await this.snapshot(),["option","radio","button"],s=>s.replace(/\s/g,"")===String(radius).replace(".",",")+"km");
      if(!distance) throw new SourceIssue("Gewünschter Umkreis nicht auswählbar");
      await this.action("click",distance);
    }
    const submit=formRef(await this.snapshot(),["button"],s=>/^(?:suchen|suche starten|ergebnisse anzeigen|(?:\d[\d.]* )?(?:treffer|angebote|ergebnisse) (?:anzeigen|ansehen))$/.test(s));
    if(submit) await this.action("click",submit);
    const p=await this.page();
    const selected=norm(p.selected);
    if(!selected.includes(a) || radius && !new RegExp("(^|\\D)"+String(radius).replace(".", "[.,]")+"\\s*km\\b").test(selected))
      throw new SourceIssue("Gebiet oder Umkreis in den Ergebnissen unbestätigt");
    return p;
  }
}
