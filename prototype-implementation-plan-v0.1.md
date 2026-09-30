# SafeCircle Prototype Implementation Plan v0.1

- 상태: Active
- 실행 원칙: **Plan → Pre-evaluate → Implement → Verify → Review → Continue**
- 기준 문서:
  - `service-concept-v0.1.md` — 제품 기준선
  - `product-thesis-v0.2.md` — 제품 가설
  - `situational-context-graph-v0.1.md` — 참여/데이터 계약
  - `prototype-interaction-spec-v0.1.md` — 사용자 상호이해 UX
  - `mobile-pwa-offline-emergency-spec-v0.1.md` — 모바일/PWA/오프라인 계약

## 1. 목표

모바일에서 바로 실행 가능한 SafeCircle 프로토타입을 만든다.

증명할 핵심:
1. 한국인·이주민 모두가 같은 앱에서 상호이해 기능을 사용할 수 있다.
2. “이 말 어떻게 들릴까?”가 단순 번역과 다른 가치를 보여준다.
3. 재난 시 인터넷이 끊겨도 승인된 비상정보를 볼 수 있다.
4. 오프라인 상태 회신을 로컬에 보존할 수 있다.
5. 개인 중재 데이터와 조직/비상 데이터의 경계를 유지한다.

## 2. 기술 결정

1차 프로토타입은 **빌드 없는 정적 모바일 PWA**로 시작한다.

- HTML / CSS / Vanilla JavaScript
- Web App Manifest
- Service Worker
- IndexedDB
- JSON fixtures

이유:
- iOS/Android/Desktop 브라우저 공통
- 코드/배포 복잡도 최소화
- 오프라인 동작 검증에 집중
- 프레임워크 선택이 제품 검증을 방해하지 않음

제품 가설이 확인된 뒤 React/Next/기타 구조로 이전 가능하다.

## 3. Phase와 Gate

### Phase 0 — 계약 고정
산출물:
- 구현계획
- 완료 정의
- 평가 체크리스트

Gate 0:
- 기존 v0.1 정체성을 훼손하지 않는가
- 사용자 UX가 우선인가
- 재난 기능이 제품 전체를 덮지 않는가
- 오프라인과 개인정보 경계가 문서화됐는가

### Phase 1 — Mobile PWA Shell
구현:
- 모바일 단일화면 shell
- 하단 탭: 도움받기 / 정보 / 안전 / 내 정보
- manifest
- service worker
- responsive layout
- 네트워크 상태 표시

Gate 1:
- 360px 모바일 너비에서 핵심 UI 사용 가능
- 데스크톱에서도 깨지지 않음
- service worker 등록 성공
- 앱 shell 오프라인 재실행 가능

### Phase 2 — 상호이해 사용자 흐름
구현:
- “이 말 어떻게 들릴까?”
- 전달 전 확인 / 받은 말 이해
- 6개 mediation fixture
- 결과 카드: 의미 / 해석 가능성 / 확인사항 / 확인질문 / 쉬운 표현
- 피드백 UI

Gate 2:
- 단순 번역만 보여주지 않음
- 국적 기반 단정 없음
- 사실과 해석 분리
- 민감영역에서 AI 판정 없음
- 양쪽 사용자 흐름 동작

### Phase 3 — Offline Emergency
구현:
- Emergency Bundle fixture
- cache-first 비상카드
- 집결지/긴급연락처
- 대피 중 / 도움 필요 / 집결 완료
- IndexedDB offline queue
- 재접속 sync

Gate 3:
- 네트워크 차단 후 비상정보 표시
- 오프라인 회신 저장
- 재접속 시 pending 상태 정리
- 마지막 승인 버전/갱신시각 표시
- 일반 중재 원문이 비상 캐시에 없음

### Phase 4 — Context Feedback
구현:
- feedback event
- Context Event fixture
- emerging pattern mock
- 조직 인사이트 예시

Gate 4:
- 개인 식별 데이터 없이 집계 가능
- 사용자 피드백이 즉시 “문화적 진실”로 승격되지 않음
- 관리자 화면에 개인 원문 없음

### Phase 5 — 통합 평가
평가 축:
- 제품 적합성
- 반복사용성
- 신뢰/안전
- 모바일 사용성
- 오프라인 복원력
- 구현 단순성

결과:
- PASS / CONDITIONAL PASS / REWORK
- 발견 이슈
- 다음 구현 우선순위

## 4. 사전 평가

### 강점
- 사용자 가치와 재난 활용을 한 앱에서 시연 가능
- 설치장벽이 낮음
- 모바일과 오프라인을 일찍 검증 가능
- 실제 LLM 연결 전 UX/데이터 계약을 검증할 수 있음

### 위험
1. 한 번에 기능을 너무 많이 만들 위험
2. 재난 기능이 상호이해 제품 정체성을 가릴 위험
3. PWA의 iOS 제한을 과대평가할 위험
4. mock 데이터가 실제 가치처럼 보일 위험
5. 문화적 해석을 사실처럼 표현할 위험

### 대응
- Phase별 Gate 통과 후 다음 단계
- 실제 AI 연결은 마지막에
- 모든 mock/fixture는 UI에서 테스트 데이터임을 구분
- 비상정보는 승인/버전 모델 유지
- 문화 맥락은 가능성/피드백 기반으로만 표현

## 5. 단계별 평가 점수표

각 Phase 종료 후 0~2점으로 평가한다.

| 항목 | 0 | 1 | 2 |
|---|---|---|---|
| 목표충족 | 실패 | 부분 | 충족 |
| 모바일 UX | 사용곤란 | 보완필요 | 자연스러움 |
| 신뢰경계 | 위반 | 모호 | 명확 |
| 오프라인 | 실패 | 일부 | 핵심동작 |
| 단순성 | 과설계 | 일부복잡 | 최소구현 |
| 다음단계준비 | 불가 | 보완필요 | 즉시가능 |

- 10~12: PASS
- 7~9: CONDITIONAL PASS
- 0~6: REWORK

## 6. 진행 기록 방식

각 Phase 종료 시 아래 형식으로 기록한다.

```
Phase:
Commit:
Implemented:
Verification:
Score:
Issues:
Decision:
Next:
```

## 7. 중단 조건

다음 중 하나면 다음 Phase로 넘어가지 않는다.

- 기존 제품 정의와 충돌
- 개인정보/감시 구조 발생
- 오프라인 안전정보 최신성 표시 실패
- 국적 기반 일반화가 핵심 로직에 들어감
- 모바일 핵심 UX가 작동하지 않음

## 8. 현재 실행 결정

- Phase 0: PASS
- 다음 실행: **Phase 1 Mobile PWA Shell**
- Phase 1 완료 후 평가 결과를 기록하고 Phase 2 진행 여부를 결정한다.
