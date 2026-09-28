# 라이엇 게임즈 API 안내

확인일: 2026-09-22. 이 문서는 [라이엇 공식 API 목록](https://developer.riotgames.com/apis/)에 보이는 **31개 API 제품군**과 공식 게임별 문서의 로컬·정적 데이터 API를 정리한다. 각 제품군의 모든 세부 URL·요청/응답 필드는 공식 API 참조에서 확인해야 한다. API 이름과 사용 권한은 변경될 수 있다.

## API의 종류

| 종류 | 접근 방법 | 주요 용도 |
| --- | --- | --- |
| 웹 API | 라이엇 서버에 HTTPS 요청, 보통 API 키 필요 | 계정, 전적, 랭크, 진행 중인 경기 메타데이터, 대회 운영 |
| RSO API | 이용자 로그인과 동의 후 OAuth 토큰 사용 | 본인 계정 또는 동의가 필요한 데이터 |
| 로컬 게임 API | 게임이 실행되는 PC의 로컬 주소에 요청 | 현재 게임의 공개된 상태 |
| 정적 데이터 | Riot CDN의 버전별 파일 다운로드 | 챔피언, 아이템, 카드, 이미지 등 |

개발자 포털 로그인 시 받는 개발 키는 24시간마다 만료된다. 개인 키는 소규모 비공개 용도이며 Tournament API 접근을 신청할 수 없다. 공개 서비스와 Tournament API는 별도 프로덕션 키·승인이 필요하다. 키를 배포 코드에 넣지 말고 서버에서 보관한다. [개발자 포털의 API 키 안내](https://developer.riotgames.com/docs/portal#api-keys)

## League of Legends 웹 API

아래 이름은 [공식 API 목록](https://developer.riotgames.com/apis/)의 제품군 이름이다. `account-v1`은 현재 목록 화면에서 Riftbound RSO로 표시되지만, [LoL 공식 문서](https://developer.riotgames.com/docs/lol#obtaining-puuid-and-summonerid-from-riotid)도 Riot ID와 PUUID 변환에 Account API 사용을 안내한다.

| API | 기능 | 중계 화면에서의 쓰임 |
| --- | --- | --- |
| `account-v1` | Riot ID ↔ PUUID, RSO 본인 계정 식별 | 선수 계정 연결 |
| `summoner-v4` | LoL 소환사 식별 정보 | PUUID와 소환사 ID 연결 |
| `champion-mastery-v4` | 챔피언별 숙련도 | 사전 선수 정보 |
| `champion-v3` | 챔피언 로테이션 | 부가 정보 |
| `clash-v1` | 격전 토너먼트·팀 정보 | 격전 관련 서비스 |
| `league-v4` | 랭크 리그·티어·리더보드 | 선수 랭크 표시 |
| `league-exp-v4` | 확장 랭크 리그 목록 조회 | 랭크 목록 수집 |
| `lol-challenges-v1` | 도전과제 정보와 진행도 | 선수 프로필 |
| `lol-status-v4` | 플랫폼 서비스 상태 | 장애 감지 |
| `spectator-v5` | 진행 중인 경기와 참가자 메타데이터 | 경기 탐색·참가자 확인 |
| `match-v5` | 종료된 경기 정보와 타임라인 | 경기 후 통계·골드 그래프 |
| `lol-rso-match-v1` | RSO 기반 경기 데이터 접근 | 동의가 필요한 경기 데이터 흐름 |
| `tournament-v5` | 제공자·대회·코드 생성, 로비 이벤트, 종료 결과 | 자체 대회 운영 |
| `tournament-stub-v5` | 토너먼트 연동 시험용 스텁 | 대회 연동 개발·검증 |

`spectator-v5`는 선수별 실시간 누적 골드 공급 API가 아니다. `tournament-v5`는 대회 코드로 비공개 로비를 만들고 종료 결과를 받는 흐름을 제공한다. [LoL 공식 문서](https://developer.riotgames.com/docs/lol#tournament-api)

## Teamfight Tactics 웹 API

| API | 기능 |
| --- | --- |
| `tft-summoner-v1` | TFT 소환사 정보; 목록상 RSO 제품군 |
| `tft-league-v1` | TFT 랭크 정보 |
| `tft-match-v1` | 종료된 TFT 경기와 참가자 정보 |
| `spectator-tft-v5` | 진행 중인 TFT 경기 정보 |
| `tft-status-v1` | TFT 플랫폼 상태 |

TFT 정적 데이터는 별도의 [TFT Data Dragon 문서](https://developer.riotgames.com/docs/tft#data-dragon)를 참고한다.

## VALORANT 웹 API

| API | 기능 |
| --- | --- |
| `val-content-v1` | 시즌·맵 등 콘텐츠 메타데이터 |
| `val-match-v1` | 경기 ID별 결과, PUUID별 경기 목록, 최근 경기 |
| `val-ranked-v1` | 경쟁전 리더보드 |
| `val-status-v1` | 플랫폼 서비스 상태 |
| `val-console-match-v1` | 콘솔 플랫폼 경기 데이터 제품군 |
| `val-console-ranked-v1` | 콘솔 플랫폼 랭크 데이터 제품군 |

공식 VALORANT 문서는 이용자의 개인 데이터를 다루는 앱에 RSO를 통한 동의를 요구한다. 세부 URL과 권한은 [VALORANT 문서](https://developer.riotgames.com/docs/valorant#valorant-official-apis) 및 [API 목록](https://developer.riotgames.com/apis/)에서 확인한다.

## Legends of Runeterra 웹 API

| API | 기능 |
| --- | --- |
| `lor-deck-v1` | RSO 기반 덱 정보 |
| `lor-inventory-v1` | RSO 기반 보유 콘텐츠 정보 |
| `lor-match-v1` | 경기 기록 |
| `lor-ranked-v1` | 랭크·리더보드 |
| `lor-status-v1` | 플랫폼 서비스 상태 |

LoR은 웹 API 외에 게임 PC의 로컬 Game Client API도 제공한다. [LoR 공식 문서](https://developer.riotgames.com/docs/lor#game-client-api)

## Riftbound 및 기타

| API | 기능 |
| --- | --- |
| `riftbound-content-v1` | Riftbound 콘텐츠 데이터 |
| `account-v1` | Riot 계정 식별·RSO 기능; 여러 게임 문서에서 활용 |

공식 목록 기준으로 2XKO에는 별도의 이름 붙은 웹 API 제품군이 나열되어 있지 않다. 제품·정책 안내는 [2XKO 개발 문서](https://developer.riotgames.com/docs/2xko)에서 확인한다. [Riftbound 개발 문서](https://developer.riotgames.com/docs/riftbound)

## 웹 API 목록 외의 게임 데이터 경로

### LoL Live Client Data API

게임이 실행 중인 **같은 PC**에서 `https://127.0.0.1:2999/liveclientdata/`로 접근한다. 주요 경로는 `allgamedata`, `playerlist`, `activeplayer`, `eventdata`, `gamestats`다. `playerlist`에는 챔피언·팀·레벨·아이템·점수 등이 있고, `activeplayer`에는 조작 중인 플레이어의 현재 보유 골드가 있다. 다른 선수의 정확한 실시간 **누적 골드**는 공식 문서의 `playerlist` 필드에 없다. 관전 모드에서 어떤 값이 반환되는지는 실제 관전 클라이언트로 검증해야 한다. 로컬 API의 OpenAPI 사양은 `https://127.0.0.1:2999/swagger/v3/openapi.json`에서 받을 수 있다. [LoL Live Client Data API 문서](https://developer.riotgames.com/docs/lol#live-client-data-api)

### LoL Replay API와 League Client API

Replay API는 리플레이 재생·카메라·녹화 등을 제어하며 설정을 통해 활성화한다. League Client API는 로비 등 클라이언트 내부 기능에 접근하지만, 라이엇은 제3자 앱용 공식 지원 API가 아니라고 명시한다. [LoL 게임 클라이언트 문서](https://developer.riotgames.com/docs/lol#game-client-api), [Replay API 문서](https://developer.riotgames.com/docs/lol#replay-api), [League Client API 문서](https://developer.riotgames.com/docs/lol#league-client-api)

### LoR 로컬 API

기본 포트 `127.0.0.1:21337`에서 현재 덱, 화면의 카드 위치, 직전 경기 결과를 조회할 수 있다. 사용자가 설정에서 끌 수 있다. [LoR Game Client API 문서](https://developer.riotgames.com/docs/lor#game-client-api)

### 정적 콘텐츠

LoL·TFT의 Data Dragon은 패치별 챔피언·아이템·룬 등 데이터와 이미지 파일을 제공한다. VALORANT에는 별도의 공개 콘텐츠 카탈로그가 있다. 게임 상태가 실시간으로 바뀌는 API는 아니다. [LoL Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon), [TFT Data Dragon](https://developer.riotgames.com/docs/tft#data-dragon), [VALORANT 콘텐츠 카탈로그](https://developer.riotgames.com/docs/valorant#assets)

## 이 프로젝트의 실시간 LoL 중계에 적용

1. 선수·경기 식별: `account-v1`, `summoner-v4`, 필요 시 `spectator-v5`.
2. 경기 중 공개 데이터: 관전 PC에서 Live Client Data API를 시험해 실제 반환 필드를 기록.
3. 아이콘·이름: Data Dragon.
4. 자체 대회 운영: `tournament-v5`의 코드·종료 콜백.
5. 경기 후 상세 통계: `match-v5` 및 타임라인.
6. **라인별 실시간 골드 차이**: 공개 API만으로는 양 팀 선수의 정확한 누적 골드가 확인되지 않는다. 관전 화면에 해당 값이 표시되는 경우 화면 인식으로 읽거나, 별도의 허가된 중계 데이터 공급 경로가 필요하다. 골드 차이는 같은 관전 시점의 선수별 누적 골드끼리 계산해야 한다.

### 공식 출처

- [라이엇 API 전체 목록](https://developer.riotgames.com/apis/)
- [개발자 포털·API 키 안내](https://developer.riotgames.com/docs/portal)
- [League of Legends 개발 문서](https://developer.riotgames.com/docs/lol)
- [Teamfight Tactics 개발 문서](https://developer.riotgames.com/docs/tft)
- [VALORANT 개발 문서](https://developer.riotgames.com/docs/valorant)
- [Legends of Runeterra 개발 문서](https://developer.riotgames.com/docs/lor)
- [Riftbound 개발 문서](https://developer.riotgames.com/docs/riftbound)
- [2XKO 개발 문서](https://developer.riotgames.com/docs/2xko)
