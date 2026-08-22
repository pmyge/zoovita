#!/bin/bash

# Loyiha papkasiga o'tish
cd /root/zoovita

# Oxirgi kodni yuklab olish
git fetch --all
git reset --hard origin/main

# Backend'ni qayta yuklash
systemctl restart zoovita-api

# Admin panelni yig'ish (Server endi 2GB RAM bo'lgani uchun o'zida yig'adi)
cd /root/zoovita/admin-panel
rm -rf node_modules
npm install
npm run build
rm -rf /var/www/zoovita/*
cp -r dist/* /var/www/zoovita/

# Veb-saytni yig'ish
cd /root/zoovita/web_site
npm install
npm run build
rm -rf /var/www/zoovita-site/*
cp -r dist/* /var/www/zoovita-site/

# Nginx'ni qayta yuklash
systemctl reload nginx
