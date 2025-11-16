from __future__ import annotations

import os
import platform
import shutil
import stat
import subprocess
import sys
import tarfile
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

from . import __version__

ASSET_NAME_TEMPLATE = "llm-link-v{version}-{target}.tar.gz"
DEFAULT_RELEASE_BASE = "https://github.com/lipish/llm-link/releases/download"


class UnsupportedPlatformError(Exception):
    pass


def detect_target() -> str:
    system = platform.system().lower()
    machine = platform.machine().lower()

    if system == "darwin":
        if machine in {"arm64", "aarch64"}:
            return "aarch64-apple-darwin"
        return "x86_64-apple-darwin"

    if system == "linux" and machine in {"x86_64", "amd64"}:
        return "x86_64-unknown-linux-gnu"

    raise UnsupportedPlatformError(f"Unsupported platform: {system} {machine}")


def cache_dir() -> Path:
    override = os.environ.get("LLM_LINK_CACHE")
    base = Path(override) if override else Path.home() / ".cache" / "llm-link"
    return base / __version__ / detect_target()


def build_asset_url(version: str, target: str) -> str:
    base = os.environ.get("LLM_LINK_DOWNLOAD_BASE", DEFAULT_RELEASE_BASE).rstrip("/")
    asset = ASSET_NAME_TEMPLATE.format(version=version, target=target)
    return f"{base}/v{version}/{asset}"


def ensure_binary() -> Path:
    local_binary = os.environ.get("LLM_LINK_BINARY_PATH")
    if local_binary:
        path = Path(local_binary)
        if not path.exists():
            raise FileNotFoundError(f"LLM_LINK_BINARY_PATH points to missing file: {path}")
        return path

    target = detect_target()
    cache = cache_dir()
    binary_path = cache / "llm-link"

    if binary_path.exists():
        return binary_path

    cache.mkdir(parents=True, exist_ok=True)
    asset_name = ASSET_NAME_TEMPLATE.format(version=__version__, target=target)
    url = build_asset_url(__version__, target)

    with tempfile.TemporaryDirectory() as tmpdir:
        tar_path = Path(tmpdir) / asset_name
        print(f"Downloading {asset_name} from {url}...", file=sys.stderr)
        try:
            urllib.request.urlretrieve(url, tar_path)
        except urllib.error.HTTPError as exc:
            raise RuntimeError(
                f"Failed to download llm-link binary ({exc.code}). "
                "Ensure the release asset exists or override LLM_LINK_DOWNLOAD_BASE."
            ) from exc

        with tarfile.open(tar_path, "r:gz") as archive:
            archive.extractall(Path(tmpdir))

        extracted = Path(tmpdir) / f"llm-link-v{__version__}-{target}"
        binary_source = extracted / "llm-link"
        shutil.move(str(binary_source), binary_path)

    mode = binary_path.stat().st_mode
    binary_path.chmod(mode | stat.S_IEXEC | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return binary_path


def main() -> int:
    try:
        binary = ensure_binary()
    except UnsupportedPlatformError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    except Exception as exc:  # pragma: no cover - best effort logging
        print(f"Failed to prepare llm-link binary: {exc}", file=sys.stderr)
        return 1

    result = subprocess.run([str(binary), *sys.argv[1:]])
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
