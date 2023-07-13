import boto3

class Client():
   
   def __init__(self):
       """
       Implementation of a Multiton pattern for the boto3 client to allow for easier testing.
       """
       self.clients = {}
    
   def client(self, service: str):
       """
       Add a client it if is not already registered. If the signiture is found then return the instance of the client.

       :param service: The AWS service to use.
       :type service: str.
       :return: A boto3 client which is part of the default session.
       """
       service = service
       if service not in self.clients.keys():
           new_client = boto3.client(service)
           self.clients[service] = new_client
              
       return self.clients[service]
    