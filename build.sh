#!/usr/bin/env bash

PACKAGES=(core
  platform-browser)
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"

bold=$(tput bold)
normal=$(tput sgr0)
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

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

echo "====== ${bold}LINTING${normal} ====="
npm run lint

VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== ${bold}BUILDING${normal}: Version ${VERSION} ====="

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

  echo ""
  echo "====== ${bold}PACKAGE: ${green}${PACKAGE}${normal} ====="

  echo "====== ${bold}COMPILING${normal}: ${TSC} -p ${SRCDIR}/tsconfig-build.json ====="
  $TSC -p ${SRCDIR}/tsconfig-build.json

  cp ${SRCDIR}/package.json ${DESTDIR}/
  cp ${PWD}/modules/README.md ${DESTDIR}/

  if [[ ${BUNDLE} == true ]]; then
    echo "====== ${bold}BUNDLING${normal}: ${SRCDIR} ====="
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
    echo "====== ${bold}VERSION${normal}: Updating version references"
    cd ${DESTDIR}
    echo "====== ${bold}EXECUTE${normal}: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
    perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
  )
done
