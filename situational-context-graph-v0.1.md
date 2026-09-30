# SafeCircle Situational Context Graph & Participation UX v0.1

- 상태: Exploration
- 상위 문서: `product-thesis-v0.2.md`
- 목적: SafeCircle의 문화·맥락 데이터를 고정관념 DB가 아닌 실제 상황 기반 학습 구조로 설계하고, 사용자 참여가 자연스럽게 축적되도록 UX와 데이터 계약을 정의한다.

## 1. 설계 목표

SafeCircle은 “국가별 문화 특성”을 수집하지 않는다.

대신 다음을 축적한다.

> **어떤 상황에서 어떤 표현·규칙·관계가 어떻게 다르게 해석되었고, 어떤 중재와 확인이 실제 이해 또는 해결에 도움이 되었는가**

따라서 데이터의 최소 단위는 사람이 아니라 **상황 사건(Context Event)** 이다.

## 2. 핵심 개체

### 2.1 Context Event

실제 상호작용 또는 사용자가 가져온 사례 한 건.

```json
{
  "event_id": "ctx_...",
  "domain": "workplace|life|safety|administration",
  "relationship": "manager-worker|peer-peer|citizen-official|other",
  "setting": {
    "public_private": "public|private|unknown",
    "urgency": "low|medium|high",
    "channel": "spoken|chat|notice|document|other"
  },
  "language_pair": ["ko", "vi"],
  "expression": {
    "original": "...",
    "normalized": "...",
    "sensitive_redacted": true
  },
  "intent": {
    "self_reported": "...",
    "confidence": "high|medium|low"
  },
  "perception": {
    "self_reported": "...",
    "reaction_tags": ["confusing", "harsh", "unclear"]
  },
  "mediation": {
    "summary": "...",
    "interpretation_candidates": ["..."],
    "fact_checks": ["..."],
    "suggested_question": "..."
  },
  "outcome": {
    "resolved": "yes|no|unknown",
    "helped": "yes|partly|no|unknown"
  },
  "provenance": {
    "source": "user_case|synthetic|expert_review|official_rule",
    "review_status": "raw|reviewed|approved|rejected"
  }
}
```

## 3. 저장하지 않을 것

다음은 기본 그래프 속성으로 저장하지 않는다.

- 국적 → 성향 점수
- 종교 → 행동 예측
- 인종/민족 → 커뮤니케이션 스타일 점수
- 개인의 “문화 적응도”
- 관리자가 보는 직원별 갈등 점수
- 사용자의 민감한 원문 전체를 장기 보관하는 구조

필요한 인구통계 정보가 연구·검증 목적으로 사용되더라도, 제품의 중재 판단에 직접 연결되는 고정 속성으로 사용하지 않는다.

## 4. 그래프 구조

핵심 노드:

```
ContextEvent
├─ SituationType
├─ RelationshipType
├─ ExpressionPattern
├─ IntendedMeaning
├─ PerceivedMeaning
├─ FrictionType
├─ MediationPattern
├─ FeedbackSignal
├─ ResolutionOutcome
└─ EvidenceSource
```

핵심 엣지:

```
ExpressionPattern
  -> interpreted_as
PerceivedMeaning

ContextEvent
  -> occurred_in
SituationType

MediationPattern
  -> helped_in
ContextEvent

FeedbackSignal
  -> validates
MediationPattern

ResolutionOutcome
  -> follows
MediationPattern
```

## 5. 신뢰도 모델

SafeCircle은 “많이 투표받은 해석 = 진실”로 취급하지 않는다.

각 지식 조각은 최소 다음 축을 가진다.

- **frequency**: 비슷한 상황에서 반복 보고되었는가
- **agreement**: 당사자 피드백이 서로 일치하는가
- **diversity**: 서로 다른 배경/조직/상황에서도 재현되는가
- **expert_review**: 전문가 또는 기관 검토가 있었는가
- **recency**: 최근에도 유효한가
- **source_type**: 사용자 경험 / 공식 정보 / 전문가 검토 / 합성 사례

예:

