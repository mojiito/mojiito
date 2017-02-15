#!/usr/bin/env bash

PACKAGES=(core
  platform-browser)
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"

echo $VERSION_PREFIX
echo $VERSION_SUFFIX

for ARG in "$@"; do
  case "$ARG" in
    --bundle=*)
      BUNDLE=( "${ARG#--bundle=}" )
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== BUILDING: Version ${VERSION} ====="

rm -rf ./dist/packages-dist

for PACKAGE in ${PACKAGES[@]}
do
  PWD=`pwd`
  UGLIFYJS=`pwd`/node_modules/.bin/uglifyjs
  TSC="./node_modules/typescript/bin/tsc"
  ROLLUP="../../node_modules/rollup/bin/rollup"
  SRCDIR=${PWD}/modules/${PACKAGE}
  DESTDIR=${PWD}/dist/packages-dist/${PACKAGE}
  UMD_ES5_PATH=${DESTDIR}/bundles/${PACKAGE}.umd.js
  UMD_ES5_MIN_PATH=${DESTDIR}/bundles/${PACKAGE}.umd.min.js
  rm -rf ${DESTDIR}

  echo "======      COMPILING: ${TSC} -p ${SRCDIR}/tsconfig-build.json        ====="
  $TSC -p ${SRCDIR}/tsconfig-build.json

  cp ${SRCDIR}/package.json ${DESTDIR}/

  if [[ ${BUNDLE} == true ]]; then
    echo "======      BUNDLING: ${SRCDIR} ====="
    mkdir ${DESTDIR}/bundles

    (
      cd  ${SRCDIR}
      $ROLLUP -c rollup.config.js
      cat ${UMD_ES5_PATH} >> ${UMD_ES5_PATH}.tmp
      mv ${UMD_ES5_PATH}.tmp ${UMD_ES5_PATH}
      $UGLIFYJS -c --screw-ie8 -o ${UMD_ES5_MIN_PATH} ${UMD_ES5_PATH}
    ) 2>&1 | grep -v "as an external dependency"
  fi

  (
    echo "======      VERSION: Updating version references"
    cd ${DESTDIR}
    echo "======       EXECUTE: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
  )
done
