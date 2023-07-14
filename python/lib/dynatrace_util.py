import requests

class DynatraceUtil():
    
    def __init__(self, organization_accounts: list, 
                 prod_env_name: str,
                 prod_token: str,
                 non_prod_env_name: str, 
                 non_prod_token: str,
                 dynatrace_iam_role: str):
                
        
        self.organization_accounts = organization_accounts
        self.prod_env_name = prod_env_name
        self.prod_token = prod_token
        self.non_prod_env_name = non_prod_env_name
        self.non_prod_token = non_prod_token
        self.dynatrace_iam_role = dynatrace_iam_role
        
    def configure_connections(self):
        
        prod_connection_names = self.get_existing_credential_names(
            env=self.prod_env_name,
            token=self.prod_token
        )
        
        non_prod_connection_names = self.get_existing_credential_names(
            env=self.non_prod_env_name,
            token=self.non_prod_token
        )
        
        for account in self.organization_accounts:
            if 'prod' in account['Name']:
                if not self.check_if_connection_exists(
                    account=account,
                    connection_names=prod_connection_names):
                        self.create_new_credential(
                            env=self.prod_env_name,
                            token=self.prod_token,
                            account=account)
                    
            else:
                if not self.check_if_connection_exists(
                    account=account,
                    connection_names=non_prod_connection_names):
                        self.create_new_credential(
                            env=self.non_prod_env_name,
                            token=self.non_prod_token,
                            account=account)  
    
    def get_existing_credential_names(self, env: str, token: str): 
        url = f'https://{env}.live.dynatrace.com/api/config/v1/aws/credentials'
            
        Headers = {
            "accept" : "application/json; charset=utf-8",
            "Authorization": f"Api-Token {token}"
                  }
        response = requests.get(url, headers=Headers)
        
        credentials = []
        
        for credential in response:
            credentials.append(credential['name'])
        
        return credentials
    
    def check_if_connection_exists(self, account: dict, connection_names: list):
        if account['Name'] in connection_names:
            return True
        
        return False

    def create_new_credential(self, env: str, token: str, account: dict):
        url = f'https://{env}.live.dynatrace.com/api/config/v1/aws/credentials'
            
        Headers = {
            "accept" : "application/json; charset=utf-8",
            "Authorization": f"Api-Token {token}"
                  }
        body = {
            'label': account['Name'],
            'partitionType': 'AWS_DEFAULT',
            'authenticationData': {
                'type': 'role',
                'roleBasedAuthentication': {
                    'iamRole': self.dynatrace_iam_role,
                    'accountId': account['Id']
                },
                'taggedOnly': False,
                'tagsToMonitor': []
            }
        }
        requests.post(url, headers=Headers, body=body)
    