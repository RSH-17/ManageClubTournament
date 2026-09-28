# JSON 샘플 필드 설명

이 문서는 프로젝트의 sample_data 폴더에 있는 [`gamedata.json`](../sample_data/gamedata.json)과 [`banpickdata.json`](../sample_data/banpickdata.json)을 직접 읽어 작성했다. 두 파일은 **각각 한 시점의 샘플**이므로, 아래의 값과 배열 길이는 항상 같다고 가정하면 안 된다. `gamedata.json`은 연습 도구(`PRACTICETOOL`)에서 약 116초에 저장되어 `allPlayers`가 한 명뿐이다. `banpickdata.json`은 커스텀 게임의 밴픽 도중 저장되어 양쪽 팀에 한 명씩만 있다.

`banpickdata.json`의 `chatDetails`에는 JWT 형식의 인증 값과 채팅 비밀번호가 들어 있다. 이 값은 방송 서버, 브라우저 UI, 로그, 공개 저장소로 보내지 않아야 한다. 이 문서에는 값 자체를 싣지 않는다.

**관전 클라이언트 관찰 결과:** 관전 중 받은 `gamedata.json` 형태의 API 응답에서는 `activePlayer`가 `null`이었다. 아래 `activePlayer` 필드 설명은 저장소의 연습 도구 샘플에 관한 것이며, 관전 수집기에서 사용할 수 있는 필드 목록이 아니다. 관전 응답의 `allPlayers`, `events`, `gameData`가 어느 범위까지 채워지는지는 해당 응답을 별도로 기록해 확인해야 한다.

## `gamedata.json`: 게임 진행 상태

LoL 게임 클라이언트의 로컬 Live Client Data API `allgamedata` 응답 형태다. 최상위에는 `activePlayer`, `allPlayers`, `events`, `gameData`가 있다. `activePlayer`는 이 클라이언트의 활성 플레이어에 대한 상세 값이고, `allPlayers`는 이 클라이언트가 반환한 참가자 목록이다. 이 샘플은 관전 클라이언트에서 얻은 데이터가 아니므로 관전 모드에서의 반환 범위는 확인할 수 없다.

### `activePlayer`: 활성 플레이어

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `abilities` | 객체 | `Q`, `W`, `E`, `R`, `Passive` 스킬 정보. |
| `championStats` | 객체 | 활성 플레이어 챔피언의 현재 능력치. 아래 표 참조. |
| `currentGold` | 숫자 | 현재 **보유** 골드. 이 샘플은 약 `605.06`이며 누적 획득 골드가 아니다. |
| `fullRunes` | 객체 | 일반 룬, 핵심 룬, 주·보조 룬 계열, 능력치 파편. |
| `level` | 숫자 | 챔피언 레벨. 샘플은 `1`. |
| `riotId` | 문자열 | 표시용 Riot ID 전체. 샘플에서는 `gameName#tagLine` 형식. |
| `riotIdGameName` | 문자열 | Riot ID의 게임 이름 부분. |
| `riotIdTagLine` | 문자열 | Riot ID의 태그 부분. |
| `summonerName` | 문자열 | 기존 소환사 이름 호환 필드. 샘플에서는 `riotId`와 같다. 식별자로는 `riotId` 또는 별도로 확보한 PUUID를 우선 고려한다. |
| `teamRelativeColors` | 불리언 | 팀 색상을 클라이언트의 상대적 팀 관점으로 표현하는지에 관한 플래그로 보인다. 이 샘플의 `true`만으로 화면 색상 매핑을 확정할 수 없다. |

`activePlayer.abilities.Q/W/E/R`는 같은 구조다. `Passive`는 이 샘플에서 `abilityLevel`이 없다.

| 스킬 하위 필드 | 형식 | 내용 |
| --- | --- | --- |
| `abilityLevel` | 숫자 | 현재 투자된 스킬 레벨. 샘플의 `Q/W/E/R`는 모두 `0`. 패시브에는 없음. |
| `displayName` | 문자열 | 클라이언트 언어로 표시되는 스킬 이름. |
| `id` | 문자열 | 스킬의 내부 식별자. 예: `GalioQ`. |
| `rawDescription` | 문자열 | 스킬 설명 텍스트의 현지화 키. 설명 문장 자체가 아니다. |
| `rawDisplayName` | 문자열 | 스킬 이름의 현지화 키. |

