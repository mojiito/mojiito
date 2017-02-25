#!/usr/bin/env bash

bold=$(tput bold)
normal=$(tput sgr0)
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

PWD=`pwd`
SRCDIR=${PWD}/playground
DESTDIR=${PWD}/dist/playground
TSC="./node_modules/.bin/tsc"
ROLLUP="../node_modules/.bin/rollup"
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

$TSC -p ${SRCDIR}/tsconfig.json

mkdir ${DESTDIR}/bundles
mkdir ${DESTDIR}/vendor

ln -s ${PWD}/dist/packages-dist/ $DESTDIR/vendor/mojiito
ln -s ${PWD}/node_modules/reflect-metadata/Reflect.js $DESTDIR/vendor/reflect.js

cd  ${SRCDIR}
$ROLLUP -c rollup.config.js
cp index.html ${DESTDIR}
cp styles.css ${DESTDIR}

if [[ ${SERVE} == true ]]; then
  cd ${DESTDIR}
  ../../node_modules/.bin/http-server -p 4200 -s
fi
