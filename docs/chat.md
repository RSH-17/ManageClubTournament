지금까지 이야기한 내용을 기준으로 정리하면, 목표는 **LoL의 밴픽부터 인게임 HUD까지 하나의 방송용 UI 시스템으로 통합하는 것**이야. 핵심은 게임 화면 자체를 그대로 송출하는 게 아니라, **LoL 클라이언트와 게임 클라이언트에서 데이터를 받아 별도의 방송 UI를 실시간으로 갱신하는 구조**로 만드는 거야.

전체 구조는 아래처럼 보면 돼.

```text
LoL Client / Game Client
        │
        ├─ 밴픽 상태
        ├─ 게임 진행 상태
        ├─ 선수 정보
        ├─ 아이템
        ├─ KDA / CS / 레벨
        └─ 게임 이벤트
        │
        ▼
Local Collector
        │
        ▼
Match Engine
        │
        ├─ Draft Engine
        ├─ Game Engine
        ├─ Event Engine
        └─ Phase Detector
        │
        ▼
WebSocket
        │
        ▼
React 기반 방송 UI
        │
        ▼
OBS Browser Source
        │
        ▼
방송 송출
```

먼저 **밴픽 단계**에서는 League Client와 통신해서 현재 챔피언 선택 상태를 읽을 수 있어. 예를 들어 현재 픽, 밴, 픽 순서, 타이머 등을 읽고, 이를 방송용 UI에 표시하는 방식이야. 방송 화면은 실제 LoL 챔피언 선택 화면을 보여주는 것이 아니라, 그 데이터를 이용해서 별도로 만든 UI를 그리는 방식이야.

```text
선수 Client

Faker → Ahri Hover
        ↓
LCU 데이터 변화
        ↓
Collector
        ↓
Broadcast UI

[ Ahri 이미지가 흐리게 등장 ]

LOCK IN
        ↓

[ Ahri 확정 애니메이션 ]
```

이때 Hover와 Lock-in을 구분해서 애니메이션을 다르게 줄 수도 있어.

---

게임이 현재 **밴픽인지, 실제 게임인지 판단하는 방법**도 있어.

League Client의 Gameflow Phase를 이용해서 현재 상태를 확인할 수 있어.

개념적으로는:

```text
Lobby
  ↓
ChampSelect
  ↓
GameStart
  ↓
InProgress
  ↓
WaitingForStats
```

이런 상태가 존재하고,

```text
ChampSelect
→ DRAFT

GameStart
→ LOADING

InProgress
→ INGAME

WaitingForStats
→ POSTGAME
```

처럼 우리 시스템 내부 상태로 변환하면 돼.

그래서 방송 시스템은 자동으로:

```text
밴픽 UI
   ↓
VS / Loading UI
   ↓
인게임 HUD
   ↓
경기 결과 UI
```

로 전환할 수 있어.

---

인게임에 들어가면 **Live Client Data API**를 사용하면 돼.

게임 PC에서 로컬로

```text
https://127.0.0.1:2999/liveclientdata/...
```

형태의 API에 접근할 수 있어.

이 데이터에서는 대략 다음 정보를 얻을 수 있어.

```text
챔피언
레벨
아이템
KDA
CS
룬
소환사 주문
사망 상태
게임 시간
게임 이벤트
```

예를 들어 한 선수의 상태를 내부적으로 이렇게 관리할 수 있어.

```ts
interface PlayerState {
  championId: number;

  level: number;

  kills: number;
  deaths: number;
  assists: number;

  cs: number;

  items: number[];
}
```

그러면 방송 UI에서는:

```text
FAKER
Ahri Lv.13

4 / 1 / 6

CS 221

[신발] [ROA] [데스캡] [...]
```

같은 화면을 만들 수 있어.

---

아이템 구매 같은 것도 감지할 수 있어.

다만 보통은

```text
"Faker가 지금 아이템을 구매했다"
```

라는 이벤트를 직접 받는다기보다 **이전 상태와 현재 상태를 비교해서 이벤트를 만들어내는 방식**이 좋아.

