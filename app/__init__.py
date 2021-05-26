from datetime import datetime, timedelta
import time
import requests
from flask import Flask, render_template, send_file, request, session, jsonify, Markup
from flask_mongoengine import MongoEngine
from flask_restful import reqparse
from werkzeug.utils import redirect
from app.config import conf
from web3 import Web3
from web3.exceptions import InvalidAddress
from requests.exceptions import HTTPError
from decimal import Decimal
from bson import ObjectId
import jwt
import json


mongo = MongoEngine()
ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"owner","type":"address"},{"indexed":True,"internalType":"address","name":"spender","type":"address"},{"indexed":False,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":True,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"from","type":"address"},{"indexed":True,"internalType":"address","name":"to","type":"address"},{"indexed":False,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_liquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_taxFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"geUnlockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromReward","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"liquidityFee","type":"uint256"}],"name":"setLiquidityFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxPercent","type":"uint256"}],"name":"setMaxTxPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setRestrictionAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"taxFee","type":"uint256"}],"name":"setTaxFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setTradingStart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"whitelistAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

credits = """<strong>Clutrack.io</strong> was created by <a target="_blank" href="https://twitter.com/maxbridgland">Max Bridgland</a>
with a little help from <a target="_blank" href="https://twitter.com/jerisbrisk">Jeremy Anderson</a> and is <strong>NOT</strong>
affiliated with the CluCoin team. The website content is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
We will never request to withdraw from your account. If you ever get a request that requires you pay gas, reject it!
<br/>
<strong>If you find use and want to support the site you can Donate CLU or any ERC/BEP-20 Token to: 0x44f6498D1403321890F3f2917E00F22dBDE3577a</strong>
"""

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
    is_logged = False
    if session.get('access_token'):
        holder = decodeJWT(session.get('access_token'))
        if holder:
            is_logged = True
    parser = search_parser()
    args = parser.parse_args()
    if args.get('address'):
        try:
            bal = w3.fromWei(Decimal(contract.functions.balanceOf(args.get('address')).call()) * Decimal(10 ** 9), 'ether')
        except InvalidAddress:
            return render_template('badaddress.html')
        holder = Holder.objects(address=args.get('address')).first()
        longterm_msg = "This address is not linked with CluTrack, long term stats unavailable."
        if holder:
            if holder_bal_count := len(holder.balances) < 12:
                longterm_msg = "Long term stats will be available about 12 hours after you link your account. Hours Left: " + str(12 - holder_bal_count)
            else:
                longterm_msg = "Loading long term stats..."
        return render_template(
            'rewards.html',
            contract=contract,
            w3=w3,
            wallet_addr=args.get('address'),
            Decimal=Decimal,
            is_logged_in=is_logged,
            wallet_bal=f"{float(bal):,}",
            longterm_msg=longterm_msg,
            conf=conf,
            credits=Markup(credits))
    return render_template('index.html', count=len(Holder.objects().all()), conf=conf)

@app.route('/')
def index():
    from app.models.holder import Holder
    if session.get('access_token'):
        holder = decodeJWT(session.get('access_token'))
        if holder:
            bal = w3.fromWei(Decimal(contract.functions.balanceOf(holder.address).call())*(Decimal(10) ** 9), "ether")
            longterm_msg = ""
            if holder_bal_count := len(holder.balances) < 12:
                longterm_msg = "Long term stats will kick in after at least 12 hours of linking. Hours Left: " + str(12 - holder_bal_count)
            else:
                longterm_msg = "Long term stats loading..."
            return render_template(
                'rewards.html',
                contract=contract,
                w3=w3,
                wallet_addr=holder.address,
                Decimal=Decimal,
                wallet_bal=f"{bal:,}",
                is_logged_in=True,
                longterm_msg=longterm_msg,
                conf=conf,
                credits=Markup(credits))
    return render_template('index.html', count=len(Holder.objects().all()), conf=conf)

@app.route('/assets/<folder>/<file>')
def serve(folder, file):
    return send_file(f'templates/assets/{folder}/{file}')

@app.route('/logout')
def logout():
    from flask import make_response
    from app.models.holder import Holder
    if session.get('access_token'):
        session['access_token'] = None
        response = make_response(redirect(conf.app.host))
        response.set_cookie('access_token', expires=0)
        return response
    return redirect(conf.app.host)

