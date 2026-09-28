# 리그 오브 레전드 관전 자동화 자료 조사

확인일: 2026-09-23. Riot 공식 문서, 도구 개발자의 원본 저장소·문서, 원 논문을 확인했다. 링크의 설명을 확인한 것이며 이 프로젝트의 PC에서 현재 LoL 패치로 설치·동작 시험을 한 것은 아니다.

## 자료를 읽을 때의 구분

| 구분 | 목적 | 주의점 |
| --- | --- | --- |
| 라이브 게임 데이터 | 경기 중 플레이어·이벤트 값 수집 | 관전 클라이언트 반환 필드는 실전 검증 필요 |
| 밴픽 데이터 | 선택·밴·타이머 확인 | League Client API는 제3자 앱용 공식 지원 API가 아님 |
| 화면 인식 | 관전 화면에 보이는 값 읽기 | HUD·해상도·패치에 따라 정확도가 달라짐 |
| 방송 오버레이 | 데이터로 OBS 그래픽 갱신 | 영상과 데이터 시점 일치 필요 |
| 카메라 제어 | 관전 화면 시점 자동 이동 | 공식 Replay API는 리플레이를 설명함 |

**진행 중인 관전 경기, 종료된 경기 리플레이, 웹 API의 진행 중 경기 메타데이터는 서로 다른 데이터 경로**다. 리플레이용 도구를 실시간 관전에 바로 적용할 수 있다고 가정하지 않는다.

## Riot 공식 자료

### [LoL 개발 문서](https://developer.riotgames.com/docs/lol)

- Live Client Data API: 게임 PC의 로컬 127.0.0.1:2999에서 allgamedata, playerlist, eventdata, gamestats 등을 조회한다. [이 프로젝트의 샘플 필드 설명](JSON_FIELDS.md)은 플레이어 클라이언트에서 얻은 파일에 근거하며 관전 클라이언트가 동일하게 반환한다는 증거는 아니다.
- 관전 클라이언트의 `gamedata.json` 형태 응답에서는 `activePlayer`가 `null`인 사례가 확인되었다. 관전 PC 한 대에서 활성 플레이어 상세값을 얻는다고 가정하지 않는다. 다른 최상위 필드의 실제 반환 범위는 추가 기록이 필요하다.
- Replay API: 리플레이 재생, 카메라, 렌더, 녹화 조작의 공식 출발점이다. 문서는 실시간 관전 카메라 동작을 보장하지 않는다.
- League Client API: 밴픽 등 클라이언트 내부 기능에 접근하지만 Riot이 제3자 앱용 공식 지원을 보장하지 않는다.
- Tournament API: 대회 코드·로비와 종료 후 결과 콜백을 제공한다. 경기 중 선수별 상태를 지속적으로 보내는 경로는 아니다.

### [Spectator-v5 공식 API 목록](https://developer.riotgames.com/apis#spectator-v5)

