# SafeCircle Prototype Interaction Spec v0.1

- 상태: Exploration / implementation-ready draft
- 상위 문서:
  - `product-thesis-v0.2.md`
  - `situational-context-graph-v0.1.md`
- 목적: “이 말, 상대방에게 어떻게 들릴까?” 흐름을 실제 프로토타입으로 구현할 수 있도록 화면, 상태, 입출력 계약, fixture, 테스트 기준을 고정한다.
- 범위: 한국어↔베트남어 / 직장 커뮤니케이션 / 관리자↔근로자

## 1. 프로토타입 목표

사용자가 한 문장을 입력했을 때 SafeCircle이 단순 번역을 제공하는 것이 아니라 다음을 구분해 보여주는지 검증한다.

1. 문자 그대로의 의미
2. 사용자가 의도했을 가능성이 높은 의미
3. 상대가 다르게 받아들일 수 있는 지점
4. 확인 질문
5. 더 쉬운 표현 또는 덜 오해받는 표현
6. 사용자 피드백
7. Situational Context Graph로 축적할 최소 신호

## 2. 핵심 사용자 시나리오

### Scenario A — 한국인 관리자가 전달 전 확인

입력:

> 내일부터 30분 일찍 나오세요.

목표:
- 명령 문장 자체를 번역하는 데서 끝나지 않음
- 왜 필요한지 맥락이 없으면 상대가 일방적 지시로 받아들일 수 있음을 표시
- 근무시간 변경이 조직 규정/노동조건과 관련될 수 있으므로 사실 확인 필요 표시
- 더 명확한 대안 표현 제안

예:

> 내일부터 30분 일찍 출근해야 합니다. 이유는 아침 안전점검입니다. 근무시간 변경과 관련해 궁금한 점이 있으면 알려주세요.

### Scenario B — 이주민 근로자가 받은 표현 이해

입력:

> 왜 이것도 아직 안 했어요?

목표:
- 문자 의미와 가능한 정서적 해석을 분리
- “상대가 화가 났다”라고 단정하지 않음
- 확인 질문 제안

예:

> 문자 그대로는 “왜 아직 완료하지 않았나요?”에 가깝습니다. 상황에 따라 재촉이나 질책처럼 느껴질 수 있습니다. 정확한 의도는 “언제까지 완료하면 되나요?”처럼 다시 확인하는 것이 좋습니다.

## 3. 화면 흐름

### Screen 0 — 진입

헤드라인:

> 이 말, 상대방에게 어떻게 들릴까?

설명:

> 전달하기 전이나, 받은 말을 이해하기 어려울 때 문장을 넣어보세요.

행동:
- `전달 전 확인`
- `받은 말 이해`

### Screen 1 — 입력

필드:
- 현재 언어
- 상대 언어
- 관계
  - 관리자 → 근로자
  - 근로자 → 관리자
  - 동료 ↔ 동료
- 상황 선택
  - 업무 지시
  - 휴가·근무시간
  - 안전수칙
- 문장 입력
- 선택 맥락
  - 왜 이 말을 하려는지 / 어떤 상황에서 들었는지

CTA:

> 어떻게 들릴지 확인

### Screen 2 — 중재 결과

카드 A — 문자 그대로의 의미

카드 B — 다르게 받아들일 수 있는 부분

카드 C — 확인해야 할 사실

카드 D — 확인 질문

카드 E — 더 쉬운 표현

카드 F — 공식정보가 필요한 경우 출처 링크

주의:
- “이 문화에서는 무례합니다” 식의 단정 금지
- “이 상황에서는 일부 사용자에게 이렇게 받아들여질 수 있습니다” 형태 사용

### Screen 3 — 피드백

질문 1:

> 이 설명이 실제 의도와 비슷했나요?

- 거의 맞아요
- 일부만 맞아요
- 달라요
- 잘 모르겠어요

질문 2:

> 상대가 이 표현을 어떻게 받아들였나요?

- 자연스러움
- 딱딱함
- 이해 어려움
- 무례하게 느껴짐
- 부담스러움
- 아직 모름

질문 3:

> 서로의 뜻을 확인하는 데 도움이 되었나요?

- 도움이 됨
- 일부 도움
- 도움이 안 됨

### Screen 4 — 결과/환류

메시지:

> 피드백은 개인을 평가하는 데 사용하지 않고, 비슷한 상황의 설명을 개선하는 데 활용합니다.

선택:
- 표현 다시 다듬기
- 다른 문장 확인
- 사람/기관 도움 보기

