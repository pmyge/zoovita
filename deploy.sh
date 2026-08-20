#!/bin/bash

cd /root/zoovita

git fetch --all
git reset --hard origin/main

# Backend'ni qayta ishga tushirish
systemctl restart zoovita-api

# Nginx'ni qayta yuklash
systemctl reload nginx
