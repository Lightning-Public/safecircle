# SafeCircle Service Plan v0.3 — Agent Experience & Release Path

- 상태: **Product Planning / Release Upgrade**
- 기준 코드: `main@3abf3aa`
- 연결 문서:
  - `agent-harness-v1.md`
  - `product-thesis-v0.2.md`
  - `situational-context-graph-v0.1.md`
  - `mobile-pwa-offline-emergency-spec-v0.1.md`
- 목적: SafeCircle을 “AI 분석 기능이 있는 프로토타입”에서 **실제 생활과 현장에서 반복적으로 도움이 되는 상호이해 에이전트 서비스**로 발전시키기 위한 서비스 기획 기준을 정의한다.

---

## 0. Product Priority

SafeCircle 서비스 기획은 Agent Harness보다 상위가 아니라 **Agentic System을 실제 사용자 장면에서 검증하고 가치를 만드는 적용 계층**이다.

우선순위:

1. Agent Runtime 품질
2. Skill orchestration
3. Policy / Knowledge / Validator
4. Eval / Trace / 운영 안정성
5. 그 위에 사용자 경험과 콘텐츠 확장

따라서 새로운 서비스 기능은 “기능 목록”으로 바로 추가하지 않고 반드시 대응하는 Agent Skill / Policy / Knowledge / Eval 계약을 먼저 정의한다.

서비스 기획의 역할은 다음을 제공하는 것이다.

- Agent가 실제로 해결해야 할 장면
- 반복사용할 사용자 작업
- 필요한 콘텐츠와 공식정보
- 실패가 치명적인 고위험 상황
- 사용자가 체감할 수 있는 완료 기준

---

## 1. 서비스 정의 업그레이드

기존:

> AI를 활용한 다문화 상호이해·중재 서비스

업그레이드:

> **SafeCircle은 말하기 전, 들은 뒤, 서로 뜻이 어긋났을 때, 그리고 안전·공식정보가 필요할 때 함께 확인하고 다음 행동을 찾도록 돕는 상호이해 에이전트다.**

핵심 변화:

- AI 기술이 전면에 나오지 않는다.
- 사용자는 “도구를 실행한다”보다 “SafeCircle에게 도움을 받는다”고 느낀다.
- 분석 결과보다 **다음 행동 완료**가 제품 가치다.

---

## 2. 초기 핵심 사용자

### U1 — 이주민 근로자

필요:

- 받은 말의 의미 확인
- 쉬운 한국어/모국어 설명
- 관리자에게 다시 물어볼 문장
- 안전/근무/행정 정보
- 말하기 어려운 상황에서 TTS/Pass the Phone

### U2 — 한국인 관리자/동료

필요:

- 전달 전 표현 점검
- 쉽고 명확한 다언어 표현
- 오해가 생길 지점 사전 확인
- 안전수칙 전달 확인
- 민감한 내용을 공식정보와 구분

### U3 — 두 사람이 함께

필요:

- 한쪽 편이 아닌 공통 화면
- 각자 이해한 내용을 순서대로 입력
- 공통사실/차이/unknowns 표시
- “다음 질문 하나” 제안

### 초기 Pilot 범위

- 한국어 ↔ 베트남어
- 소규모 사업장
- 관리자 ↔ 근로자 / 동료 ↔ 동료
- 업무 지시 / 근무·휴가 / 안전
- 일반 생활 도움 일부

전체 다문화 생활 서비스로 한 번에 확장하지 않는다.

---

## 3. 사용자가 얻어야 하는 5가지 가치

### V1 — 말하기 전에 실수를 줄인다

> “이 말을 이렇게 보내도 괜찮을까?”

SafeCircle이:

- 뜻
- 다르게 들릴 지점
- 빠진 맥락
- 더 명확한 표현

을 보여준다.

### V2 — 받은 말을 혼자 추측하지 않아도 된다

> “이 말이 무슨 뜻이지?”

SafeCircle이:

- 확실히 알 수 있는 뜻
- 가능한 해석
- 모르는 부분
- 되물을 한 문장

으로 정리한다.

### V3 — 서로 직접 확인하기 쉬워진다

> “내 설명이 아니라, 둘이 같이 확인하고 싶다.”

한 기기에서:

- A 입력
- B 확인/입력
- 공통점/차이
- 다음 질문

을 제공한다.

### V4 — 어려운 정보를 이해하기 쉬워진다

공공·노동·안전정보를:

