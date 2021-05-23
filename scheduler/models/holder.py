from mongoengine.fields import DictField, IntField, StringField
from apscheduler import mongo

class Holder(mongo.Document):
    balance = IntField(default=0)
    address = StringField(unique=True)
    starting_balance = IntField(default=0)
    balances = DictField()

    def check_msg(self, signature, message_hash):
        from app import w3
        signer = w3.eth.account.recoverHash(message_hash, signature=signature)
        print(signer)
        if signer == self.address:
            return True
        return False
