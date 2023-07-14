import unittest
import requests
from unittest.mock import MagicMock, Mock
from lib import DynatraceUtil

class TestControlTowerdUtil(unittest.TestCase):
    
    def setUp(self):
        self.dt = DynatraceUtil(
            organization_accounts=[
                {
                    'Name': 'conn',
                    'Id': '123',
                    'email': 'me@me.com'
                },
                {
                    'Name': 'another-prod',
                    'Id': '456',
                    'email': 'you@you.org'
                },
                {
                    'Name': 'prod-cred2',
                    'id': '2'
                }
            ],
            prod_env_name='prd123',
            prod_token='dt0c01.DOIMDJDJD4CHJE5G.CZCXXETFFVX11DCW5LCCIRYAU724IND6GWREA',
            non_prod_env_name='456non', 
            non_prod_token='dt0c01.DOIMDJKKO9HJE5G.CZCXXETFFVX11DCW5LCCIRYA344FFGWREA',
            dynatrace_iam_role='iam::role/hhjsdjsjhdj')

    def test_check_if_connection_exists(self):
        self.assertTrue(self.dt.check_if_connection_exists(
            account={
                'Name': 'conn',
                'Id': '123'
                }, 
            connection_names=['conn','another']))
        
    def test_check_if_connection_exists_false(self):
        self.assertFalse(self.dt.check_if_connection_exists(
            account={
                'Name': 'conn',
                'Id': '123'
                }, 
            connection_names=['conn1','another']))
    
    
    def test_get_existing_credential_names(self):
        
        requests.get = MagicMock(return_value=[
            {
                'name': 'cred1',
                'id': 1 
            },
            {
                'name': 'cred2',
                'id': 55 
            }
        ])
        
        credentials = self.dt.get_existing_credential_names(env='', token='')
        self.assertEqual(credentials[0], 'cred1')
        self.assertEqual(credentials[1], 'cred2')
        
    def test_create_new_credential(self):
        
        requests.post = MagicMock(return_value='')
        self.dt.create_new_credential(
            env='prod',
            token='hdhdjkfhkh',
            account={
                'Name': 'conn',
                'Id': '123',
                'email': 'me@me.com'
            })
        requests.post.assert_called_once
        
    def test_configure_connections(self):
        
        get_responses = [
            [
                {
                    'name': 'prod-cred1',
                    'id': 1 
                },
                {
                    'name': 'prod-cred2',
                    'id': 2 
                }
            ],
            [
                {
                    'name': 'non-cred1',
                    'id': 3
                }
            ]
        ]
        
        requests.get = Mock(side_effect=get_responses)
        requests.post = Mock(side_effect=['','',''])
        
        self.dt.configure_connections()
        
        self.assertEqual(requests.get.call_count, 2)
        self.assertEqual(requests.post.call_count, 2)