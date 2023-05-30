#!/bin/bash

# SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
#
# SPDX-License-Identifier: CC0-1.0

echo "Bundle preview available at: http://0.0.0.0:8000"
echo ""

if [ ! $(python -c 'import sys; exit(1) if sys.version_info.major < 3 and sys.version_info.minor < 5 else exit(0)') ]; then
    $(cd ./dist && python -m SimpleHTTPServer 8000)
else
    $(cd ./dist && python -m http.server 8000)
fi