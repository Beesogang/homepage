이미지 폴더 안내
================

이 폴더에 실제 이미지를 넣고, 각 데이터 파일에서 경로만 맞추면 됩니다.

1) 로고
   - 파일: assets/img/logo.png  (PNG 권장, 배경 투명)
   - 지정: assets/js/main.js 의 LOGO_SRC 값
   - 로고 파일이 없으면 자동으로 "B" 벌 마크가 표시됩니다.

2) 팀원 사진
   - 폴더: assets/img/team/  (원하는 이름으로 저장, 예: kwon.jpg)
   - 지정: data/team.js 의 각 멤버 photo: "assets/img/team/kwon.jpg"
   - 정사각형(1:1) 이미지가 가장 예쁘게 나옵니다.
   - 비워두면 이름 이니셜 아바타가 자동 표시됩니다.

3) 연구 분야 그림
   - 폴더: assets/img/research/
   - 지정: data/site.js 의 RESEARCH_AREAS 각 항목 image: "assets/img/research/eei.jpg"
   - 가로로 긴 이미지(16:7 정도)가 잘 맞습니다.

4) PI 사진
   - 파일: assets/img/pi.jpg
   - 지정: data/site.js 의 PI.photo 값
   - 세로 3:4 인물 사진이 잘 맞습니다.

5) 갤러리 사진
   - 폴더: assets/img/gallery/  (원하는 이름으로 저장, 예: 2025-mt.jpg)
   - 지정: data/gallery.js 에 한 줄씩 추가:
       { src: "assets/img/gallery/2025-mt.jpg", caption: "2025 MT", date: "2025.06" }
   - 가로/세로 아무 비율이나 됩니다. 목록에서는 정사각 썸네일,
     클릭하면 원본 비율로 크게 열립니다(라이트박스).

※ 사진 경로가 틀리거나 파일이 없으면 자동으로 이니셜/placeholder로 대체되므로
  사이트가 깨지지 않습니다. 천천히 하나씩 교체하셔도 됩니다.
