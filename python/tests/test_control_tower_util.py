import unittest
from unittest import mock
from unittest.mock import MagicMock, Mock
from lib import ControlTowerUtil, Client


class TestControlTowerdUtil(unittest.TestCase):
    
    def setUp(self):
        self.client = Client()
        self.ct = ControlTowerUtil(client=self.client)
    
    def test_set_limit_to_account_numbers(self):
        self.assertIsNone(self.ct.limit_to_account_numbers)
        self.ct.set_limit_to_account_numbers('123,456')
        self.assertEqual(self.ct.limit_to_account_numbers[0], '123')
        self.assertEqual(self.ct.limit_to_account_numbers[1], '456')
    
    def test_append_accounts(self):
        self.ct.append_accounts(['ab123', '3456'])
        self.ct.append_accounts(['789'])
        self.assertEqual(self.ct.accounts[0],'ab123')
        self.assertEqual(self.ct.accounts[1],'3456')
        self.assertEqual(self.ct.accounts[2],'789')
    
    def test_append_accounts_limited_accounts(self):
        self.ct.set_limit_to_account_numbers('123,456')
        self.ct.append_accounts([{'Id': '123'}, {'Id': '4567'}])
        self.ct.append_accounts([{'Id': '789'}])
        self.assertEqual(len(self.ct.accounts), 1)
        self.assertEqual(self.ct.accounts[0], {'Id': '123'})
    
    def test_list_accounts_under_ou_no_child_ous_no_ou_token_no_accounts_token(self):
        org_client = self.client.client('organizations')
        
        ou_return_dict = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        org_client.list_organizational_units_for_parent = MagicMock(return_value=ou_return_dict)
        
        
        accounts_return_dict = {
            'Accounts': [
                {'Id': '111222333444'},
                {'Id': '111122223333'}
            ],
            'ResponseMetadata': {}
        }
        org_client.list_accounts_for_parent =  MagicMock(return_value=accounts_return_dict)
        
        
        self.ct.list_accounts_under_ou(parent_id='ou-abcd-a12bcdef')
        self.assertEqual(self.ct.accounts[0], {'Id': '111222333444'})
        self.assertEqual(self.ct.accounts[1], {'Id': '111122223333'})
        
    
    def test_list_accounts_under_ou_no_child_ous_no_ou_token_with_accounts_token(self):
        org_client = self.client.client('organizations')
        
        ou_return_dict = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        org_client.list_organizational_units_for_parent = MagicMock(return_value=ou_return_dict)
        
        accounts_return_dict_1 = {
            'Accounts': [
                {'Id': '111222333444'},
                {'Id': '111122223333'}
            ],
            'NextToken': 'ab-123',
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_2 = {
            'Accounts': [
                {'Id': '111222333445'},
                {'Id': '111122223336'}
            ],
            'ResponseMetadata': {}
        }

        org_client.list_accounts_for_parent =  Mock(side_effect=[accounts_return_dict_1, accounts_return_dict_2])
        
        self.ct.list_accounts_under_ou(parent_id='ou-abcd-a12bcdef')
        self.assertEqual(len(self.ct.accounts), 4)
        self.assertEqual(self.ct.accounts[0], {'Id': '111222333444'})
        self.assertEqual(self.ct.accounts[1], {'Id': '111122223333'})
        self.assertEqual(self.ct.accounts[2], {'Id': '111222333445'})
        self.assertEqual(self.ct.accounts[3], {'Id': '111122223336'})
        org_client.list_organizational_units_for_parent.assert_called_once
        self.assertEqual(org_client.list_accounts_for_parent.call_count, 2)
        
        
    def test_list_accounts_under_ou_with_child_ous_no_ou_token_with_accounts_token(self):
        org_client = self.client.client('organizations')
        
        ou_return_dict_1 = {
            'OrganizationalUnits': [
                {
                    'Id': '789-child'
                }],
            'ResponseMetadata': {}
        }
        
        ou_return_dict_2 = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        org_client.list_organizational_units_for_parent = Mock(side_effect=[ou_return_dict_1, ou_return_dict_2])
        
        accounts_return_dict_1 = {
            'Accounts': [
                {'Id': '555666777888'}
            ],
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_2 = {
            'Accounts': [
                {'Id': '111222333444'},
                {'Id': '111122223333'}
            ],
            'NextToken': 'ab-123',
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_3 = {
            'Accounts': [
                {'Id': '111222333445'},
                {'Id': '111122223336'}
            ],
            'ResponseMetadata': {}
        }

        org_client.list_accounts_for_parent =  Mock(side_effect=[accounts_return_dict_1, accounts_return_dict_2, accounts_return_dict_3])
        
        self.ct.list_accounts_under_ou(parent_id='ou-abcd-a12bcdef')
        self.assertEqual(len(self.ct.accounts), 5)
        self.assertEqual(self.ct.accounts[0], {'Id': '555666777888'})
        self.assertEqual(self.ct.accounts[1], {'Id': '111222333444'})
        self.assertEqual(self.ct.accounts[2], {'Id': '111122223333'})
        self.assertEqual(self.ct.accounts[3], {'Id': '111222333445'})
        self.assertEqual(self.ct.accounts[4], {'Id': '111122223336'})
        self.assertEqual(org_client.list_organizational_units_for_parent.call_count, 2)
        self.assertEqual(org_client.list_accounts_for_parent.call_count, 3)
        
    def test_list_accounts_under_ou_with_child_ous_with_ou_token_with_accounts_token(self):
        org_client = self.client.client('organizations')
        
        ou_return_dict_1 = {
            'OrganizationalUnits': [
                {
                    'Id': '456-child'
                }],
            'NextToken': 'ab-123',
            'ResponseMetadata': {}
        }
        
        ou_return_dict_2 = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        ou_return_dict_3 = {
            'OrganizationalUnits': [
                {
                    'Id': '789-child'
                }],
            'ResponseMetadata': {},
        }
        
        ou_return_dict_4 = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        
        org_client.list_organizational_units_for_parent = Mock(side_effect=[ou_return_dict_1, ou_return_dict_2, ou_return_dict_3, ou_return_dict_4])
        
        accounts_return_dict_0 = {
            'Accounts': [
                {'Id': '999999999999'}
            ],
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_1 = {
            'Accounts': [
                {'Id': '555666777888'}
            ],
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_2 = {
            'Accounts': [
                {'Id': '111222333444'},
                {'Id': '111122223333'}
            ],
            'NextToken': 'ab-123',
            'ResponseMetadaters': {}
        }
        
        accounts_return_dict_3 = {
            'Accounts': [
                {'Id': '111222333445'},
                {'Id': '111122223336'}
            ],
            'ResponseMetadata': {}
        }

        org_client.list_accounts_for_parent =  Mock(side_effect=[accounts_return_dict_0, accounts_return_dict_1, accounts_return_dict_2, accounts_return_dict_3])
        
        self.ct.list_accounts_under_ou(parent_id='ou-abcd-a12bcdef')
        self.assertEqual(len(self.ct.accounts), 6)
        self.assertEqual(self.ct.accounts[0], {'Id': '999999999999'})
        self.assertEqual(self.ct.accounts[1], {'Id': '555666777888'})
        self.assertEqual(self.ct.accounts[2], {'Id': '111222333444'})
        self.assertEqual(self.ct.accounts[3], {'Id': '111122223333'})
        self.assertEqual(self.ct.accounts[4], {'Id': '111222333445'})
        self.assertEqual(self.ct.accounts[5], {'Id': '111122223336'})
        self.assertEqual(org_client.list_organizational_units_for_parent.call_count, 4)
        self.assertEqual(org_client.list_accounts_for_parent.call_count, 4)
        
    def test_list_all_accounts_for_ou_under_root_no_token(self):
        org_client = self.client.client('organizations')
        
        org_client.list_roots =  Mock(return_value={
            'Roots': [
                {'Id': 'x-1234'}
            ]
        })
        
        ou_return_dict_1 = {
            'OrganizationalUnits': [
                {
                    'Name': 'Workload',
                    'Id': 'hjjhs-kjbhshjkhj'
                }
            ],
            'ResponseMetadata': {}
        }
        
        ou_return_dict_2 = {
            'OrganizationalUnits': [],
            'ResponseMetadata': {}
        }
        
        org_client.list_organizational_units_for_parent = Mock(side_effect=[ou_return_dict_1, ou_return_dict_2])
        
        
        accounts_return_dict = {
            'Accounts': [
                {'Id': '111222333444'},
                {'Id': '111122223333'}
            ],
            'ResponseMetadata': {}
        }
        org_client.list_accounts_for_parent =  MagicMock(return_value=accounts_return_dict)
        
        self.ct.list_all_accounts_for_ou_under_root(ou_name='Workload', account_numbers=None, apply_to_all=True)
        org_client.list_roots.assert_called_once
        
        self.assertEqual(self.ct.accounts[0], {'Id': '111222333444'})
        self.assertEqual(self.ct.accounts[1], {'Id': '111122223333'})
    
    if __name__ == '__main__':
        unittest.main()