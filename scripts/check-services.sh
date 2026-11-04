#!/usr/bin/env bash
# LaoTrace Local Microservice Health Check Script
# Checks availability of Go Backend (4001), Python AI (5000), and LAB Chain RPC

set -e

echo "=== LaoTrace Service Health Check ==="

# 1. LAB Chain RPC
echo -n "Checking LAB Chain RPC (https://rpc.labchain.la)... "
if curl -s -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -H "Content-Type: application/json" https://rpc.labchain.la > /dev/null; then
    echo "ONLINE"
else
    echo "OFFLINE / UNREACHABLE"
fi

# 2. Go Backend
echo -n "Checking Go Backend API (http://localhost:4001)... "
if curl -s http://localhost:4001/health > /dev/null 2>&1; then
    echo "ONLINE"
else
    echo "NOT RUNNING (Defaulting to mock fallback)"
fi

# 3. Python AI Engine
echo -n "Checking Python AI Service (http://localhost:5000)... "
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "ONLINE"
else
    echo "NOT RUNNING (Defaulting to simulated Sentinel-2 AI)"
fi

echo "======================================"
