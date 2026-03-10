#!/usr/bin/env python3

"""
export_session_data.py
----------------------
Queries the database for specific learning sessions and exports their
relevant data to a single JSON file.

Assumes the new data schema where 'base_config' and 'user_config' 
are stored directly within the 'training_progress' list.
"""

import json
import argparse
from picc_llm.app import app
from picc_llm.app.models import Learning

def export_data(args):
    data_to_export = []
    
    print("Connecting to database...")
    
    with app.app_context():
        base_query = Learning.query
        sessions = []

        if args.ids:
            print(f"Querying for specific IDs: {args.ids}")
            sessions = base_query.filter(
                Learning.learning_id.in_(args.ids)
            ).all()
            
        elif args.range:
            start_id, end_id = args.range
            print(f"Querying for ID range: {start_id} to {end_id} (inclusive)")
            sessions = base_query.filter(
                Learning.learning_id.between(start_id, end_id)
            ).order_by(Learning.learning_id.asc()).all()
            
        elif args.last:
            print(f"Querying for last {args.last} sessions...")
            sessions = base_query.order_by(
                Learning.learning_id.desc()
            ).limit(args.last).all()
            sessions.reverse()

        print(f"Found {len(sessions)} matching sessions.")

        for session in sessions:
            session_data = {
                "learning_id": session.learning_id,
                "training_progress": session.training_progress,
                "active_environment_config": session.active_environment_config # this will be null if using random configs
            }
            data_to_export.append(session_data)

    with open(args.output, "w") as f:
        json.dump(data_to_export, f, indent=4)
        
    print(f"Successfully exported {len(data_to_export)} sessions to: {args.output}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Export learning session data from DB to a JSON file."
    )
    parser.add_argument("-o", "--output", required=True, help="Output JSON file path.")
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--ids", type=int, nargs='+', help="Specific session IDs.")
    group.add_argument("--range", type=int, nargs=2, metavar=('START', 'END'), help="ID range.")
    group.add_argument("--last", type=int, metavar='N', help="Last N sessions.")

    args = parser.parse_args()
    export_data(args)