진행 중 경기의 메타데이터 조회에 쓰는 웹 API다. 관전 화면의 모든 선수 통계나 프레임별 방송 이벤트를 주는 API로 취급하지 않는다. 커스텀 경기 접근에는 [Riot 개발자 관계 저장소의 관련 이슈](https://github.com/RiotGames/developer-relations/issues/884)가 있어 실제 이벤트에서 확인해야 한다.

### [Riot League Director](https://github.com/RiotGames/leaguedirector)

Riot이 공개한 Replay API 참조 구현이다. 리플레이 재생 속도, 카메라 부착·이동, HUD 표시, 키프레임, 녹화를 다룬다. **리플레이 기반 하이라이트·영상 제작**에 직접 참고할 수 있다. README의 사용법은 리플레이 실행을 전제로 한다.

## 실제 방송·오버레이 구현 사례

### [OSL: Overlay Spectator Live](https://github.com/Sky-CSC/OSL) · [프로젝트 문서](https://sky-csc.github.io/OSL/)

데이터 수집 서버와 웹 오버레이를 분리해 다른 PC에도 배치할 수 있다. 서버가 WebSocket으로 오버레이에 데이터를 전달한다. 현재 문서가 제공 기능으로 명시한 것은 밴픽, Fearless, 경기 종료 오버레이 등이며 **인게임 오버레이는 개발 중**이다. 이 프로젝트에서는 관전 PC → 서버 → 방송 PC 구조와 밴픽 화면을 참고할 만하다.

### [league-prod-toolkit](https://github.com/RCVolus/league-prod-toolkit) · [설치 문서](https://github.com/RCVolus/league-prod-toolkit/wiki/1.-Installation) · [league-observer-tool](https://github.com/RCVolus/league-observer-tool)

관전 PC의 observer tool이 로컬 클라이언트 데이터를 수집해 별도 제작 서버로 보내고 OBS/vMix 브라우저 소스가 표시하는 구성이다. 역할 분리와 운영 화면의 참고 사례다. 저장소는 인게임 기능이 **LiveEvents API 제거와 Vanguard 도입의 영향**을 받았다고 명시하며, observer tool은 메모리 읽기 기능을 비활성화한다고 설명한다. 과거의 모든 통계 기능이 현재 동작한다고 가정하지 않는다.

### [LeagueOCR](https://github.com/floh22/LeagueOCR)

관전 화면의 OCR 결과를 HTTP API로 제공하는 원본 구현이다. README에는 **팀 골드와 드래곤·바론 상태** 예시가 있다. UI 크기 100%, 16:9, 1080p 기반 설정을 제시한다. 관전 HUD 영역 추출, 숫자 인식, API 결과 형식을 참고할 수 있다. 현재 패치·한국어 HUD에서의 인식률은 이 자료로 확인할 수 없다.

### [obs-websocket](https://github.com/obsproject/obs-websocket) · [OBS 게임 캡처 안내](https://obsproject.com/kb/game-capture-setup-guide)

OBS의 장면 전환과 소스·오버레이 상태를 외부 프로그램에서 제어한다. 원본 README에 따르면 OBS 28 이상에 기본 포함된다. **LoL 데이터 수집 도구는 아니며**, 수집 결과를 방송 화면에 반영하는 연결 수단이다.

## 관전 카메라 직접 제어 자료

| 자료 | 문서에 나온 제어 기능 | 적용 범위 |
| --- | --- | --- |
| [Riot Replay API](https://developer.riotgames.com/docs/lol#replay-api) | 리플레이 카메라 조정. `/replay/render`로 렌더 속성을, `/replay/sequence`로 키프레임 시퀀스를 읽고 적용한다. `/replay/playback`은 재생·일시정지·시간 이동을 제어한다. | **공식 문서의 대상은 리플레이**다. 진행 중인 경기 관전에서 동일하게 작동한다는 설명은 없다. |
| [Riot League Director](https://github.com/RiotGames/leaguedirector) | 1인칭 카메라 이동, 챔피언·미니언에 카메라 부착, 카메라 위치 키프레임 편집·재생, HUD 전환을 구현한다. | README의 절차는 **리플레이 실행 후 연결**이다. 라이브 관전 자동 제어의 검증 자료는 아니다. |
| [League Replay UI Hook](https://github.com/Matviy/LeagueReplayHook) | 과거 관전·리플레이 UI에 directed camera, 챔피언 선택·즉시 이동, 카메라 고정 등의 명령을 전달한 구현이다. | DLL 주입 및 당시 Flash/Scaleform UI에 의존하는 **오래된 비공식 구현**이다. 현재 패치에서 동작하거나 사용해도 안전하다는 근거로 삼지 않는다. |

공식 Replay API를 사용하려면 **게임 클라이언트가 실행되는 PC**의 `game.cfg`에 `[General] EnableReplayApi=1`을 설정한다. Riot 문서에 따르면 사용 가능할 때 로컬 `https://127.0.0.1:2999/swagger/v3/openapi.json`에서 실제 API 스키마를 읽을 수 있다. League Director는 이 API의 공개 참조 구현이므로 카메라 명령 형식을 이해할 때 코드와 함께 보는 것이 좋다. 이 설정은 실시간 관전 지원을 보장하는 설정이 아니다.

**실시간 대회 관전에 적용하기 전 확인할 사항:** 현재 패치의 커스텀 게임을 관전 PC에서 실행하고, 해당 로컬 스키마와 `GET /replay/game`, `GET /replay/render`, `GET /replay/sequence`의 응답 가능 여부를 기록한다. 이후 별도 테스트 경기에서 카메라 변경 요청이 실제 관전 화면에 반영되는지 확인해야 한다. 스키마에 엔드포인트가 나타나는 것만으로 라이브 관전 지원이 확인되지는 않는다. 작동하지 않으면 관전 클라이언트의 기본 카메라 모드와 수동 조작을 운영 기준으로 두고, 자동화는 화면 인식과 입력 제어를 별도 실험한다.

## 자동 카메라 연구

### [Viewport Tracking Model for Automatic Observing in League of Legends](https://scholar.gist.ac.kr/handle/local/32377) — CoG 2025

프로 관전자의 시점 이동 자료로 이벤트 이후의 뷰포트 움직임을 예측하는 LoL 연구다. 카메라 자동화에는 이벤트 감지뿐 아니라 사건을 자연스럽게 따라가는 시점 이동도 필요하다는 점을 보여 준다. 현 클라이언트에서 바로 실행하는 제품이나 API 사용 설명서는 아니다.

## 오래된 경로와 현재 상태

- [LeagueBroadcast](https://github.com/floh22/LeagueBroadcast): 밴픽·인게임 오버레이 참고 구현이지만 원본 README가 **Vanguard 도입 후 더 이상 작동하지 않는다**고 밝힌다.
- [SkinSpotlights LiveEventsDocumentation](https://github.com/SkinSpotlights/LiveEventsDocumentation): 관전·리플레이용 비공개 LiveEvents API를 기록한 아카이브다. 저자는 **패치 14.1 이후 제거·비활성화된 것으로 보인다**고 적었다. 위의 observer tool 문서와 내용이 엇갈리므로 현재 패치에서 검증 없이 의존하지 않는다.
- [Neeko-Server](https://github.com/Vidalee/Neeko-Server): 관전 서버 기록·재현 구현이지만 README는 **14.1 이후 동작하지 않는다**고 명시한다.
- [방송 데이터 확장 요청](https://github.com/RiotGames/developer-relations/issues/216): 관전 방송용 팀 골드·오브젝트 정보가 부족하다는 사용자 요청이다. **Riot의 기능 제공 약속이나 구현 사실은 아니다.**
- [관전 서버 API 지원 범위 이슈](https://github.com/RiotGames/developer-relations/issues/1064): 저수준 관전 서버 API가 Riot 개발자 관계 팀의 지원 대상으로 취급되지 않은 사례다.

## 이 프로젝트에 적용할 조사·개발 순서

1. **관전 PC의 실제 응답 기록:** 커스텀 경기 관전 중 로컬 allgamedata, playerlist, eventdata의 성공 여부와 필드를 기록한다. [기존 JSON 설명](JSON_FIELDS.md)과 비교한다.
2. **방송 항목별 출처 결정:** 밴픽, KDA, CS, 아이템, 팀 골드, 오브젝트 등 각 항목을 로컬 API·관전 화면 OCR·운영자 입력 중 어디서 가져올지 정한다.
3. **OCR 작은 실험:** 실제 관전 녹화에서 게임 시간, 팀 점수, 팀 골드처럼 위치가 일정한 영역부터 인식한다. LeagueOCR의 접근을 참고하고 한국어·실전 해상도로 정확도를 확인한다.
4. **영상과 데이터 시점 통일:** 가능한 한 관전 화면 영상과 같은 PC의 데이터·OCR을 기준으로 방송 상태를 만든다. 선수 PC 데이터가 앞서면 관전 화면 게임 시간에 맞춰 표시한다.
5. **방송 PC 연결:** 결과에 경기 ID, 게임 시간, 수집 시각, 출처, 신뢰도를 붙여 서버로 보내고 OBS 오버레이와 운영 콘솔에 반영한다. 실패 시 마지막 정상값과 운영자 수정을 사용한다.
6. **카메라 자동화 분리 평가:** 먼저 기본 관전 카메라와 수동 운영으로 방송을 완성한다. Replay API와 자동 관전 연구를 실시간 카메라에 적용할 수 있는지는 별도 실험으로 다룬다.

가장 큰 미확인 사항은 **현재 LoL 패치의 관전 클라이언트가 로컬 API로 반환하는 필드**와 **관전 HUD OCR의 실전 정확도**다. 이 두 가지가 수집기 배치와 방송 자동화 범위를 결정한다.