#### `activePlayer.championStats`

모두 현재 스냅샷의 값이다. 일부 수치는 UI의 정수 표시와 달리 소수점이 길게 나타날 수 있다. 퍼센트가 붙은 값의 단위·표시 변환은 이 샘플만으로 확정하지 않는다. 특히 `*PenetrationPercent`의 `1`을 곧바로 화면상 `1%`라고 표시하면 안 된다.

| 필드 | 내용 |
| --- | --- |
| `abilityHaste` | 스킬 가속. |
| `abilityPower` | 주문력. |
| `armor` | 방어력. |
| `armorPenetrationFlat` | 고정 방어력 관통 관련 값. |
| `armorPenetrationPercent` | 비율 방어력 관통 관련 내부 값. |
| `attackDamage` | 공격력. |
| `attackRange` | 공격 사거리. |
| `attackSpeed` | 공격 속도. |
| `bonusArmorPenetrationPercent` | 추가 방어력에 대한 관통 비율 관련 내부 값. |
| `bonusMagicPenetrationPercent` | 추가 마법 저항력에 대한 관통 비율 관련 내부 값. 정확한 적용 방식은 샘플만으로 확인 불가. |
| `critChance` | 치명타 확률 관련 값. |
| `critDamage` | 치명타 피해 관련 값. 샘플은 `200`; 표시 단위는 검증 필요. |
| `currentHealth` | 현재 체력. |
| `healShieldPower` | 회복·보호막 효과 증가 관련 값. |
| `healthRegenRate` | 체력 재생 관련 값. 시간 단위는 샘플만으로 확인 불가. |
| `lifeSteal` | 생명력 흡수 관련 값. |
| `magicLethality` | 마법 관통 관련 내부 값. `magicPenetrationFlat`과의 정확한 관계는 확인 필요. |
| `magicPenetrationFlat` | 고정 마법 관통 관련 값. |
| `magicPenetrationPercent` | 비율 마법 관통 관련 내부 값. |
| `magicResist` | 마법 저항력. |
| `maxHealth` | 최대 체력. |
| `moveSpeed` | 이동 속도 관련 값. 샘플은 `740`; 표시 UI와 일치하는지는 별도 검증 필요. |
| `omnivamp` | 모든 피해 흡혈 관련 값. |
| `physicalLethality` | 물리 관통력 관련 값. |
| `physicalVamp` | 물리 피해 흡혈 관련 값. |
| `resourceMax` | 마나 등 자원의 최대치. |
| `resourceRegenRate` | 자원 재생 관련 값. 시간 단위는 샘플만으로 확인 불가. |
| `resourceType` | 자원 종류. 샘플은 `MANA`. |
| `resourceValue` | 현재 자원량. |
| `spellVamp` | 주문 흡혈 관련 값. |
| `tenacity` | 강인함 관련 값. 샘플의 `5`에 적용할 표시 단위는 검증 필요. |

#### `activePlayer.fullRunes`

| 필드 | 내용 |
| --- | --- |
| `generalRunes[]` | 선택한 일반 룬 목록. 샘플은 6개. |
| `keystone` | 핵심 룬. 샘플은 `집중 공격` (`8005`). `generalRunes`에도 같은 룬이 들어 있다. |
| `primaryRuneTree` | 주 룬 계열. 샘플은 `정밀` (`8000`). |
| `secondaryRuneTree` | 보조 룬 계열. 샘플은 `영감` (`8300`). |
| `statRunes[]` | 능력치 파편 목록. 샘플은 3개. |

`generalRunes[]`, `keystone`, `primaryRuneTree`, `secondaryRuneTree`의 공통 하위 필드는 `displayName`(현지화된 이름), `id`(숫자 식별자), `rawDescription`(설명 현지화 키), `rawDisplayName`(이름 현지화 키)다. `statRunes[]`의 각 항목에는 이 샘플에서 `id`와 `rawDescription`만 있다. `raw*` 필드는 사용자에게 보여 줄 완성된 문장이 아니다.

### `allPlayers[]`: 참가자별 공개 목록

