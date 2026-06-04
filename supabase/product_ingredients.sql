-- Tabela de vínculo entre produtos e ingredientes (ficha técnica)
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10,4) NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, ingredient_id)
);

ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

-- Todos podem ler
CREATE POLICY "PI visível para todos" ON product_ingredients
  FOR SELECT USING (true);

-- Apenas admin pode modificar
CREATE POLICY "Apenas admin modifica PI" ON product_ingredients
  FOR ALL USING (auth.jwt() ->> 'email' = 'augustocalado22@gmail.com');