@app.route('/removeAccount', methods=['POST'])
def remove():
    from app.models.holder import Holder
    data = json.loads(request.data)
    holder = decodeJWT(session.get('access_token'))
    if holder and data:
        if holder.check_msg(data['sig'], data['hash']):
            session['access_token'] = ('', 0)
            if Holder.objects(id=holder.id).delete():
                return render_template('index.html', count=len(Holder.objects().all()), conf=conf)
        else:
            return render_template('error.html', msg="Your wallet signature did not match your logged in user")

@app.route('/getPrice')
def price():
    res = requests.get('https://api.pancakeswap.info/api/v2/tokens/0x1162e2efce13f99ed259ffc24d99108aaa0ce935').json()
    obj = {
        'price': res.get('data').get('price')[0:12],
        'price_BNB': res.get('data').get('price_BNB')[0:14]
    }
    return jsonify(obj)

@app.route('/sign', methods=['POST'])
def sign():
    from app.models.holder import Holder
    data = json.loads(request.data)
    holder = Holder.objects(address=str(data['wallet_address'])).first()
    if holder:
        if holder.check_msg(data['sig'], data['hash']):
            session['access_token'] = (signJWT(str(holder.id), holder.address), time.time() + 3500 * 20)
            return {'redirect': conf.app.host}
    else:
        bal = contract.functions.balanceOf(data['wallet_address']).call()
        new_holder = {
            'address': data['wallet_address'],
            'balances': {}
        }
        nh = Holder(**new_holder)
        nh.save()
        session['access_token'] = (signJWT(str(nh.id), nh.address), time.time() + 3500 * 20)
    return {'redirect': conf.app.host}
    

@app.route('/getRewards/<addr>')
def getRewards(addr):
    from app.models.holder import Holder
    currentBlock = w3.eth.blockNumber
    currentBalance = contract.functions.balanceOf(addr).call()
    block = currentBlock
    lastBal = currentBalance
    bals = []
    block_data = {}

    while currentBlock - block <= 120:
        try:
            balance = contract.functions.balanceOf(addr).call(block_identifier=block)
            bals.append(w3.fromWei(Decimal(Decimal(lastBal) - Decimal(balance))* (Decimal(10) ** 9), 'ether'))
            block_data['b' + str(block)] = float(w3.fromWei(Decimal(Decimal(lastBal) - Decimal(balance))* (Decimal(10) ** 9), 'ether'))
            lastBal = balance
            block -= 1
        except ValueError:
            block -= 1

    bal_12hr = {}
    bal_24hr = {}
    total_12hr = 0
    total_24hr = 0
    has_12hr = False
    has_24hr = False
    lifetime = 0
    has_lifetime = False
    holder = Holder.objects(address=addr).first()

    if holder:
        if len(holder.balances) >= 12:
            has_12hr = True
            bal_list = list(holder.balances.items())[-12:]
            for bal in bal_list:
                bal_12hr[str(bal[0])] = bal[1]
            total_12hr = bal_list[-1][1] - bal_list[0][1]
        if len(holder.balances) >= 24:
            has_24hr = True
            bal_list = list(holder.balances.items())[-24:]
            for bal in bal_list:
                bal_24hr[str(bal[0])] = bal[1]
            total_24hr = bal_list[-1][1] - bal_list[0][1]
        if len(holder.balances) > 0:
            has_lifetime = True
            lifetime = list(holder.balances.values())[-1] - list(holder.balances.values())[0]

    return jsonify({
        'avg_br_1m': float(sum(bals[0:20]) / len(bals[0:20])),
        'avg_br_3m': float(sum(bals) / len(bals)),
        'total_reward_3m': float(sum(bals)),
        'total_reward_1m': float(sum(bals[:20])),
        'block_data': block_data,
        'has_12hr': has_12hr,
        'has_24hr': has_24hr,
        'bal_12hr': bal_12hr,
        'bal_24hr': bal_24hr,
        'has_lifetime': has_lifetime,
        'lifetime': lifetime,
        'total_12hr': total_12hr,
        'total_24hr': total_24hr
    })