이 샘플에는 한 명만 있다. 다른 경기에서 10명이 반환되는지, 관전 모드에서 어떤 값이 나오는지는 이 파일로 판단할 수 없다.

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `championName` | 문자열 | 현지화된 챔피언 이름. 샘플은 `갈리오`. |
| `isBot` | 불리언 | 봇 여부. |
| `isDead` | 불리언 | 현재 사망 상태 여부. |
| `items[]` | 배열 | 보유 아이템. 샘플에서는 빈 배열이라 **아이템 객체의 실제 필드 구조는 확인할 수 없다**. |
| `level` | 숫자 | 챔피언 레벨. |
| `position` | 문자열 | 포지션 값. 샘플은 `NONE`; 이 값만으로 라인을 정할 수 없다. |
| `rawChampionName` | 문자열 | 챔피언 이름 현지화 키. |
| `rawSkinName` | 문자열 | 스킨 이름 현지화 키. |
| `respawnTimer` | 숫자 | 부활까지 남은 시간 관련 값. 샘플의 생존 플레이어에서는 `0`. 단위는 실전 값으로 확인 필요. |
| `riotId` | 문자열 | 참가자 Riot ID 전체. |
| `riotIdGameName` | 문자열 | Riot ID의 게임 이름 부분. |
| `riotIdTagLine` | 문자열 | Riot ID의 태그 부분. |
| `runes` | 객체 | 핵심 룬, 주 룬 계열, 보조 룬 계열. `fullRunes`의 일반 룬·능력치 파편 목록은 여기에 없다. |
| `scores` | 객체 | 킬, 데스, 어시스트, CS, 시야 점수. |
| `skinID` | 숫자 | 챔피언별 스킨 번호로 보이는 값. 샘플은 `6`. |
| `skinName` | 문자열 | 현지화된 스킨 이름. |
| `summonerName` | 문자열 | 기존 소환사 이름 호환 필드. 이 샘플은 `riotId`와 같다. |
| `summonerSpells` | 객체 | 첫째·둘째 소환사 주문의 표시 이름 및 현지화 키. |
| `team` | 문자열 | 팀 구분. 샘플은 `ORDER`. 상대 팀 값은 이 파일에 없어 실제 양 팀 매핑은 추가 샘플로 확인해야 한다. |

`allPlayers[].runes.keystone/primaryRuneTree/secondaryRuneTree` 각각의 `displayName`, `id`, `rawDescription`, `rawDisplayName`은 위의 `fullRunes`와 같은 뜻이다. `allPlayers[].scores`의 `kills`, `deaths`, `assists`는 K/D/A 횟수이고, `creepScore`는 CS, `wardScore`는 시야 점수다. `summonerSpells.summonerSpellOne`과 `summonerSpellTwo` 각각의 `displayName`은 표시 이름이며, `rawDescription`과 `rawDisplayName`은 현지화 키다.

### `events.Events[]`: 경기 이벤트

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `EventID` | 숫자 | 이벤트 식별 번호. 같은 경기에서 이미 처리한 이벤트를 걸러내는 데 사용할 수 있다. |
| `EventName` | 문자열 | 이벤트 종류. 샘플에는 `GameStart`, `MinionsSpawning`이 있다. |
| `EventTime` | 숫자 | 게임 시작 기준 이벤트 발생 시간(초). |

`events.Events`는 이 샘플에서 2개다. 수집할 때는 새 이벤트만 처리하되, 다른 경기로 넘어가면 처리한 ID 기록을 초기화해야 한다.

### `gameData`: 경기 기본 정보

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `gameMode` | 문자열 | 게임 모드. 샘플은 `PRACTICETOOL`. |
| `gameTime` | 숫자 | 게임 경과 시간(초). 샘플은 약 `116.41`. |
| `mapName` | 문자열 | 맵의 내부 이름. 샘플은 `Map11`. |
| `mapNumber` | 숫자 | 맵 번호. 샘플은 `11`. |
| `mapTerrain` | 문자열 | 맵 지형 상태. 샘플은 `Default`. |

## `banpickdata.json`: 밴픽 세션 상태

LoL League Client의 챔피언 선택 세션 형태로 보이는 JSON이다. 아래 설명은 **파일 구조와 샘플 값에 근거**한다. League Client API는 Riot의 제3자 앱 공식 지원 API가 아니므로, 세부 내부 필드의 정확한 의미·안정성은 버전과 모드별로 검증해야 한다.

### 밴픽 액션: `actions[][]`