- 쉬운 문장
- 대상 언어
- TTS
- 출처
- 검토일

로 제공한다.

### V5 — 위기 시 생각할 것을 줄인다

재난에서는:

- 승인 행동카드
- 큰 버튼
- 음성
- 집결지
- 119/담당자
- 상태 회신

만 빠르게 제공한다.

---

## 4. 핵심 사용자 여정

### Journey A — 말로 전하기

```
홈
→ SafeCircle에게 말 전달 도움 요청
→ 관계/상황 자동 또는 간단 선택
→ 말/텍스트 입력
→ SafeCircle Meaning Mirror
→ SafeCircle이 아직 모르는 부분
→ SafeCircle 제안
→ [들려주기] [복사] [상대에게 보여주기]
→ 5초 피드백
```

완료 기준:
- 사용자가 실제로 전달 가능한 문장을 얻음

### Journey B — 들은 말 이해하기

```
받은 문장 붙여넣기/말하기
→ 문자 의미
→ 가능한 해석
→ 단정할 수 없는 부분
→ “이렇게 물어보세요”
→ 상대에게 질문
```

완료 기준:
- 사용자가 혼자 의도를 추측하지 않고 확인 행동으로 이동

### Journey C — 같이 이야기하기

```
A가 상황 설명
→ 휴대폰 전달
→ B가 자신의 이해 입력
→ SafeCircle이 공통사실 정리
→ 서로 다른 해석 표시
→ 확인이 필요한 한두 가지
→ 다음 질문
→ 양쪽 확인
```

완료 기준:
- AI 결과를 읽는 것이 아니라 두 사람이 같은 쟁점을 보고 대화를 재개

### Journey D — 공식정보 필요

```
질문
→ SafeCircle이 R2 감지
→ 일반 해석 + Official Check
→ “제가 판단하지 않고 확인할게요”
→ 공식정보 카드
→ 출처 / 검토일 / 기관
→ 필요한 경우 사람 연결
```

### Journey E — 재난/안전

```
안전 탭 또는 긴급 진입
→ 현재 재난/시설 확인
→ 승인 행동카드
→ TTS
→ 집결지
→ [대피 중] [도움 필요] [집결 완료]
→ offline queue
→ 연결 복구 후 실제 ACK
```

완료 기준:
- LLM이 없어도 핵심 안전 행동이 유지됨

---

## 5. 홈 화면의 서비스 구조

홈은 기능 메뉴가 아니라 “SafeCircle에게 무엇을 부탁할지”를 보여준다.

권장:

### SafeCircle에게 부탁하기

1. **말을 잘 전하고 싶어요**
   - 보내기 전 확인

2. **들은 말이 헷갈려요**
   - 의미/맥락 확인

3. **같이 이야기하고 싶어요**
   - 두 사람이 같은 화면에서 확인

4. **정보가 맞는지 확인하고 싶어요**
   - 공식정보/생활정보

5. **안전·재난**
   - 승인된 오프라인 정보

홈 상단:

> **SafeCircle**  
> 서로의 뜻을 확인하고 다음 대화를 도와드려요.

---

## 6. 편의성 기능

반복사용은 콘텐츠 양보다 마찰 감소에서 나온다.

### P0 Convenience

#### 1. Voice-first
- 키보드 없이 말하기
- STT 실패 시 즉시 텍스트 fallback

#### 2. One-tap TTS
- SafeCircle 제안
- 공식정보 쉬운 문장
- 안전카드

#### 3. Pass the Phone
- 상대가 계정 없이 확인
- 상대 언어로 즉시 전환

#### 4. Language Preference
- 기본 언어/상대 언어 기억
- 매번 언어 선택하지 않게 함

#### 5. Context Carry-over
같은 세션에서는:
- 관계
- 상황
- 앞선 질문

을 유지해 반복 입력을 줄인다.

개인 원문 장기저장과는 구분한다.

#### 6. Copy / Share
- 복사
- 메신저 공유
- 큰 화면 보여주기

#### 7. “다음에 뭐라고 물어보지?”
결과마다 가장 중요한 확인 질문 1개를 큰 CTA로 제공.

#### 8. Save Helpful Phrase
사용자가 선택한 표현만 저장.

예:
- 휴가 요청
- 작업 완료시간 확인
- 안전 확인

민감한 원문 대화 전체를 저장하지 않는다.

---

## 7. 사용자에게 도움이 되는 콘텐츠 체계

