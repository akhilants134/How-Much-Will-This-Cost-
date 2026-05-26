#!/bin/bash

JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc3OTc3MTg3NywiZXhwIjoxNzc5ODU4Mjc3fQ.Ks3Z5Mo2FlGmrVNaYxp80LvZ_l3kHcgdTk44SugbxJE"
BASE_URL="http://localhost:3000"
TEST_DIR="/Users/Akhilan/Downloads/Project-Engineering-main/Milestone 09/How Much Will This Cost?/test"

echo "===== Running 5 Test Calls ====="
echo ""

echo "--- Call 1: short-note.txt (~200 words) ---"
curl -s -X POST "$BASE_URL/notes/1/summarize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d "{\"noteContent\": $(cat "$TEST_DIR/short-note.txt" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))")}" | python3 -m json.tool
echo ""
sleep 3

echo "--- Call 2: medium-note.txt (~500 words) ---"
curl -s -X POST "$BASE_URL/notes/2/summarize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d "{\"noteContent\": $(cat "$TEST_DIR/medium-note.txt" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))")}" | python3 -m json.tool
echo ""
sleep 3

echo "--- Call 3: long-note.txt (~800 words) ---"
curl -s -X POST "$BASE_URL/notes/3/summarize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d "{\"noteContent\": $(cat "$TEST_DIR/long-note.txt" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))")}" | python3 -m json.tool
echo ""
sleep 3

echo "--- Call 4: extra-note-1.txt (~300 words — Climate Change) ---"
curl -s -X POST "$BASE_URL/notes/4/summarize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d "{\"noteContent\": $(cat "$TEST_DIR/extra-note-1.txt" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))")}" | python3 -m json.tool
echo ""
sleep 3

echo "--- Call 5: extra-note-2.txt (~600 words — Immune System) ---"
curl -s -X POST "$BASE_URL/notes/5/summarize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT" \
  -d "{\"noteContent\": $(cat "$TEST_DIR/extra-note-2.txt" | python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))")}" | python3 -m json.tool
echo ""

echo "===== All 5 calls complete ====="
