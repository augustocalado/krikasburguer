-- Criação da Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ==== POLÍTICAS DE ACESSO (SEGURANÇA) ====

-- Todos os visitantes podem LER as categorias
CREATE POLICY "Categorias visíveis para todos" ON categories 
  FOR SELECT USING (true);

-- Apenas o Master pode Inserir, Atualizar e Deletar Categorias
CREATE POLICY "Apenas admin modifica categorias" ON categories 
  FOR ALL USING (auth.jwt() ->> 'email' = 'augustocalado22@gmail.com');

-- Todos os visitantes podem LER os produtos
CREATE POLICY "Produtos visíveis para todos" ON products 
  FOR SELECT USING (true);

-- Apenas o Master pode Inserir, Atualizar e Deletar Produtos
CREATE POLICY "Apenas admin modifica produtos" ON products 
  FOR ALL USING (auth.jwt() ->> 'email' = 'augustocalado22@gmail.com');