## 4. 상태 전이

```
ENTRY
  -> MODE_SELECTED
  -> INPUT_READY
  -> ANALYZING
  -> RESULT_READY
  -> FEEDBACK_OPTIONAL
  -> COMPLETE
```

에러 상태:

```
ANALYZING
  -> NEED_MORE_CONTEXT
  -> UNSAFE_TO_INFER
  -> OFFICIAL_INFO_REQUIRED
  -> HUMAN_SUPPORT_RECOMMENDED
```

## 5. 프론트엔드 입력 계약

```json
{
  "mode": "before_send|understand_received",
  "source_language": "ko",
  "target_language": "vi",
  "relationship": "manager-worker",
  "domain": "workplace_instruction",
  "message": "내일부터 30분 일찍 나오세요.",
  "optional_context": "아침 안전점검 때문에 필요함",
  "user_role": "manager"
}
```

## 6. 중재 API 출력 계약

```json
{
  "literal_meaning": {
    "text": "내일부터 평소보다 30분 일찍 출근하라는 뜻입니다."
  },
  "interpretation_risks": [
    {
      "text": "이유 설명 없이 전달되면 일방적인 지시로 받아들여질 수 있습니다.",
      "confidence": "medium",
      "basis": "context_pattern"
    }
  ],
  "facts_to_confirm": [
    {
      "text": "근무시간 변경이 사전 합의 또는 조직 규정 확인이 필요한 사항인지 확인하세요.",
      "basis": "official_or_org_rule"
    }
  ],
  "questions_to_confirm": [
    "왜 30분 일찍 출근해야 하는지 설명이 필요한가요?"
  ],
  "suggested_rephrase": [
    {
      "text_ko": "내일부터 아침 안전점검 때문에 30분 일찍 출근해야 합니다. 궁금한 점이 있으면 말씀해주세요.",
      "text_target": "..."
    }
  ],
  "official_sources": [],
  "escalation": "none",
  "feedback_prompt": true
}
```

## 7. Feedback Event 계약

```json
{
  "event_id": "ctx_001",
  "mediation_id": "med_001",
  "intent_match": "mostly|partly|different|unknown",
  "perceived_reaction": "natural|formal|confusing|rude|burdensome|unknown",
  "helpfulness": "yes|partly|no",
  "free_text": null,
  "consent_for_aggregate_learning": true
}
```

## 8. 초기 fixture 6개

### F1 업무지시 / 한국인 관리자 → 베트남인 근로자

입력:
> 내일부터 30분 일찍 나오세요.

기대:
- 이유 부재를 오해 가능성으로 표시
- 노동조건 관련 공식 확인 가능성 표시
- 더 명확한 표현 제안

### F2 업무지시 / 공개 질책

입력:
> 왜 이것도 아직 안 했어요?

기대:
- 공격성 단정 금지
- 공개/비공개 맥락 요청 가능
- 확인 질문 제공

### F3 휴가

입력:
> 다음 주 금요일은 쉬면 안 됩니다.

기대:
- 규정/승인 절차 확인 필요
- 절대적 금지인지 일정 조정 요청인지 구분 필요

### F4 근무시간

입력:
> 오늘은 일이 많으니까 끝날 때까지 해주세요.

기대:
- 초과근무 관련 공식정보/조직규정 확인 필요
- 단순 문화 해석으로 처리 금지

### F5 안전수칙

입력:
> 기계 멈추면 바로 만지지 말고 관리자 부르세요.

기대:
- 핵심 안전행동은 문화적 해석보다 우선
- 쉬운 표현/행동단계 제안
- 승인된 안전정보 필요 상태 가능

### F6 동료간 표현

입력:
> 이것 좀 빨리 해주세요.

기대:
- 상황에 따라 자연스러운 요청일 수도 있고 재촉으로 들릴 수도 있음을 표현
- 확정 판정 금지

## 9. 안전/신뢰 규칙

### 반드시 지킬 것

1. 국적만으로 해석 생성 금지
2. 개인 성격·감정 추론 금지
3. 민감한 노동·법률 판단 확정 금지
4. 안전수칙은 공식/승인 정보 우선
5. 문화적 해석은 가능성으로 표시
6. 사용자 피드백은 개인 평가에 사용하지 않음
7. 조직 관리자에게 원문 중재 로그 제공 금지

### 출력 문구 규칙

금지:
> 베트남 사람들은 공개 지적을 싫어합니다.

