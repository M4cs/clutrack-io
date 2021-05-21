from datetime import datetime, timedelta
import time
from flask import Flask, render_template, send_file, request, session, jsonify
from flask_mongoengine import MongoEngine
from flask_restful import reqparse
from app.config import conf
from web3 import Web3
from requests.exceptions import HTTPError
from decimal import Decimal
from bson import ObjectId
import requests
import jwt
import json


mongo = MongoEngine()
ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"spender","type":"address"},{"indexed":False,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":True,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"from","type":"address"},{"indexed":True,"internalType":"address","name":"to","type":"address"},{"indexed":False,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_liquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_taxFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"geUnlockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromReward","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"liquidityFee","type":"uint256"}],"name":"setLiquidityFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxPercent","type":"uint256"}],"name":"setMaxTxPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setRestrictionAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"taxFee","type":"uint256"}],"name":"setTaxFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setTradingStart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"whitelistAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

def create_app():
    app = Flask(__name__)
    try:
        w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed.binance.org/'))
    except HTTPError:
        try:
            w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed1.defibit.io/'))
        except HTTPError:
            try:
                w3 = w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed1.ninicoin.io/'))
            except HTTPError:
                w3 = Web3(Web3.HTTPProvider('https://bsc-dataseed.binance.org/'))
 
    from web3.middleware import geth_poa_middleware
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    contract = w3.eth.contract(address=Web3.toChecksumAddress('0x1162e2efce13f99ed259ffc24d99108aaa0ce935'), abi=ABI)
    config = conf
    app.config['MONGODB_SETTINGS'] = {
        'db': 'clutrack',
        'host': config.db.host,
        'connect': False
    }
    app.config['SECRET_KEY'] = config.app.secret_key
    app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
    mongo.init_app(app)
    return app, config, w3, contract

app, config, w3, contract = create_app()

def signJWT(user_id, address):
    payload = {'address': str(address), 'user_id': str(user_id), 'expires': time.time() + 3500 * 20}
    token = jwt.encode(payload, config.app.secret_key, algorithm='HS256')
    return token

def decodeJWT(token):
    from app.models.holder import Holder
    decoded = jwt.decode(
        token[0], config.app.secret_key, algorithms=['HS256']
    )
    if decoded['expires'] > time.time():
        return Holder.objects(id=ObjectId(decoded['user_id'])).first()

def search_parser():
    parser = reqparse.RequestParser()
    parser.add_argument('address')
    return parser

@app.route('/search')
def search():
    from app.models.holder import Holder
    parser = search_parser()
    args = parser.parse_args()
    if args.get('address'):
        return render_template('rewards.html', contract=contract, w3=w3, wallet_addr=args.get('address'), Decimal=Decimal)
    return render_template('index.html', count=len(Holder.objects().all()))

@app.route('/')
def index():
    from app.models.holder import Holder
    if session.get('access_token'):
        holder = decodeJWT(session.get('access_token'))
        if holder:
            return render_template('rewards.html', contract=contract, w3=w3, wallet_addr=holder.address, Decimal=Decimal)
    return render_template('index.html', count=len(Holder.objects().all()))

@app.route('/assets/<file>')
def serve(file):
    return send_file(f'templates/assets/{file}')

@app.route('/sign', methods=['POST'])
def sign():
    from app.models.holder import Holder
    data = json.loads(request.data)
    holder = Holder.objects(address=data['wallet_address']).first()
    if holder:
        if holder.check_msg(data['sig'], data['hash']):
            session['access_token'] = (signJWT(holder.id, holder.address), time.time() + 3500 * 20)
            return {'redirect': config.base_url}
    else:
        new_holder = {
            'address': data['wallet_address']
        }
        nh = Holder(**new_holder)
        if nh.save():
            print('NEW HOLDER MADE')
    return {'redirect': config.base_url}
    

@app.route('/getRewards/<addr>')
def getRewards(addr):
    currentBlock = w3.eth.blockNumber
    currentBalance = contract.functions.balanceOf(addr).call()
    block = currentBlock
    lastBal = currentBalance
    bals = []
    block24 = currentBlock - 28800
    blockWk = currentBlock - (28800 * 7)
    block_data = {}
    try:
        bal24hr = contract.functions.balanceOf(addr).call(block_identifier=block24)
        balWk = contract.functions.balanceOf(addr).call(block_identifier=blockWk)
    except:
        bal24hr = 0
        balWk = 0
    while currentBlock - block <= 60:
        try:
            balance = contract.functions.balanceOf(addr).call(block_identifier=block)
            bals.append(w3.fromWei(Decimal(Decimal(lastBal) - Decimal(balance))* (Decimal(10) ** 9), 'ether'))
            block_data['b' + str(block)] = float(w3.fromWei(Decimal(Decimal(lastBal) - Decimal(balance))* (Decimal(10) ** 9), 'ether'))
            lastBal = balance
            block -= 1
        except ValueError:
            block -= 1
        
 
    return jsonify({
        'avg_br_1m': float(sum(bals[0:20]) / len(bals[0:20])),
        'avg_br_3m': float(sum(bals) / len(bals)),
        'total_reward_3m': float(sum(bals)),
        'total_reward_1m': float(sum(bals[:20])),
        'block_data': block_data,
        'wk_increase': float(w3.fromWei((Decimal(currentBalance) - Decimal(balWk))* (Decimal(10) ** 9), 'ether')),
        'tfhr_increase': float(w3.fromWei((Decimal(currentBalance) - Decimal(bal24hr))* (Decimal(10) ** 9), 'ether'))
    })