# 비전트립 PWA

몇 명이 잠깐 쓰는 모바일 비전트립 앱을 위한 의존성 없는 PWA입니다.

실제 작업 폴더는 `D:\Codex\handbook-pwa`입니다. 다른 위치에 남아 있는 복사본은 배포에 반영되지 않을 수 있습니다.

## 실행

```powershell
cd D:\Codex\handbook-pwa
npm.cmd run dev
```

PC에서 확인:

```text
http://localhost:5173
```

## 내용 수정

비전트립 항목은 `data.js`의 `handbookItems` 배열에서 수정합니다.

수정 후 브라우저를 새로고침하면 바로 반영됩니다.

개발 서버가 켜져 있으면 파일 저장 시 PC와 같은 와이파이의 휴대폰 화면이 자동으로 새로고침됩니다.

## 올리기

수정한 내용을 GitHub Pages까지 올릴 때는 커밋 메시지를 붙여서 한 번에 실행합니다.

```powershell
npm.cmd run publish -- "수정 내용"
```

이 명령은 문법 검사, 커밋, GitHub 푸시를 순서대로 실행합니다.

검사만 하고 싶을 때는 다음 명령을 실행합니다.

```powershell
npm.cmd run check
```

휴대폰에서 예전 화면이 계속 보이면 `sw.js`의 `cacheVersion` 값을 `v3`, `v4`처럼 올린 뒤 다시 publish 합니다.

## VS Code에서 미리보기

1. `D:\Codex\handbook-pwa` 폴더를 VS Code로 엽니다.
2. `Terminal > Run Task...`에서 `비전트립 미리보기 서버 시작`을 실행합니다.
3. `Ctrl+Shift+P`를 누르고 `Simple Browser: Show`를 선택합니다.
4. 주소에 `http://localhost:5173`을 입력합니다.

이후 코드를 저장하면 VS Code 안의 미리보기 패널도 자동으로 새로고침됩니다.

## 배포 방향

잠깐 공유할 목적이면 Cloudflare Pages, Netlify, Vercel 같은 정적 호스팅에 올린 뒤 URL만 공유하면 됩니다.
스토어 업로드는 필요 없습니다.

## GitHub Pages 배포

이 앱은 별도 빌드 없이 정적 파일로 동작합니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더를 remote에 push합니다.
3. GitHub 저장소의 `Settings > Pages`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, folder는 `/root`를 선택합니다.

배포 후 HTTPS 주소에서 열면 Android 앱 설치 프롬프트와 오프라인 캐시가 더 안정적으로 동작합니다.
