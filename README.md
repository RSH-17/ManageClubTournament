# LCK UI

내전 및 대회 서비스의 모노레포입니다. npm workspaces로 프론트엔드와 백엔드를 관리합니다.

| 위치 | 환경 | 기본 주소 |
| --- | --- | --- |
| `apps/web` | Next.js 프론트엔드 | `http://localhost:3000` |
| `apps/api` | NestJS 백엔드 | `http://localhost:3001` |
| `apps/collector` | Python 게임 데이터 수집 스크립트 | 로컬 실행 |

## 시작하기

Node.js 20.19 이상과 npm이 필요합니다.

```bash
npm install
npm run dev
```

각 환경만 실행하려면 `npm run dev:web` 또는 `npm run dev:api`를 사용합니다. API 상태는 `http://localhost:3001/health`에서 확인할 수 있습니다.

```bash
npm run typecheck
npm run build
```

프론트엔드는 기존 게임 유형 선택 화면을 옮긴 상태입니다. 선택 이후 화면과 실제 참여·경매 기능은 아직 구현되지 않았습니다. API 설정을 바꾸려면 `apps/api/.env.example`을 `apps/api/.env`로 복사한 뒤 값을 수정합니다. 기존 Python 수집 스크립트는 `apps/collector/lol_live_data.py`에 보관합니다.
