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

# Create backup directory if it doesn't exist
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/psql_backups}"  # Default to 'psql_backups' directory in project root
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y_%m_%d_%H_%M_%S)

# Create backup filename
BACKUP_FILE="${DB_NAME}_backup_${TIMESTAMP}.dump"

# Full path to backup file
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Print debug information
echo "Script location: $SCRIPT_DIR"
echo "Project root: $PROJECT_ROOT"
echo "Backup directory: $BACKUP_DIR"
echo "Using database: $DB_NAME"

# Perform the backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -Fc -v -f $BACKUP_PATH

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Database backup completed successfully"
    echo "Backup saved as: $BACKUP_PATH"
else
    echo "Error: Database backup failed"
    exit 1
fi