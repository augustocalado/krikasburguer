-- Criação da Tabela de Grupos de Adicionais
CREATE TABLE IF NOT EXISTS addon_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT false,
  min INTEGER NOT NULL DEFAULT 0,
  max INTEGER NOT NULL DEFAULT 1,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da Tabela de Opções de Adicionais
CREATE TABLE IF NOT EXISTS addon_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  addon_group_id UUID NOT NULL REFERENCES addon_groups(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE addon_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE addon_options ENABLE ROW LEVEL SECURITY;

-- ==== POLÍTICAS DE ACESSO (SEGURANÇA) ====

-- Todos os visitantes podem LER os grupos de adicionais
CREATE POLICY "Grupos de adicionais visíveis para todos" ON addon_groups 
  FOR SELECT USING (true);

-- Apenas o Master pode Inserir, Atualizar e Deletar Grupos de Adicionais
CREATE POLICY "Apenas admin modifica grupos de adicionais" ON addon_groups 
  FOR ALL USING (auth.jwt() ->> 'email' = 'augustocalado22@gmail.com');

-- Todos os visitantes podem LER as opções de adicionais
CREATE POLICY "Opções de adicionais visíveis para todos" ON addon_options 
  FOR SELECT USING (true);

-- Apenas o Master pode Inserir, Atualizar e Deletar Opções de Adicionais
CREATE POLICY "Apenas admin modifica opções de adicionais" ON addon_options 
  FOR ALL USING (auth.jwt() ->> 'email' = 'augustocalado22@gmail.com');