SafeCircle은 무한 콘텐츠 피드를 만들지 않는다.

대신 **상황에서 바로 꺼내 쓰는 Circle Cards**를 만든다.

### Circle Card 유형

#### A. Conversation Card
자주 필요한 실제 문장.

예:
- “언제까지 하면 되나요?”
- “이 지시의 이유를 알려주세요.”
- “제가 이해한 게 맞는지 확인하고 싶어요.”

포함:
- 쉬운 한국어
- 대상 언어
- TTS
- 사용 상황

#### B. Official Info Card

예:
- 근로상담 연락처
- 행정기관 이용
- 병원 이용
- 체류/생활 지원기관
- 조직 승인 규칙

필수:
- 공식 출처
- 검토일
- 적용 범위

#### C. Safety Card

- 승인 안전수칙
- 시설별 행동
- 집결지
- 연락처

오프라인 보장.

#### D. “What to Ask” Card

갈등을 판정하지 않고 상대에게 확인할 질문을 제공한다.

#### E. Easy Guide

복잡한 공지/절차를:
- 3단계
- 쉬운 말
- 그림/아이콘
- 음성

형태로 제공.

---

## 8. My Circle Kit

개인화는 민감한 개인 프로파일이 아니라 **사용 편의 설정** 중심으로 한다.

저장 가능:

- 기본 언어
- 상대 언어
- 글자 크기
- TTS 속도
- 즐겨찾는 Circle Cards
- 사용자가 직접 저장한 표현
- 연결할 기관/담당자
- 시설 Emergency Bundle

기본 저장 금지:

- 민감한 전체 대화 기록
- 개인 갈등 점수
- 문화 성향 점수
- 관리자에게 보이는 개인 사용내역

---

## 9. SafeCircle 콘텐츠 플라이휠

콘텐츠는 세 경로에서 성장한다.

### Source 1 — Official

```
공식기관/조직 승인 정보
→ 정제
→ 쉬운 표현
→ 다언어
→ 검토
→ Circle Card
```

### Source 2 — Context

```
실제 사용
→ 짧은 피드백
→ 비식별 Context Event
→ 유사 상황 묶음
→ 반복 패턴
→ 검토
→ SafeCircle Context Knowledge
```

### Source 3 — Expert / Field Review

- 다문화 지원 현장
- 노무/안전 담당
- 통역/한국어 교육 현장

의 피드백을 reviewed pattern으로 반영.

중요:

> 사용자 한 명의 경험을 “문화적 사실”로 승격하지 않는다.

---

## 10. 재방문 이유

SafeCircle이 갈등/재난 때만 쓰이면 서비스가 지속되지 않는다.

반복사용의 핵심은 다음 순서다.

### Daily Utility

- 전달 전 문장 확인
- 받은 메시지 이해
- 번역+의도 유지
- 쉬운 표현
- 공식정보 찾기

### Occasional Support

- 휴가/근무시간
- 병원/행정
- 주거/생활
- 갈등 중재

### High-risk Utility

- 안전
- 재난

즉:

> 일상에서 신뢰를 쌓고, 중요한 상황에서 같은 SafeCircle을 사용한다.

---

## 11. Notification 원칙

재방문을 위해 불필요한 알림을 만들지 않는다.

허용 가치가 높은 알림:

- 사용자가 저장한 공식정보 변경
- Emergency Bundle 갱신 필요
- 시설 안전정보 만료
- 사용자가 요청한 후속 확인

지양:

- 일일 랜덤 문화팁
- 참여 유도 푸시
- 불안감을 만드는 안전 알림

---

## 12. 조직용 서비스 가치

B2B 기능은 개인 감시가 아니라 **환경 개선**이어야 한다.

조직이 볼 수 있는 것:

- 충분히 집계된 반복 마찰 유형
- 이해하기 어려운 공지/안전수칙 유형
- 공식 카드 열람/도움 요청의 집계 수준
- 교육/안내 개선 후보

예:

> 최근 교대근무 안내에서 “언제부터 적용되는지 모르겠다”는 확인 요청이 반복되었습니다.

조직이 볼 수 없는 것:

- 특정 사용자의 원문
- 특정 직원의 “무례함 평가”
- 개인별 갈등 횟수
- 개인별 문화 적응 점수

---

## 13. 서비스 장면 × Agent Skill

