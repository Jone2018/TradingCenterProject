# TODO

0. 各货币价格动态变化，存Redis  # from coinmarketcap
1. 用户下单后，短信提醒双方
2. 订单状态变更时，短信提醒对方
3. 信用打分系统
4. 付款期限 动态

# CRUD

* C
    - POST /
* R
    - GET /
    - GET /pk
* U
    - PUT /pk
* D
    - DELETE /pk
    
## Permission

* Create

    IsAuthenticatedOrReadOnly
    
* Retrieve

    IsAuthenticatedOrReadOnly
    
* Update

    IsOwnerOrReadOnly

* Delete

    IsOwnerOrReadOnly
