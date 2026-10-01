# 2026 AI·디지털 기반 사회문제 해결 챌린지

## 실행실
- `world_bots` WarRoom 3 / Telegram topic 3189
- 2026-09-07 사용자 지정

## 현재 목표
다문화 사회통합을 주제로, 2026-09-30 참가신청서와 2026-11-03 상세기획서로 이어질 디지털 사회현안 해결 서비스 프로토타입을 구체화한다.

## 현재 상태
- 내부 관리: Active / WarRoom 3
- 외부 접수: 접수 증빙 확인 전
- 부문: `디지털 기반 국가 사회현안 해결 서비스 아이디어 발굴(프로토타입개발)`
- 아이템: 다문화 사회통합을 위한 **SafeCircle 상호이해 에이전트**·다언어 지원 서비스
- 대표 상황: 소규모 사업장의 일상 지원과 재난 안전 대응
- 작업명: `SafeCircle` (가칭)

## 현재 의사결정
1. 부문: 아이디어 발굴(프로토타입 개발)
2. 사회현안: 언어·문화·정보 장벽으로 한국인과 이주민 모두가 일상 지원과 의사결정에서 소외되는 문제
3. 우선 현장: 다언어 구성원이 함께 일하는 소규모 사업장
4. 핵심 서비스: **SafeCircle Agent**가 양쪽의 뜻 차이를 구조화하고, 검증된 다언어 정보와 사람·기관의 도움을 연결
5. 대표 고위험 모드: 사업장 화재 시 승인된 행동카드와 안전상태 확인
6. 기존 재난앱·일반 커뮤니티를 그대로 복제하지 않는 신규 결합 범위

## 문서 인덱스
- [서비스 개념서](./service-concept-v0.1.md) — 사회현안, AI 중재자, 다언어 지원, 평상시·위기 모드
- [프로토타입 개발계획](./prototype-plan-v0.1.md) — 핵심 사용자 흐름, MVP 범위, 안전·검증 기준
- [사회현안 후보 비교](./candidate-shortlist-v0.1.md) — 초기 후보 조사 기록
- [SafeLoop 경쟁·대체재 조사](./competitive-landscape-safeloop-v0.1.md) — 기존 재난·산업안전 서비스와 중복 위험
- [Product Thesis v0.2](./product-thesis-v0.2.md) — **탐색 문서**. v0.1 기준선을 대체하지 않고 반복사용 루프, Situational Context Graph, Trust Architecture, 검증가설을 보강
- [Situational Context Graph & Participation UX v0.1](./situational-context-graph-v0.1.md) — 상황 기반 문화맥락 데이터 모델, 참여 피드백 UX, 신뢰도·승격·어뷰징 방지 규칙
- [Prototype Interaction Spec v0.1](./prototype-interaction-spec-v0.1.md) — “이 말, 상대방에게 어떻게 들릴까?” 화면 흐름, API/fixture 계약, 최소 테스트 기준
- [Mobile PWA & Offline Emergency Spec v0.1](./mobile-pwa-offline-emergency-spec-v0.1.md) — 모바일 우선·플랫폼 독립 PWA, 비상정보 로컬 저장, 오프라인 회신·재동기화 계약
- [Prototype Implementation Plan v0.1](./prototype-implementation-plan-v0.1.md) — Plan → Evaluate → Implement → Verify → Review 실행 게이트
- [Prototype Progress](./prototype-progress.md) — Phase별 구현·검증·점수·다음 Gate 기록
- [SafeCircle Agent Harness v1](./agent-harness-v1.md) — **다음 구현 기준선**. Agent Constitution, Scenario/Risk Router, Circle Skills, Knowledge 계층, Mediation Contract v2, Validator/Eval 구조
- [Service Plan v0.3](./service-plan-v0.3.md) — **서비스 고도화 기준선**. 사용자 여정, 편의 기능, Circle Cards, My Circle Kit, Pilot/Release 1.0 Gate

## 일정
- 2026-09-10: 후보 3개 비교 및 1개 선정
- 2026-09-14: 부문·문제·사용자·핵심흐름 동결
- 2026-09-20: 참가신청서 초안
- 2026-09-27: 내부 최종본
- 2026-09-30: 참가신청서 제출·접수증 보존
- 2026-11-03: 상세기획서 제출

## 공식 링크
- https://devcontest-digitalsolveup.kr/
- https://devcontest-digitalsolveup.kr/register
- https://devcontest-digitalsolveup.kr/summary?c=1
- https://devcontest-digitalsolveup.kr/summary?c=2


## 다음 개발 기준선 (2026-10-01)

현재 Functional POC는 Upstage Solar를 이용한 자유문장 분석까지 동작한다.

다음 단계에서는 모델 자체보다 **SafeCircle Agent Harness**를 제품 source of truth로 둔다.

우선순위:
1. Mediation Contract v2
2. Scenario Router / Risk Router
3. Circle Skills 분리
4. Response Validator / Eval Pack
5. 한국어↔베트남어 실제 사용자 흐름
6. Together 양측 입력
7. Official Knowledge / Emergency 운영 경계
8. Release 0.9 Closed Pilot 준비

제품 언어에서는 “AI 중재자”보다 **SafeCircle이 확인하고, 모르는 것은 묻고, 다음 대화를 돕는다**는 Agent 경험을 우선한다.
