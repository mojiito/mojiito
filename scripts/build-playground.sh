#!/usr/bin/env bash

bold=$(tput bold)
normal=$(tput sgr0)
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

PWD=`pwd`
SRCDIR=${PWD}/playground
DESTDIR=${PWD}/dist/playground
TSC="node --max-old-space-size=3000 ./node_modules/@angular/tsc-wrapped/src/main"
ROLLUP="../node_modules/.bin/rollup"
SERVER="${PWD}/node_modules/.bin/http-server"
SERVE=false

for ARG in "$@"; do
  case "$ARG" in
    --serve)
      SERVE=true
      ;;
    *)
      echo "${bold}${red}Unknown option $ARG.${reset}"
      echo "${reset}Available options: ${bold}serve${reset}"
      exit 1
      ;;
  esac
done

echo $AS

rm -rf ./dist/playground

echo "====== ${bold}COMPILING${normal}: ${TSC} -p ${SRCDIR}/tsconfig-build.json ====="
$TSC -p ${SRCDIR}/tsconfig.json

mkdir ${DESTDIR}/bundles
mkdir ${DESTDIR}/vendor

echo "====== ${bold}LINKING VENDORS${normal} ====="
ln -s ${PWD}/dist/packages-dist/ $DESTDIR/vendor/mojiito
ln -s ${PWD}/node_modules/reflect-metadata/Reflect.js $DESTDIR/vendor/reflect.js

echo "====== ${bold}BUNDLING${normal}: ${SRCDIR} ====="
cd  ${SRCDIR}
$ROLLUP -c rollup.config.js

echo "====== ${bold}COPYING HTML & CSS${normal} ====="
cp index.html ${DESTDIR}
cp styles.css ${DESTDIR}

if [[ ${SERVE} == true ]]; then
echo "====== ${bold}STARTING SERVER${normal} ====="
  cd ${DESTDIR}
  $SERVER -p 4200
fi
