# SafeCircle Functional POC v1 Progress

- Issue: #5
- Branch: `feat/functional-poc-v1`
- Goal: 준비된 fixture 문장에 의존하지 않고 사용자의 임의 문장/음성이 Meaning Mirror 흐름을 끝까지 통과하는 POC
- Merge gate: Vercel Preview 실사용 확인 후 owner 승인

## Implemented

### 1. Arbitrary input mediation
- 새 `prototype/mediation-engine.js`
- 임의 한국어 문장을 규칙 기반으로 실제 분석
- 관계/상황/요청·질문·긴급성·금지·모호성·안전 신호 반영
- 결과 계약:
  - literal
  - risks
  - facts
  - questions
  - rephrase
  - escalation

### 2. Fixture 역할 축소
- fixture exact-match 의존 제거
- 구두점/공백 차이를 정규화하여 샘플/회귀 테스트 데이터로만 사용
- fixture에 없는 문장도 분석 가능

### 3. API contract
- `POST /api/mediate`
- same-origin JSON request/response
- raw conversation storage 없음
- 입력 검증 및 오류 응답
- 서버 실패/오프라인 시 동일 mediation engine으로 기기 내 fallback

### 4. Voice path
- 음성 → textarea 반영 → 임의 문장 분석으로 연결
- fixture 일치가 필요하지 않음

### 5. Runtime transparency
결과 화면에 다음 source 상태를 구분:
- 검증된 예시 데이터
- SafeCircle POC 서버 분석
- 기기 내 fallback

### 6. Offline/cache
- mediation engine을 app shell에 포함
- Service Worker `safecircle-shell-v13`
- 비상정보 cache-first 정책은 유지

## Static verification

PASS:
- mediation engine syntax
- app/API/SW syntax
- arbitrary request result schema
- punctuation-normalized fixture matching
- safety escalation
- ordinary question handling
- API wiring
- local fallback
- old “fixture에 없는 문장” fallback 제거
- engine script load order
- SW v13 cache entry

## Important limitation

현재 Functional POC의 mediation 품질은 **rule-v1 deterministic engine** 기준이다.
즉, 화면만 작동하는 목업은 벗어났지만 아직 외부 LLM 기반의 의미 추론 품질은 연결하지 않았다.

다음 품질 단계에서는 현재 `/api/mediate` 계약을 유지한 채 provider adapter를 추가해 AI mediation을 연결하고,
`rule-v1`은 offline/error fallback과 회귀 테스트 기준선으로 유지한다.

## Preview runtime gate

1. fixture에 없는 임의 문장 직접 입력
2. 음성으로 임의 문장 입력
3. Meaning Mirror 결과 생성
4. 추천 표현 TTS
5. Pass the Phone
6. microphone denied fallback
7. offline emergency
8. 새 Service Worker/asset 즉시 갱신