| 사용자 장면 | SafeCircle Skill | Knowledge | 최종 행동 |
|---|---|---|---|
| 전달 전 | Before Send + Meaning Mirror | Context | 재표현/전달 |
| 받은 말 | Understand Received | Context | 확인 질문 |
| 둘이 갈등 | Together | Session + Context | 공통점/다음 질문 |
| 노동/휴가 | Meaning Mirror + Official Check | Official + Context | 공식 확인/재표현 |
| 생활/행정 | Simplify + Official Check | Official | 쉬운 안내/기관 연결 |
| 번역 | Translate With Intent | Session | 전달 가능한 대상언어 |
| 안전질문 | Safety Guard | Approved Safety | 승인정보 |
| 재난 | Emergency Assist | Emergency Bundle | 행동/상태회신 |

---

## 14. Release 0.9 — Closed Pilot

목표:

> “몇 개 상황에서 실제로 매우 유용한 SafeCircle”을 증명한다.

범위:

- PWA
- 한국어↔베트남어
- 직장 중심
- Before Send
- Understand Received
- Together 최소 버전
- TTS
- Pass the Phone
- Official Card 소수
- 오프라인 Emergency Bundle
- 실제 Upstage 기반 SafeCircle Agent
- rule fallback

### Pilot 콘텐츠 목표

- 검증된 Conversation Card 30개
- Official Card 10~20개
- 안전/재난 승인 카드 1개 시설 기준
- 평가용 실제/합성 상황 50개 이상

---

## 15. Release 1.0 Gate

### Agent Quality

- Scenario Router 동작
- Risk Router 동작
- Mediation Contract v2
- Validator
- Eval Pack
- provider 장애 fallback

### UX

- iPhone Safari
- Android Chrome
- 음성입력
- TTS
- Pass the Phone
- 최소 접근성 기준
- 사용자 언어 전환

### Knowledge

- 공식 출처
- freshness
- review status
- 잘못된 정보 정정 절차

### Emergency

- fixture가 아닌 운영 Emergency Bundle
- 실제 서버 ACK
- offline queue
- duplicate 방지
- 만료 상태

### Privacy / Trust

- 외부 LLM 처리 고지
- 저장정책
- 삭제/정정 경로
- 개인/조직 데이터 분리
- telemetry 원문 비저장

### Operations

- rate limit
- API 비용 상한
- latency/timeout
- provider error monitoring
- rollback
- incident response

---

## 16. 핵심 지표

### 사용자 가치

- SafeCircle 제안 사용률
- 확인 질문 사용률
- Pass the Phone 완료율
- “실제 이해에 도움” 응답률
- 동일 상황 재사용률

### 신뢰

- “한쪽 편을 든다” 응답률
- “감시받는 느낌” 응답률
- 공식정보/해석 구분 이해율

### Agent 품질

- Validator fail rate
- provider fallback rate
- unknowns 적정 노출률
- official escalation precision
- emergency unsafe generation = 0 목표

### 운영

- p50/p95 latency
- API cost per completed task
- error rate
- offline emergency success rate

가입자 수만으로 초기 성공을 판단하지 않는다.

---

## 17. 상세기획서에서 보여줄 대표 시나리오

### Scene 1 — 평범한 업무 요청

관리자:
> 회의 자료 오늘 안에 좀 빨리 보내주세요.

SafeCircle:
- 뜻
- 압박으로 들릴 수 있는 지점
- 필요한 시점 확인
- 더 명확한 표현

효과:
- 갈등이 생기기 전 예방

### Scene 2 — 받은 말이 불안한 근로자

입력:
> 회의 끝나고 잠깐 얘기합시다.

SafeCircle:
- 확실한 문자 의미
- 문장만으로 모르는 부분
- “어떤 내용인지 미리 알 수 있을까요?” 제안

효과:
- 숨은 의도를 AI가 만들어내지 않고 직접 확인

### Scene 3 — 휴가/근무시간

입력:
> 다음 주 금요일은 쉬면 안 됩니다.

SafeCircle:
- 해석 차이
- Official Check
- 규정/합의 확인 필요
- 대안 표현

효과:
- 문화문제로 오해하지 않고 사실과 관계 문제를 분리

### Scene 4 — 두 사람이 이미 다르게 이해함

A/B 순차 입력
→ SafeCircle이:
- 같은 사실
- 다른 해석
- 아직 모르는 부분
- 다음 질문

효과:
- “누가 맞는지” 대신 대화 재개

