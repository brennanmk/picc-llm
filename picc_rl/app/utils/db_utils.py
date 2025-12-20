#!/usr/bin/env python3

"""
picc_rl.app.utils.db_utils
-----------------

Dangerous utils that allow db to drop / add tables.
"""

from picc_rl.app import db, app
from sqlalchemy import inspect
import argparse
import sys


def create_if_empty():
    """
    Checks if tables defined in models exist and creates them if any are missing.
    """

    engine = db.engine
    inspector = inspect(engine)

    defined_tables = db.metadata.tables.keys()

    tables_exist = True
    for table_name in defined_tables:
        if not inspector.has_table(table_name):
            app.logger.warning(f"Table '{table_name}' does NOT exist.")
            tables_exist = False

    if not tables_exist:
        app.logger.warning("One or more tables are missing. Creating all tables...")
        db.metadata.create_all(bind=engine)


def create():
    try:
        db.metadata.create_all(bind=db.engine)
    except Exception as e:
        app.logger.error(f"An error occurred during create_all: {e}")
        sys.exit(1)


def delete():
    try:
        db.metadata.drop_all(bind=db.engine, checkfirst=True)
    except Exception as e:
        app.logger.error(f"An error occurred during drop_all: {e}")
        sys.exit(1)


modes = {
    "reset": lambda: (delete(), create()),
    "delete": delete,
    "create": create,
    "create_if_empty": create_if_empty,
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="database_utils", description="Tools for use with databse"
    )

    parser.add_argument(
        "--mode",
        choices=modes.keys(),
        default="create_if_empty",
    )

    args = parser.parse_args()

    with app.app_context():
        modes[args.mode]()