```json
{
  "pattern_id": "pat_...",
  "frequency": 18,
  "agreement": 0.72,
  "diversity_score": 0.61,
  "expert_review": false,
  "recency_days": 45,
  "status": "emerging"
}
```

상태 예시:
- `raw`
- `emerging`
- `supported`
- `reviewed`
- `deprecated`

## 6. 사용자 참여 UX

### 6.1 원칙

사용자에게 “문화 데이터를 입력하세요”라고 요구하지 않는다.

서비스 사용 후 5~10초 안에 끝나는 피드백으로 데이터를 축적한다.

### 6.2 피드백 카드 A — 설명 적합성

질문:

> 이 설명이 실제 의도와 비슷했나요?

선택:
- 거의 맞아요
- 일부만 맞아요
- 달라요
- 잘 모르겠어요

### 6.3 피드백 카드 B — 받은 느낌

질문:

> 이 표현을 받았을 때 가장 가까운 느낌은 무엇이었나요?

선택:
- 자연스러움
- 딱딱함
- 이해 어려움
- 무례하게 느껴짐
- 부담스러움
- 기타

주의:
“이 표현은 무례하다”가 아니라 **사용자가 그렇게 느꼈다**는 피드백으로 저장한다.

### 6.4 피드백 카드 C — 더 좋은 표현

질문:

> 더 자연스럽거나 정확한 표현이 있나요?

입력은 선택 사항.

이 입력은 곧바로 표준 답변이 되지 않고 `raw contribution` 으로 저장된다.

### 6.5 피드백 카드 D — 해결 여부

질문:

> 서로의 뜻을 확인하는 데 도움이 되었나요?

선택:
- 도움이 됨
- 일부 도움
- 도움이 안 됨

## 7. 참여 보상 구조

금전성 보상보다 **기여가 실제 개선으로 연결되는 경험**을 우선한다.

예:
- “당신의 피드백이 비슷한 상황 설명 개선에 반영되었습니다.”
- “이 표현에 대한 다양한 해석이 추가되었습니다.”
- “이 사례는 아직 의견이 나뉘어 있어 하나의 정답으로 사용하지 않습니다.”

배지/기여도는 가능하지만, 특정 문화의 “대표자” 지위를 부여하지 않는다.

## 8. 관리자/조직용 데이터 경계

관리자는 개인 Context Event를 직접 조회하지 못한다.

조직에는 최소 집계 기준을 통과한 패턴만 제공한다.

예:

허용:
> 최근 교대근무 안내에서 “이해하기 어렵다” 피드백이 반복되고 있습니다.

금지:
> 특정 직원이 특정 관리자 표현을 무례하다고 평가했습니다.

권장 최소 집계 조건 예:
- 동일 패턴 5건 이상
- 단일 사용자 기여 비중 50% 미만
- 개인 식별 가능 문장 비노출

## 9. 공식정보와 문화맥락의 분리

두 지식은 절대 같은 신뢰도로 섞지 않는다.

### Official Knowledge
- 법령
- 공공기관 안내
- 조직 규정
- 안전수칙
- 게시일/출처/검토일 필수

### Context Knowledge
- 사용자 경험
- 해석 차이
- 표현 인식
- 중재 피드백
- 불확실성과 분포 표시

UI에서도 다음처럼 구분한다.

> **확인된 정보**
> 회사 규정상 교대 변경은 전날 오후 6시까지 신청해야 합니다.

> **해석 가능성**
> 이 표현은 일부 사용자에게 명령이나 질책처럼 받아들여질 수 있습니다.

## 10. 중재 출력 계약

```json
{
  "shared_facts": [],
  "different_interpretations": [],
  "context_hints": [
    {
      "text": "...",
      "confidence": "low|medium|high",
      "basis": "context_pattern|official_rule|user_statement"
    }
  ],
  "questions_to_confirm": [],
  "suggested_rephrase": [],
  "official_sources": [],
  "escalation": "none|human_support|official_support|emergency"
}
```

## 11. 패턴 승격 규칙

Raw 사용자 기여가 곧바로 AI의 기본 지식이 되지 않는다.