### Scene 5 — 기계 안전

질문:
> 멈춘 기계 전원을 다시 켜도 돼요?

SafeCircle:
> 이건 제가 임의로 판단하지 않을게요.

→ 승인된 현장 안전카드

효과:
- Agent가 자신의 한계를 알고 행동을 바꿈

### Scene 6 — 화재/오프라인

네트워크 단절
→ SafeCircle Safety
→ 승인 행동카드
→ TTS
→ 집결지
→ 도움 필요 로컬 저장
→ 연결 복구 후 전송

효과:
- 생성 AI가 없어도 SafeCircle이 핵심 역할 유지

---

## 18. 개발 우선순위

### P0 — Agent 구조
1. Agent Harness v1
2. Mediation Contract v2
3. Scenario/Risk Router
4. Core Skills
5. Validator/Eval

### P0 — Release UX
1. source/target language
2. Together 실제 양측 입력
3. Official Check UI
4. SafeCircle 브랜드 언어 전환
5. Agent 상태/unknowns 표현

### P0 — Safety
1. 재난 생성형 AI 차단 계약
2. 운영 Emergency Bundle
3. 실제 ACK sync

### P1 — Content
1. Conversation Cards
2. Official Cards
3. Easy Guides
4. My Circle Kit

### P1 — Data
1. Context Event 저장
2. PII filtering
3. aggregate threshold
4. reviewed pattern pipeline

---

## 19. 하지 않을 것

Release 0.9/1.0에서 제외:

- 범용 AI 챗봇
- SNS 피드
- 국가별 문화 성향 점수
- 감정 자동 판정
- 관리자 개인 모니터링
- 사용자 대화 전체 자동 보관
- LLM 자유생성 재난 행동지침
- 모든 언어/생활영역 동시 지원

---

## 20. 완료 정의

서비스 기획 관점의 Release Candidate는 다음 질문에 모두 “예”라고 답할 수 있어야 한다.

1. 사용자가 SafeCircle을 단순 번역기보다 에이전트로 인식하는가?
2. 일상에서 30초 안에 실제 사용할 표현/질문을 얻는가?
3. 받은 말을 혼자 추측하는 대신 확인 행동으로 이동하는가?
4. 두 사람이 같은 화면으로 공통점과 차이를 확인할 수 있는가?
5. 공식정보와 SafeCircle 해석을 구분할 수 있는가?
6. 안전/재난에서 AI의 역할이 적절히 제한되는가?
7. 대상 언어 사용자가 직접 이해하고 들을 수 있는가?
8. 개인 대화가 조직의 개인 평가로 흘러가지 않는가?
9. provider 장애 시에도 핵심 fallback이 존재하는가?
10. 사용 후 피드백이 다음 SafeCircle 품질 개선 데이터로 연결되는가?

---

## 결정 기록

- SafeCircle의 제품 주체는 “AI 모델”이 아니라 **SafeCircle Agent**다.
- 반복사용은 갈등 해결만이 아니라 **전달 전/받은 뒤/공식정보/쉬운 표현**에서 만든다.
- 콘텐츠는 피드가 아니라 **상황에 바로 쓰는 Circle Cards** 중심으로 만든다.
- 개인화는 대화 감시가 아니라 언어·접근성·즐겨찾기 등 편의 중심으로 제한한다.
- 조직용 가치는 개인 평가가 아니라 반복되는 환경 문제 개선에서 만든다.
- Release 0.9는 한국어↔베트남어 직장 Pilot으로 좁히고, 검증 후 생활/행정으로 확장한다.


## 21. Agent-first Feature Gate

새 서비스 기능은 다음 Gate를 통과해야 한다.

| Gate | 질문 |
|---|---|
| Scenario | 어떤 사용자 장면인가? |
| Skill | 어떤 SafeCircle Skill이 해결하는가? |
| Policy | 판단/금지/에스컬레이션 규칙은 무엇인가? |
| Knowledge | 필요한 공식/맥락 데이터는 무엇인가? |
| Contract | 구조화 출력은 무엇인가? |
| Validator | 잘못된 답을 어떻게 막는가? |
| Eval | 성공/실패를 어떻게 자동 검증하는가? |
| UX | 사용자가 어떤 행동을 완료하는가? |
| Ops | 비용/지연/오류를 어떻게 운영하는가? |

이 Gate가 정의되지 않은 기능은 Release 0.9 핵심 범위로 승격하지 않는다.
