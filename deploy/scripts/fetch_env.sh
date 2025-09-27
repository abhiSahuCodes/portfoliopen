#!/usr/bin/env bash
# Fetch AWS SSM parameters by path and build an env file (KEY=VALUE per line).
# Default output: ./deploy/env/.backend.env
# Example:
#   ./deploy/scripts/fetch_env.sh --ssm-path "/portfoliopen/prod/" --region ap-south-1
#
# Requirements:
# - awscli installed on the host (Ubuntu: sudo apt-get install -y awscli)
# - EC2 instance role or AWS credentials with ssm:GetParametersByPath, ssm:GetParameter, kms:Decrypt
#
# Flags:
#   --ssm-path <path>   SSM base path to fetch (e.g., /portfoliopen/prod/backend) [required]
#   --output <file>     Output env file (default: ./deploy/env/.backend.env)
#   --region <region>   AWS region (e.g., ap-south-1). If omitted, uses AWS default config/metadata
#   --profile <profile> AWS CLI profile name (optional)
#   --dry-run           Print to stdout instead of writing the file
#   --help              Show usage

set -euo pipefail

OUTPUT_FILE="./deploy/env/.backend.env"
SSM_PATH=""
AWS_REGION=""
AWS_PROFILE=""
DRY_RUN="false"

usage() {
  echo "Usage: $0 --ssm-path <path> [--output <file>] [--region <region>] [--profile <profile>] [--dry-run]"
  echo "Example: $0 --ssm-path \"/portfoliopen/prod/backend\" --region ap-south-1"
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --ssm-path)
      SSM_PATH="$2"; shift 2;;
    --output)
      OUTPUT_FILE="$2"; shift 2;;
    --region)
      AWS_REGION="$2"; shift 2;;
    --profile)
      AWS_PROFILE="$2"; shift 2;;
    --dry-run)
      DRY_RUN="true"; shift 1;;
    --help|-h)
      usage; exit 0;;
    *)
      echo "Unknown argument: $1"; usage; exit 1;;
  esac
done

if [[ -z "${SSM_PATH}" ]]; then
  echo "Error: --ssm-path is required."
  usage
  exit 1
fi

# Ensure aws CLI exists
if ! command -v aws >/dev/null 2>&1; then
  echo "Error: aws CLI not found. Install with: sudo apt-get install -y awscli"
  exit 1
fi

# Build common AWS CLI args
AWS_ARGS=()
if [[ -n "${AWS_REGION}" ]]; then
  AWS_ARGS+=(--region "${AWS_REGION}")
fi
if [[ -n "${AWS_PROFILE}" ]]; then
  AWS_ARGS+=(--profile "${AWS_PROFILE}")
fi

# Prepare output
if [[ "${DRY_RUN}" != "true" ]]; then
  mkdir -p "$(dirname "${OUTPUT_FILE}")"
  # Truncate previous file
  : > "${OUTPUT_FILE}"
fi

# Fetch parameters (auto-paginated by AWS CLI) and output as tab-separated Name,Value pairs
# We use --query 'Parameters[*].[Name,Value]' and --output text to avoid needing jq.
PARAM_LINES="$(aws ssm get-parameters-by-path \
  --path "${SSM_PATH}" \
  --recursive \
  --with-decryption \
  --query 'Parameters[*].[Name,Value]' \
  --output text \
  "${AWS_ARGS[@]}")"

if [[ -z "${PARAM_LINES}" ]]; then
  echo "Warning: No parameters found under path: ${SSM_PATH}"
  exit 0
fi

COUNT=0
# Process each line: NAME<TAB>VALUE
# We set IFS to tab to properly split columns even if VALUE contains spaces.
while IFS=$'\t' read -r NAME VALUE; do
  # Extract KEY from the last path segment
  KEY="${NAME##*/}"

  # Basic KEY sanitization (optional): uppercase and replace invalid chars with underscore
  # Uncomment if your SSM names contain unusual characters.
  # KEY="$(echo "${KEY}" | tr '[:lower:]' '[:upper:]' | sed 's/[^A-Z0-9_]/_/g')"

  # Normalize line endings
  VALUE="${VALUE//$'\r'/}"

  LINE="${KEY}=${VALUE}"

  if [[ "${DRY_RUN}" == "true" ]]; then
    echo "${LINE}"
  else
    echo "${LINE}" >> "${OUTPUT_FILE}"
  fi

  COUNT=$((COUNT + 1))
done <<< "${PARAM_LINES}"

if [[ "${DRY_RUN}" == "true" ]]; then
  echo "Previewed ${COUNT} parameters from: ${SSM_PATH}"
else
  echo "Wrote ${COUNT} parameters to: ${OUTPUT_FILE}"
fi