바깥 배열은 단계별 묶음이고, 안쪽 배열은 그 단계에서 일어나는 액션들의 목록이다. 이 샘플은 바깥쪽 8개 묶음에 액션이 하나씩 있다. 액션 종류로 `ban`, `pick`, `phase_transition`이 보인다.

| 액션 필드 | 형식 | 내용 |
| --- | --- | --- |
| `actorCellId` | 숫자 | 액션을 수행하는 참가자 칸의 ID. `myTeam[].cellId` 등과 연결한다. `-1`은 샘플에서 단계 전환에 쓰인다. |
| `championId` | 숫자 | 대상 챔피언 ID. `0`은 이 샘플에서 아직 선택되지 않은 액션에 나타난다. |
| `completed` | 불리언 | 액션 완료 여부. |
| `duration` | 숫자 | 액션의 시간 관련 값. 샘플에서는 전부 `0`이므로 정확한 의미·단위를 확인할 수 없다. |
| `id` | 숫자 | 액션 식별 번호. 배열 위치와 같다고 가정하면 안 된다. |
| `isAllyAction` | 불리언 | 로컬 클라이언트 기준 아군 액션 여부. |
| `isInProgress` | 불리언 | 현재 진행 중인 액션 여부. |
| `pickTurn` | 숫자 | 픽 순서/턴 관련 값. 샘플에서는 모두 `0`이라 상세 규칙은 확인 불가. |
| `type` | 문자열 | 액션 종류: 샘플에는 `ban`, `pick`, `phase_transition`. |

샘플에서는 `championId: 267`인 밴 액션 하나가 완료되어 있고, 다음 밴 액션 하나가 진행 중이다. `actions`와 별도의 `bans.myTeamBans`는 빈 배열이므로, **액션의 완료 상태만 보고 최종 밴 목록이 동기화되었다고 가정하면 안 된다**.

### 세션 옵션과 상태

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `allowBattleBoost` | 불리언 | 배틀 부스트 허용 여부. 샘플은 `false`. 해당 모드의 실제 효과는 확인 필요. |
| `allowDuplicatePicks` | 불리언 | 챔피언 중복 선택 허용 여부. |
| `allowLockedEvents` | 불리언 | 잠긴 이벤트 허용 관련 설정. 구체적 동작은 샘플만으로 확인 불가. |
| `allowPlayerPickSameChampion` | 불리언 | 플레이어의 동일 챔피언 선택 허용 관련 설정. `allowDuplicatePicks`와의 차이는 확인 필요. |
| `allowRerolling` | 불리언 | 재선택/리롤 허용 여부. |
| `allowSkinSelection` | 불리언 | 스킨 선택 허용 여부. 샘플은 `true`. |
| `allowSubsetChampionPicks` | 불리언 | 일부 챔피언으로 선택 범위를 제한하는 기능 관련 설정으로 보인다. 상세 규칙은 확인 필요. |
| `benchEnabled` | 불리언 | 벤치 기능 활성화 여부. 샘플은 `false`. |
| `boostableSkinCount` | 숫자 | 부스트 가능한 스킨 수 관련 값. 샘플은 `0`. |
| `counter` | 숫자 | 세션 내부 카운터로 보인다. 샘플의 `5`만으로 증가 조건은 알 수 없다. 방송 UI 상태 판단에 직접 쓰지 않는 편이 안전하다. |
| `disallowBanningTeammateHoveredChampions` | 불리언 | 팀원이 선택 의사를 표시한 챔피언의 밴 금지 설정. |
| `gameId` | 숫자 | 해당 게임/로비의 ID. 샘플은 `8390531361`. 경기 API의 다른 ID와 같다고 가정하지 말고 실제 연동 시 확인한다. |
| `hasSimultaneousBans` | 불리언 | 동시 밴 단계 존재 여부. |
| `hasSimultaneousPicks` | 불리언 | 동시 픽 단계 존재 여부. 샘플은 `true`. |
| `id` | 문자열 | 챔피언 선택 세션 자체의 ID. `gameId`와 다른 값이다. |
| `isCustomGame` | 불리언 | 커스텀 게임 여부. 샘플은 `true`. |
| `isLegacyChampSelect` | 불리언 | 구형 챔피언 선택 방식 여부. |
| `isSpectating` | 불리언 | 이 클라이언트의 관전 상태 여부. 샘플은 `false`. |
| `localPlayerCellId` | 숫자 | 이 클라이언트 플레이어의 `cellId`. 샘플은 `0`. |
| `lockedEventIndex` | 숫자 | 잠긴 이벤트의 인덱스 관련 값. `-1`은 이 샘플에서 유효 인덱스가 없음을 시사하지만, 확정적 의미는 확인 필요. |
| `queueId` | 숫자 | 큐/게임 형식 ID. 샘플은 `3130`; 모드 이름과 매핑하려면 별도 큐 ID 자료가 필요하다. |
| `rerollsRemaining` | 숫자 | 남은 리롤 횟수. 샘플은 `0`. |
| `showQuitButton` | 불리언 | 클라이언트에서 나가기 버튼 표시 여부. |
| `skipChampionSelect` | 불리언 | 챔피언 선택 단계 건너뛰기 설정. |

