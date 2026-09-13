# BEE Lab 홈페이지

서강대학교 화공생명공학과 류재건 교수님 연구실(BEE Laboratory) 홈페이지입니다.

- **온라인 게시 + 화면 편집(/admin) 설정** → `게시_및_편집_가이드.md` 참고
- 화면 편집을 켜면 `사이트주소/admin` 에서 논문·팀원·사진을 폼으로 편집할 수 있습니다.

---

## 폴더 구조
```
bee-lab/
├── index.html  research.html  pi.html  team.html  publications.html  gallery.html
├── admin/                  화면 편집 패널 (CMS)
│   ├── index.html
│   └── config.yml
├── data/
│   ├── json/               ← 실제 내용 (CMS가 편집). news/team/publications/research/pi/gallery
│   └── data.js             로컬 더블클릭용 폴백 (build-data.js 가 자동 생성)
├── assets/  (css, js, img)
├── build-data.js           JSON → data.js 동기화 스크립트
├── netlify.toml            Netlify 배포 설정
├── README.md
└── 게시_및_편집_가이드.md
```

## 내용 수정 방법 (세 가지 다 가능)
1. **화면 편집**: `사이트주소/admin` (가장 쉬움 · 가이드 참고)
2. **GitHub 웹**: `data/json/*.json` 파일을 열어 직접 수정
3. **로컬**: `data/json/*.json` 수정 후 `node build-data.js` 실행

## 로컬 미리보기
`index.html` 더블클릭 (data/data.js 폴백으로 표시).
최신 편집을 로컬에 반영하려면 `node build-data.js` 실행 후 열기.

## 색 바꾸기
`assets/css/style.css` 맨 위 `:root` 의 `--accent`(노랑)/`--green`(초록)/`--ink`(검정)/`--band-a`(다크) 수정.