예를 들어 이전 상태:

```text
[1056, 1001]
```

현재 상태:

```text
[1056, 1001, 3802]
```

라면 서버에서:

```json
{
  "type": "ITEM_PURCHASE",
  "player": "Faker",
  "item": 3802
}
```

라는 자체 방송 이벤트를 생성하는 방식이야.

그래서 서버에서는 크게 두 종류의 데이터를 관리하는 게 좋아.

```text
State

현재 KDA
현재 CS
현재 레벨
현재 아이템
현재 골드
현재 게임 시간
```

그리고:

```text
Event

Kill
Item Purchase
Dragon
Baron
Tower
Level Up
```

이런 식으로 분리하는 거야.

---

킬, 드래곤, 바론 같은 이벤트는 Live Client Data API의 이벤트 데이터를 이용할 수도 있어.

이 경우 이전에 처리한 `EventID`를 기억했다가 새 이벤트만 처리하면 돼.

예를 들어:

```text
기존 이벤트

20
21
22

새 응답

20
21
22
23
24
```

라면:

```text
23
24
```

만 방송 시스템에 전달하는 식이야.

---

API 통신은 기본적으로 **로컬 환경**에서 이루어져.

League Client API는:

```text
127.0.0.1:<동적 포트>
```

게임 중 Live Client Data API는:

```text
127.0.0.1:2999
```

로 접근하는 구조야.

즉:

```text
LoL Client
   ↓
localhost
   ↓
Collector
```

구조야.

그래서 LoL이 실행되는 PC와 방송 서버가 다른 PC라면, 방송 서버가 직접 `127.0.0.1`에 접근할 수는 없어.

그럴 때는 게임 PC에 작은 Collector 프로그램을 하나 두면 돼.

```text
[Observer PC]

League Client
Game Client
     │
     ▼
Collector
     │
     │ WebSocket / TCP
     ▼
────────────────────────

[Broadcast PC]

Match Server
     │
     ▼
Broadcast UI
     │
     ▼
OBS
```

즉 **LoL 관련 API는 로컬에서 읽고**, 우리가 만든 Collector가 필요한 정보만 방송 서버로 보내는 거야.

---

그리고 선수 PC 10대에서 각각 데이터를 모으는 것보다는 **Observer PC 하나를 중심으로 구성하는 방식이 훨씬 현실적**이야.

관전자 클라이언트에서도 경기 전체 플레이어에 대한 상당한 정보를 받을 수 있기 때문이야.

예를 들어:

```text
Observer PC

10명 플레이어
 ├─ Champion
 ├─ Level
 ├─ Items
 ├─ KDA
 ├─ CS
 ├─ Runes
 └─ Summoner Spells
```

같은 정보를 한 PC에서 수집할 수 있는 구조가 가능해.

그래서 이상적인 형태는:

```text
               Observer PC
                    │
        ┌───────────┴───────────┐
        │                       │
       LCU               Live Client API
        │                       │
    Champ Select           In-game Data
        │                       │
        └───────────┬───────────┘
                    ▼
                Collector
                    │
                    ▼
               Match Engine
                    │
          ┌─────────┼─────────┐
          │         │         │
       Draft      Game      Events
          │         │         │
          └─────────┼─────────┘
                    ▼
                WebSocket
                    │
          ┌─────────┼──────────┐
          ▼         ▼          ▼
       Draft UI   HUD      Popup UI
          │         │          │
          └─────────┼──────────┘
                    ▼
                   OBS
```

이런 구조야.

---

여기서 가장 중요한 설계 요소가 **Match Engine**이야.

게임 API를 UI가 직접 읽게 하지 말고, 모든 데이터를 한 번 서버에서 정리해서 하나의 경기 상태로 관리하는 게 좋아.

예를 들어:

```ts
interface MatchState {

  phase:
    | "LOBBY"
    | "DRAFT"
    | "LOADING"
    | "INGAME"
    | "POSTGAME";

  blue: TeamState;
  red: TeamState;

  draft: DraftState | null;
  game: GameState | null;
}
```