### 밴·벤치·교환 목록

| 필드 | 샘플 | 내용 |
| --- | --- | --- |
| `bans.myTeamBans[]` | 빈 배열 | 아군 팀 밴 목록. 항목 형식은 이 샘플에서 확인 불가. |
| `bans.theirTeamBans[]` | 빈 배열 | 상대 팀 밴 목록. 항목 형식은 이 샘플에서 확인 불가. |
| `bans.numBans` | `0` | 세션의 밴 수 관련 값. 샘플의 완료된 `ban` 액션과 다르므로 이것만으로 확정 밴 수를 판단하지 않는다. |
| `benchChampions[]` | 빈 배열 | 벤치에 있는 챔피언 목록. 항목 형식은 확인 불가. |
| `pickOrderSwaps[]` | 빈 배열 | 픽 순서 교환 요청/상태. 항목 형식은 확인 불가. |
| `positionSwaps[]` | 빈 배열 | 포지션 교환 요청/상태. 항목 형식은 확인 불가. |
| `trades[]` | 빈 배열 | 챔피언 교환 요청/상태. 항목 형식은 확인 불가. |

### `myTeam[]` / `theirTeam[]`: 참가자 슬롯

두 배열의 참가자 객체는 이 샘플에서 같은 필드 구조를 가진다. `myTeam`과 `theirTeam`은 **로컬 클라이언트 관점**의 아군/상대 팀이다. 샘플은 각 배열에 한 명뿐이다.

| 참가자 필드 | 형식 | 내용 |
| --- | --- | --- |
| `assignedPosition` | 문자열 | 배정된 포지션. 아군 샘플은 `top`, 상대 샘플은 빈 문자열. |
| `cellId` | 숫자 | 밴픽 슬롯 ID. `actions[][].actorCellId`, `localPlayerCellId`와 연결한다. |
| `championId` | 숫자 | 현재 선택된 챔피언 ID. `0`이면 이 샘플에서 미선택 상태다. 확정 여부는 액션 상태도 함께 봐야 한다. |
| `championPickIntent` | 숫자 | 챔피언 선택 의사/희망 픽 ID. 샘플은 `0`. |
| `gameName` | 문자열 | Riot ID의 게임 이름. 상대 슬롯의 빈 문자열은 정보가 제공되지 않았음을 뜻하며 실제 이름이 없다는 의미는 아니다. |
| `internalName` | 문자열 | 클라이언트 내부 이름 관련 값. 두 슬롯 모두 빈 문자열이라 상세 의미 불명. |
| `isAutofilled` | 불리언 | 자동 배정 여부. |
| `isHumanoid` | 불리언 | 인간형/사용자 유형 관련 내부 플래그로 보이나 샘플만으로 의미를 확정할 수 없다. |
| `nameVisibilityType` | 문자열 | 이름 공개 상태. 샘플은 `VISIBLE`. |
| `obfuscatedPuuid` | 문자열 | 비식별화된 PUUID 관련 필드. 샘플에서는 빈 문자열. |
| `obfuscatedSummonerId` | 숫자 | 비식별화된 소환사 ID 관련 필드. 샘플은 `0`. |
| `pickMode` | 숫자 | 픽 방식 관련 내부 코드. 샘플은 `0`; 코드별 의미는 확인 불가. |
| `pickTurn` | 숫자 | 해당 슬롯의 픽 턴 관련 값. 샘플은 `0`. |
| `playerAlias` | 문자열 | 플레이어 별칭. 샘플에서는 빈 문자열. |
| `playerType` | 문자열 | 플레이어 유형 관련 값. 샘플에서는 빈 문자열. |
| `puuid` | 문자열 | Riot 계정의 PUUID. 외부 노출과 로그 보관 시 개인정보 취급에 유의한다. |
| `selectedSkinId` | 숫자 | 현재 선택한 스킨 ID. 아군 샘플은 `0`, 상대 샘플은 `15000`. |
| `spell1Id` | 숫자 | 첫째 소환사 주문 ID. 샘플의 아군 값은 `12`. |
| `spell2Id` | 숫자 | 둘째 소환사 주문 ID. 샘플의 아군 값은 `4`. |
| `summonerId` | 숫자 | 소환사 계정 ID. 상대 슬롯의 `0`은 값이 제공되지 않은 상태로 해석하는 것이 안전하다. |
| `tagLine` | 문자열 | Riot ID의 태그. 상대 슬롯은 빈 문자열. |
| `team` | 숫자 | 팀 번호. 샘플에서는 `myTeam`이 `1`, `theirTeam`이 `2`. 블루/레드와의 고정 대응은 이 파일로 확정 불가. |
| `wardSkinId` | 숫자 | 와드 스킨 ID. 샘플의 `-1`은 선택된 값이 없음을 시사한다. |

