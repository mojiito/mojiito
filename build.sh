
#!/usr/bin/env bash

set -u -e -o pipefail

readonly currentDir=$(cd $(dirname $0); pwd)
source ${currentDir}/scripts/_travis-fold.sh
cd ${currentDir}

PACKAGES=(core
  platform-browser)

BUILD_ALL=true
BUNDLE=true
VERSION_PREFIX=$(node -p "require('./package.json').version")
VERSION_SUFFIX="-$(git log --oneline -1 | awk '{print $1}')"
COMPILE_SOURCE=true
TYPECHECK_ALL=true


for ARG in "$@"; do
  case "$ARG" in
    --bundle=*)
      BUNDLE=( "${ARG#--bundle=}" )
      ;;
    --packages=*)
      PACKAGES_STR=${ARG#--packages=}
      PACKAGES=( ${PACKAGES_STR//,/ } )
      BUILD_ALL=false
      ;;
    --publish)
      VERSION_SUFFIX=""
      ;;
    --compile=*)
      COMPILE_SOURCE=${ARG#--compile=}
      ;;
    --typecheck=*)
      TYPECHECK_ALL=${ARG#--typecheck=}
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

#######################################
# Recursively compile package
# Arguments:
#   param1 - Source directory
#   param2 - Out dir
#   param3 - Package Name
#   param4 - Is child (are we recursing?)
# Returns:
#   None
#######################################
compilePackage() {
  echo "======      [${3}]: COMPILING: ${NGC} -p ${1}/tsconfig-build.json"

  local package_name=$(basename "${2}")
  $NGC -p ${1}/tsconfig-build.json
  echo "======           Create ${1}/../${package_name}.d.ts re-export file for Closure"
  echo "$(cat ${LICENSE_BANNER}) ${N} export * from './${package_name}/index'" > ${2}/../${package_name}.d.ts
  echo "{\"__symbolic\":\"module\",\"version\":3,\"metadata\":{},\"exports\":[{\"from\":\"./${package_name}/index\"}]}" > ${2}/../${package_name}.metadata.json

  for DIR in ${1}/* ; do
    [ -d "${DIR}" ] || continue
    BASE_DIR=$(basename "${DIR}")
    # Skip over directories that are not nested entry points
    [[ -e ${DIR}/tsconfig-build.json && "${BASE_DIR}" != "integrationtest" ]] || continue
    compilePackage ${DIR} ${2}/${BASE_DIR} ${3} true
  done
}


VERSION="${VERSION_PREFIX}${VERSION_SUFFIX}"
echo "====== BUILDING: Version ${VERSION}"

echo "====== LINTING ====="
npm run lint

N="
"
TSC=`pwd`/node_modules/.bin/tsc
NGC="node --max-old-space-size=3000 node_modules/@angular/tsc-wrapped/src/main"
UGLIFYJS=`pwd`/node_modules/.bin/uglifyjs
ROLLUP=`pwd`/node_modules/.bin/rollup

if [[ ${BUILD_ALL} == true && ${TYPECHECK_ALL} == true ]]; then
  travisFoldStart "clean dist" "no-xtrace"
    rm -rf ./dist/all/
    rm -rf ./dist/packages
  travisFoldEnd "clean dist"

  TSCONFIG="packages/tsconfig.json"
  travisFoldStart "tsc -p ${TSCONFIG}" "no-xtrace"
    $NGC -p ${TSCONFIG}
  travisFoldEnd "tsc -p ${TSCONFIG}"
fi

if [[ ${BUILD_ALL} == true ]]; then
  rm -rf ./dist/packages
  if [[ ${BUNDLE} == true ]]; then
    rm -rf ./dist/packages-dist
  fi
fi


for PACKAGE in ${PACKAGES[@]}
do
  travisFoldStart "build packages: ${PACKAGE}" "no-xtrace"
  PWD=`pwd`
  ROOT_DIR=${PWD}/packages
  SRC_DIR=${ROOT_DIR}/${PACKAGE}
  ROOT_OUT_DIR=${PWD}/dist/packages
  OUT_DIR=${ROOT_OUT_DIR}/${PACKAGES}
  NPM_DIR=${PWD}/dist/packages-dist/${PACKAGE}
  PACKAGES_DIR=${NPM_DIR}/@angular
  BUNDLES_DIR=${NPM_DIR}/bundles
  LICENSE_BANNER=${ROOT_DIR}/license-banner.txt


  if [[ ${COMPILE_SOURCE} == true ]]; then
    rm -rf ${OUT_DIR}
    rm -f ${ROOT_OUT_DIR}/${PACKAGE}.js
    compilePackage ${SRC_DIR} ${OUT_DIR} ${PACKAGE}
  fi
done

# rm -rf ./dist/packages-dist

# for PACKAGE in ${PACKAGES[@]}
# do
#   PWD=`pwd`
#   UGLIFYJS=`pwd`/node_modules/.bin/uglifyjs
#   # TSC="./node_modules/typescript/bin/tsc"
#   TSC="node --max-old-space-size=3000 ./node_modules/@angular/tsc-wrapped/src/main"
#   ROLLUP="../../node_modules/rollup/bin/rollup"
#   SRCDIR=${PWD}/packages/${PACKAGE}
#   DESTDIR=${PWD}/dist/packages-dist/${PACKAGE}
#   UMD_ES5_PATH=${DESTDIR}/bundles/${PACKAGE}.umd.js
#   UMD_ES5_MIN_PATH=${DESTDIR}/bundles/${PACKAGE}.umd.min.js
#   rm -rf ${DESTDIR}

#   echo ""
#   echo "====== PACKAGE: ${PACKAGE} ====="

#   echo "====== COMPILING: ${TSC} -p ${SRCDIR}/tsconfig-build.json ====="
#   $TSC -p ${SRCDIR}/tsconfig-build.json

#   cp ${SRCDIR}/package.json ${DESTDIR}/
#   cp ${PWD}/packages/README.md ${DESTDIR}/

#   if [[ ${BUNDLE} == true ]]; then
#     echo "====== BUNDLING: ${SRCDIR} ====="
#     mkdir ${DESTDIR}/bundles

#     (
#       cd  ${SRCDIR}
#       $ROLLUP -c rollup.config.js
#       cat ${UMD_ES5_PATH} >> ${UMD_ES5_PATH}.tmp
#       mv ${UMD_ES5_PATH}.tmp ${UMD_ES5_PATH}
#       $UGLIFYJS -c --screw-ie8 -o ${UMD_ES5_MIN_PATH} ${UMD_ES5_PATH}
#     ) 2>&1 | grep -v "as an external dependency"
#   fi

#   (
#     echo "====== VERSION: Updating version references"
#     cd ${DESTDIR}
#     echo "====== EXECUTE: perl -p -i -e \"s/0\.0\.0\-PLACEHOLDER/${VERSION}/g\" $""(grep -ril 0\.0\.0\-PLACEHOLDER .)"
#     perl -p -i -e "s/0\.0\.0\-PLACEHOLDER/${VERSION}/g" $(grep -ril 0\.0\.0\-PLACEHOLDER .) < /dev/null 2> /dev/null
#   )
# done
