CREATE OR REPLACE FUNCTION increment_balance(amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance numeric;
  new_balance numeric;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM profiles
  WHERE id = auth.uid();
  
  -- Calculate new balance
  new_balance := current_balance + amount;
  
  -- Update balance
  UPDATE profiles
  SET balance = new_balance
  WHERE id = auth.uid();
  
  -- Insert into balance history
  INSERT INTO balance_history (
    admin_id,
    user_id,
    operation_type,
    amount,
    previous_balance,
    new_balance
  ) VALUES (
    auth.uid(),
    auth.uid(),
    'trade_investment',
    amount,
    current_balance,
    new_balance
  );
  
  RETURN new_balance;
END;
$$;