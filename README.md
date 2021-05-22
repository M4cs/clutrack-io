# Clutrack.io
The easiest way to track your CluCoin Redistribution Rewards!

You can Donate CLU or any ERC/BEP-20 Token to: 0x44f6498D1403321890F3f2917E00F22dBDE3577a

# How does it work?
Clutrack can link with your wallet and provide you with a dashboard to view your recent CluCoin rewards. By holding CluCoin you gain rewards everytime a transaction is made. It can be hard to see just how much you are gettig so Clutrack aims to help that! 

Go to [clutrack.io](https://clutrack.io) and click Sign in With Wallet or paste a wallet's address in the search box. From here you are able to view the dashboard of that wallet and see the rewards it's making on a 1 minute, 3 minute, daily, and weekly interval!

# Development

### Requirements:

- Python 3.8+

### Installation

```
pip install flask flask-mongoengine flask-restful web3
```

### Running

Create file `config.yaml`

```yml
db:
  host: mongo_url # Your MongoDB URI

app:
  secret_key: randomsecretkey # A Secret Key
  host: http://localhost:5000 # Base URL
  ```

```
flask run
```

# License

You may not host Clutrack yourself on a public facing domain. I open sourced this for transparency and to allow people to learn, not to steal. If you'd like to host the code locally or make pull requests feel free but you cannot rehost clutrack.io or a fork of it.