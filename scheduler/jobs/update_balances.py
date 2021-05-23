from scheduler.__main__ import contract, db, w3
from bson import ObjectId
from datetime import datetime
import motor
import time
from scheduler.logging import logger
from decimal import Decimal

async def update_balances():
    logger.info('STARTING JOB')
    current_block = w3.eth.blockNumber
    timestamp = time.time()
    async for document in db.holder.find():
        currentBal = w3.fromWei(Decimal(contract.functions.balanceOf(document.get('address')).call(block_identifier=current_block)) * Decimal(10 ** 9), 'ether')
        balances = {}
        if document.get('balances'):
            balances = document.get('balances')
        balances[datetime.fromtimestamp(timestamp).strftime('%m:%d:%YT%H:%M:%S')] = float(currentBal)
        result = await db.holder.update_one({'_id': document.get('_id')}, {'$set': {'balances': balances}})