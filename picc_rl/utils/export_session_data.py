#!/usr/bin/env python3
"""
export_session_data.py
----------------------
Queries the database for specific learning sessions and exports their
relevant data to a single JSON file.

Updated to handle user_params/base_params format and extract object_counts.
"""
import json
import argparse
from picc_rl.app import app
from picc_rl.app.models import Learning


def extract_object_counts(params):
    """
    Extract object_counts from parameter dict.
    
    Expected format: {"objects": {...}, "width": 10, "height": 10}
    Width and height are optional, but "objects" is required.
    
    :param params: Parameter dictionary
    :return: Object counts dictionary
    :raises ValueError: If params is None or doesn't contain "objects"
    """
    if params is None:
        raise ValueError("params is None - expected dict with 'objects' key")
    
    if not isinstance(params, dict):
        raise ValueError(f"params must be dict, got {type(params)}")
    
    if "objects" not in params:
        raise ValueError(f"Missing 'objects' key in params. Keys: {list(params.keys())}")
    
    return params["objects"]


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
            # Get the most recent training iteration
            if not session.training_progress or len(session.training_progress) == 0:
                raise ValueError(
                    f"Session {session.learning_id} has no training_progress data"
                )
            
            latest_progress = session.training_progress[-1]
            
            # Expect user_params to exist
            if 'user_params' not in latest_progress:
                raise ValueError(
                    f"Session {session.learning_id}: Missing 'user_params' in training_progress"
                )
            
            user_params = latest_progress['user_params']
            
            # extract_object_counts will raise if objects not found
            object_counts = extract_object_counts(user_params)
            
            # Export compact format
            session_data = {
                "learning_id": session.learning_id,
                "object_counts": object_counts,
                "training_progress": session.training_progress,
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
