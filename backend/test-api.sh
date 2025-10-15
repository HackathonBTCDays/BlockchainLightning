#!/bin/bash

# API Testing Script for Lightning Certificate Backend
# This script tests all API endpoints to verify functionality

BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api"

echo "========================================="
echo "Lightning Certificate Backend API Tests"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json ${BASE_URL}/health)
HTTP_CODE=$(echo $RESPONSE | tail -c 4)
if [ "$HTTP_CODE" = "200" ]; then
    STATUS=$(cat /tmp/response.json | grep -o '"status":"ok"')
    if [ -n "$STATUS" ]; then
        print_result 0 "Health check endpoint"
    else
        print_result 1 "Health check endpoint (invalid response)"
    fi
else
    print_result 1 "Health check endpoint (HTTP $HTTP_CODE)"
fi

# Test 2: Get Certificate Types
echo -e "${YELLOW}Test 2: Get Certificate Types${NC}"
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json ${API_URL}/certificates/types)
HTTP_CODE=$(echo $RESPONSE | tail -c 4)
if [ "$HTTP_CODE" = "200" ]; then
    SUCCESS=$(cat /tmp/response.json | grep -o '"success":true')
    TYPES=$(cat /tmp/response.json | grep -o '"types":\[')
    if [ -n "$SUCCESS" ] && [ -n "$TYPES" ]; then
        print_result 0 "Get certificate types"
        echo "Available types:"
        cat /tmp/response.json | grep -o '"name":"[^"]*"' | head -5
        echo ""
    else
        print_result 1 "Get certificate types (invalid response)"
    fi
else
    print_result 1 "Get certificate types (HTTP $HTTP_CODE)"
fi

# Test 3: Create Payment Invoice
echo -e "${YELLOW}Test 3: Create Payment Invoice${NC}"
PAYMENT_DATA='{
  "amount": 50000,
  "certificateType": "birth",
  "userData": {
    "fullName": "Test User",
    "dateOfBirth": "01/01/1990"
  }
}'

RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json -X POST ${API_URL}/payments/invoice \
  -H "Content-Type: application/json" \
  -d "$PAYMENT_DATA")
HTTP_CODE=$(echo $RESPONSE | tail -c 4)

if [ "$HTTP_CODE" = "200" ]; then
    SUCCESS=$(cat /tmp/response.json | grep -o '"success":true')
    PAYMENT_HASH=$(cat /tmp/response.json | grep -o '"payment_hash":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$SUCCESS" ] && [ -n "$PAYMENT_HASH" ]; then
        print_result 0 "Create payment invoice"
        echo "Payment hash: $PAYMENT_HASH"
        echo ""
    else
        print_result 1 "Create payment invoice (invalid response)"
    fi
else
    print_result 1 "Create payment invoice (HTTP $HTTP_CODE)"
fi

# Test 4: Check Payment Status
if [ -n "$PAYMENT_HASH" ]; then
    echo -e "${YELLOW}Test 4: Check Payment Status${NC}"
    RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json ${API_URL}/payments/status/${PAYMENT_HASH})
    HTTP_CODE=$(echo $RESPONSE | tail -c 4)
    if [ "$HTTP_CODE" = "200" ]; then
        SUCCESS=$(cat /tmp/response.json | grep -o '"success":true')
        PAID=$(cat /tmp/response.json | grep -o '"paid":[^,}]*' | cut -d':' -f2)
        if [ -n "$SUCCESS" ]; then
            print_result 0 "Check payment status"
            echo "Payment status: paid=$PAID"
            echo ""
        else
            print_result 1 "Check payment status (invalid response)"
        fi
    else
        print_result 1 "Check payment status (HTTP $HTTP_CODE)"
    fi
else
    echo -e "${YELLOW}Test 4: Check Payment Status${NC}"
    print_result 1 "Check payment status (no payment hash from previous test)"
fi

# Test 5: Verify Certificate (should fail without valid certificate)
echo -e "${YELLOW}Test 5: Verify Certificate${NC}"
VERIFY_DATA='{
  "certificateId": "test123",
  "documentHash": "abc123"
}'

RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json -X POST ${API_URL}/certificates/verify \
  -H "Content-Type: application/json" \
  -d "$VERIFY_DATA")
HTTP_CODE=$(echo $RESPONSE | tail -c 4)

if [ "$HTTP_CODE" = "200" ]; then
    SUCCESS=$(cat /tmp/response.json | grep -o '"success":true')
    if [ -n "$SUCCESS" ]; then
        print_result 0 "Certificate verification endpoint"
        cat /tmp/response.json
        echo ""
    else
        print_result 1 "Certificate verification endpoint (invalid response)"
    fi
else
    print_result 1 "Certificate verification endpoint (HTTP $HTTP_CODE)"
fi

# Test 6: Generate LNURL
echo -e "${YELLOW}Test 6: Generate LNURL${NC}"
LNURL_DATA='{
  "amount": 30000,
  "description": "Test LNURL"
}'

RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json -X POST ${API_URL}/payments/lnurl \
  -H "Content-Type: application/json" \
  -d "$LNURL_DATA")
HTTP_CODE=$(echo $RESPONSE | tail -c 4)

if [ "$HTTP_CODE" = "200" ]; then
    SUCCESS=$(cat /tmp/response.json | grep -o '"success":true')
    LNURL=$(cat /tmp/response.json | grep -o '"lnurl":"[^"]*"')
    if [ -n "$SUCCESS" ] && [ -n "$LNURL" ]; then
        print_result 0 "Generate LNURL"
    else
        print_result 1 "Generate LNURL (invalid response)"
    fi
else
    print_result 1 "Generate LNURL (HTTP $HTTP_CODE)"
fi

# Summary
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo "========================================="

# Cleanup
rm -f /tmp/response.json

# Exit with appropriate code
if [ $TESTS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
