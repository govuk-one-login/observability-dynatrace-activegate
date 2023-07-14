import argparse
from lib import control_tower_util, client, dynatrace_util

parser = argparse.ArgumentParser()

parser.add_argument('--ou-name', required=False, default='Workloads', help='The OU below root where accounts exist.')
parser.add_argument('--account-numbers', required=False, help='A specific lists of account numbers to Create Dynatrace connections for.')
parser.add_argument('--apply-to-all', required=False, default=False, help='Create Dynatrace connections for all accounts under the specified OU. \
   This is a catch all to confirm you have made the choice to apply to all')
parser.add_argument('--dynatrace-prod-token', required=True, help='The token to use to authenticate against the dynatrace prod environemnt.')
parser.add_argument('--dynatrace-non-prod-token', required=True, help='The token to use to authenticate against the dynatrace non prod environemnt.')
parser.add_argument('--dynatrace-prod-environment', required=True, help='The name dynatrace prod environemnt, it is in the URL of the dashboard.')
parser.add_argument('--dynatrace-non-prod-environment', required=True, help='The name dynatrace non prod environemnt, it is in the URL of the dashboard.')
parser.add_argument('--dynatrace-iam-role', required=False, default='CTOrgReadonly', help='The IAM role that has permission to read organisation information.')

args = parser.parse_args()

if __name__ == '__main__':
   
   client = client.Client()
   ct = control_tower_util.ControlTowerUtil(client=client)
   organization_accounts = ct.list_all_accounts_for_ou_under_root(
      ou_name=vars(args)["ou_name"],
      account_numbers=vars(args)["account_numbers"],
      apply_to_all=vars(args)["apply_to_all"]
   )
   
   dt = dynatrace_util.DynatraceUtil(
      organization_accounts=organization_accounts,
      prod_env_name=vars(args)["dynatrace_prod_environment"],
      prod_token=vars(args)["dynatrace_prod_token"],
      non_prod_env_name=vars(args)["dynatrace_non_prod_environment"],
      non_prod_token=vars(args)["dynatrace_non_prod_token"],
      dynatrace_iam_role=vars(args)["dynatrace_iam_role"])
   
   dt.configure_connections()