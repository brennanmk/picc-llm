#!/usr/bin/env python3

"""
picc_llm.environments.utils
-------------------

Shared utilities between environments.
"""

import os
import base64
import sys


def get_image_map(filename_map: dict, base_image_path: str) -> dict:
    """
    takes a map of {name: filename} and a
    base path, returning a map of {name: base64_data_uri}.
    """
    b64_map = {}
    for name, filename in filename_map.items():
        full_path = os.path.join(base_image_path, filename)
        if os.path.exists(full_path):
            try:
                with open(full_path, "rb") as f:
                    encoded = base64.b64encode(f.read()).decode("utf-8")
                    # Assumes png, but can be adapted if other types are needed
                    b64_map[name] = f"data:image/png;base64,{encoded}"
            except Exception as e:
                print(f"Error encoding image {full_path}: {e}", sys.stderr)
                b64_map[name] = ""
        else:
            b64_map[name] = ""  # Return empty string if file is missing
            print(f"Image not found in get_image_map: {full_path}", sys.stderr)
    return b64_map
