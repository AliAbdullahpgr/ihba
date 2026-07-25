import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "images");

const c = {
  navy: "#16255C",
  navyDeep: "#0D1738",
  azure: "#2E8FD4",
  azureMist: "#F2F8FC",
  gold: "#C7A45F",
  goldSoft: "#EBD9AF",
  paper: "#FAF7F0",
  white: "#FFFFFF",
};

const xml = (w, h, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-hidden="true">
${body}
</svg>
`;

const grain = (opacity = 0.12) => `<defs><pattern id="grain" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="4" cy="6" r="1.2" fill="${c.white}" opacity="${opacity}"/><circle cx="19" cy="15" r="1" fill="${c.white}" opacity="${opacity * 0.7}"/><circle cx="10" cy="23" r="0.9" fill="${c.goldSoft}" opacity="${opacity}"/></pattern></defs>`;
const arch = (x, y, w, h, stroke, sw, opacity = 1) => `<path d="M${x} ${y + h}V${y + h * 0.58}C${x} ${y + h * 0.2} ${x + w} ${y + h * 0.2} ${x + w} ${y + h * 0.58}V${y + h}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" opacity="${opacity}"/>`;
const dove = (x, y, s, fill = c.gold) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 45C47 2 100 2 146 42C109 32 78 43 52 75C37 68 19 58 0 45Z" fill="${fill}"/><path d="M60 70C109 31 172 19 235 45C176 48 135 69 104 112C90 96 77 83 60 70Z" fill="${fill}" opacity="0.92"/><path d="M48 77C84 92 117 115 147 148C102 141 68 123 35 91Z" fill="${c.goldSoft}" opacity="0.95"/><circle cx="143" cy="43" r="6" fill="${c.navyDeep}" opacity="0.55"/></g>`;
const rays = (cx, cy, r1, r2, count, color, opacity = 1) => Array.from({ length: count }, (_, i) => {
  const a = (Math.PI * 2 * i) / count;
  const x1 = cx + Math.cos(a) * r1;
  const y1 = cy + Math.sin(a) * r1;
  const x2 = cx + Math.cos(a) * r2;
  const y2 = cy + Math.sin(a) * r2;
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity="${opacity}"/>`;
}).join("");

const images = {
  "hero-main.svg": xml(1200, 1350, `${grain(0.08)}
<rect width="1200" height="1350" fill="${c.navyDeep}"/><rect width="1200" height="1350" fill="url(#grain)"/>
<circle cx="910" cy="215" r="165" fill="${c.gold}" opacity="0.14"/>${rays(910, 215, 205, 330, 28, c.goldSoft, 0.22)}
<path d="M80 408C325 225 760 205 1118 384" fill="none" stroke="${c.azure}" stroke-width="3" opacity="0.35"/><path d="M112 476C388 278 740 292 1088 468" fill="none" stroke="${c.goldSoft}" stroke-width="2" opacity="0.34"/>
${dove(365, 255, 2.15)}
<g opacity="0.9">${arch(80, 620, 1040, 530, c.navy, 92)}${arch(245, 700, 710, 420, c.azure, 44, 0.94)}${arch(380, 785, 440, 315, c.gold, 30, 0.9)}</g>
<path d="M0 1110C215 1040 350 1165 555 1095C762 1025 958 1082 1200 1005V1350H0Z" fill="${c.navy}" opacity="0.72"/><path d="M0 1198C225 1148 410 1225 608 1175C835 1118 1010 1178 1200 1118V1350H0Z" fill="${c.azure}" opacity="0.22"/>
<g fill="${c.goldSoft}" opacity="0.72"><circle cx="178" cy="275" r="5"/><circle cx="244" cy="196" r="3"/><circle cx="1010" cy="392" r="4"/><circle cx="998" cy="592" r="3"/><circle cx="134" cy="548" r="3"/></g>`),
  "hero-light.svg": xml(1320, 1180, `<rect width="1320" height="1180" fill="${c.azureMist}"/>
<circle cx="1032" cy="242" r="116" fill="${c.gold}" opacity="0.24"/>${rays(1032, 242, 150, 232, 24, c.gold, 0.2)}
<path d="M192 338C440 210 774 196 1086 326" fill="none" stroke="${c.azure}" stroke-width="3" stroke-linecap="round" opacity="0.22"/><path d="M230 444C520 282 796 300 1102 456" fill="none" stroke="${c.gold}" stroke-width="2" stroke-linecap="round" opacity="0.28"/><path d="M154 752C360 672 524 730 704 680C856 638 984 646 1168 588" fill="none" stroke="${c.azure}" stroke-width="2" stroke-linecap="round" opacity="0.16"/>
${dove(494, 212, 1.16)}
<g opacity="0.98">${arch(146, 520, 1028, 492, c.navy, 64)}${arch(304, 604, 712, 360, c.azure, 36, 0.96)}${arch(438, 684, 444, 260, c.gold, 22, 0.94)}</g>
<g fill="${c.azure}" opacity="0.52"><circle cx="218" cy="334" r="7"/><circle cx="1098" cy="474" r="6"/><circle cx="1126" cy="842" r="5"/><circle cx="350" cy="924" r="4"/></g><g fill="${c.gold}" opacity="0.62"><circle cx="286" cy="436" r="5"/><circle cx="940" cy="384" r="7"/><circle cx="1030" cy="930" r="5"/><circle cx="184" cy="842" r="4"/></g>`),
  "hero-tile-1.svg": xml(600, 600, `${grain(0.07)}<rect width="600" height="600" fill="${c.navyDeep}"/><rect width="600" height="600" fill="url(#grain)"/>${arch(-80, 170, 760, 430, c.azure, 48, 0.95)}${arch(70, 245, 460, 305, c.navy, 34, 1)}${arch(170, 315, 260, 210, c.gold, 16, 0.85)}<path d="M0 458C130 426 238 490 367 454C463 428 528 435 600 396V600H0Z" fill="${c.azure}" opacity="0.18"/>`),
  "hero-tile-2.svg": xml(600, 600, `<rect width="600" height="600" fill="${c.white}"/><circle cx="300" cy="315" r="118" fill="${c.gold}"/>${rays(300, 315, 155, 255, 32, c.gold, 0.55)}<path d="M0 392C132 336 235 390 334 356C444 318 510 348 600 300V600H0Z" fill="${c.goldSoft}" opacity="0.75"/><path d="M0 470C158 408 296 492 438 432C514 400 558 410 600 380V600H0Z" fill="${c.white}"/>${arch(90, 365, 420, 210, c.navy, 24, 0.9)}`),
  "hero-tile-3.svg": xml(600, 600, `${grain(0.08)}<rect width="600" height="600" fill="${c.navy}"/><rect width="600" height="600" fill="url(#grain)"/><g opacity="0.9">${Array.from({ length: 25 }, (_, i) => dove((i % 5) * 124 + 24, Math.floor(i / 5) * 122 + 34, 0.28, i % 2 ? c.goldSoft : c.gold)).join("")}</g><g fill="${c.azure}" opacity="0.45">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 83) % 590 + 5}" cy="${(i * 47) % 585 + 8}" r="${i % 3 + 2}"/>`).join("")}</g>`),
  "cause-education.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><circle cx="450" cy="216" r="102" fill="${c.gold}" opacity="0.88"/>${rays(450, 216, 132, 210, 26, c.gold, 0.38)}<path d="M160 385C270 322 362 320 450 392C538 320 630 322 740 385V548C628 492 535 494 450 572C365 494 272 492 160 548Z" fill="${c.white}" stroke="${c.navy}" stroke-width="4"/><path d="M450 392V572" stroke="${c.navy}" stroke-width="4"/><path d="M208 414C294 380 360 389 422 435M492 435C554 389 620 380 706 414" stroke="${c.azure}" stroke-width="5" stroke-linecap="round"/><path d="M0 590H900V675H0Z" fill="${c.goldSoft}" opacity="0.55"/>`),
  "cause-water.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><path d="M450 88C562 230 642 332 642 445C642 552 557 620 450 620C343 620 258 552 258 445C258 332 338 230 450 88Z" fill="${c.azure}" opacity="0.92"/><path d="M365 432C435 382 486 503 565 443" fill="none" stroke="${c.white}" stroke-width="16" stroke-linecap="round" opacity="0.9"/><path d="M70 560C180 505 286 615 396 560C506 505 614 615 724 560C772 536 823 532 875 552" fill="none" stroke="${c.navy}" stroke-width="18" stroke-linecap="round"/><path d="M80 610C190 555 295 665 405 610C515 555 624 665 734 610C784 586 832 584 878 602" fill="none" stroke="${c.azure}" stroke-width="12" stroke-linecap="round" opacity="0.65"/>`),
  "cause-health.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><path d="M450 226C512 142 641 166 655 287C669 410 548 480 450 565C352 480 231 410 245 287C259 166 388 142 450 226Z" fill="${c.gold}"/><path d="M235 405H348L386 347L438 467L486 382H665" fill="none" stroke="${c.white}" stroke-width="13" stroke-linejoin="round" stroke-linecap="round"/><path d="M170 528C258 470 325 496 390 574M730 528C642 470 575 496 510 574" fill="none" stroke="${c.navy}" stroke-width="28" stroke-linecap="round"/><circle cx="450" cy="340" r="196" fill="none" stroke="${c.azure}" stroke-width="3" opacity="0.35"/>`),
  "cause-relief.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><path d="M450 182L612 298V506H288V298Z" fill="${c.goldSoft}" stroke="${c.navy}" stroke-width="5"/><path d="M248 317L450 170L652 317" fill="none" stroke="${c.gold}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><rect x="404" y="390" width="92" height="116" fill="${c.navy}" opacity="0.86"/><path d="M160 506C262 444 337 482 406 598M740 506C638 444 563 482 494 598" fill="none" stroke="${c.azure}" stroke-width="30" stroke-linecap="round"/><path d="M214 590H686" stroke="${c.navy}" stroke-width="18" stroke-linecap="round"/>`),
  "story-1.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><path d="M0 128H900V370H0Z" fill="${c.azure}" opacity="0.32"/><circle cx="720" cy="166" r="88" fill="${c.gold}"/>${rays(720, 166, 115, 178, 20, c.gold, 0.35)}<path d="M0 560C170 500 316 586 450 534C596 477 708 530 900 486V675H0Z" fill="${c.goldSoft}"/><g fill="${c.navy}"><circle cx="250" cy="374" r="28"/><path d="M220 412H280L300 548H202Z"/><path d="M232 446L162 396M268 446L334 382" stroke="${c.navy}" stroke-width="18" stroke-linecap="round"/><circle cx="450" cy="342" r="26"/><path d="M420 380H480L500 535H400Z"/><path d="M430 402L360 334M470 402L532 330" stroke="${c.navy}" stroke-width="18" stroke-linecap="round"/><circle cx="610" cy="386" r="24"/><path d="M584 420H636L662 552H562Z"/><path d="M596 440L540 390M626 440L690 398" stroke="${c.navy}" stroke-width="16" stroke-linecap="round"/></g>`),
  "story-2.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><path d="M0 498C160 438 300 524 462 460C598 406 728 440 900 390V675H0Z" fill="${c.azure}" opacity="0.2"/><g stroke="${c.navy}" stroke-width="16" stroke-linecap="round" fill="none"><path d="M260 282V474M220 380L330 336M308 474L358 575M250 474L204 575"/><path d="M610 280V474M570 378L464 338M655 474L704 575M600 474L552 575"/></g><g fill="${c.navy}"><circle cx="260" cy="232" r="42"/><circle cx="610" cy="230" r="42"/></g><g><rect x="344" y="282" width="212" height="142" rx="14" fill="${c.gold}" stroke="${c.navy}" stroke-width="5"/><path d="M450 282V424M344 352H556" stroke="${c.goldSoft}" stroke-width="5"/></g><path d="M128 592H776" stroke="${c.navy}" stroke-width="12" stroke-linecap="round" opacity="0.55"/>`),
  "story-3.svg": xml(900, 675, `<rect width="900" height="675" fill="${c.white}"/><circle cx="450" cy="338" r="216" fill="${c.azure}"/><path d="M308 190C356 244 382 300 366 365C350 434 389 490 445 546C291 550 187 413 246 282C258 252 278 222 308 190Z" fill="${c.white}" opacity="0.92"/><path d="M520 140C500 218 554 264 640 278C684 380 638 484 550 528C590 440 565 386 494 344C425 303 424 220 520 140Z" fill="${c.navy}" opacity="0.82"/><path d="M150 434C296 238 604 238 750 434" fill="none" stroke="${c.gold}" stroke-width="30" stroke-linecap="round"/><path d="M238 430V352C238 286 362 286 362 352V430M538 430V352C538 286 662 286 662 352V430" fill="none" stroke="${c.goldSoft}" stroke-width="14" stroke-linecap="round"/><circle cx="450" cy="338" r="216" fill="none" stroke="${c.navy}" stroke-width="4" opacity="0.16"/>`),
  "texture-arches.svg": xml(1600, 400, `<rect width="1600" height="400" fill="${c.navyDeep}"/><g opacity="0.34">${Array.from({ length: 9 }, (_, i) => arch(i * 205 - 100, 72, 300, 320, c.navy, 34, 1)).join("")}</g><g opacity="0.18">${Array.from({ length: 7 }, (_, i) => arch(i * 260 - 40, 160, 360, 250, c.azure, 12, 1)).join("")}</g>`),
  "volunteer-cta.svg": xml(1200, 800, `${grain(0.07)}<rect width="1200" height="800" fill="${c.navyDeep}"/><rect width="1200" height="800" fill="url(#grain)"/>${arch(78, 172, 1044, 540, c.azure, 38, 0.45)}${arch(210, 240, 780, 440, c.gold, 22, 0.85)}${dove(810, 112, 1.05)}<g stroke-linecap="round"><path d="M178 710V514" stroke="${c.gold}" stroke-width="42"/><path d="M178 520L118 420M178 520L238 408" stroke="${c.goldSoft}" stroke-width="28"/><path d="M350 710V470" stroke="${c.azure}" stroke-width="46"/><path d="M350 478L280 354M350 478L428 360" stroke="${c.azure}" stroke-width="30"/><path d="M548 710V500" stroke="${c.goldSoft}" stroke-width="44"/><path d="M548 508L488 398M548 508L620 394" stroke="${c.goldSoft}" stroke-width="28"/><path d="M756 710V470" stroke="${c.azure}" stroke-width="46"/><path d="M756 478L682 352M756 478L832 368" stroke="${c.azure}" stroke-width="30"/><path d="M980 710V515" stroke="${c.gold}" stroke-width="42"/><path d="M980 520L918 420M980 520L1046 410" stroke="${c.goldSoft}" stroke-width="28"/></g><path d="M0 696C210 642 358 720 560 664C786 602 970 658 1200 604V800H0Z" fill="${c.navy}" opacity="0.86"/>`),
};

await mkdir(outDir, { recursive: true });
await Promise.all(Object.entries(images).map(([name, data]) => writeFile(join(outDir, name), data, "utf8")));
console.log(`Generated ${Object.keys(images).length} SVG images in ${outDir}`);
