#!/bin/sh
while true; do
  git pull --ff-only origin main >/dev/null 2>&1
  sleep 30
done