허용:
> 비슷한 직장 상황에서 공개적인 지적을 개인적인 비난처럼 받아들였다는 피드백이 일부 보고될 수 있습니다. 실제 의도는 직접 확인하는 것이 좋습니다.

## 10. Context Graph write 규칙

중재 1건이 끝났다고 자동으로 패턴을 생성하지 않는다.

```
mediation complete
-> optional feedback
-> PII redaction
-> event storage
-> similarity cluster
-> threshold check
-> emerging pattern candidate
```

초기 임계값 예:
- 유사 Context Event 5건 이상
- 단일 사용자 비중 50% 미만
- 상반 피드백 존재 여부 기록
- 민감영역이면 자동 승격 금지

## 11. pattern fixture 예시

```json
{
  "pattern_id": "pat_public_correction_001",
  "domain": "workplace_instruction",
  "relationship": "manager-worker",
  "trigger": {
    "setting": "public",
    "expression_pattern": "direct_correction"
  },
  "observations": {
    "count": 8,
    "reaction_distribution": {
      "natural": 1,
      "formal": 1,
      "confusing": 1,
      "rude": 3,
      "burdensome": 2
    }
  },
  "interpretation": "공개된 자리에서 직접적인 지적이 부담 또는 비난으로 받아들여질 가능성이 반복 보고됨",
  "status": "emerging",
  "allowed_use": "context_hint_only"
}
```

## 12. 테스트 기준

### T1 단정 방지
입력에 국적이 포함되어도 “OO인은 원래…” 유형 출력이 없어야 한다.

### T2 사실/해석 분리
조직규칙 또는 노동조건 확인이 필요한 경우 문화 해석으로 덮지 않아야 한다.

### T3 재표현
각 fixture에서 최소 1개 이상의 더 쉬운 표현을 반환한다.

### T4 확인 질문
맥락 부족 시 확인 질문을 최소 1개 제공한다.

### T5 민감 영역 에스컬레이션
초과근무/안전 관련 fixture는 필요 시 `official_support` 또는 공식정보 확인을 표시한다.

### T6 피드백 저장
피드백 이벤트는 원문 개인식별정보 없이 Context Event에 연결되어야 한다.

### T7 관리자 경계
조직 인사이트용 fixture에는 개인 사용자 ID/원문이 포함되지 않아야 한다.

## 13. 프로토타입 최소 기술 구성

초기 권장:

- Frontend: 모바일 우선 Web/PWA
- Fixture store: JSON
- Mediation endpoint: mock 또는 LLM wrapper
- Official knowledge: 5~10개 검증 카드
- Context pattern store: JSON
- Feedback: local/session storage 또는 간단한 API
- Analytics: 이벤트 카운트 수준

그래프DB는 사용하지 않는다.

## 14. 프로토타입 파일 구조 제안

```
prototype/
├─ fixtures/
│  ├─ mediation-cases.json
│  ├─ context-patterns.json
│  └─ official-cards.json
├─ schemas/
│  ├─ mediation-input.schema.json
│  ├─ mediation-output.schema.json
│  └─ feedback-event.schema.json
├─ src/
│  ├─ screens/
│  ├─ mediation/
│  └─ feedback/
└─ tests/
   ├─ mediation-fixtures.test.*
   └─ trust-boundary.test.*
```

## 15. 구현 순서

1. 6개 fixture 작성
2. 화면 0~4 정적 프로토타입
3. mock mediation output 연결
4. feedback event 저장
5. context pattern 1개 mock
6. official/context knowledge 구분 UI
7. trust boundary 테스트
8. 이후 실제 LLM 연결 여부 결정

## 16. 완료 정의

다음이 되면 v0.1 프로토타입 스펙 완료로 본다.

- 한국인/이주민 양쪽 흐름이 모두 동작
- 단순 번역 외의 해석 차이 카드가 보임
- 확인 질문/재표현이 제공됨
- 사용자 피드백이 저장됨
- Context Event로 연결 가능
- 개인 데이터와 조직 인사이트가 분리됨
- 민감영역에서 AI가 판정하지 않음

---

## 결정 기록

- 첫 구현은 “문화 지식 검색”이 아니라 **문장 단위 상호이해 흐름**에서 시작한다.
- 그래프DB보다 fixture와 데이터 계약을 먼저 검증한다.
- “이 말 어떻게 들릴까?”를 반복사용성 가설의 대표 기능으로 둔다.
- 사용자의 피드백은 즉시 학습 지식이 아니라 Context Event로 축적한다.
- 공식정보와 문화적 해석은 같은 카드에 섞지 않는다.
