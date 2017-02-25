#!/usr/bin/env bash

PWD=`pwd`
SRCDIR=${PWD}/playground
DESTDIR=${PWD}/dist/playground
TSC="./node_modules/.bin/tsc"
ROLLUP="../node_modules/.bin/rollup"

rm -rf ./dist/playground

$TSC -p ${SRCDIR}/tsconfig.json

mkdir ${DESTDIR}/bundles
mkdir ${DESTDIR}/vendor

ln -s ${PWD}/dist/packages-dist/ $DESTDIR/vendor/mojiito
ln -s ${PWD}/node_modules/reflect-metadata/Reflect.js $DESTDIR/vendor/reflect.js

cd  ${SRCDIR}
$ROLLUP -c rollup.config.js
cp index.html ${DESTDIR}
