#!/usr/bin/env python3
"""
export_compensation.py
----------------------
Exports compensation info (email + name) for users who have fully completed
the study. A user is considered complete if they have both a Compensation
record and a Learning session marked complete=True.

Outputs a CSV and backs it up to a timestamped destination if --backup-dir
is provided.
"""
import argparse
import csv
import os
import shutil
from datetime import datetime

from picc_llm.app import app
from picc_llm.app.models import Compensation, Consent, Learning


def export_compensation(output_path: str, backup_dir: str | None = None) -> None:
    with app.app_context():
        # Users who submitted a compensation email
        compensations = Compensation.query.all()

        rows = []
        for comp in compensations:
            # Only include users with a completed learning session
            learning = Learning.query.filter_by(
                user_index=comp.user_index, complete=True
            ).first()
            if learning is None:
                continue

            consent = Consent.query.filter_by(user_index=comp.user_index).first()

            rows.append({
                "user_index": comp.user_index,
                "name": consent.name if consent else "",
                "email": comp.email,
                "visualization_type": learning.visualization_type,
                "consent_date": consent.completion_date.isoformat() if consent else "",
            })

    if not rows:
        print("No completed participants with compensation records found.")
        return

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    fieldnames = ["user_index", "name", "email", "visualization_type", "consent_date"]
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Exported {len(rows)} compensation records to: {output_path}")

    if backup_dir:
        os.makedirs(backup_dir, exist_ok=True)
        dest = os.path.join(backup_dir, os.path.basename(output_path))
        shutil.copy2(output_path, dest)
        print(f"Backed up to: {dest}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Export compensation info for completed study participants."
    )
    parser.add_argument(
        "-o", "--output", required=True,
        help="Output CSV file path.",
    )
    parser.add_argument(
        "--backup-dir",
        default=None,
        help="Optional directory to copy the CSV to as a backup.",
    )
    args = parser.parse_args()
    export_compensation(args.output, args.backup_dir)
