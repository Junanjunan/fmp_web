user_symbols unique configuration
  - user_email & symbol_id pair must be unique
  - But, if same symbol_ids exist between different exchanges,
    they can not be unique
    -> In this case, it has to be unique by user_email & symbol_id & exchange_id
  * Have to change column uniqueness to (user_email, symbol_id, exchange_id)