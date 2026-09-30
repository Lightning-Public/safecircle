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

AI mediation은 POC 필수 기능으로 확정했다.

현재 브랜치에는 Upstage Solar provider adapter가 연결되어 있으며 온라인 기본 경로는:
`사용자 입력 → /api/mediate → Upstage Solar → Structured Output → Meaning Mirror` 이다.

- 기본 모델: `solar-pro4` (환경변수 `UPSTAGE_MODEL`로 변경 가능)
- 비밀키: Vercel `UPSTAGE_API_KEY`
- structured output: strict JSON Schema
- provider 실패/timeout: `rule-v1` fallback
- offline: `rule-v1` local fallback
- 앱에서 `/api/health`를 통해 AI 연결 여부만 표시하며 키 값은 노출하지 않는다.

따라서 `rule-v1` 단독 동작은 Functional POC PASS가 아니며, Preview에서 실제 Upstage 응답을 확인해야 한다.

## Preview runtime gate

1. fixture에 없는 임의 문장 직접 입력
2. 음성으로 임의 문장 입력
3. Meaning Mirror 결과 생성
4. 추천 표현 TTS
5. Pass the Phone
6. microphone denied fallback
7. offline emergency
8. 새 Service Worker/asset 즉시 갱신