권장 흐름:

```
raw contribution
→ duplicate/PII/safety filtering
→ cluster
→ emerging pattern
→ multi-user support
→ optional expert review
→ supported/reviewed pattern
→ mediation retrieval
```

민감영역(노동분쟁, 의료, 법률, 재난)은 전문가/공식자료 검토 없이는 `reviewed` 상태로 승격하지 않는다.

## 12. 어뷰징 방지

가능한 공격:
- 특정 집단에 대한 혐오성 “문화 정보” 대량 등록
- 조직이 직원 평가용으로 사용
- 같은 사용자의 반복 투표
- 특정 표현을 악의적으로 표준화
- 개인정보 포함 사례 업로드

대응:
- 개인 식별정보 자동 마스킹
- 사용자별 기여 가중치 상한
- 신규 패턴 자동 승격 금지
- 혐오/차별성 기여 검토
- 조직 관리자에게 개인 기여 원문 비노출
- 신고/정정/삭제 요청 경로 제공

## 13. MVP 데이터 범위

초기에는 전체 문화권을 다루지 않는다.

범위:
- 한국어 + 베트남어 우선
- 직장 상황 중심
- 관리자↔근로자 / 동료↔동료
- 3개 상황군:
  1. 업무 지시
  2. 휴가·근무시간
  3. 안전수칙

초기 목표:
- 합성/전문가 검토 사례 20개
- 실제 사용자 인터뷰 기반 사례 20개
- 각 사례당 양쪽 관점 피드백
- 5개 이상 반복 패턴 발견 여부 확인

## 14. 검증 지표

제품 가치:
- 단순 번역 대비 중재 결과 선호율
- 오해 가능성 사전 발견률
- 재표현 사용률
- 실제 해결 도움 응답률

데이터 품질:
- 패턴별 사용자 다양성
- 상반된 피드백 비율
- 잘못된 일반화 신고 수
- 전문가 검토 후 폐기/수정 비율

참여:
- 피드백 카드 응답률
- 10초 이내 완료율
- 반복 기여율
- 기여 후 이탈률

신뢰:
- “감시받는다” 인식 비율
- 개인 대화 비공개 정책 이해율
- 관리자와 일반 사용자의 신뢰도 차이

## 15. 프로토타입 화면 제안

### 화면 1 — 문장/상황 입력
“이 말이 어떻게 들릴지 확인해보세요.”

### 화면 2 — 중재 결과
- 문자 그대로의 의미
- 상대가 다르게 받아들일 수 있는 부분
- 확인이 필요한 질문
- 더 쉬운 표현

### 화면 3 — 피드백
“실제 의도와 비슷했나요?”

### 화면 4 — 기여 환류
“이 피드백은 비슷한 상황의 설명 품질 개선에 사용됩니다.”

### 화면 5 — 조직 인사이트 예시
개인 정보 없이 반복되는 커뮤니케이션 마찰만 집계.

## 16. 다음 구현 계약

프로토타입에서는 실제 그래프DB를 먼저 구축할 필요는 없다.

1단계:
- JSON fixture
- Context Event schema
- feedback 기록
- pattern clustering mock

2단계:
- embedding 기반 유사 사례 검색
- pattern score 계산
- official/context knowledge 분리 retrieval

3단계:
- 그래프DB 또는 관계형+벡터 구조 선택

기술 선택보다 **데이터 계약과 신뢰 경계 검증을 먼저 한다.**

---

## 결정 기록

- 문화 지식은 국적 단위가 아니라 상황 사건 단위로 축적한다.
- 사용자 참여는 별도 제보가 아니라 사용 흐름의 짧은 피드백으로 만든다.
- 빈도는 진실이 아니며, 다양성·출처·검토·불확실성을 함께 관리한다.
- 관리자에게 개인 중재 원문을 제공하지 않는다.
- 공식정보와 문화적 해석은 데이터와 UI 모두에서 분리한다.
- 초기 MVP는 한국어-베트남어 직장 커뮤니케이션 3개 상황군으로 좁혀 검증한다.
