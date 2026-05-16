#!/usr/bin/env bash
set -e

echo "Checking GrowthDesk AI project structure..."

test -d backend || (echo "backend folder missing" && exit 1)
test -d frontend || (echo "frontend folder missing" && exit 1)
test -f README.md || echo "README.md not found, continuing..."

echo "Project structure verified."