그러면 UI는 Riot API가 어떻게 생겼는지 몰라도 돼.

```text
Riot API
   ↓
Collector
   ↓
MatchEngine
   ↓
표준 MatchState
   ↓
UI
```

이 구조로 만들면 나중에 API 구조가 바뀌어도 Collector와 Source 부분만 수정하면 돼.

---

백엔드도 역할별로 분리하는 게 좋아.

```text
backend/

sources/
 ├─ LcuSource.ts
 └─ LiveGameSource.ts

engine/
 ├─ PhaseDetector.ts
 ├─ MatchEngine.ts
 ├─ DraftEngine.ts
 └─ GameEngine.ts

events/
 ├─ ItemDetector.ts
 ├─ KillDetector.ts
 ├─ ObjectiveDetector.ts
 └─ LevelDetector.ts

websocket/
 └─ BroadcastServer.ts
```

`LcuSource`는 밴픽 데이터를 읽고,

```text
DraftEngine
```

이 그걸 해석한다.

게임이 시작되면:

```text
LiveGameSource
        ↓
GameEngine
```

으로 넘어가는 방식이야.

---

프론트엔드 방송 UI도 하나의 거대한 화면보다는 여러 Overlay로 분리하는 게 좋아.

예를 들어:

```text
/broadcast/draft

/broadcast/scoreboard

/broadcast/player

/broadcast/items

/broadcast/objectives

/broadcast/notifications

/broadcast/postgame
```

이렇게 만들어두면 OBS에서:

```text
Game Capture

+

Scoreboard Overlay

+

Objective Overlay

+

Popup Overlay
```

처럼 레이어로 합성할 수 있어.

---

운영자용 Control Panel도 따로 만드는 게 좋아.

예를 들어:

```text
BROADCAST CONTROL

MATCH
T1 vs GEN
Game 3

Phase
● IN GAME

LoL Client
● Connected

Game Data
● Connected

----------------

Overlay

[ Scoreboard ]
[ Player HUD ]
[ Items ]
[ Objectives ]
[ Hide All ]

----------------

Manual Control

[ Set Draft ]
[ Set In Game ]
[ Set Post Game ]

[ Manual Kill ]
[ Manual Item ]
[ Manual Objective ]
```

자동 시스템이 잘못됐을 때 운영자가 바로 고칠 수 있도록 **수동 fallback을 반드시 두는 게 좋다.**

---

기술 스택은 처음에는 이 정도가 적당해.

```text
Frontend

React
TypeScript
CSS / Tailwind


Backend

Node.js
TypeScript
Express


Realtime

Socket.IO


Game Data

LCU
Live Client Data API


Assets

Riot Data Dragon


Broadcast

OBS Browser Source


DB

SQLite
```

SQLite에는 경기 실시간 상태 전체를 저장하기보다는:

```text
팀
선수
로고
선수 사진
매치 정보
세트 점수
방송 설정
```

정도를 저장하면 돼.

---

구현 순서는 아래가 가장 안정적이야.

1. **MatchState + MatchEngine부터 구현**
2. 수동 Control Panel 구현
3. 밴픽 UI 구현
4. WebSocket으로 Control Panel과 방송 UI 연결
5. LCU 밴픽 데이터 연결
6. Phase Detector 구현
7. Live Client Data API 연결
8. 인게임 Scoreboard 구현
9. KDA / CS / Item / Level UI 구현
10. Kill / Dragon / Baron / Tower 이벤트 처리
11. OBS Browser Source 연결
12. 애니메이션과 디자인 추가
13. Observer PC → Broadcast Server 구조로 분리

최종적으로 만들고 있는 시스템을 한 문장으로 표현하면 **“Observer PC에서 LoL의 경기 상태를 수집하고, 중앙 Match Engine이 이를 방송용 데이터로 변환해서 웹 기반 Overlay를 실시간으로 OBS에 제공하는 시스템”**이라고 볼 수 있어.