### `timer`: 현재 밴픽 단계의 시간

| 필드 | 형식 | 내용 |
| --- | --- | --- |
| `adjustedTimeLeftInPhase` | 숫자 | 현재 단계의 보정된 남은 시간. 샘플의 `30000`은 밀리초로 해석하면 30초다. |
| `internalNowInEpochMs` | 숫자 | 클라이언트의 현재 시각을 Unix epoch 기준 밀리초로 나타낸 값. |
| `isInfinite` | 불리언 | 시간 제한이 없는 단계인지 여부. |
| `phase` | 문자열 | 현재 타이머 단계. 샘플은 `BAN_PICK`. |
| `totalTimeInPhase` | 숫자 | 단계 전체 시간. 샘플의 `30000`은 30초에 해당한다. |

방송 화면에서 카운트다운을 만들 때는 매번 수신한 `adjustedTimeLeftInPhase`와 수신 시각을 함께 기록하고, 새 값이 들어오면 보정해야 한다.

### `chatDetails`: 밴픽 채팅 연결 정보

| 필드 | 내용 |
| --- | --- |
| `chatDetails.mucJwtDto.channelClaim` | 채팅 채널 식별 정보. |
| `chatDetails.mucJwtDto.domain` | 채팅 도메인/종류. 샘플은 `lol-champ-select`. |
| `chatDetails.mucJwtDto.jwt` | **채팅 인증 JWT**. 방송 데이터에서 제거해야 한다. |
| `chatDetails.mucJwtDto.targetRegion` | 채팅 대상 리전. 샘플은 `kr1`. |
| `chatDetails.multiUserChatId` | 다중 사용자 채팅방 ID. |
| `chatDetails.multiUserChatPassword` | **채팅방 인증 비밀번호/토큰**. 방송 데이터에서 제거해야 한다. |

## 방송 서비스에 적용할 때의 핵심 구분

- 인게임 `currentGold`는 현재 **보유** 골드이며, 이 샘플에는 선수별 **누적 골드** 필드가 없다.
- 인게임 `allPlayers`의 선수별 KDA·CS·아이템과 `activePlayer`의 상세 능력치는 범위가 다르다. 이 샘플만으로 관전 클라이언트가 같은 필드를 주는지 알 수 없다.
- 밴픽 `myTeam`/`theirTeam` 및 `isAllyAction`은 수집 PC 관점이다. 여러 PC의 결과를 합칠 때 고정 블루/레드 팀으로 바로 치환하면 안 된다.
- `actions`의 진행·완료 상태, 팀 슬롯의 `championId`, `bans` 요약은 서로 다른 표현이므로 방송 화면에서 확정 픽/밴을 판단할 규칙을 별도로 검증해야 한다.
- 빈 배열(`items`, `trades` 등)은 항목 스키마를 알려 주지 않는다. 실제 아이템 구매·교환이 일어난 추가 샘플이 필요하다.

참고: [Riot Live Client Data API](https://developer.riotgames.com/docs/lol#live-client-data-api), [Riot League Client API 안내](https://developer.riotgames.com/docs/lol#league-client-api).
