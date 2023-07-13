import argparse
from lib import control_tower_util, client

parser = argparse.ArgumentParser()

parser.add_argument('--ou-name', required=False, default='Workloads', help='The OU below root where accounts exist.')
parser.add_argument('--account-numbers', required=False, help='A specific lists of account numbers to Create Dynatrace connections for.')
parser.add_argument('--apply-to-all', required=False, default=False, help='Create Dynatrace connections for all accounts under the specified OU. \
   This is a catch all to confirm you have made the choice to apply to all')

args = parser.parse_args()

if __name__ == '__main__':
   
   client = client.Client()
   ct = control_tower_util.ControlTowerUtil(client=client)
   ct.list_all_accounts_for_ou_under_root(
      ou_name=vars(args)["ou_name"],
      account_numbers=vars(args)["account_numbers"],
      apply_to_all=vars(args)["apply_to_all"]
   )