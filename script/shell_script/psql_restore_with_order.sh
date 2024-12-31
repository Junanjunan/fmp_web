#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Navigate up until we find the .env file or reach the root directory
PROJECT_ROOT=$SCRIPT_DIR
while [[ ! -f "$PROJECT_ROOT/.env" ]] && [[ "$PROJECT_ROOT" != "/" ]]; do
    PROJECT_ROOT="$(dirname "$PROJECT_ROOT")"
done

# Check if .env was found
if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
    echo "Error: Could not find .env file in parent directories"
    exit 1
fi

# Load environment variables from .env file
export $(cat "$PROJECT_ROOT/.env" | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $0}' )

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
    echo "Error: Required environment variables are not set in .env file"
    echo "Please ensure DB_HOST, DB_PORT, DB_USER, and DB_NAME are defined"
    exit 1
fi

# Check if backup file path is provided as argument
if [ -z "$1" ]; then
    echo "Error: Please provide the backup file path"
    echo "Usage: $0 path/to/backup.dump"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

if [ -z "$RESTORE_TABLE_ORDER" ]; then
    echo "Warning: RESTORE_TABLE_ORDER not set in .env file"
    echo "Proceeding with full database restore..."
    
    # Original restore command
    PGPASSWORD=$DB_PASSWORD pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -v -c "$BACKUP_FILE"
else
    echo "Performing ordered table restore..."
    
    # Convert comma-separated string to array
    IFS=',' read -ra TABLES <<< "$RESTORE_TABLE_ORDER"
    
    # Loop through each table and restore
    for table in "${TABLES[@]}"; do
        echo "Restoring table: $table"
        PGPASSWORD=$DB_PASSWORD pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME --data-only -v --table="$table" "$BACKUP_FILE"
        
        # Check if individual table restore was successful
        if [ $? -eq 0 ]; then
            echo "Table $table restored successfully"
            echo "--------------------------------"
        else
            echo "Error: Failed to restore table $table"
            exit 1
        fi
    done
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Database restore completed successfully"
else
    echo "Error: Database restore failed"
    exit 1
fi