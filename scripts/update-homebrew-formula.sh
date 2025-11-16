#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 5 ]; then
  echo "Usage: $0 <version> <formula_path> <arm64_sha> <intel_sha> <linux_sha>" >&2
  exit 1
fi

VERSION="$1"
FORMULA_PATH="$2"
ARM64_SHA="$3"
INTEL_SHA="$4"
LINUX_SHA="$5"

python3 - "$VERSION" "$FORMULA_PATH" "$ARM64_SHA" "$INTEL_SHA" "$LINUX_SHA" <<'PY'
import pathlib
import re
import sys

version, formula_path, arm_sha, intel_sha, linux_sha = sys.argv[1:6]
path = pathlib.Path(formula_path)
text = path.read_text(encoding='utf-8')

text = re.sub(r'version "[^"]+"', f'version "{version}"', text)
text = re.sub(r'(sha256 "[^"]+" # arm64)', f'sha256 "{arm_sha}" # arm64', text, count=1)
text = re.sub(r'(sha256 "[^"]+" # intel)', f'sha256 "{intel_sha}" # intel', text, count=1)
text = re.sub(r'(sha256 "[^"]+" # linux)', f'sha256 "{linux_sha}" # linux', text, count=1)

path.write_text(text, encoding='utf-8')
PY

echo "Updated ${FORMULA_PATH} to version ${VERSION}."
