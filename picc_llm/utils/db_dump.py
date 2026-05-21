#!/usr/bin/env python3
"""
db_dump.py
----------
Dumps all database tables to a gzipped JSON file, or restores from one.

Usage:
    python -m picc_llm.utils.db_dump dump -o backup.json.gz
    python -m picc_llm.utils.db_dump restore -i backup.json.gz
"""
import argparse
import gzip
import json
import sys
from datetime import datetime

from picc_llm.app import app, db
from picc_llm.app.models import (
    Compensation, Consent, Learning,
    PostQuestionnaire, PreQuestionnaire, User,
)

# Restore order matters: User first so user_index exists when other rows are inserted
MODELS = [User, Learning, Consent, Compensation, PreQuestionnaire, PostQuestionnaire]


def _serialize(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def _row_to_dict(row):
    return {col.name: getattr(row, col.name) for col in row.__table__.columns}


def _coerce_row(model, row):
    """Convert ISO strings back to datetime for DateTime columns."""
    result = {}
    for col in model.__table__.columns:
        val = row.get(col.name)
        if val is not None and isinstance(col.type, db.DateTime):
            val = datetime.fromisoformat(val)
        result[col.name] = val
    return result


def dump(output_path):
    with app.app_context():
        data = {
            "version": 1,
            "timestamp": datetime.now().isoformat(),
            "tables": {},
        }
        for model in MODELS:
            rows = model.query.all()
            data["tables"][model.__tablename__] = [_row_to_dict(r) for r in rows]
            print(f"  {model.__tablename__}: {len(rows)} rows")

    payload = json.dumps(data, default=_serialize, indent=2).encode()

    with gzip.open(output_path, "wb") as f:
        f.write(payload)

    print(f"Dump written to: {output_path}")


def restore(input_path):
    with gzip.open(input_path, "rb") as f:
        data = json.loads(f.read())

    print(f"Backup timestamp: {data.get('timestamp', 'unknown')}")
    confirm = input("This will clear and replace all database tables. Type 'yes' to confirm: ")
    if confirm.strip() != "yes":
        print("Aborted.")
        sys.exit(0)

    with app.app_context():
        for model in reversed(MODELS):
            count = model.query.delete()
            print(f"  Cleared {count} rows from {model.__tablename__}")
        db.session.commit()

        for model in MODELS:
            rows = data["tables"].get(model.__tablename__, [])
            for row in rows:
                db.session.execute(
                    model.__table__.insert().values(**_coerce_row(model, row))
                )
            print(f"  Restored {len(rows)} rows into {model.__tablename__}")
        db.session.commit()

    print("Restore complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Dump or restore the picc database.")
    subparsers = parser.add_subparsers(dest="mode", required=True)

    dump_p = subparsers.add_parser("dump", help="Dump all tables to a .json.gz file.")
    dump_p.add_argument("-o", "--output", required=True, help="Output path (e.g. backup.json.gz)")

    restore_p = subparsers.add_parser("restore", help="Restore all tables from a .json.gz file.")
    restore_p.add_argument("-i", "--input", required=True, help="Input path (e.g. backup.json.gz)")

    args = parser.parse_args()

    if args.mode == "dump":
        dump(args.output)
    else:
        restore(args.input)
