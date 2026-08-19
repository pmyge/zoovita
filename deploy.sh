#!/bin/bash

cd /root/zoovita

git fetch --all
git reset --hard origin/main

systemctl restart zoovita-api

cd /root/zoovita/admin-panel
npm install
npm run build
rm -rf /var/www/zoovita/*
cp -r dist/* /var/www/zoovita/

cd /root/zoovita/web_site
npm install
npm run build
rm -rf /var/www/zoovita-site/*
cp -r dist/* /var/www/zoovita-site/

systemctl reload nginx
