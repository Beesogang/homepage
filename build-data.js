#!/usr/bin/env node
/* =========================================================================
   build-data.js
   -------------------------------------------------------------------------
   data/json/*.json  →  data/data.js 로 합칩니다.
   Netlify가 배포할 때 자동 실행되어, CMS(/admin)로 편집한 JSON 내용이
   로컬 더블클릭용 data.js 에도 반영되도록 동기화합니다.
   (수동 실행도 가능:  node build-data.js)
   ========================================================================= */
const fs = require("fs");
const path = require("path");

const J = (p) => JSON.parse(fs.readFileSync(path.join(__dirname, p), "utf8"));

const news     = J("data/json/news.json");
const team     = J("data/json/team.json");
const pubs     = J("data/json/publications.json");
const research = J("data/json/research.json");
const pi       = J("data/json/pi.json");
const gallery  = J("data/json/gallery.json");

const S = (o) => JSON.stringify(o, null, 2);

const out = `/* =========================================================================
   BEE Lab — 사이트 데이터 (자동 생성 파일)
   -------------------------------------------------------------------------
   ⚠ 이 파일은 build-data.js 가 data/json/*.json 으로부터 자동 생성합니다.
   직접 수정하지 마세요. 내용은 /admin 편집 화면 또는 data/json/*.json 에서 고칩니다.
   (이 파일은 로컬에서 HTML을 더블클릭으로 열 때의 폴백 데이터로 쓰입니다.)
   ========================================================================= */

window.NEWS = ${S(news)};

window.TEAM = ${S(team)};

window.PUBLICATIONS = ${S(pubs.publications)};

window.BOOK_CHAPTERS = ${S(pubs.book_chapters)};

window.RESEARCH_AREAS = ${S(research)};

window.PI = ${S(pi)};

window.GALLERY = ${S(gallery)};
`;

fs.writeFileSync(path.join(__dirname, "data/data.js"), out);
console.log("data/data.js generated from JSON.");
