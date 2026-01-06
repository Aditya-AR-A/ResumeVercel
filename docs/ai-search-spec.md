# AI Search Specifications

## Endpoints
- `/ai/search` (POST): `{ query, search_type?, filters?, limit?, offset?, include_sections? }`
- `/ai/chat` (POST): `{ message }`

## Response
- Search: `{ total_count, search_time, search_type, summary?, sections?, llm_response? }`
- Chat: `{ response | message }`

## Caching
- Client-side LRU cache for AI POST responses; TTL 5 minutes; keyed by endpoint+payload
- Bypass cache for differing payloads; evict oldest when size exceeds 100

## Errors
- Non-OK responses surface as exceptions; UI shows friendly messages and retry
- Add route-level `error.tsx` and `loading.tsx` for `/search`

## Loading & Empty States
- Skeletons during fetch; clear empty state messaging when no matches
- Suggestions and highlights rendered when provided by API

