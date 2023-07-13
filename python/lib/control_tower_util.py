from lib.client import Client

class ControlTowerUtil():
    
    def __init__(self, client: Client):
        """
        Class for interacting with control tower.

        :param client: AWS Client from the Multiton. 
        :type client: Client.
        """
        
        self.org = client.client('organizations')
        self.accounts = []
        self.limit_to_account_numbers = None
        
    def set_limit_to_account_numbers(self, account_numbers: str):
        """
        Set the limit_to_account_numbers.

        :param account_numbers: The account numbers to set limit_to_account_numbers to 
        :type account_numbers: str
        """
        
        if account_numbers is not None:
            account_numbers_list = account_numbers.split(',')
            if self.limit_to_account_numbers is None:
                self.limit_to_account_numbers = []
            
            self.limit_to_account_numbers = self.limit_to_account_numbers + account_numbers_list
        
    def append_accounts(self, accounts: list):
        """
        Append accounts onto the class level list of accounts for iteration over later.

        :param accounts: The list of accounts to be added to the class level accounts list.
        :type accounts: list of dict.
        """
        
        if self.limit_to_account_numbers is not None:
            for account in accounts:
                if account['Id'] in self.limit_to_account_numbers:
                    self.accounts.append(account)
        else:
            self.accounts =  self.accounts + accounts
    
    def list_all_accounts_for_ou_under_root(self, ou_name: str, account_numbers: str, apply_to_all: bool):
        """
        List all of the accounts for a specified OU that exists under the organization root. 

        :param ou_name: The name of the OU to fetch the accounts for.
        :type ou_name: str.
        :param account_numbers: A comma seperated string of the  account numbers to create connections for.
        :type account_numbers: str.
        :param apply_to_all: Create Dynatrace connections for all accounts under OU.
        :type apply_to_all: bool.
        """
        
        if account_numbers is not None and apply_to_all:
            print('If you provide a list of account numbers then apply to all must be false.')
            exit(1)
        
        if account_numbers is None and not apply_to_all:
            print('If you dont provide a list of account numbers then apply to all must be True, be certain you want to do this')
            exit(1)
        
        self.set_limit_to_account_numbers(account_numbers)
        
        roots = self.org.list_roots()
        root_id = roots['Roots'][0]['Id']    
        
        response = self.org.list_organizational_units_for_parent(ParentId=root_id, MaxResults=20)
        self.iterate_ou_under_root(response=response, ou_name=ou_name)
                
        while 'NextToken' in response.keys():
            response = self.org.list_organizational_units_for_parent(ParentId=root_id, MaxResults=20, NextToken=response['NextToken'])
            self.iterate_ou_under_root(response=response, ou_name=ou_name)
            
        return self.accounts
    
    def iterate_ou_under_root(self, response: dict, ou_name: str):
        """
        Iterate over the OUs the exist under the organization if the named OU is found get the accounts that exist underneath it.

        :param response: The response from the organization units for parenets command.
        :type response: dict
        :param ou_name: The name of the OU to get accounts for.
        :type ou_name: str.
        """
        ous_under_root = response['OrganizationalUnits']
        for ou in ous_under_root:
            if ou['Name'] == ou_name:
                self.list_accounts_under_ou(parent_id=ou['Id'])
                break
        
    def list_accounts_under_ou(self, parent_id: str):
        """List the accounts under an OU.

        :param parent_id: The Id of the parernt OU.
        :type parent_id: str.
        """
        ou_response = self.org.list_organizational_units_for_parent(ParentId=parent_id, MaxResults=20)
        self.iterate_child_ous(ou_response=ou_response)
        
        while 'NextToken' in ou_response.keys():
            ou_response = self.org.list_organizational_units_for_parent(ParentId=parent_id, MaxResults=20,NextToken=ou_response['NextToken'])
            self.iterate_child_ous(ou_response=ou_response)
            
        accounts_response = self.org.list_accounts_for_parent(ParentId=parent_id, MaxResults=20)
        self.append_accounts(accounts=accounts_response['Accounts'])
        
        while 'NextToken' in accounts_response.keys():
            accounts_response = self.org.list_accounts_for_parent(ParentId=parent_id, MaxResults=20, NextToken=accounts_response['NextToken'])
            self.append_accounts(accounts=accounts_response['Accounts'])
        
    def iterate_child_ous(self, ou_response: dict):
        """Iterate the over the child OUs of an OU.

        :param ou_response: The response from the organization units for parenets command.
        :type ou_response: dict
        """
        
        child_ous = ou_response['OrganizationalUnits']
        if len(child_ous) > 0:
            for child_ou in child_ous:
                self.list_accounts_under_ou(parent_id=child_ou['Id'])